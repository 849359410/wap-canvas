<template>
	<div class="gradeMain">
		<div class="grade">
			<div v-if="rewardShow === 1" class="grade--tabHead">
				<p
					v-for="i in tabHead"
					:key="i.id"
					:class="tabHeadIndex === i.id ? 'active' : ''"
					@click="tabHeadList(i.id)"
				>
					<span>{{ i.name }}</span>
				</p>
			</div>
			<div v-if="configData" class="grade--head">
				<div class="grade--head_main">
					<div
						class="grade--head_main_head"
						:class="tabHeadIndex !== 0 ? 'grade--head_main_head_reward' : ''"
					>
						<img class="head_img" :src="userIcon" />
						<div class="head_name">
							<span>{{ configData.username }}</span>
							<div class="head_name_list">
								<p>
									<span>头衔：{{ configData.title }}</span>
									<span>成长积分：{{ configData.inte }}</span>
								</p>
								<span v-if="tabHeadIndex === 0" class="rew_money"
									>晋级奖励：<em class="head_money"
										>¥{{ configData.money }}</em
									></span
								>
							</div>
						</div>
						<div v-if="tabHeadIndex === 0" class="head_bar">
							<div class="head_bar_pro">
								<span>{{ configData.now_title }}</span>
								<p>
									<span :style="{ width: widthSpan + '%' }">
										<em>{{ widthSpan }}%</em>
									</span>
								</p>
								<span>{{ configData.next_title }}</span>
							</div>
							<p v-if="inteDiff > 0">
								距离下一等级还差{{ inteDiff }}分，每充值1元加1分
							</p>
							<p v-else>恭喜您，目前已经达到最高等级</p>
						</div>
						<p class="head_vip">
							<span>{{ configData.level }}</span>
						</p>
					</div>
					<div v-if="configData.jack_state === 1" class="grade--head_main_but">
						<p @click="receive()">领取奖励</p>
					</div>
					<div v-else class="grade--head_main_but grade--head_main_noBut">
						<p v-if="configData.jack_state === 3">不可领取</p>
						<p v-else>已领取</p>
					</div>
				</div>
			</div>
			<div class="grade--rule">
				<div v-html="configData.activity_rules"></div>
			</div>
			<!--// 领取成功提示-->
		</div>
		<van-dialog :receive-show="receiveShow" :receive-reward="receiveReward"></van-dialog>
	</div>
</template>

<script>
import { mapState } from "vuex";
import { APP_IMG_HOST } from "../../../config/deploy.config";
import VanDialog from "./dialog";
export default {
	name: "Index",
	components: {
		VanDialog
	},
	data() {
		return {
			tabHead: [
				{ id: 0, name: "" },
				{ id: 1, name: "" }
			],
			tabHeadIndex: 0,
			widthSpan: 0,
			inteDiff: 0,
			receiveShow: false,
			configData: "",
			rewardShow: 0,
			receiveReward: "",
			userIcon: ""
		};
	},
	computed: {
		...mapState({
			userMessage: state => state.user.userMessage
		})
	},
	watch: {},
	created() {
		this.returnConfig();
		this.userIcon = `${APP_IMG_HOST}/img/userIcon/${this.userMessage.pic_id}.jpg`;
	},
	methods: {
		tabHeadList(type) {
			if (type === 1) {
				// 查询等级嘉奖信息
				this.returnReward();
			} else {
				this.returnConfig();
			}
			this.tabHeadIndex = type;
		},
		// 领取晋级奖励
		receive() {
			let url = "";
			if (this.tabHeadIndex === 0) {
				url = "API_POST_ISSUE_USER_PRO_RECORD";
			} else {
				url = "API_POST_ISSUE_USER_REWARD_RECORD";
			}
			this.$helps.showLoading();
			this.$api.request(url).then(
				success => {
					setTimeout(() => {
						this.$helps.hideLoading();
					}, 500);
					this.receiveReward = success.Data;
					this.receiveShow = !this.receiveShow;
					this.configData.jack_state = 2;
				},
				error => {
					setTimeout(() => {
						this.$helps.hideLoading();
					}, 1000);
					this.$root.$emit("handleError", error);
				}
			);
		},
		// 查询等级信息
		async returnConfig() {
			await this.$api.request("API_GET_ACTIVITY_LEVEL").then(success => {
				let data = success.Data;
				// 等级嘉奖是否开启
				this.rewardShow = success.Data.reward_state;
				// 获取头部切换名称
				this.tabHead[0].name = data.level_name;
				this.tabHead[1].name = data.reward_name;
				// 个人信息
				this.configData = data;
				this.widthSpan =
					((data.inte - data.now_inte) / (data.next_inte - data.now_inte)) * 100;
				if (this.widthSpan !== 0) this.widthSpan = this.widthSpan.toFixed(1).slice(0, -2);
				if (this.widthSpan > 100) this.widthSpan = 100;
				this.inteDiff = data.next_inte - data.inte;
			});
		},
		returnReward() {
			this.$api.request("API_GET_ACTIVITY_REWARD").then(success => {
				this.configData = success.Data;
			});
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/userCenter/grade/grade";
</style>

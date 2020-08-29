<template>
	<van-row class="userCenter">
		<van-row class="userCenter--box">
			<van-row v-if="isLogin" class="userCenter--top">
				<router-link class="userCenter--head" :to="{ name: 'ModifyIcon' }">
					<img :src="userIcon" />
				</router-link>
				<div class="userCenter--info">
					<span>
						<em>{{ userMessage.username }}</em>
					</span>
					<span>
						余额：<em>{{ userMessage["money"] | formatPenny }}</em
						>元
						<refresh class="user_reg"></refresh>
					</span>
				</div>
				<div
					v-if="levelConfig"
					class="userCenter--grade"
					@click="$router.push({ name: 'Grade' })"
				>
					<span>{{ levelConfig }}</span>
				</div>
				<div v-else class="userCenter--grade">
					<span>尊贵会员</span>
				</div>
			</van-row>
			<van-row v-else="" class="userCenter--top">
				<div class="userCenter--head">
					<img :src="userIcon" />
				</div>
				<div class="userCenter--infos">
					<p>
						<router-link :to="{ name: 'login' }">登录</router-link>/
						<router-link :to="{ name: 'Register' }">注册</router-link>
					</p>
				</div>
			</van-row>
		</van-row>
		<van-row class="userCenter--tc" :class="!isLogin ? 'NotLog' : ''">
			<van-row v-if="isLogin" class="userCenter--tc_box">
				<van-grid :border="false" column-num="3">
					<van-grid-item
						v-for="(item, index) in mainTabs"
						:key="index"
						@click="takeMoney(item)"
					>
						<van-image :src="item.icon" class="img"></van-image>
						<span> {{ item.label }} </span>
					</van-grid-item>
				</van-grid>
			</van-row>
			<van-row v-show="conSing === 1" class="userCenter--listBox">
				<van-cell
					title="每日签到"
					:icon="require('../../assets/images/userCenter/home/userCenterSingin.png')"
					to="SingIn"
				>
					<span :class="norSing === 0 ? 'item-no-after' : ''">{{
						norSing === 0 ? "立即签到" : "已签到"
					}}</span>
				</van-cell>
			</van-row>
			<van-row
				v-for="(item, index) in userMenu"
				v-show="isLogin"
				:key="index"
				class="userCenter--listBox"
			>
				<van-grid :column-num="4" :border="false">
					<van-cell class="topTab">{{ userTotal[index].label }}</van-cell>
					<van-grid-item
						v-for="(i, value) in item"
						:key="value"
						class="userCenter--listBox-B"
						@click="concatService(i)"
					>
						<van-tag
							v-if="i.tagShow"
							round
							plain
							color="#ef384a"
							type="primary"
							class="tagText"
							>{{ i.tag }}</van-tag
						>
						<van-image v-if="i.icon2" :src="i.icon2" class="topTab-img"></van-image>
						<van-image :src="i.icon" class="userCenter--listBox_img"></van-image>
						<span class="userCenter--listBox_text">{{ i.label }}</span>
					</van-grid-item>
				</van-grid>
			</van-row>
			<van-row v-show="!isLogin" class="boxHeight">
				<van-cell
					v-for="(item, index) in messages"
					:key="index"
					is-link
					:icon="item.icon"
					@click="concatService(item)"
				>
					{{ item.label }}
				</van-cell>
			</van-row>
			<qk-alert
				v-if="isShowObj.isShow"
				:msg-show="isShowObj"
				@closeShow="closeShow"
			></qk-alert>
		</van-row>
	</van-row>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { APP_IMG_HOST } from "../../config/deploy.config";
import refresh from "../../components/refresh";
import QkAlert from "../../components/qkAlert";
import withdrawals from "../../mixins/withdrawals";
export default {
	name: "UserCenter",
	components: {
		refresh,
		QkAlert
	},
	mixins: [withdrawals],
	data: () => ({
		userIcon: "",
		conSing: "",
		norSing: "",
		levelConfig: "",
		mainTabs: [
			{
				label: "充值",
				action: "Recharge",
				icon: require("../../assets/images/yuBao/withdrawal.png")
			},
			{
				label: "额度转换",
				action: "quotaConversion",
				icon: require("../../assets/images/userCenter/home/edzh.png")
			},
			{
				label: "提现",
				action: "withdrawCash",
				icon: require("../../assets/images/yuBao/recharge.png")
			}
		],
		// 记录报表
		userTotal: [
			{ label: "常用工具" },
			{ label: "我的订单" },
			{ label: "报表统计" },
			{ label: "消息公告" }
		],
		userMenu: [
			[
				{
					label: "个人资料",
					icon: require("../../assets/images/userCenter/home/person.png"),
					icon2: require("../../assets/images/userCenter/home/hyzx_new.png"),
					action: "PersonalData",
					notification: 0,
					content: "新增等级头衔"
				},
				{
					label: "余额宝",
					icon: require("../../assets/images/userCenter/home/hyzx_yeb.png"),
					icon2: require("../../assets/images/userCenter/home/huzx_hot.png"),
					click: true,
					notification: 0
				},
				{
					label: "银行卡管理",
					icon: require("../../assets/images/userCenter/home/blank.png"),
					action: "BankManages",
					notification: 0,
					content: ""
				},
				{
					label: "修改密码",
					icon: require("../../assets/images/userCenter/home/pwd.png"),
					action: "UpdatePwd",
					notification: 0,
					content: "修改登录、安全密码"
				}
			],
			[
				{
					label: "入款记录",
					icon: require("../../assets/images/userCenter/home/charge.png"),
					action: "RechargeRecord",
					notification: 0,
					content: ""
				},
				{
					label: "出款记录",
					icon: require("../../assets/images/userCenter/home/cash.png"),
					action: "WithdrawRecord",
					notification: 0,
					content: ""
				},
				{
					label: "资金记录",
					icon: require("../../assets/images/userCenter/home/money.png"),
					action: "MoneyRecord",
					notification: 0,
					content: ""
				},
				{
					label: "投注记录",
					icon: require("../../assets/images/userCenter/home/record.png"),
					action: "Mrecord",
					notification: 0,
					content: ""
				},
				{
					label: "转换记录",
					icon: require("../../assets/images/userCenter/home/conversion.png"),
					action: "ConversionRecord",
					notification: 0,
					content: ""
				}
			],
			[
				{
					label: "今日盈亏",
					icon: require("../../assets/images/userCenter/home/personalProfit.png"),
					action: "TodayProfit",
					notification: 0,
					content: ""
				},
				{
					label: "代理中心",
					icon: require("../../assets/images/userCenter/home/proxy.png"),
					action: "Proxy",
					notification: 0,
					content: ""
				},
				{
					label: "自助返水",
					icon: require("../../assets/images/userCenter/home/returnWater.png"),
					action: "ReturnWater",
					notification: 0,
					content: ""
				},
				{
					label: "投注报表",
					icon: require("../../assets/images/userCenter/home/report.png"),
					action: "Report",
					notification: 0,
					content: ""
				}
			],
			[
				{
					label: "会员消息",
					icon: require("../../assets/images/userCenter/home/messages.png"),
					action: "UserMessages",
					notification: 0,
					tagShow: true,
					tag: 0
				},
				{
					label: "系统公告",
					icon: require("../../assets/images/userCenter/home/notice.png"),
					action: "Mnotice",
					notification: 0
				},
				{
					label: "帮助指南",
					icon: require("../../assets/images/userCenter/home/helpGuide.png"),
					action: "HelpGuide",
					notification: 0
				},
				{
					label: "在线客服",
					icon: require("../../assets/images/userCenter/home/contact.png"),
					notification: 0,
					content: "",
					click: true
				}
			]
		],
		messages: [
			{
				label: "系统公告",
				icon: require("../../assets/images/userCenter/home/notice.png"),
				action: "Mnotice",
				notification: 0,
				content: ""
			},
			{
				label: "帮助指南",
				icon: require("../../assets/images/userCenter/home/helpGuide.png"),
				action: "HelpGuide",
				notification: 0,
				content: ""
			},
			{
				label: "在线客服",
				icon: require("../../assets/images/userCenter/home/contact.png"),
				notification: 0,
				content: "",
				click: true
			}
		]
	}),
	computed: {
		...mapState({
			userMessage: state => state.user.userMessage,
			isLogin: state => state.user.isLogin
		}),
		...mapGetters(["webData"])
	},
	created() {
		this._loading();
		this.GetUserMessage();
	},
	methods: {
		// 获取会员消息
		GetUserMessage() {
			if (this.isLogin) {
				this.$api.request("API_GET_USER_MESSAGE").then(
					success => {
						let count = 0,
							data = success.Data.Data;
						if (data.length > 0) {
							data.forEach(i => {
								if (Number(i.state) === 1) {
									count++;
								}
							});
						}
						this.userMenu[3].forEach(v => {
							if (v.label === "会员消息") {
								v.tag = count;
							}
						});
					},
					error => this.$root.$emit("handleError", error)
				);
			}
		},
		concatService(name) {
			if (name.label === "在线客服") {
				const ws = this.webData.web_cs;
				if (ws === "" || null) {
					this.$root.$emit("handleError", "没有在线客服");
				} else {
					window.open(ws);
				}
			} else if (name.label === "余额宝") {
				if (this.userMessage.name === "") {
					this.$root.$emit("handleError", "请先完善个人资料");
					return this.$router.push({ name: "BankManages" });
				} else this.$router.push({ name: "YuBao" });
			} else this.$router.push({ name: name.action });
		},
		_loading() {
			this.userIcon = `${APP_IMG_HOST}/img/userIcon/${this.userMessage.pic_id || 1}.jpg`;
			if (this.isLogin) {
				// 签到是否开启 等级头衔开启接口合并（字段level）
				this.$api.request("API_GET_USER_SING_IS_OR_NOT").then(
					success => {
						this.conSing = success.Data.state;
						this.norSing = success.Data.is_cancel;
						this.levelConfig = success.Data.level;
						this.userMenu[0].state = !!this.levelConfig;
						this.$stores.set("conSing", this.conSing);
						this.$stores.set("levelShow", this.levelConfig ? 1 : 2);
					},
					error => this.$root.$emit("handleError", error)
				);
				// 会员是否今日已签到
				// this.norSing = Number(this.$stores.get("norSing"));
			}
		},
		takeMoney(item) {
			if (item.action === "withdrawCash") {
				this.getQkpwd();
			} else {
				this.$router.push({ name: item.action });
			}
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/userCenter/userCenter";
</style>
<style lang="scss">
.userCenter--listBox-B {
	.van-grid-item__content {
		padding: 10px 0 10px 0;
	}
}
</style>

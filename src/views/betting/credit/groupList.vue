<template>
	<van-row>
		<div v-if="activePlayingGroup.hasOwnProperty('subset')" class="credit_message--ul-group">
			<div id="center" class="center">
				<van-tabs
					v-model="activeObj"
					title-active-color="#ef384a"
					line-height="2"
					@click="selectPlaying"
				>
					<van-tab
						v-for="(i, index) in activePlayingGroup.subset"
						:key="index"
						:title="i.name"
						:name="i"
					></van-tab>
				</van-tabs>
			</div>
		</div>
		<van-col
			v-for="(item, index) in creditPlayingList"
			:key="index"
			span="24"
			class="credit_message--ul_li"
		>
			<div
				v-if="(!isMarkSixLottery && creditPlayingList[0].name === '连码') || '任选'"
				v-show="!activePlayingGroup.hasOwnProperty('subset')"
				class="credit_message--ul_li-title"
			>
				<span v-show="!activePlayingGroup.hasOwnProperty('subset')">
					{{ item.name }}
				</span>
				<van-icon
					v-if="creditPlayingList.length !== 1"
					:name="creditPlayingIndex.indexOf(index) < 0 ? 'arrow-up' : 'arrow-down'"
					@click="showChildPlay(index)"
				></van-icon>
			</div>
			<div
				v-if="currentLottery.fc_id === 72 && creditPlayingList[0].name === '直选'"
				class="lhcSpecial"
			>
				<p
					v-for="i in lhcSpecial"
					:key="i.id"
					:class="Number($stores.get('lhcAB')) === i.num ? 'active' : ''"
					@click="switchABGroup(i)"
				>
					{{ i.name }}
				</p>
			</div>
			<div v-if="creditPlayingIndex.indexOf(index) < 0">
				<credit-total
					v-if="item.name === '总和' && item.list.length === 28 && isLuckyLottery"
					:lucky-playing-list="item"
					@bett-mess="watchBetting"
					@bett-order="watchBettOrder"
				></credit-total>
				<van-grid v-else class="credit_message--ul_li-codeNumber">
					<div
						v-for="(ball, index1) in item.list"
						id="dataNumber"
						:key="index1"
						class="credit_message--ul_li-codeNumber_right"
						:class="[
							generateBetCodeItemClassName(ball.content_name),
							getRunLong(item.list.length),
							{
								'': ball.content_name && $helps.czLength(ball.content_name) > 5
							}
						]"
					>
						<div
							class="credit_message--ul_li-codeNumber_right-button"
							:class="[
								ball.ball_color,
								generateBetCodeButtonClassName(
									ball.play_id,
									ball.content_name,
									item.name
								),
								checkIsActiveBetCode(ball.play_id, ball.content_name, item.name)
									? 'is-active'
									: ''
							]"
							@click="setRadioCode(item.name, ball)"
						>
							<span>{{ ball.content_name }}</span>
							<span>{{ ball.odds }}</span>
						</div>
					</div>
				</van-grid>
			</div>
		</van-col>
	</van-row>
</template>

<script>
import model from "../../../mixins/model";
import lotteryResult from "../../../mixins/lotteryResult";
import creditTotal from "./creditTotal";
import creditLucky from "../../../mixins/playing.lucky";
import { mapState } from "vuex";
import { Bus } from "../../../main";

export default {
	name: "GroupList",
	components: { creditTotal },
	mixins: [lotteryResult, model, creditLucky],
	props: {
		creditPlayingList: {
			type: [Array, Object],
			default: null
		},
		activePlayingGroup: {
			type: [Object, Array],
			default: null
		}
	},
	data() {
		return {
			lhcSpecial: [
				{ name: "A", num: 1 },
				{ name: "B", num: 2 }
			],
			creditPlayingIndex: [],
			activeObj: {}
		};
	},
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery
		})
	},
	watch: {
		creditPlayingList: {
			handler() {
				this.creditPlayingIndex = [];
			},
			deep: true
		}
	},
	mounted() {
		Bus.$on("initializeOrder", () => {
			this.initializeBetCode();
		});
	},
	methods: {
		watchBetting(n) {
			this.$emit("bet-code", n);
		},
		//监控28注单信息
		watchBettOrder(n) {
			this.$emit("bett-order", n);
		},
		// 初始化注单号码
		initializeBetCode() {
			this.betCode = [];
		},
		// 生成号码列的样式类名
		generateBetCodeItemClassName(key) {
			return [
				"credit_message--ul_li-codeNumber__right",
				{
					"medium-width": this.$helps.czLength(key) === 4,
					"big-width": this.$helps.czLength(key) === 6,
					"auto-width": this.$helps.czLength(key) > 6,
					"message--ul_li_code_right_two": this.$helps.czLength(key) < 5
				}
			];
		},
		// 主要区别6,11,16,21(比较特殊，能被4、5都整除，所有还要处理)，等数字排列问题
		getRunLong(length) {
			return [
				{
					"message--ul_li_code_right_five": length % 5 === 0,
					"message--ul_li_code_right_four": length === 4,
					"message--ul_li_code_right_three": length === 3,
					"message--ul_li_code_right_one": length === 1,
					"message--ul_li_code_right_twelve": length === 12
				}
			];
		},
		showChildPlay(index) {
			let ind = this.creditPlayingIndex.indexOf(index);
			if (ind > -1) {
				this.creditPlayingIndex.splice(ind, 1);
			} else {
				this.creditPlayingIndex.push(index);
			}
		},
		// 切换AB盘
		switchABGroup(item) {
			this.$stores.set("lhcAB", item.num);
			this.$emit("switchAb", item);
		},
		// 选择玩法
		selectPlaying(item) {
			this.$stores.set("subName", item.name);
			if (this.isMarkSixLottery) {
				let lhc = JSON.parse(this.$stores.get("lhcLottery"));
				if (item.list.length === 0 && item.name === "两面") {
					item = lhc;
					this.$stores.set("lhcLiangMian", 1);
				} else this.$stores.set("lhcLiangMian", 2);
			}
			let a = document.getElementById("center");
			this.$emit("selectPlaying", item);
			this.$stores.set("selIndexSL", a.scrollLeft);
		},
		getActive() {
			if (this.activePlayingGroup.hasOwnProperty("subset")) {
				this.activeObj = this.activePlayingGroup.subset[0];
			}
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/groupList";
@import "../../../assets/css/views/betting/creditChoice";
</style>

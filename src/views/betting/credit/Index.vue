<template>
	<div class="credit">
		<head-tab
			:play-id="id"
			:playing-dialog="playingDialog"
			:playing-type-list="playingTypeList"
		></head-tab>
		<div class="credit_message" @click="clickMain()">
			<div
				id="main-data"
				class="credit_message--ul"
				:class="isHappyLottery ? 'isHappyLottery' : ''"
			>
				<group-list
					v-if="showCredit"
					ref="group"
					:credit-playing-list="creditPlayingList"
					:active-playing-group="activePlayingGroup"
					@selectPlaying="selectChinPlaying"
					@switchAb="switchAB"
					@bet-code="bettCodeList"
					@bett-order="watchBettOrder"
				></group-list>
				<!-- 露珠图 -->
				<dewdrop-chart v-if="showDew()"></dewdrop-chart>
			</div>
		</div>
		<Betting-footer
			:betting="bettingMessage"
			:money="betMoney"
			:rule-show="true"
			@del="del"
			@moneyRule="moneyRule"
			@inBetMoney="inBetMoney"
			@handlerBetting="handlerBetting"
			@creditRuleShow="creditRuleShow"
		></Betting-footer>
		<!-- 注单弹出框 -->
		<van-popup v-model="popupShow" :class="popupShow ? 'credit_up' : 'credit_down'">
			<bet-popup
				:bet-order="order"
				:bet-tmp-code="$helps.cloneDeep(betCode)"
				:b-money="betMoney"
				@bets-order-off="betsOrderOff"
				@getCross="getCross"
			></bet-popup>
		</van-popup>
		<!-- 玩法规则 -->
		<van-popup v-model="ruleShow" :class="ruleShow ? 'credit_up' : 'credit_down'">
			<credit-rule :play-id="Number(id)" :type="activePlayingType"></credit-rule>
		</van-popup>
	</div>
</template>
<script>
import headTab from "../head/Index";
import creditPlaying from "../../../mixins/creditPlaying";
import lotteryResult from "../../../mixins/lotteryResult";
import playingCredits from "../../../mixins/playing.credit";
import { mapState, mapActions } from "vuex";
import groupList from "./groupList";
import dewdropChart from "./dewdropChart";
import BettingFooter from "../../../components/bettingFooter";
import betPopup from "./betPopup";
import creditRule from "../../../components/Rule";
import { Bus } from "../../../main";

export default {
	name: "Index",
	components: {
		headTab,
		groupList,
		dewdropChart,
		BettingFooter,
		betPopup,
		creditRule
	},
	mixins: [creditPlaying, lotteryResult, playingCredits],
	props: {
		id: {
			type: [Number, String],
			default: null
		}
	},
	data() {
		return {
			popupShow: false,
			ruleShow: false,
			showCredit: true,
			playingDialog: false
		};
	},
	computed: {
		...mapState({
			pageStatus: state => state.common.pageStatus,
			userMessage: state => state.user.userMessage
		})
	},
	watch: {
		id(n) {
			this.setCurrentLottery(Number(n));
			this.loadHistoryLotteryResult();
			this.del();
			this.loadPlayingCreditType();
			this.reloadShow();
		}
	},
	created() {
		this.setCurrentLottery(Number(this.id));
		this.loadHistoryLotteryResult();
	},
	methods: {
		...mapActions(["setCurrentLottery"]),
		//监控注单信息
		watchBettOrder(n) {
			this.order = n;
		},
		// 监控到betCode变化
		bettCodeList(val) {
			if (val.length < 1) this.order = [];
			this.betCode = val;
		},
		// 监控点击选号界面
		clickMain() {
			this.playingDialog = false;
		},
		// 刷新子组件data
		reloadShow() {
			this.showCredit = false;
			this.$nextTick(() => {
				this.showCredit = true;
			});
		},
		creditNameIndex(val) {
			this.del();
			this.setCreditPlay(val);
			this.$refs.group.getActive();
		},
		selectChinPlaying(item) {
			this.del();
			this.creditPlayingList = [];
			if (Object.prototype.hasOwnProperty.call(item, "group")) {
				this.creditPlayingList = [...item.group];
			} else {
				this.creditPlayingList.push(item);
			}
		},
		// 切换AB盘
		switchAB(item) {
			this.loadPlayingCreditType(item.num);
			this.del();
		},
		// 初始化注单号码
		initializeBetCode() {
			this.betCode = [];
		},
		del() {
			this.betMoney = "";
			Bus.$emit("initializeOrder");
			this.initializeOrder();
			this.initializeBetCode();
			this.initializeBettingMessage();
		},
		inBetMoney(money) {
			let reg = /(^\d$)|(^\d+[0-9]{1,2}$)/;
			this.betMoney = money.replace(/[^\d\\.]/g, "");
			if (!reg.test(money)) {
				this.betMoney = "";
			} else if (Number(money) === 0) {
				this.betMoney = 1;
			} else if (Number(money) > 1000000) {
				this.betMoney = 1000000;
			}
		},
		moneyRule(money) {
			if (money) this.betMoney = parseFloat(money).toString();
		},
		// 弹出注单信息
		handlerBetting() {
			if (this.order.length === 0) return this.$root.$emit("handleError", "您还没有完成选号");
			if (Number(this.betMoney) < 1)
				return this.$root.$emit("handleError", "下注金额不能小于1元");
			this.popupShow = true;
		},
		creditRuleShow() {
			this.ruleShow = true;
		},
		betsOrderOff() {
			this.playCreditLotteryOrder();
			this.del();
		},
		showDew() {
			let flag = false;
			if (!this.$lotteryPub.isMarkSixLottery(this.currentLottery.fc_id)) {
				if (!this.$lotteryPub.isHappyLottery(this.currentLottery.fc_id)) {
					if (this.currentLottery.fc_id !== 64) {
						if (this.currentLottery.fc_id !== 114) {
							flag = true;
						}
					}
				}
			}
			return flag;
		},
		getCross() {
			this.popupShow = false;
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/groupList";
</style>

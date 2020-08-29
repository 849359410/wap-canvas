<template>
	<div class="credit">
		<second-head
			ref="species"
			:play-id="id"
			:second-de="second"
			:accumulate="accumulate"
		></second-head>
		<div class="credit_message">
			<van-row id="main-data" class="credit_message--ul credit_message--second">
				<group-list
					:credit-playing-list="creditPlayingList"
					:active-playing-group="activePlayingGroup"
					@selectPlaying="selectChindPlaying"
					@switchAb="switchAB"
					@bet-code="bettCodeList"
					@bett-order="watchBettOrder"
					@second-code="getSecondCode"
				></group-list>
			</van-row>
		</div>
		<Betting-footer
			:betting="bettingMessage"
			:money="betMoney"
			:bet-tmp-code="$helps.cloneDeep(betCode)"
			:quick-show-style="quickShowStyle"
			:second="second"
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
				:quick-time="second.quickTime"
				@bets-order-off="betsOrderOff"
				@getCross="getCross"
			></bet-popup>
		</van-popup>
		<!-- 玩法规则 -->
		<van-popup v-model="ruleShow" :class="ruleShow ? 'credit_up' : 'credit_down'">
			<credit-rule :play-id="Number(id)" :type="activePlayingType"></credit-rule>
		</van-popup>
		<!-- 暂停弹出框 -->
		<van-popup
			v-model="shadowShow"
			:close-on-click-overlay="false"
			:class="shadowShow ? 'credit_up' : 'credit_down'"
		>
			<stop-lottery :second="second" :autos="autos" class="stopLott"></stop-lottery>
		</van-popup>
		<van-popup
			v-model="second.whetherShow"
			:class="second.whetherShow ? 'credit_up' : 'credit_down'"
		>
			<grandTotal :second="second" @getFun="getFun"></grandTotal>
		</van-popup>
		<van-popup
			v-model="second.confirmShow"
			:class="second.confirmShow ? 'credit_up' : 'credit_down'"
		>
			<grandTotal :second="second" @getFun="getFun"></grandTotal>
		</van-popup>
	</div>
</template>
<script>
import secondHead from "./secondHead";
import creditPlaying from "../../../mixins/creditPlaying";
import lotteryResult from "../../../mixins/lotteryResult";
// import creditLucky from "../../../mixins/playing.lucky";
import playingCredits from "../../../mixins/playing.credit";
import { mapState, mapActions } from "vuex";
import groupList from "../credit/groupList";
import BettingFooter from "../../../components/bettingFooter";
import betPopup from "../credit/betPopup";
import creditRule from "../../../components/Rule";
import stopLottery from "../../../components/stopLottery";
import grandTotal from "../../../components/grandTotal";
import assign from "../../../mixins/assign";
import { Bus } from "../../../main";

export default {
	name: "Index",
	components: {
		secondHead,
		groupList,
		BettingFooter,
		betPopup,
		creditRule,
		stopLottery,
		grandTotal
	},
	mixins: [creditPlaying, lotteryResult, playingCredits, assign],
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
			second: {
				whetherShow: false, // 暂停的后弹出的
				confirmShow: false, // 这个是开完奖本次弹出的
				quickShow: false, // 是否显示开奖次数
				text1: "开奖进行中，是否中中断开奖",
				text2: "",
				sign: 1,
				name: "",
				quickTime: 1,
				cumulative: 0
			},
			interrupt: false, // 是否中断开奖
			accumulate: 0,
			shadowShow: false,
			quickShowStyle: false,
			waitBet: false
		};
	},
	computed: {
		...mapState({
			currentPlaying: state => state.lottery.currentPlaying,
			pageStatus: state => state.common.pageStatus,
			userMessage: state => state.user.userMessage
		})
	},
	watch: {
		id(n) {
			this.setCurrentLottery(Number(n));
			this.loadHistoryLotteryResult();
		}
	},
	created() {
		this.setCurrentLottery(Number(this.id));
		this.loadHistoryLotteryResult();
	},
	beforeRouteLeave(to, from, next) {
		if (this.isLastSecondOpen(this.id) && this.waitBet) {
			this.second.whetherShow = true;
			next(false); // 防止路由产生变化
		} else {
			next();
		}
	},
	beforeRouteUpdate(to, from, next) {
		if (this.isLastSecondOpen(this.id) && this.waitBet) {
			this.second.whetherShow = true;
			next(false);
		} else {
			next();
		}
	},
	methods: {
		...mapActions(["setCurrentLottery"]),
		// 监控到betCode变化
		bettCodeList(val) {
			if (val.length < 1) this.order = [];
			this.betCode = val;
		},
		watchBettOrder(n) {
			this.order = n;
		},
		creditNameIndex(val) {
			this.del();
			this.setCreditPlay(val);
		},
		getSecondCode() {
			this.$refs.species.playingDialog = false;
			this.quickShowStyle = true;
			if (this.second.quickTime === 0) this.second.quickTime = 1;
		},
		selectChindPlaying(item) {
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
			// this.playCreditLotteryOrder();
			// this.del();
			this.quickShowStyle = false;
			if (this.interrupt) return; // 开奖是否暂停
			if (!this.second.quickTime) {
				this.getStopPrize(); // 最后一次开奖
			} else {
				this.handlerBetting();
				this.playCreditSecondLotteryOrder();
				this.popupShow = false;
			}
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
		},
		// 余额不足判断
		moneyNot(n) {
			if (n !== "") {
				let countSun = this.order.length * Number(n) * this.second.quickTime;
				if (this.userMessage.money < countSun) {
					this.$root.$emit("handleError", "余额不足");
					this.betMoney = "";
				}
			}
		},
		setQuickChoice(i) {
			this.second.quickTime = Number(i.text);
			this.moneyNot(this.betMoney);
			this.calculationBetting();
		},
		getFun(i) {
			// 开奖暂停点击确认事件
			let self = this;
			self.interrupt = true;
			if (i === 1) {
				self.second.quickTime = 0;
				return this.getStopPrize(); // 这个是为了显示弹窗及一些逻辑处理 具体请点击方法
			} else {
				self.second.quickTime = 0; // 初始化开奖次数
				self.TimeMoney = 0; // 清掉累计中奖
				self.currentCount = 0; // 清空掉本次温馨提示的开奖次数
				self.betMoney = ""; // 最后一次清空输入的值
				self.del(); // 清除选号
				self.interrupt = false; // 重置开奖暂停
				self.autos = {}; // 清空开奖数据
				setTimeout(() => {
					self.closeDigitalScrolling(); // 停止滚动开奖号码
				}, 2000);
			}
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/groupList";
</style>

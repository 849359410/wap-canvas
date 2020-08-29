<template>
	<div
		class="fastThree content"
		:class="[iFastSecondOpen ? 'seconds' : '', { scrollTop: !scrollTop }]"
	>
		<fast-head
			:play-id="Number(id)"
			:playing-type-list="playingTypeList"
			:active-type-val="activeTypeVal"
			:second-de="second"
			:accumulate="accumulate"
			:playing-dialog="playingDialog"
			@getScroll="getScroll"
		></fast-head>
		<div @click="playingDialog = false">
			<group-list
				v-if="showCredit"
				ref="group"
				:play-id="Number(id)"
				:credit-playing="creditPlaying"
				@upDataBetCode="upDataBetCode"
			></group-list>
			<betting-list ref="betting" :play-id="Number(id)"></betting-list>
		</div>
		<Betting-footer
			:rule-show="false"
			:placeholder="`请输入要投注的金额`"
			:money="betMoney"
			:betting="bettingMessage"
			:quick-show-style="quickShowStyle"
			@del="del"
			@inBetMoney="inBetMoney"
			@moneyRule="moneyRule"
			@handlerBetting="handlerBetting"
		></Betting-footer>
		<!-- 注单弹出框 -->
		<van-popup v-model="popupShow" :class="popupShow ? 'credit_up' : 'credit_down'">
			<bet-popup
				:bet-order="order"
				:bet-tmp-code="betCode"
				:b-money="betMoney"
				:quick-time="quickTime"
				@bets-order-off="betsOrderOff"
				@getCross="getCross"
			></bet-popup>
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
import fastHead from "./fastHead";
import { mapActions } from "vuex";
import { PlayingCredit } from "@server/singularity";
import lotteryResult from "../../../mixins/lotteryResult";
import groupList from "./groupList";
import fastThree from "../../../mixins/fastThree";
import bettingList from "./bettingList";
import BettingFooter from "../../../components/bettingFooter";
import playingFastThree from "../../../mixins/playing.fastThree";
import betPopup from "../credit/betPopup";
import assign from "../../../mixins/assign";
import stopLottery from "../../../components/stopLottery";
import grandTotal from "../../../components/grandTotal";

export default {
	name: "Index",
	components: {
		fastHead,
		groupList,
		bettingList,
		BettingFooter,
		betPopup,
		stopLottery,
		grandTotal
	},
	mixins: [lotteryResult, fastThree, playingFastThree, assign],
	props: {
		id: {
			type: [Number, String],
			default: null
		}
	},
	data() {
		return {
			betCode: [],
			popupShow: false,
			quickTime: 1,
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
			amount: 0,
			interrupt: false, // 是否中断开奖
			bonuses: 1, // 总开奖次数
			quickShowStyle: false,
			shadowShow: false,
			waitBet: false,
			scrollTop: false,
			playingDialog: false,
			showCredit: true,
			accumulate: 0
		};
	},
	watch: {
		order(n) {
			if (!n.length) this.betMoney = "";
		},
		id(n) {
			this.setCurrentLottery(Number(n));
			this.loadHistoryLotteryResult();
			this.loadPlayingOdds();
			if (this.iFastSecondOpen) {
				this.closeTimeOut();
				this.closeDigitalScrolling();
			}
			this.reloadShow();
		}
	},
	mounted() {
		this.$on("ks-quickTime", frequency => {
			this.second.quickTime = frequency;
		});
		this.$on("ks-result", (result, Accumulate) => {
			this.accumulate = Accumulate;
		});
	},
	created() {
		this.setCurrentLottery(Number(this.id));
		this.loadHistoryLotteryResult();
		this.loadPlayingOdds();
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
		// 刷新子组件data
		reloadShow() {
			this.showCredit = false;
			this.$nextTick(() => {
				this.showCredit = true;
			});
		},
		upDataBetCode(n) {
			const cloneBetCode = this.$helps.cloneDeep(n);
			this.betCode = cloneBetCode;
			cloneBetCode.forEach(i => {
				if (i.play_id === 40) i.place = this.subsetName;
			});
			if (cloneBetCode.length < 1) return this.initializeOrder();
			this.order = PlayingCredit.handleBettingCodes(cloneBetCode, this.currentLottery.id);
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
		handlerBetting() {
			if (this.order.length === 0) return this.$root.$emit("handleError", "您还没有完成选号");
			if (Number(this.betMoney) < 1)
				return this.$root.$emit("handleError", "下注金额不能小于1元");
			this.popupShow = true;
		},
		del() {
			this.betMoney = "";
			this.initializeOrder();
			this.$refs.group.initializeBetCode();
			this.initializeBettingMessage();
		},
		betsOrderOff() {
			if (!this.quickTime && this.iFastSecondOpen) {
				return this.getStopPrize(this.autos, 0);
			}
			if (this.interrupt) return;
			this.playCreditLotteryOrder();
			this.popupShow = false;
			if (!this.iFastSecondOpen) this.del();
		},
		getCross() {
			this.popupShow = false;
		},
		setQuickChoice(i) {
			this.quickTime = Number(i.text);
			this.second.quickTime = Number(i.text);
			this.bonuses = Number(i.text);
		},
		getFun(i) {
			// 开奖暂停点击确认事件
			let self = this;
			self.interrupt = true;
			if (i === 1) {
				this.second.quickTime = this.bonuses - Number(this.quickTime);
				return self.getStopPrize(self.autos, 0); // 这个是为了显示弹窗及一些逻辑处理 具体请点击方法
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
		},
		getScroll(scroll) {
			this.scrollTop = scroll;
		}
	}
};
</script>
<style lang="scss">
.seconds {
	.fastThree--dataList {
		top: 43px;
	}
	.message--ul {
		top: 44px;
		position: relative;
	}
	.message--ul_li_betting {
		top: 44px;
		position: relative;
	}
}
</style>

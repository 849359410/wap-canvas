<template>
	<div class="official">
		<head-tab
			ref="headOffcial"
			:play-id="Number(id)"
			:playing-dialog="playingDialog"
		></head-tab>
		<group-list ref="group" @click.native="clickMain"></group-list>
		<Betting-footer
			:betting="bettingMessage"
			:rule-show="true"
			@del="del"
			@creditRuleShow="officialRuleShow"
			@handlerBetting="handlerBetting"
		></Betting-footer>
		<van-popup v-model="popupShow" :class="popupShow ? 'credit_up' : 'credit_down'">
			<bet-popup
				:actual-odds="actualOdds"
				:order="order"
				@buildNum="buildNum"
				@changeBetPattern="changeBetPattern"
				@enterMultiple="enterMultiple"
				@enterMultipleBlur="enterMultipleBlur"
				@getClose="getClose"
				@betsOrderOff="betsOrderOff"
			></bet-popup>
		</van-popup>
		<van-popup v-model="ruleShow" :class="ruleShow ? 'credit_up' : 'credit_down'">
			<official-rule :play-id="id"></official-rule>
		</van-popup>
	</div>
</template>

<script>
import headTab from "../head/Index";
import groupList from "./groupList";
import { mapState, mapActions } from "vuex";
import lotteryResult from "../../../mixins/lotteryResult";
import BettingFooter from "../../../components/bettingFooter";
import playingOfficial from "../../../mixins/playing.official";
import betPopup from "./betPopup";
import { AlgorithmOfficial } from "@server/singularity";
import officialRule from "../../../components/Rule";

export default {
	name: "Index",
	components: { headTab, groupList, BettingFooter, betPopup, officialRule },
	mixins: [lotteryResult, playingOfficial],
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
			actualOdds: 0,
			playingDialog: false
		};
	},
	computed: {
		...mapState({
			currentPlaying: state => state.lottery.currentPlaying
		})
	},
	watch: {
		currentPlaying: {
			handler(n) {
				this.actualOdds = n.max_odds;
				this.initializeOrder();
			},
			deep: true
		},
		id(n) {
			this.setCurrentLottery(Number(n));
			this.loadHistoryLotteryResult();
		}
	},
	created() {
		this.setCurrentLottery(Number(this.id));
		this.loadHistoryLotteryResult();
	},
	methods: {
		...mapActions(["setCurrentLottery"]),
		// 监控点击选号界面
		clickMain() {
			this.$refs.headOffcial.closePlayDialog();
		},
		del() {
			this.initializeOrder();
			this.$refs.group.initBetCode();
			this.initializeBettingMessage();
		},
		handlerBetting() {
			if (this.isFinishPick === false)
				return this.$root.$emit("handleError", "您还没有完成选号");
			if (Number(this.betMoney) < 1)
				return this.$root.$emit("handleError", "下注金额不能小于1元");
			this.popupShow = true;
		},
		enterMultipleBlur() {
			this.order.bet_num = 1;
		},
		officialRuleShow() {
			this.ruleShow = true;
		},
		// 输入倍数
		enterMultiple() {
			let reg = /(^\d$)|(^\d+[0-9]{1,2}$)/,
				reg1 = /^(0|[1-9][0-9]*)$/;
			this.order.bet_num = this.order.bet_num.replace(/[^\d\\.]/g, "");
			if (!reg.test(this.order.bet_num)) {
				this.order.bet_num = "";
			} else if (Number(this.order.bet_num) === 0) {
				this.order.bet_num = 1;
			} else if (Number(this.order.bet_num) > 99) {
				this.order.bet_num = 99;
			} else if (!reg1.test(this.order.bet_num)) {
				this.order.bet_num = "";
			}
		},
		getBetCode(n) {
			this.order.play_details = n;
			const algorithm = new AlgorithmOfficial(this.currentPlaying, this.order);
			this.bettingMessage.numbers = algorithm.calculateBetNumber();
			if (this.bettingMessage.numbers > 0) {
				this.isFinishPick = true;
				this.bettingMessage.amount =
					this.$helps.floatMultiplication([
						this.bettingMessage.numbers,
						this.order.bet_num,
						this.defaultAmount,
						1
					]) / this.order.bet_model;
			} else {
				this.initializeBettingMessage();
				this.isFinishPick = false;
			}
		},
		// 加减倍数
		buildNum(type) {
			if (type === 1) {
				if (this.order.bet_num < 2) this.order.bet_num = 1;
				else this.order.bet_num--;
			}
			if (type === 2) {
				if (this.order.bet_num === "") {
					this.order.bet_num = 1;
				} else if (this.order.bet_num < 99) {
					this.order.bet_num++;
				}
			}
		},
		getClose() {
			this.popupShow = false;
		},
		async betsOrderOff(orderAloneMoney) {
			if (!orderAloneMoney) {
				this.$root.$emit("handleError", "下注金额不能为空");
				return;
			}
			if (!this.order.bet_num) {
				this.$root.$emit("handleError", "下注倍数不能为空");
				return;
			}
			this.order.bet = Number(
				(
					(orderAloneMoney * this.order.bet_num * this.order.note_num) /
					this.order.bet_model
				).toFixed(3)
			);
			this.order.fc_id = this.currentLottery.fc_id;
			await this.getLogin(this.order);
			this.popupShow = false;
			this.del();
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/official/Index";
</style>

import { mapState, mapGetters } from "vuex";

export default {
	data() {
		return {
			lotteryTimerID: null,
			lotteryTimeOut: null
		};
	},
	computed: {
		...mapState({
			liveLottery: state => state.lottery.liveLottery,
			pageStatus: state => state.common.pageStatus,
			period: state => state.lottery.period
		}),
		...mapGetters(["singleLotteryResult"]),
		isFastThree() {
			return this.$lotteryPub.isFastThree(this.liveLottery.fc_id);
		},
		// 单个彩种开奖结果
		lotteryResult() {
			return this.singleLotteryResult(this.liveLottery.fc_id)
				? this.singleLotteryResult(this.liveLottery.fc_id).slice(0, 20)
				: [];
		},
		// 最近一条开奖结果
		firstHistory() {
			const lotteryResult = this.lotteryResult;
			return lotteryResult.length > 0 ? lotteryResult[0] : {};
		},
		// 其他开奖结果
		otherHistory() {
			const lotteryResult = this.lotteryResult;
			return lotteryResult.length > 0 ? lotteryResult.slice(0) : [];
		}
	},
	methods: {
		// 加载历史开奖结果
		async loadHistoryLotteryResult() {
			await this.$api
				.request("API_GET_FC_AUTO_TO_NUM", {
					fc_id: this.liveLottery.fc_id,
					limit: 50
				})
				.then(
					success => {
						const { Data } = success.Data;
						if (
							!Data.length > 0 &&
							!this.$lotteryPub.isFastSecond(this.liveLottery.fc_id)
						)
							return this.$root.$emit(
								"handleError",
								"请求历史开奖结果失败，请稍后重试"
							);
						return this.$store.dispatch("setLotteryResult", {
							id: this.liveLottery.fc_id,
							lotteryResult: this.$lotteryPub.handleLotteryResult(
								this.liveLottery,
								Data
							)
						});
					},
					() => this.$root.$emit("handleError", "请求历史开奖结果失败，请稍后重试")
				);
		},
		isLastSecondOpen(id) {
			return this.$lotteryPub.isFastSecond(Number(id));
		}
	}
};

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
			currentLottery: state => state.lottery.currentLottery,
			pageStatus: state => state.common.pageStatus,
			period: state => state.lottery.period
		}),
		...mapGetters(["singleLotteryResult"]),
		isMarkSixLottery() {
			return this.$lotteryPub.isMarkSixLottery(this.currentLottery.id);
		},
		isHappyLottery() {
			return this.$lotteryPub.isHappyLottery(this.currentLottery.id);
		},
		isLuckyLottery() {
			return this.$lotteryPub.isLuckyLottery(this.currentLottery.id);
		},
		isFanTan() {
			return this.$lotteryPub.isFanTan(this.currentLottery.id);
		},
		isFastThree() {
			return this.$lotteryPub.isFastThree(this.currentLottery.id);
		},
		isLuckyCar() {
			return this.$lotteryPub.isLuckyCar(this.currentLottery.id);
		},
		isTimeTime() {
			return this.$lotteryPub.isTimeTime(this.currentLottery.id);
		},
		iFastSecondOpen() {
			return this.$lotteryPub.isFastSecond(this.currentLottery.id);
		},
		// 单个彩种开奖结果
		lotteryResult() {
			if (this.isFastThree) {
				let list = this.singleLotteryResult(this.currentLottery.fc_id) || [];
				if (this.currentLottery.info_rule === 1) {
					list.forEach(i => {
						let num = i.number,
							num1 = i.number[0];
						if (num.every(item => item === num1)) {
							i.single = "豹子";
							i.size = "豹子";
						}
					});
				}
				return list;
			} else {
				return this.singleLotteryResult(this.currentLottery.id)
					? this.singleLotteryResult(this.currentLottery.id).slice(0, 20)
					: [];
			}
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
			if (!this.currentLottery.fc_id) return;
			await this.$api
				.request("API_GET_FC_AUTO_TO_NUM", {
					fc_id: this.currentLottery.fc_id,
					limit: 50
				})
				.then(
					success => {
						const { Data } = success.Data;
						if (
							!Data.length > 0 &&
							!this.$lotteryPub.isFastSecond(this.currentLottery.id)
						)
							return this.$root.$emit(
								"handleError",
								"请求历史开奖结果失败，请稍后重试"
							);
						return this.$store.dispatch("setLotteryResult", {
							id: this.currentLottery.id,
							lotteryResult: this.$lotteryPub.handleLotteryResult(
								this.currentLottery,
								Data
							)
						});
					},
					() => this.$root.$emit("handleError", "请求历史开奖结果失败，请稍后重试")
				);
		},
		isLastSecondOpen(id) {
			return this.$lotteryPub.isFastSecond(Number(id));
		},
		goLottery(i) {
			if (i) {
				this.footerObj = i;
			}
			if (
				this.typeIndex === 1 &&
				(this.footerObj.tra_maint !== 1 || this.footerObj.tra_state !== 1)
			) {
				this.$root.$emit("handleError", "该彩种正在维护...");
				return;
			}
			if (
				this.typeIndex === 2 &&
				(this.footerObj.fc_maint !== 1 || this.footerObj.fc_state !== 1)
			) {
				this.$root.$emit("handleError", "该彩种正在维护...");
				return;
			}
			if (this.$lotteryPub.isFastThree(this.footerObj.id)) {
				this.$router.push({ name: "FastThree", params: { id: this.footerObj.id } });
			} else if (this.footerObj.is_second === 1) {
				this.$router.push({ name: "SecondsOpen", params: { id: this.footerObj.id } });
			} else if (this.typeIndex === 1) {
				this.$router.push({ name: "Official", params: { id: this.footerObj.id } });
			} else {
				this.$router.push({ name: "Credit", params: { id: this.footerObj.id } });
			}
		}
	}
};

import { mapState } from "vuex";
export default {
	data() {
		return {
			isShowHistory: false,
			order: [],
			betMoney: "",
			bettingMessage: {
				numbers: 0,
				amount: 0
			},
			isFinishPick: false,
			waitBet: false,
			ksResult: [],
			TimeMoney: 0, // 本次累计中奖金额
			autos: {},
			Accumulate: 0 //累计下注金额
		};
	},
	computed: {
		...mapState({
			userMessage: state => state.user.userMessage,
			platformFlag: state => state.common.platformFlag
		})
	},
	watch: {
		currentLottery: {
			handler() {
				// document.getElementsByClassName('page__content')[4].scrollTop = 0;
				this.isShowHistory = false;
			},
			deep: true
		},
		order: {
			handler() {
				this.calculationBetting();
			},
			deep: true
		},
		betMoney() {
			this.calculationBetting();
		},
		"second.quickTime": {
			handler() {
				this.calculationBetting();
			}
		}
	},
	methods: {
		initializeOrder() {
			this.order = [];
		},
		// 初始化注单信息
		initializeBettingMessage() {
			this.bettingMessage.numbers = 0;
			this.bettingMessage.amount = 0;
		},
		// 输入金额
		enterMoney(value) {
			let v = parseInt(value, 10);
			if (isNaN(v)) v = 0;
			else if (v < 0) v = 1;
			this.betMoney = v === 0 ? "" : v;
		},
		// 计算注单信息
		calculationBetting() {
			const money = this.betMoney ? parseInt(this.betMoney, 10) : 0;
			this.bettingMessage.numbers = this.order.length;
			this.bettingMessage.amount = this.order.length * money;
			if (this.iFastSecondOpen)
				this.bettingMessage.amount = this.order.length * money * this.second.quickTime;
		},
		// 快三彩票下单
		async playCreditLotteryOrder() {
			const self = this;
			if (Number(self.betMoney) < 1) {
				self.$root.$emit("handleError", "下注金额不能小于1元");
				self.betMoney = "";
				return;
			}
			if (!this.iFastSecondOpen) {
				self.shadowShow = false;
			}
			const tmpOrder = self.$helps.cloneDeep(self.order);
			tmpOrder.forEach(i => {
				i.bet = Number(self.betMoney);
				i.source_type = this.platformFlag || Number(self.$stores.get("de"));
				self.Accumulate += i.bet;
				delete i.odds;
			});
			if (!tmpOrder.length) return;
			this.$api
				.request("API_POST_BET_K3", {
					fc_id: self.currentLottery.id,
					params: tmpOrder
				})
				.then(
					success => {
						if (this.iFastSecondOpen) {
							self.openDigitalScrolling();
							if (self.quickTime > 0) {
								self.waitBet = true;
								self.shadowShow = true;
								self.quickTime--;
								setTimeout(() => {
									self.autos = success.Data;
									self.closeDigitalScrolling();
									self.openTimerOut(0, success.Data.autos);
									self.$root.$emit("getUserMessage"); // 刷新会员余额
									self.$refs.betting.getBetInfo(); // 刷新投注记录
									self.$emit("ks-result", success.Data, self.Accumulate); // 秒速快三开奖结果
									if (success.Data.winState === 1) {
										self.second.cumulative += Number(success.Data.betResult);
										self.TimeMoney += Number(success.Data.betResult);
									}
									this.loadHistoryLotteryResult();
								}, 2000);
								setTimeout(() => {
									self.betsOrderOff();
								}, 3000);
								self.$emit("ks-quickTime", self.quickTime); //剩余次数
							} else {
								self.getStopPrize(self.autos, 2000);
							}
						}
						self.popupShow = false; // 关闭注单弹窗
						// self.logRecord(tmpOrder);
						if (!this.iFastSecondOpen) {
							self.$refs.betting.getBetInfo();
							setTimeout(() => {
								self.$root.$emit("handleSuccess", "下注成功", 1000);
							}, 500);
							self.$root.$emit("getUserMessage"); // 刷新会员余额
						}
					},
					error => {
						self.$helps.hideLoading();
						self.$root.$emit("handleError", error);
					}
				);
		},
		getStopPrize(data, num) {
			let self = this;
			setTimeout(() => {
				self.shadowShow = false;
				this.second.confirmShow = true;
				this.second.sign = 2;
				this.second.text1 = `本次连续开奖 <span style="color: #f00">${this.second
					.quickTime || this.bonuses}</span> 次`;
				this.second.text2 = `累计中奖金额 <span style="color: #f00">${self.TimeMoney.toFixed(
					3
				)}</span> 元`;
				self.quickTime = 1;
				self.threeRemove = true;
				setTimeout(() => {
					self.threeRemove = false;
				}, 500); // 开奖完毕后清除本次中奖s金额
				self.TimeMoney = 0;
				this.del();
				this.initializeBettingMessage();
				self.waitBet = false;
				this.loadHistoryLotteryResult();
				self.autos = {};
				self.quickShowStyle = false;
				this.$emit("ks-quickTime", 0); //剩余次数
			}, num);
			self.activeQuick = 1;
		},
		// 日志打点
		logRecord(item) {
			this.$api
				.request("LOG_RECORD", {
					params: {
						user_name: this.userMessage.username,
						action: "betting",
						content: item,
						site_type: window.location.href
					}
				})
				.then();
		}
	}
};

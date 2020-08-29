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
			autos: {}, // 用于存投注开奖后的结果
			currentCount: 0 // 本次开奖次数
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
		}
	},
	created() {
		this.$emit("bettingMessage", this.bettingMessage);
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
			if (this.iFastSecondOpen) {
				this.bettingMessage.amount = this.order.length * money * this.second.quickTime;
			}
		},
		// 信用彩票下单
		async playCreditLotteryOrder() {
			const self = this;
			if (Number(self.betMoney) < 1) {
				self.$root.$emit("handleError", "下注金额不能小于1元");
				self.betMoney = "";
				return;
			}
			this.$helps.showLoading();
			const tmpOrder = self.$helps.cloneDeep(this.order);
			tmpOrder.forEach(i => {
				i.bet = Number(self.betMoney);
				i.source_type = this.platformFlag || Number(self.$stores.get("de"));
				delete i.odds;
			});
			self.waitBet = true;
			this.$api
				.request("API_POST_FC_BET", {
					fc_id: self.currentLottery.id,
					params: tmpOrder
				})
				.then(
					() => {
						self.$helps.hideLoading();
						self.$root.$emit("getUserMessage"); // 刷新会员余额
						self.logRecord(tmpOrder);
						self.popupShow = false;
						return self.$root.$emit("handleSuccess", "下注成功");
					},
					error => {
						self.popupShow = false;
						self.$helps.hideLoading();
						self.$root.$emit("handleError", error);
					}
				);
			self.waitBet = false;
			self.betMoney = "";
		},
		// 信用彩票秒彩下单
		async playCreditSecondLotteryOrder() {
			let _this = this;
			if (Number(this.betMoney) < 1) {
				this.$root.$emit("handleError", "下注金额不能小于1元");
				this.betMoney = "";
				return;
			}
			const tmpOrder = this.$helps.cloneDeep(this.order);
			tmpOrder.forEach(i => {
				i.bet = Number(this.betMoney);
				i.source_type = Number(_this.$stores.get("de"));
				delete i.odds;
			});
			this.$api
				.request("API_POST_FC_BET", {
					fc_id: this.currentLottery.id,
					params: tmpOrder
				})
				.then(
					success => {
						// 是否秒三
						this.currentCount++;
						tmpOrder.forEach(i => {
							_this.accumulate += i.bet; // 统计下注的金额
						});
						this.openDigitalScrolling(); // 开启滚动
						if (this.second.quickTime > 0) {
							_this.waitBet = true;
							// 开奖次数是否大于
							_this.shadowShow = true; // 显示开奖提示信息的（可以暂停的那个）
							this.loadHistoryLotteryResult(); // 历史开奖刷新一下
							setTimeout(() => {
								this.closeDigitalScrolling(); // 停止滚动开奖号码
								this.firstHistory.period = success.Data.Period;
								this.openTimerOut(0, success.Data.autos); // 滚动后显示开奖结果号码
								this.autos = success.Data; // 这里返回的数据可以用在别的地方
								if (success.Data.winState === 1) {
									this.second.cumulative += Number(success.Data.betResult); // 统计累计中奖
									this.TimeMoney += Number(success.Data.betResult); // 累计中奖金额
								}
							}, 2000); // 这个是号码滚动的 写下面这个是为了不要开奖太快了
							setTimeout(() => {
								this.betsOrderOff(); // 隔3秒再调用下注接口
							}, 3000);
							this.second.quickTime--; // 每次进入开奖次数减去一个
						}
						this.$root.$emit("getUserMessage"); // 刷新会员余额
						// this.logRecord(tmpOrder);
					},
					error => {
						this.$helps.hideLoading();
						this.$root.$emit("handleError", error);
					}
				);
		},
		getStopPrize() {
			let self = this;
			if (self.currentCount) {
				self.shadowShow = false; // 隐藏掉有暂停那个弹窗
				self.second.whetherShow = false; // 隐藏掉开奖暂停后点击是否的温馨提示
				self.$helps.hideLoading(); // 关闭loadging
				self.second.confirmShow = true; // 显示具体开奖信息（控制弹窗显示）
				self.second.sign = 2; // 这里的表示弹窗提示样式显示 （下面写法你懂得）
				self.second.text1 = `本次连续开奖 <span style="color: #f00">${self.currentCount}</span> 次`;
				self.second.text2 = `累计中奖金额 <span style="color: #f00">${self.TimeMoney.toFixed(
					3
				)}</span> 元`;
				self.second.quickTime = 0;
				self.waitBet = false;
			}
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

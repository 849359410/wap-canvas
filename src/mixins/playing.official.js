import { mapState } from "vuex";

export default {
	data() {
		return {
			order: {},
			defaultAmount: 1,
			maxMultiple: 100000,
			multiple: 1,
			maxBonus: 0,
			bettingMessage: {
				numbers: 0,
				amount: 0
			},
			isFinishPick: false,
			waitBet: false
		};
	},
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery,
			currentPlaying: state => state.lottery.currentPlaying,
			userMessage: state => state.user.userMessage,
			period: state => state.lottery.period,
			isLogin: state => state.user.isLogin,
			platformFlag: state => state.common.platformFlag
		})
	},
	watch: {
		bettingMessage: {
			handler(n) {
				// this.$emit("bett-mess", n);
				this.order.note_num = n.numbers;
				this.order.bet = Number(n.amount);
			},
			deep: true
		}
	},
	created() {
		this.getLogin();
	},
	methods: {
		initializeOrder() {
			this.order = {
				fc_id: Number(this.currentPlaying.fid), // 彩种id
				type_id: Number(this.currentPlaying.type_id), // 玩法类型id
				play_id: Number(this.currentPlaying.id), // 玩法id
				content_id: Number(this.currentPlaying.cid), // 各个站点配置 id
				scale: 0, // 滚动条 百分之
				bet: 1, // 金额
				bet_num: 1, // 倍数
				bet_model: Object.prototype.hasOwnProperty.call(
					this.currentPlaying,
					"bettingPattern"
				)
					? this.currentPlaying.bettingPattern[0]
					: 1, // 投注模式
				play_details: {}, // 投注号码
				note_num: 0, // 注数
				rball: "", // 位置中文
				source_type: this.platformFlag || Number(this.$stores.get("de"))
			};
			this.multiple = 1;
		},
		// 初始化注单信息
		initializeBettingMessage() {
			this.maxBonus = 0;
			this.bettingMessage.numbers = 0;
			this.bettingMessage.amount = 0;
		},
		// 加减按钮改变倍数
		changeMultiple(type) {
			if (type === 1) {
				if (this.multiple !== "" && this.multiple > 1) this.multiple -= 1;
			}
			if (type === 2) {
				if (this.multiple === "") {
					this.multiple = 1;
				} else if (this.multiple < this.maxMultiple) {
					this.multiple += 1;
				}
			}
		},
		// 输入倍数
		enterMultiple(value) {
			let v = Number(value);
			if (!Number.isSafeInteger(v)) v = 0;
			if (v > this.maxMultiple) v = this.maxMultiple;
			else if (v < 0) v = 1;
			this.multiple = v === 0 ? "" : v;
		},
		enterMultipleBlur(value) {
			if (isNaN(value)) {
				this.multiple = 1;
			}
		},
		// 改变投注模式
		changeBetPattern(type) {
			this.order.bet_model = type;
		},
		// 生成购物车数据
		tidyOrder(order) {
			const arr = [];
			Object.keys(order).forEach(i => {
				if (!Object.prototype.hasOwnProperty.call(this.order, i)) {
					delete order[i];
				}
				if (i === "play_details") {
					if (Object.prototype.hasOwnProperty.call(order.play_details, "optional")) {
						const tmpRBall = [];
						order.play_details.optional.forEach(j => {
							if (
								Object.prototype.hasOwnProperty.call(
									this.currentPlaying.optional.ball,
									j
								)
							) {
								tmpRBall.push(this.currentPlaying.optional.ball[j]);
							}
						});
						order.rball = tmpRBall.join(",");
						order.rball = order.rball.replace(/位/g, "");
						delete order.play_details.optional;
					}
					order.play_details = Object.values(order.play_details);
					order.play_details.forEach(j => {
						j.sort((x, y) => {
							if (Number(x) < Number(y)) return -1;
							if (Number(x) > Number(y)) return 1;
							return 0;
						});
						if (j.length) arr.push(j);
					});
					if (this.$lotteryPub.isHappyLottery(this.currentLottery.id)) {
						order.play_details = arr.join(",");
					} else {
						order.play_details = order.play_details.map(j => j.join(",")).join("|");
					}
				}
			});
		},
		async getLogin(order) {
			await this.$api.request("API_GET_USER").then(
				success => {
					if (success.IsLogin === 0) {
						this.$root.$emit("handleError", success);
					} else if (arguments.length) {
						this.placeOrder(order);
					}
				},
				error => this.$root.$emit("handleError", error)
			);
		},
		// 投注
		placeOrder(order) {
			let tmpOrder = this.$helps.cloneDeep(order),
				betOrder = [];
			if (this.isFinishPick === false)
				return this.$root.$emit("handleError", "您还没有完成选号");
			this.$helps.showLoading();
			betOrder.push(tmpOrder);
			betOrder.forEach(i => {
				this.tidyOrder(i);
				i.bet_num = Number(i.bet_num);
			});
			return this.$api
				.request("API_POST_FC_TRA_BET", {
					fc_id: Number(order.fc_id),
					params: betOrder
				})
				.then(
					() => {
						this.$helps.hideLoading();
						this.waitBet = false;
						this.multiple = 1;
						this.$root.$emit("getUserMessage");
						this.logRecord(betOrder);
						return this.$root.$emit("handleSuccess", "下注成功");
					},
					error => {
						this.$helps.hideLoading();
						this.waitBet = false;
						this.multiple = 1;
						return this.$root.$emit("handleError", error);
					}
				);
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

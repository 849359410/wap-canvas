import LotteryResult from "./lotteryResult";
import { mapState } from "vuex";

export default {
	mixins: [LotteryResult],
	computed: {
		...mapState({
			period: state => state.lottery.period
		})
	},
	watch: {
		pageStatus(n) {
			switch (n) {
				case "hidden":
					if (!this.iFastSecondOpen) this.openTimeOut(this.closeScrolling, 0);
					break;
				case "visible":
					if (!this.iFastSecondOpen) this.openDigitalScrolling();
					this.loadHistoryLotteryResult();
					break;
			}
		},
		period: {
			handler(n) {
				if (!this.iFastSecondOpen) this.openDigitalScrolling();
				if (
					this.firstHistory.period &&
					Number(this.firstHistory.period) === Number(n.pre_period)
				) {
					this.openTimeOut(this.closeScrolling, 500);
				}
			},
			immediate: true,
			deep: true
		},
		firstHistory: {
			handler(n) {
				if (n.period && Number(n.period) === Number(this.period.pre_period)) {
					this.openTimeOut(this.closeScrolling, 500);
				}
			},
			deep: true
		}
	},
	created() {
		this.closeDigitalScrolling();
	},
	beforeDestroy() {
		this.closeTimeOut();
		this.closeDigitalScrolling();
	},
	methods: {
		returnClass(v) {
			return [
				"Dice",
				{
					Dice2: v === 2,
					Dice3: v === 3,
					Dice4: v === 4,
					Dice5: v === 5,
					Dice6: v === 6
				}
			];
		},
		assign(type, autos) {
			if (document.getElementsByClassName("resultList")[0] === undefined) return;
			let emList = document.getElementsByClassName("resultList")[0].children,
				emlistMain = document.getElementsByClassName("resultList");
			emList = [...emList];
			emlistMain = [...emlistMain];
			if (emlistMain.length > 1 && !this.iFastSecondOpen) {
				for (let j = 0; j < emlistMain.length; j++) {
					for (let i = 0; i < emlistMain[j].children.length; i++) {
						if (type === 1) {
							emlistMain[j].children[i].innerHTML = autos[j][i];
						} else {
							emlistMain[j].children[i].innerHTML = Math.round(
								Math.random() * 10 * (9 / 10)
							);
						}
					}
				}
			} else {
				if (emList.length > 0) {
					for (let i = 0; i < emList.length; i++) {
						if (this.iFastSecondOpen && this.isFastThree) {
							// 秒开快三
							let arr = [1, 1, 1];
							if (type === 1) {
								if (autos && autos.length) {
									emList[i].className = `red-ball Dice Dice${autos[i]}`;
								} else {
									emList[i].className = `red-ball Dice Dice${arr[i]}`;
								}
							} else {
								let a = Math.round(Math.random() * 10 * (6 / 10));
								emList[i].className = `red-ball Dice Dice${a}`;
							}
						} else if (this.isFastThree) {
							// 快三
							if (type === 1) {
								emList[
									i
								].className = `red-ball Dice Dice${this.firstHistory.number[i]}`;
							} else {
								let a = Math.round(Math.random() * 10 * (6 / 10));
								emList[i].className = `red-ball Dice Dice${a}`;
							}
						} else if (!this.isFastThree && this.iFastSecondOpen) {
							// 其他秒开
							if (type === 1) {
								if (typeof autos[i] === "object") {
									emList[i].innerHTML = autos[i];
								} else {
									if (this.isFanTan && i === 3) {
										emList[i].innerHTML = `${autos[i]}番`;
									} else emList[i].innerHTML = autos[i];
								}
							} else {
								emList[i].innerHTML = Math.round(Math.random() * 10 * (9 / 10));
							}
						} else {
							if (type === 1) {
								if (typeof this.firstHistory.number[i] === "object") {
									emList[i].innerHTML = this.firstHistory.number[i].id;
								} else {
									emList[i].innerHTML = this.firstHistory.number[i];
								}
							} else {
								emList[i].innerHTML = Math.round(Math.random() * 10 * (9 / 10));
							}
						}
					}
				}
			}
		},
		closeScrolling() {
			this.closeDigitalScrolling();
			this.assign(1);
		},
		// 开启号码滚动
		openDigitalScrolling() {
			if (this.lotteryTimeOut) this.closeTimeOut();
			if (this.lotteryTimerID) this.closeDigitalScrolling();
			this.lotteryTimerID = window.setInterval(() => {
				this.assign();
			}, 50);
		},
		// 关闭号码滚动
		closeDigitalScrolling() {
			window.clearInterval(this.lotteryTimerID);
			this.lotteryTimerID = null;
		},
		openTimeOut(callback, time) {
			if (this.lotteryTimeOut) this.closeTimeOut();
			this.lotteryTimeOut = setTimeout(callback, time);
		},
		openTimerOut(time, autos) {
			if (this.lotteryTimeOut) this.closeTimeOut();
			this.lotteryTimeOut = setTimeout(() => {
				this.closeDigitalScrolling();
				this.assign(1, autos);
			}, time);
		},
		closeTimeOut() {
			window.clearTimeout(this.lotteryTimeOut);
			this.lotteryTimeOut = null;
		}
	}
};

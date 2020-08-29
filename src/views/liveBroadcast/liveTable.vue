<template>
	<canvas id="table"></canvas>
</template>

<script>
import { mapState } from "vuex";
import canvas from "./js/canvas";
import { PlayingCredit } from "@server/singularity";
import { Bus } from "../../main";

export default {
	name: "LiveTable",
	mixins: [canvas],
	props: {
		creditPlaying: {
			type: Array,
			default() {
				return [];
			}
		},
		betMoney: {
			type: Number,
			default() {
				return 10;
			}
		},
		audioMute: {
			type: Boolean,
			default() {
				return false;
			}
		},
		bgmEffect: {
			type: Boolean,
			default() {
				return false;
			}
		},
		gameEffect: {
			type: Boolean,
			default() {
				return false;
			}
		},
		variousData: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			resultData: [],
			lineWidth: 0,
			lineHeight: 0,
			total: {
				money: 0,
				numbers: 0
			},
			second: 0,
			secondActive: false,
			hintObj: {
				show: true,
				img: require("../../assets/images/liveBroadcast/popup/th.png"),
				text: ""
			},
			tipsMus: new Audio(require("./audio/effect_clickchip.mp3")),
			successAudio: new Audio(require("./audio/cnbetsuccess.mp3")),
			fail: new Audio(require("./audio/effect_timealert.mp3")),
			noBet: new Audio(require("./audio/cnbenjuweixiazhu.mp3"))
		};
	},
	computed: {
		...mapState({
			userMessage: state => state.user.userMessage,
			liveLottery: state => state.lottery.liveLottery
		})
	},
	watch: {
		creditPlaying(n) {
			this.getStructure(n[0]);
		},
		resultData: {
			handler() {
				let canvas = document.getElementById("table"),
					ctx = canvas.getContext("2d");
				this.total.money = 0;
				this.total.numbers = 0;
				this.getCanvas(ctx, canvas);
			},
			deep: true
		},
		total: {
			handler(n) {
				this.$emit("getTotal", n);
			},
			deep: true
		},
		second() {
			// console.log("未下注次数", n);
		}
	},
	destroyed() {
		Bus.$off("getMutePlay");
	},
	mounted() {
		let canvas = document.getElementById("table"),
			ctx = canvas.getContext("2d");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight * 0.35;
		window.addEventListener("resize", () => {
			this.getCanvas(ctx, canvas);
		});
		canvas.onmousedown = event => {
			let w = (canvas.width / 5) * 0.98,
				h = (canvas.height / 4) * 0.82;
			if (
				this.creditPlaying[0].name === "三同号通选" ||
				this.creditPlaying[0].name === "三连号通选"
			) {
				w = canvas.width * 0.8;
				h = canvas.height / 4;
			}
			this.resultData.forEach((item, val) => {
				let deviationX = (canvas.width / 5) * 0.12,
					deviationY = (canvas.height / 4) * 0.15 * (val + 1);
				if (
					this.creditPlaying[0].name === "三同号通选" ||
					this.creditPlaying[0].name === "三连号通选"
				) {
					deviationX = canvas.width * 0.16;
					deviationY = (canvas.height / 4) * 0.4;
				}
				item.forEach((i, index) => {
					if (event.layerX >= w * index + deviationX && event.layerX <= w * index + w) {
						if (
							event.layerY >= h * val + deviationY &&
							event.layerY <= h * val + deviationY + h
						) {
							if (this.userMessage.money - this.total.money < this.betMoney) {
								this.$parent.topUp = true;
								if (!this.gameEffect) this.fail.play();
								return;
							}
							this.total.money += this.betMoney;
							if (!i.active) {
								i.active = true;
								this.total.numbers += 1;
								i.tired.push(this.betMoney);
								this.drawTiredImg(
									ctx,
									w * index + w - 15,
									h * val + deviationY + h - 15,
									i.tired
								);
							}
							if (!this.gameEffect) this.tipsMus.play();
							i.money += this.betMoney;
							let img = new Image();
							img.src = require("../../assets/images/liveBroadcast/other/selectBg.png");
							img.onload = () => {
								ctx.drawImage(
									img,
									w * index + deviationX,
									h * val + deviationY,
									w - deviationX,
									h / 2.5
								);
								this.drawText(
									ctx,
									w * index + deviationX,
									h * val + deviationY,
									w,
									(w - deviationX) / 2,
									15,
									i.money,
									"#fff",
									"normal 14px Arial"
								);
							};
							if (i.tired.indexOf(this.betMoney) < 0 && i.tired.length < 9) {
								i.tired.push(this.betMoney);
							}
							this.drawTiredImg(
								ctx,
								w * index + w - 15,
								h * val + deviationY + h - 15,
								i.tired
							);
						}
					}
				});
			});
		};
		Bus.$on("getMutePlay", () => {
			this.noBet.muted = true;
			this.noBet.play();
		});
	},
	methods: {
		getCanvas(ctx, canvas) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight * 0.37;
			let w = (canvas.width / 5) * 0.98,
				h = (canvas.height / 4) * 0.82;
			if (
				this.creditPlaying[0].name === "三同号通选" ||
				this.creditPlaying[0].name === "三连号通选"
			) {
				w = canvas.width * 0.8;
				h = canvas.height / 4;
			}
			this.resultData.forEach((item, val) => {
				let deviationX = (canvas.width / 5) * 0.12,
					deviationY = (canvas.height / 4) * 0.15 * (val + 1);
				if (
					this.creditPlaying[0].name === "三同号通选" ||
					this.creditPlaying[0].name === "三连号通选"
				) {
					deviationX = canvas.width * 0.16;
					deviationY = (canvas.height / 4) * 0.4;
				}
				item.forEach((i, index) => {
					this.roundRect(ctx, w * index, h * val, w, h, deviationX, deviationY, i);
				});
			});
		},
		roundRect(ctx, x, y, w, h, deviationX, deviationY, item) {
			this.drawRect(ctx, x, y, w, h, 1, "#5a6dcb", deviationX, deviationY);
			if (
				this.creditPlaying[0].name === "三同号通选" ||
				this.creditPlaying[0].name === "三连号通选"
			) {
				this.drawText(
					ctx,
					x + deviationX,
					y + deviationY,
					w,
					(w - deviationX) / 2,
					20,
					item.content_name,
					"#fff",
					"normal 16px Arial"
				);
				this.drawText(
					ctx,
					x + deviationX,
					y + deviationY,
					w,
					(w - deviationX) / 2,
					h / 2 + 16,
					item.odds,
					"#ebe54a",
					"normal 12px Arial"
				);
			} else {
				this.drawText(
					ctx,
					x + deviationX,
					y + deviationY,
					w,
					(w - deviationX) / 2,
					18,
					item.content_name,
					"#fff",
					"normal 16px Arial"
				);
				this.drawText(
					ctx,
					x + deviationX,
					y + deviationY,
					w,
					(w - deviationX) / 2,
					h / 2 + 14,
					item.odds,
					"#ebe54a",
					"normal 12px Arial"
				);
			}
		},
		getStructure(obj) {
			this.resultData = obj.list.reduce((pre, next, idx) => {
				next.active = false;
				next.money = 0; // 注单金额
				next.tired = [];
				if (idx % 5) {
					pre[parseInt(idx / 5)].push(next);
				} else pre.push([next]);
				return pre;
			}, []);
		},
		betsOrderFast() {
			let canvas = document.getElementById("table"),
				ctx = canvas.getContext("2d");
			// 下注
			let arr = [],
				tmpOrder = [];
			this.resultData.forEach(item => {
				item.forEach(i => {
					if (this.$helps.cloneDeep(i).active) {
						let data = {};
						data.bet = this.$helps.cloneDeep(i).money;
						data.content_id = this.$helps.cloneDeep(i).id;
						data.fc_id = this.$helps.cloneDeep(i).fc_id;
						data.handicap = this.$helps.cloneDeep(i).handicap;
						data.play_details = this.$helps.cloneDeep(i).content_name;
						data.play_id = this.$helps.cloneDeep(i).play_id;
						data.source_type = Number(this.$stores.get("de")) || 2;
						arr.push(data);
					}
				});
			});
			tmpOrder = PlayingCredit.handleBettingCodes(arr, this.liveLottery.id);
			this.resultData.forEach(item => {
				item.forEach(i => {
					if (this.$helps.cloneDeep(i).active) {
						tmpOrder.forEach(j => {
							if (this.$helps.cloneDeep(i).content_name === j.play_details) {
								j.bet = this.$helps.cloneDeep(i).money;
							}
						});
					}
				});
			});
			if (!tmpOrder.length) {
				this.hintObj.img = require("../../assets/images/liveBroadcast/popup/th.png");
				this.hintObj.text = "您未下注，请先下注";
				return this.$emit("getDialog", this.hintObj);
			}
			if (this.variousData.state !== 2) {
				this.hintObj.img = require("../../assets/images/liveBroadcast/popup/th.png");
				this.hintObj.text = "下注时间未到";
				tmpOrder = [];
				return this.$emit("getDialog", this.hintObj);
			}
			this.$api
				.request("API_POST_BET_LIVE_K3", {
					fc_id: this.liveLottery.fc_id,
					params: tmpOrder
				})
				.then(
					() => {
						this.second = 0;
						this.secondActive = true;
						this.hintObj.img = require("../../assets/images/liveBroadcast/popup/cg.png");
						this.hintObj.text = "下注成功";
						sessionStorage.setItem("period", this.variousData.period);
						this.$root.$emit("getUserMessage"); // 刷新个人信息
						if (!this.bgmEffect) this.successAudio.play();
						this.$emit("getDialog", this.hintObj);
					},
					error => {
						switch (error.Code) {
							case "1103":
								// 彩种停用
								this.$parent.maintainObj.show = true;
								this.$parent.maintainObj.text = "已停用";
								break;
							case "1104":
								// 彩种维护
								this.$parent.maintainObj.show = true;
								this.$parent.maintainObj.text = "已维护";
								break;
							case "1109":
								this.$root.$emit("handleError", error);
								break;
							default:
								if (!this.gameEffect) this.fail.play();
								this.hintObj.img = require("../../assets/images/liveBroadcast/popup/th.png");
								this.hintObj.text = error.Msg;
								this.$emit("getDialog", this.hintObj);
								break;
						}
					}
				);
			this.getStructure(this.creditPlaying[0]);
			this.getCanvas(ctx, canvas);
		},
		getSecond() {
			if (this.secondActive) return (this.secondActive = false);
			this.second += 1;
		},
		getNoAudio() {
			if (!this.bgmEffect) {
				this.noBet.muted = false;
				this.noBet.play();
			}
		},
		drawTiredImg(ctx, x, y, item) {
			item.forEach((i, j) => {
				let tiredImg = new Image();
				tiredImg.src = require(`../../assets/images/liveBroadcast/chip/noSelect/${i}.png`);
				tiredImg.onload = () => {
					ctx.drawImage(tiredImg, x, y - j * 2, 15, 15);
				};
			});
		}
	}
};
</script>

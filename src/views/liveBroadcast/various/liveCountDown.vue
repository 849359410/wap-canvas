<template>
	<canvas id="count"></canvas>
</template>

<script>
import { mapState } from "vuex";
import canvas from "../js/canvas";
import { Bus } from "../../../main";
export default {
	name: "CountDown",
	mixins: [canvas],
	props: {
		audioMute: {
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
		},
		bgmEffect: {
			type: Boolean,
			default() {
				return false;
			}
		}
	},
	data() {
		return {
			diffTime: 0,
			countDownTime: 0,
			timeOut: null,
			nowTime: Math.trunc(new Date().getTime() / 1000),
			resultDown: {},
			tenAudio: new Audio(require("../audio/cnlast10Seconds.mp3"))
		};
	},
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery,
			pageStatus: state => state.common.pageStatus
		}),
		seconds() {
			return Math.trunc(this.diffTime) % 60;
		},
		minutes() {
			return Math.trunc(this.diffTime / 60) % 60;
		},
		hours() {
			return Math.trunc(this.diffTime / 60 / 60);
		}
	},
	watch: {
		pageStatus(n) {
			return n === "hidden" ? this.closeCountdown() : this.openCountdown();
		},
		nowTime(n) {
			const diffTime = this.countDownTime - n;
			if (diffTime <= 0) {
				this.diffTime = 0;
				this.closeCountdown();
				this.$emit("getStatistics");
			} else {
				this.diffTime = diffTime;
			}
			this.getCanvas();
			if (diffTime <= 10 && diffTime >= 0) this.$emit("timeOut", diffTime, true);
			if (diffTime === 10) {
				this.$emit("timeOut", diffTime, true);
				let audio = new Audio(require("../audio/cnWinMoneyFast.mp3"));
				if (!this.bgmEffect) {
					this.tenAudio.muted = false;
					this.tenAudio.play();
					this.tenAudio.addEventListener("ended", () => {
						this.tenAudio = new Audio(require("../audio/cnlast10Seconds.mp3"));
						audio.play();
					});
				}
			}
		},
		variousData: {
			handler(n) {
				if (n.state === 2) {
					this.countDownTime = n.ztime
						? Math.trunc(new Date().getTime() / 1000) + n.ztime
						: 0;
					this.openCountdown();
				}
				this.getCanvas();
			},
			deep: true
		}
	},
	destroyed() {
		Bus.$off("getMutePlay");
	},
	mounted() {
		let count = document.getElementById("count"),
			ctx = count.getContext("2d");
		count.width = window.innerWidth * 0.45;
		count.height = 56;
		let x = (count.width * 0.2) / 2 - 6,
			y = count.height / 2 - 8;
		this.drawImg(ctx, x, y);
		this.roundRect(ctx, count.width * 0.2, 0, count.width * 0.8, 56, 5);
		window.addEventListener("resize", this.getCanvas());
		count.onmousedown = event => {
			if (event.layerX >= x && event.layerX <= x + 12) {
				if (event.layerY >= y && event.layerY <= y + 16) {
					this.$router.go(-1);
				}
			}
		};
		Bus.$on("getMutePlay", () => {
			this.tenAudio.muted = true;
			this.tenAudio.play();
		});
	},
	methods: {
		getCanvas() {
			let count = document.getElementById("count"),
				ctx = count.getContext("2d"),
				time = `${this.$filters.twoDigits(this.hours)}:${this.$filters.twoDigits(
					this.minutes
				)}:${this.$filters.twoDigits(this.seconds)}`;
			let x = (count.width * 0.2) / 2 - 6,
				y = count.height / 2 - 8;
			this.drawImg(ctx, x, y);
			ctx.clearRect(0, 0, count.width * 0.8, 56);
			this.roundRect(ctx, count.width * 0.2, 0, count.width * 0.8, 56, 5);
			this.drawText(
				ctx,
				count.width * 0.2,
				20,
				count.width * 0.8,
				(count.width * 0.8) / 2,
				6,
				`距${this.$filters.formatString(this.variousData.period, -6)}期截止`,
				"#fff",
				"normal 14px Aria"
			);
			this.drawText(
				ctx,
				count.width * 0.2,
				40,
				count.width * 0.8,
				(count.width * 0.8) / 2,
				6,
				time,
				"yellow",
				"normal 16px Aria"
			);
		},
		drawImg(ctx, x, y) {
			let img = new Image();
			img.src = require("../../../assets/images/liveBroadcast/other/retreat.png");
			img.onload = () => {
				ctx.drawImage(img, x, y, 12, 16);
			};
		},
		roundRect(ctx, x, y, w, h, r) {
			if (w < 2 * r) r = w / 2;
			if (h < 2 * r) r = h / 2;
			ctx.beginPath();
			ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
			ctx.moveTo(x + r, y);
			ctx.arcTo(x + w, y, x + w, y + h, r);
			ctx.arcTo(x + w, y + h, x, y + h, r);
			ctx.arcTo(x, y + h, x, y, r);
			ctx.arcTo(x, y, x + w, y, r);
			ctx.fill();
			ctx.closePath();
		},
		openCountdown() {
			this.timeOut = window.setInterval(() => {
				this.nowTime = Math.trunc(new Date().getTime() / 1000);
			}, 1000);
		},
		closeCountdown() {
			window.clearInterval(this.timeOut);
			this.timeOut = null;
		}
	}
};
</script>

<style scoped lang="scss">
#count {
	position: fixed;
	top: -5px;
}
</style>

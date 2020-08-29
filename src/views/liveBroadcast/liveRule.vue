<template>
	<canvas id="rule"></canvas>
</template>

<script>
import canvas from "./js/canvas";
import { mapState } from "vuex";

export default {
	name: "LiveRule",
	mixins: [canvas],
	data() {
		return {
			lineWidth: 0,
			lineHeight: 0
		};
	},
	computed: {
		...mapState({
			liveLottery: state => state.lottery.liveLottery
		})
	},
	mounted() {
		let rule = document.getElementById("rule"),
			ctx = rule.getContext("2d");
		rule.width = window.innerWidth;
		rule.height = window.innerHeight;
		this.lineWidth = rule.width;
		this.lineHeight = rule.height;
		this.drawHead(ctx);
		rule.onmousedown = event => {
			if (event.layerX >= 18 && event.layerX <= 18 + 12) {
				if (event.layerY >= 28 / 2 && event.layerY <= 28 / 2 + 16) {
					this.$router.go(-1);
				}
			}
		};
		window.addEventListener("resize", () => {
			rule.width = window.innerWidth;
			rule.height = window.innerHeight;
			this.lineWidth = rule.width;
			this.lineHeight = rule.height;
			this.drawHead(ctx);
		});
	},
	methods: {
		drawHead(ctx) {
			this.drawRect2(ctx, 0, 0, this.lineWidth, this.lineHeight, "#010c2c");
			this.drawRect2(ctx, 0, 0, this.lineWidth, 44, "#222d51");
			ctx.beginPath();
			ctx.fillStyle = "#fff";
			ctx.font = "bold 18px sans-serif";
			ctx.textAlign = "center";
			ctx.fillText(this.$route.meta.name, this.lineWidth / 2, 28);
			ctx.closePath();

			let img = new Image();
			img.src = require("../../assets/images/liveBroadcast/other/retreat.png");
			img.onload = () => {
				ctx.drawImage(img, 18, 28 / 2, 12, 16);
			};
			ctx.beginPath();
			let ruleImg = new Image();
			if (this.liveLottery.info_rule === 1) {
				ruleImg.src = require("../../assets/images/liveBroadcast/rule/killingRule.png");
			} else {
				ruleImg.src = require("../../assets/images/liveBroadcast/rule/noKillingRule.png");
			}
			ruleImg.onload = () => {
				ctx.drawImage(
					ruleImg,
					(this.lineWidth * 0.06) / 2,
					44 + this.lineHeight * 0.02,
					this.lineWidth * 0.94,
					(this.lineHeight - 44) * 0.9
				);
			};
		},
		drawRect2(ctx, x, y, w, h, color) {
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(w, y);
			ctx.lineTo(w, h);
			ctx.lineTo(x, h);
			ctx.lineTo(x, y);
			ctx.fill();
			ctx.closePath();
		}
	}
};
</script>

<style scoped lang="scss">
#rule {
	position: absolute;
}
</style>

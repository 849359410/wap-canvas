<template>
	<div style="overflow-y: hidden;height: 100%">
		<canvas id="canvas"></canvas>
		<liveTrendTable :table-data="tableData" :line-height="lineHeight"></liveTrendTable>
	</div>
</template>

<script>
import liveTrendTable from "./liveTrendTable";
import { LotteryPub } from "@server/singularity";
import { mapActions, mapState } from "vuex";
import canvas from "./js/canvas";
import liveLotteryResult from "./js/liveLotteryResult";

export default {
	name: "LiveTrend",
	components: { liveTrendTable },
	mixins: [canvas, liveLotteryResult],
	props: {
		id: {
			type: [Number, String],
			default: ""
		}
	},
	data() {
		return {
			lineWidth: 0,
			lineHeight: 0,
			lotteryResults: [],
			activeTab: 0,
			tableData: [],
			searchParams: {
				limit: 30
			},
			digit: ["百位", "十位", "个位"]
		};
	},
	computed: {
		...mapState({
			lottery: state => state.lottery.liveLottery
		})
	},
	watch: {
		id() {
			// 设置当前彩种
			this.lotteryResultAll();
			this.lotteryResults = [];
			this.tableData = [];
		}
	},
	mounted() {
		let canvas = document.getElementById("canvas"),
			ctx = canvas.getContext("2d");
		this.getCanvas(ctx, canvas);
		canvas.onmousedown = event => {
			if (event.layerX >= 18 && event.layerX <= 18 + 12) {
				if (event.layerY >= 28 / 2 && event.layerY <= 28 / 2 + 16) {
					this.$router.go(-1);
				}
			}
			if (event.layerY >= 55 && event.layerY <= 55 + 25) {
				if (Math.floor(event.layerX / 60) > 2) return;
				let startX = 60 * Math.floor(event.layerX / 60) + 10,
					nedX = 60 * Math.floor(event.layerX / 60) + 60;
				// 点击到格子x坐标之间的空白区域
				if (event.layerX < startX || event.layerX > nedX) return;
				this.activeTab = Math.floor(event.layerX / 60);
				this.getLotteryResult(this.activeTab);
				this.drawButton(ctx);
			}
		};
		window.addEventListener("resize", () => {
			this.getCanvas(ctx, canvas);
		});
	},
	created() {
		this.setCurrentLottery(Number(this.id));
		this.lotteryResultAll();
	},
	methods: {
		...mapActions(["setCurrentLottery"]),
		getCanvas(ctx, canvas) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			this.lineWidth = canvas.width;
			this.lineHeight = canvas.height;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			this.drawHead(ctx, canvas);
			this.drawButton(ctx);
		},
		drawHead(ctx) {
			this.drawRect2(ctx, 0, 0, this.lineWidth, this.lineHeight, "#2b365f");
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
			ctx.lineWidth = 1;
			ctx.strokeStyle = "#222d51";
			ctx.moveTo(0, 94);
			ctx.lineTo(this.lineWidth, 94);
			ctx.stroke();
		},
		drawRect1(ctx, x, y, width, height, borderColor) {
			ctx.fillStyle = borderColor;
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(width + x, y);
			ctx.lineTo(width + x, height + y);
			ctx.lineTo(x, height + y);
			ctx.closePath();
			ctx.fill();
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
		},
		// 获取开奖结果
		lotteryResultAll() {
			this.searchParams.fc_id = this.lottery.fc_id ? this.lottery.fc_id : 54;
			this.$api.request("API_GET_FC_AUTO_TO_NUM", this.searchParams).then(
				success => {
					const { Data } = success.Data;
					this.lotteryResults = Data;
					this.getLotteryResult(this.activeTab);
				},
				error => {
					this.$root.$emit("handleError", error);
				}
			);
		},
		getLotteryResult(index) {
			this.activeTab = index;
			this.tableData = LotteryPub.handleLotteryTrendMap(
				this.lottery,
				this.lotteryResults,
				index
			);
			if (this.isFastThree) {
				let data = {
					className: "",
					colSpan: 2,
					isActive: false,
					rowSpan: 1,
					text: ""
				};
				this.tableData.forEach(i => {
					if (i.length === 8) {
						i.splice(2, 0, data);
					}
				});
			}
		},
		drawButton(ctx) {
			this.digit.forEach((i, index) => {
				if (this.activeTab === index) {
					this.drawRect1(ctx, 60 * index + 10, 55, 50, 25, "#0a84ff");
				} else {
					this.drawRect1(ctx, 60 * index + 10, 55, 50, 25, "#242d51");
				}
				this.drawText(
					ctx,
					60 * index + 10,
					55,
					50,
					50 / 2,
					18,
					i,
					"#fff",
					"bold 14px Arial"
				);
			});
			this.drawRect1(ctx, this.lineWidth * 0.6, 55, 120, 25, "#101732");
			this.drawText(
				ctx,
				this.lineWidth * 0.6,
				55,
				120,
				120 / 2,
				18,
				`游戏类型 ${this.lottery.fc_name}`,
				"#fff",
				"normal 12px Arial"
			);
		}
	}
};
</script>

<style scoped>
#canvas {
	position: absolute;
	top: 0;
	left: 0;
}
</style>

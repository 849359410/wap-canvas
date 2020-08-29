<template>
	<div id="div" class="liveTrendTable">
		<canvas id="canvas1"></canvas>
	</div>
</template>

<script>
import canvas from "./js/canvas";
export default {
	name: "LiveTrendTable",
	mixins: [canvas],
	props: {
		tableData: {
			type: Array,
			default() {
				return [];
			}
		},
		lineHeight: {
			type: Number,
			default() {
				return 0;
			}
		}
	},
	data() {
		return {
			lineData: []
		};
	},
	watch: {
		tableData() {
			let canvas = document.getElementById("canvas1"),
				ctx = canvas.getContext("2d");
			this.getCanvas(ctx, canvas);
		}
	},
	mounted() {
		let canvas = document.getElementById("canvas1"),
			ctx = canvas.getContext("2d");
		window.addEventListener("resize", () => {
			this.getCanvas(ctx, canvas);
		});
	},
	methods: {
		getCanvas(ctx, canvas) {
			canvas.width = document.getElementById("div").offsetWidth;
			canvas.height = 30 * this.tableData.length;
			this.lineData = [];
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			this.tableData.forEach((item, index) => {
				item.forEach((i, index1) => {
					let x =
							canvas.width * 0.5 +
							((canvas.width * 0.5) / 6) * (index1 - 3) +
							(canvas.width * 0.5) / 6 / 2,
						y = 30 * index + 15;
					let w = (canvas.width * 0.5) / 3;
					ctx.closePath();
					if (index1 === 0 || index1 === 1 || index1 === 2) {
						this.drawRectPos(ctx, w * index1, 30 * index, w, 30, 1, "#181b39");
						this.drawText(
							ctx,
							w * index1,
							30 * index,
							w,
							w / 2,
							20,
							i.text,
							"#ebdd9c",
							"normal 12px Arial"
						);
					} else {
						if (i.isActive) {
							// 绘制圆
							ctx.beginPath();
							ctx.fillStyle = "#4d84fd";
							ctx.arc(x, y, 10, 0, 2 * Math.PI);
							ctx.fill();
							ctx.closePath();
							let data = {
								x: x,
								y: y,
								text: i.text,
								index: index,
								deviationX: index1 - 3
							};
							this.lineData.push(data);
						} else {
							this.drawText(
								ctx,
								canvas.width * 0.5 + ((canvas.width * 0.5) / 6) * (index1 - 3),
								30 * index,
								(canvas.width * 0.5) / 6,
								(canvas.width * 0.5) / 6 / 2,
								20,
								i.text,
								"#ebdd9c",
								"normal 12px Arial"
							);
						}
						this.drawRectPos(
							ctx,
							canvas.width * 0.5 + ((canvas.width * 0.5) / 6) * (index1 - 3),
							30 * index,
							(canvas.width * 0.5) / 6,
							30,
							1,
							"#181b39"
						);
					}
				});
			});
			this.lineData.forEach(i => {
				// 连线
				ctx.beginPath();
				ctx.lineWidth = 2;
				ctx.strokeStyle = "#4d84fd";
				ctx.moveTo(i.x, i.y);
				if (this.lineData[i.index]) {
					ctx.lineTo(this.lineData[i.index].x, this.lineData[i.index].y);
				}
				ctx.stroke();
				this.drawText(
					ctx,
					canvas.width * 0.5 + ((canvas.width * 0.5) / 6) * i.deviationX,
					30 * i.index,
					(canvas.width * 0.5) / 6,
					(canvas.width * 0.5) / 6 / 2,
					20,
					i.text,
					"#ebdd9c",
					"normal 12px Arial"
				);
			});
		},
		drawRectPos(ctx, x, y, width, height, borderWidth, borderColor) {
			ctx.lineWidth = borderWidth;
			ctx.strokeStyle = borderColor;
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(width + x, y);
			ctx.lineTo(width + x, height + y);
			ctx.lineTo(x, height + y);
			ctx.closePath();
			ctx.stroke();
		}
	}
};
</script>

<style scoped lang="scss">
.liveTrendTable {
	position: absolute;
	left: 2%;
	top: 18%;
	width: 96%;
	overflow-y: scroll;
	height: 82%;
	background-color: #242d51;
}
</style>

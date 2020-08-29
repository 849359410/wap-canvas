<template>
	<div class="liveChip">
		<div class="liveChip-left">
			<img
				class="liveChip-left--img"
				src="../../assets/images/liveBroadcast/other/zuo_cm.png"
				alt=""
				@click="getLeft"
			/>
			<div id="liveChip" class="liveChip-left_chip">
				<!--<canvas id="chip"></canvas>-->
				<div v-if="noSelect.length">
					<img
						v-for="(i, index) in noSelect"
						:key="index"
						:src="i.img"
						class="liveChip-left_chip--img"
						alt=""
						@click="getChip(i)"
					/>
				</div>
			</div>
			<img
				class="liveChip-left--img"
				src="../../assets/images/liveBroadcast/other/you_cm.png"
				alt=""
				@click="getRight"
			/>
		</div>
		<div class="liveChip-right">
			<img src="../../assets/images/liveBroadcast/other/ch.png" alt="" @click="getWithdraw" />
			<img src="../../assets/images/liveBroadcast/other/qr.png" alt="" @click="getConfirm" />
		</div>
	</div>
</template>

<script>
export default {
	name: "LiveChip",
	data() {
		return {
			noSelect: [
				{
					money: 10,
					img: require("../../assets/images/liveBroadcast/chip/select/10.png")
				},
				{
					money: 20,
					img: require("../../assets/images/liveBroadcast/chip/noSelect/20.png")
				},
				{
					money: 50,
					img: require("../../assets/images/liveBroadcast/chip/noSelect/50.png")
				},
				{
					money: 100,
					img: require("../../assets/images/liveBroadcast/chip/noSelect/100.png")
				},
				{
					money: 200,
					img: require("../../assets/images/liveBroadcast/chip/noSelect/200.png")
				},
				{
					money: 500,
					img: require("../../assets/images/liveBroadcast/chip/noSelect/500.png")
				},
				{
					money: 1000,
					img: require("../../assets/images/liveBroadcast/chip/noSelect/1000.png")
				},
				{
					money: 5000,
					img: require("../../assets/images/liveBroadcast/chip/noSelect/5000.png")
				},
				{
					money: 10000,
					img: require("../../assets/images/liveBroadcast/chip/noSelect/10000.png")
				}
			]
		};
	},
	mounted() {
		// let chip = document.getElementById("chip"),
		// 	ctx = chip.getContext("2d");
		// this.getCanvas(ctx, chip);
		// chip.onmousedown = event => {
		// 	let index = Math.floor(event.layerX / ((window.innerWidth * 0.47) / 3));
		// 	this.noSelect.forEach((i, val) => {
		// 		if (index === val) {
		// 			i.img = require(`../../assets/img/liveBroadcast/chip/select/${i.money}.png`);
		// 			this.$emit("getMoney", i.money);
		// 		} else {
		// 			i.img = require(`../../assets/img/liveBroadcast/chip/noSelect/${i.money}.png`);
		// 		}
		// 	});
		// 	this.getCanvas(ctx, chip);
		// };
		window.addEventListener("resize", () => {
			// this.getCanvas(ctx, chip);
			document.getElementById("liveChip").style.height = `${window.innerHeight * 0.06}px`;
		});
		document.getElementById("liveChip").style.height = `${window.innerHeight * 0.06}px`;
	},
	methods: {
		getCanvas(ctx, chip) {
			chip.height = window.innerHeight * 0.08;
			chip.width = ((window.innerWidth * 0.47) / 3) * this.noSelect.length;
			ctx.clearRect(0, 0, chip.width, chip.height);
			this.noSelect.forEach((i, index) => {
				let img = new Image();
				img.src = i.img;
				img.onload = () => {
					ctx.drawImage(
						img,
						((window.innerWidth * 0.47) / 3) * index,
						10,
						(window.innerWidth * 0.47) / 3 - 5,
						30
					);
				};
			});
		},
		getChip(item) {
			this.noSelect.forEach(i => {
				if (item.money === i.money) {
					i.img = require(`../../assets/images/liveBroadcast/chip/select/${i.money}.png`);
					this.$emit("getMoney", i.money);
				} else {
					i.img = require(`../../assets/images/liveBroadcast/chip/noSelect/${i.money}.png`);
				}
			});
		},
		getLeft() {
			let liveChip = document.getElementById("liveChip");
			liveChip.scrollLeft -= (window.innerWidth * 0.47) / 3;
		},
		getRight() {
			let liveChip = document.getElementById("liveChip");
			liveChip.scrollLeft += (window.innerWidth * 0.47) / 3;
		},
		getWithdraw() {
			this.$emit("getWithdraw");
		},
		getConfirm() {
			this.$emit("getConfirm");
		}
	}
};
</script>

<style scoped lang="scss">
.liveChip {
	display: flex;
	margin-top: -6px;
	margin-bottom: 2px;
	@at-root #{&}-left {
		display: flex;
		width: 58%;
		height: 100%;
		@at-root #{&}--img {
			width: 14px;
			height: 18px;
			&:first-child {
				margin: auto 2% auto 6px;
			}
			&:last-child {
				margin: auto 0 auto 2%;
			}
		}
		@at-root #{&}_chip {
			overflow-x: scroll;
			overflow-y: hidden;
			div {
				width: 540px;
				height: 100%;
			}
			@at-root #{&}--img {
				width: 50px !important;
				height: 28px !important;
				margin: 5px;
			}
		}
	}
	@at-root #{&}-right {
		width: 42%;
		padding: 0 4%;
		display: flex;
		img {
			height: 32px;
			width: 45%;
			margin: auto;
		}
	}
}
</style>

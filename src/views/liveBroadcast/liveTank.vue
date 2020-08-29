<template>
	<div id="liveTank" class="liveTank">
		<canvas id="tank"></canvas>
	</div>
</template>

<script>
import { PlayingCredit } from "@server/singularity";
import canvas from "./js/canvas";
export default {
	name: "LiveTank",
	mixins: [canvas],
	props: {
		playId: {
			type: Number,
			default() {
				return 0;
			}
		}
	},
	data() {
		return {
			activeTypeVal: [],
			playingTypeList: [],
			activeTank: 0
		};
	},
	watch: {
		playingTypeList() {
			let canvas = document.getElementById("tank"),
				ctx = canvas.getContext("2d");
			this.getDraw(ctx, canvas);
		}
	},
	mounted() {
		let canvas = document.getElementById("tank"),
			ctx = canvas.getContext("2d");
		canvas.height = 35;
		this.loadPlayingOdds();
		canvas.onmousedown = event => {
			this.activeTank = Math.floor(event.layerX / (window.innerWidth / 3));
			this.clickPlay(this.playingTypeList[this.activeTank]);
			this.getDraw(ctx, canvas);
		};
		window.addEventListener("resize", () => {
			this.getDraw(ctx, canvas);
		});
	},
	methods: {
		async loadPlayingOdds() {
			await this.$api
				.request("API_GET_TRA_COMMON_INDEX_K3", {
					fc_id: this.playId,
					handicap: 1
				})
				.then(
					success => {
						const Data = success.Data;
						let list = PlayingCredit.generatePlayingMessage(this.playId, Data.cdata, 1);
						list.forEach(i => {
							if (i.group.length) this.playingTypeList.push(i);
						});
						this.clickPlay(this.playingTypeList[0]);
					},
					error => this.$root.$emit("handleError", error)
				);
		},
		// 获取玩法注单号 渲染的号码数据
		clickPlay(val) {
			this.activeTypeVal = val;
			this.$emit("getTank", val.group);
		},
		getDraw(ctx, canvas) {
			canvas.width = (window.innerWidth / 3) * this.playingTypeList.length;
			this.drawText(
				ctx,
				(window.innerWidth / 3) * this.activeTank,
				0,
				window.innerWidth,
				window.innerWidth / 3 / 2,
				30,
				"____",
				"#fff",
				"normal 22px Arial"
			);
			this.playingTypeList.forEach((i, index) => {
				this.drawText(
					ctx,
					(window.innerWidth / 3) * index,
					0,
					window.innerWidth,
					window.innerWidth / 3 / 2,
					23,
					i.name,
					"#fff",
					this.activeTank === index ? "bold 14px Arial" : "normal 12px Arial"
				);
			});
		}
	}
};
</script>

<style scoped lang="scss">
.liveTank {
	overflow-x: scroll;
	border-bottom: none;
	background-color: #3440b0;
	line-height: 12px;
	overflow-y: hidden;
}
</style>

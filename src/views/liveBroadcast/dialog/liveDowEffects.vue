<template>
	<div class="liveDowEffects">
		<div class="liveDowEffects-top">
			提示
			<span @click="getClose">×</span>
		</div>
		<div class="liveDowEffects-box">
			<span>是否加载特效音符？</span>
			<div class="liveDowEffects-box_button">
				<img
					src="../../../assets/images/liveBroadcast/dialog/qx.png"
					alt=""
					@click="getCancelDow"
				/>
				<img
					src="../../../assets/images/liveBroadcast/dialog/qd.png"
					alt=""
					@click="getConfirmDow"
				/>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "LiveDowEffects",
	methods: {
		getCancelDow() {
			this.$emit("getCancelDow");
		},
		getConfirmDow() {
			this.$emit("getConfirmDow");
		},
		getClose() {
			this.$emit("getClose");
		}
	}
};
</script>

<style scoped lang="scss">
.liveDowEffects {
	position: fixed;
	margin: auto;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	width: 250px;
	height: 150px;
	background-color: rgba(21, 25, 80, 0.9);
	color: #fff;
	border-radius: 5px;
	border: 1px solid rgb(62, 70, 169);
	padding: 0 10px;
	@at-root #{&}-top {
		text-align: center;
		height: 40px;
		line-height: 40px;
		font-size: 14px;
		position: relative;
		border-bottom: 1px solid rgb(62, 70, 169);
		span {
			position: absolute;
			font-size: 25px;
			right: 0;
			top: 0;
		}
	}
	@at-root #{&}-box {
		margin-top: 20px;
		font-size: 14px;
		img {
			width: 20px;
			margin: 0 10px -3px 0px;
		}
		text-align: center;
		@at-root #{&}_button {
			margin-top: 16px;
			img {
				width: 82px;
				height: 31px;
				margin-right: 16px;
			}
		}
	}
}
</style>

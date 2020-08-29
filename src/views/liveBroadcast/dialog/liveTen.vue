<template>
	<div class="liveTen">
		<div class="liveTen-img"></div>
		{{ timeText }}
	</div>
</template>

<script>
export default {
	name: "LiveTen",
	props: {
		timeText: {
			type: [Number, String],
			default() {
				return "";
			}
		}
	}
};
</script>

<style scoped lang="scss">
.liveTen {
	position: fixed;
	margin: auto;
	left: 0;
	right: 0;
	top: -38%;
	bottom: 0;
	z-index: 9;
	width: 46px;
	height: 46px;
	text-align: center;
	line-height: 46px;
	font-size: 20px;
	color: rgb(255, 234, 0);
	@at-root #{&}-img {
		position: absolute;
		left: 0;
		width: 100%;
		height: 100%;
		background: url("../../../assets/images/liveBroadcast/dialog/kuang.png") no-repeat;
		background-size: 100% 100%;
		-webkit-animation: rotating 1s infinite;
		animation: rotating 1s linear infinite;
	}
}
@-webkit-keyframes rotating {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}
@keyframes rotating {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>

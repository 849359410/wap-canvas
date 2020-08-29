<template>
	<div class="liveOut">
		<div class="liveOut-box">
			{{ timeText }}
		</div>
	</div>
</template>

<script>
export default {
	name: "LiveOut",
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
.liveOut {
	position: fixed;
	margin: auto;
	z-index: 9;
	left: 0;
	right: 0;
	top: -30%;
	bottom: 0;
	width: 100px;
	height: 60px;
	opacity: 0.9;
	background: -webkit-gradient(linear, top left, right top, from(#706ae5), to(#872bdc));
	background: linear-gradient(to bottom, #706ae5, #872bdc);
	color: #fff;
	text-align: center;
	border-radius: 5px;
	@at-root #{&}-box {
		line-height: 60px;
	}
}
</style>

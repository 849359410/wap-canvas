<template>
	<div class="liveTotal">
		共：
		<span>{{ total.numbers }}</span>
		注， <span>{{ total.money }}</span
		>元
	</div>
</template>

<script>
export default {
	name: "LiveTotal",
	props: {
		total: {
			type: Object,
			default() {
				return {};
			}
		}
	}
};
</script>

<style scoped lang="scss">
.liveTotal {
	width: 100%;
	height: 28px;
	background: url("../../assets/images/liveBroadcast/other/je_bj.png") no-repeat;
	background-size: 100% 100%;
	text-align: center;
	font-size: 12px;
	color: white;
	line-height: 28px;
	span {
		color: #ebe54a;
	}
}
</style>

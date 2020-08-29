<template>
	<div class="livePayout">
		<div class="livePayout-box">
			<p class="livePayout-box_text">派彩</p>
			<p class="livePayout-box_money">100.03</p>
		</div>
	</div>
</template>

<script>
export default {
	name: "LivePayout"
};
</script>

<style scoped lang="scss">
.livePayout {
	position: fixed;
	margin: auto;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	width: 250px;
	background-color: rgba(21, 25, 80, 0.9);
	color: #fff;
	height: 130px;
	border-radius: 5px;
	border: 1px solid rgb(62, 70, 169);
	@at-root #{&}-box {
		text-align: center;
		@at-root #{&}_text {
			color: #f6ed30;
			margin: 30px 0 20px 0;
		}
		@at-root #{&}_money {
		}
	}
}
</style>

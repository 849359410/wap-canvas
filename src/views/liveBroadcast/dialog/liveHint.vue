<template>
	<div class="liveHint">
		<div class="liveHint-box">
			<img :src="hintObj.img" alt="" />
			<span>{{ hintObj.text }}</span>
		</div>
	</div>
</template>

<script>
export default {
	name: "LiveHint",
	props: {
		hintObj: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			error: require("../../../assets/images/liveBroadcast/popup/th.png"),
			corr: require("../../../assets/images/liveBroadcast/popup/cg.png")
		};
	}
};
</script>

<style scoped lang="scss">
.liveHint {
	position: fixed;
	margin: auto;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	width: 250px;
	background-color: rgba(21, 25, 80, 0.9);
	color: #fff;
	height: 60px;
	border-radius: 5px;
	border: 1px solid rgb(62, 70, 169);
	@at-root #{&}-box {
		line-height: 60px;
		text-align: center;
		img {
			width: 20px;
			margin: 0 10px -3px 0px;
		}
	}
}
</style>

<template>
	<div class="liveMore">
		<div
			v-for="(i, index) in moreList"
			:key="index"
			class="liveMore-center"
			@click="getGoRoute(i.path)"
		>
			<img class="liveMore-center_left" :src="i.imgLeft" alt="" />
			{{ i.text }}
			<img class="liveMore-center_right" :src="i.imgRight" alt="" />
		</div>
	</div>
</template>

<script>
export default {
	name: "LiveMore",
	data() {
		return {
			moreList: [
				{
					imgLeft: require("../../assets/images/liveBroadcast/more/tzjl.png"),
					text: "投注记录",
					imgRight: require("../../assets/images/liveBroadcast/more/right.png"),
					path: "Mrecord"
				},
				{
					imgLeft: require("../../assets/images/liveBroadcast/more/yxgz.png"),
					text: "游戏规则",
					imgRight: require("../../assets/images/liveBroadcast/more/right.png"),
					path: "liveRule"
				}
			]
		};
	},
	methods: {
		getGoRoute(name) {
			this.$router.push({ name: name, params: { type: 2 } });
		}
	}
};
</script>

<style scoped lang="scss">
.liveMore {
	width: 94%;
	background: #151e5c;
	margin: 10px auto 0 auto;
	border-radius: 5px;
	border: 1px solid #4354bb;
	@at-root #{&}-center {
		width: 88%;
		height: 60px;
		margin: 0 auto;
		line-height: 60px;
		color: #9ca7e7;
		font-size: 12px;
		position: relative;
		@at-root #{&}_left {
			width: 20px;
			height: 20px;
			vertical-align: middle;
			margin-right: 10px;
		}
		@at-root #{&}_right {
			width: 9px;
			height: 10px;
			vertical-align: middle;
			position: absolute;
			right: 0;
			top: 50%;
			margin-top: -5px;
		}
		&:first-child {
			border-bottom: 1px solid #4354bb;
		}
	}
}
</style>

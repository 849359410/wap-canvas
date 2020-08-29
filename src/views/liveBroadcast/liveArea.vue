<template>
	<div class="liveArea">
		<div
			v-for="(i, index) in moreList"
			:key="index"
			:class="[{ active: pageIndex === index }]"
			@click="getPage(index)"
		>
			<img :src="i.img" alt="" />
			{{ i.text }}
		</div>
	</div>
</template>

<script>
export default {
	name: "LiveArea",
	props: {
		pageIndex: {
			type: Number,
			default() {
				return 0;
			}
		}
	},
	data() {
		return {
			moreList: [
				{
					text: "投注",
					img: require("../../assets/images/liveBroadcast/other/tz.png")
				},
				{
					text: "更多",
					img: require("../../assets/images/liveBroadcast/other/gd.png")
				}
			],
			activeIndex: 0
		};
	},
	methods: {
		getPage(index) {
			this.$emit("getPageIndex", index);
		}
	}
};
</script>
<style scoped lang="scss">
.liveArea {
	width: 100%;
	background-color: #323b96;
	display: flex;
	div {
		width: 50%;
		font-size: 14px;
		color: white;
		text-align: center;
		line-height: 32px;
		img {
			width: 14px;
			vertical-align: text-top;
		}
	}
	.active {
		background-color: #5365c7;
	}
}
</style>

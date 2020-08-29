<template>
	<van-empty class="custom-image" :image="imgAge || img" :description="noText"></van-empty>
</template>

<script>
export default {
	name: "NoData",
	props: {
		imgAge: {
			type: String,
			default() {
				return "";
			}
		},
		noText: {
			type: String,
			default() {
				return "暂无数据";
			}
		}
	},
	data: () => ({
		img: require("../assets/images/userCenter/recording/nodata.png")
	})
};
</script>
<style lang="scss">
.custom-image {
	padding-top: 80px;
	.van-empty__image {
		width: 170px;
		height: 126px;
	}
}
</style>

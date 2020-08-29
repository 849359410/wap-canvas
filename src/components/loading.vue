<template>
	<van-popup v-model="isLoading">
		<van-loading type="spinner" color="#fff">
			<span>请稍后...</span>
		</van-loading>
	</van-popup>
</template>

<script>
import { mapState } from "vuex";
export default {
	name: "Loading",
	computed: {
		...mapState({
			isLoading: state => state.common.isLoading
		})
	}
};
</script>

<style scoped lang="scss">
.van-popup {
	background-color: transparent;
	.van-loading {
		span {
			color: white;
		}
	}
}
</style>

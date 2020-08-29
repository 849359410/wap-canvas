<template>
	<van-swipe :autoplay="3000" style="height: 110px">
		<van-swipe-item v-for="(image, index) in images" :key="index">
			<img :src="image" />
		</van-swipe-item>
	</van-swipe>
</template>
<script>
export default {
	props: {
		images: {
			type: Array,
			default: () => []
		}
	}
};
</script>

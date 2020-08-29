<template>
	<lottie :options="defaultOptions" @animCreated="handleAnimation" />
</template>

<script>
import lottie from "vue-lottie";
import animationData from "../assets/SignGif/data";
animationData.assets.forEach((item, index) => {
	if (item.hasOwnProperty("u") && item.hasOwnProperty("p")) {
		item.u = "";
		item.p = require(`../assets/SignGif/images/img_${index}.png`);
	}
});
export default {
	name: "SignGif",
	components: { lottie: lottie },
	data() {
		return {
			defaultOptions: { animationData: animationData },
			animationSpeed: 1,
			anim: {}
		};
	},
	methods: {
		handleAnimation: function(anim) {
			this.anim = anim;
			//这里可以看到 lottie 对象的全部属性
		}
	}
};
</script>

<style scoped></style>

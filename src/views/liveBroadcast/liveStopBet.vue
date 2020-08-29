<template>
	<lottie :options="defaultOptions" @animCreated="handleAnimation" />
</template>

<script>
import lottie from "vue-lottie";
import animationData from "./lottie/stop/stopBet";
animationData.assets.forEach((item, index) => {
	if (item.hasOwnProperty("u") && item.hasOwnProperty("p")) {
		item.u = "";
		item.p = require(`./lottie/stop/img/image_${index}.png`);
	}
});
export default {
	name: "LiveStopBet",
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
		}
	}
};
</script>

<style scoped></style>

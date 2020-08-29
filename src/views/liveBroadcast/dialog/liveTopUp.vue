<template>
	<div class="liveDialog" @click="getClose">
		<div class="liveTopUp">
			<div class="liveTopUp-top">
				<span @click="getClose">×</span>
			</div>
			<div class="liveTopUp-box">
				<img :src="error" alt="" />
				<span>余额不足，请充值</span>
				<button @click="getGoToRecharge">立即充值</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "LiveTopUp",
	data() {
		return {
			error: require("../../../assets/images/liveBroadcast/popup/th.png")
		};
	},
	methods: {
		getClose() {
			this.$emit("getClose");
		},
		getGoToRecharge() {
			this.$router.push({ name: "Recharge" });
		}
	}
};
</script>

<style scoped lang="scss">
.liveTopUp {
	position: fixed;
	margin: auto;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	width: 250px;
	height: 120px;
	background-color: rgba(21, 25, 80, 0.9);
	color: #fff;
	border-radius: 5px;
	border: 1px solid rgb(62, 70, 169);
	@at-root #{&}-top {
		height: 30px;
		span {
			position: absolute;
			font-size: 25px;
			right: 0;
			margin: 5px;
		}
	}
	@at-root #{&}-box {
		img {
			width: 20px;
			margin: 0 10px -3px 0px;
		}
		text-align: center;
		button {
			display: block;
			margin: 15px auto auto auto;
			width: 170px;
			height: 30px;
			border-radius: 5px;
			border-color: transparent;
			outline: none;
			color: #fff;
			background-color: #5967c7;
		}
	}
}
.liveDialog {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.5);
}
</style>

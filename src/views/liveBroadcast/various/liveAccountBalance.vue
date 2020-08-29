<template>
	<div class="accountBalance">
		<img src="../../../assets/images/liveBroadcast/other/qb.png" alt="" />
		{{ userMessage.money }}元
	</div>
</template>

<script>
import { mapState } from "vuex";
export default {
	name: "AccountBalance",
	computed: {
		...mapState({
			userMessage: state => state.user.userMessage
		})
	}
};
</script>

<style scoped lang="scss">
.accountBalance {
	position: absolute;
	left: 0;
	bottom: 0;
	height: 26px;
	padding: 0 10px;
	background-color: rgba(0, 0, 0, 0.6);
	border-radius: 0 5px 0 0;
	text-align: center;
	line-height: 30px;
	font-size: 12px;
	color: white;
	img {
		width: 18px;
		height: 18px;
		vertical-align: text-bottom;
	}
}
</style>

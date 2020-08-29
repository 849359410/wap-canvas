<template>
	<div class="content">
		<div class="main">
			<p class="ok">{{ type === 2 ? "转出" : "转入" }}成功</p>
			<p class="tips">正在等待系统处理，请注意查看账户余额!</p>
			<van-button class="clickList" :to="{ name: 'MoneyRecord' }" size="small"
				>查看记录</van-button
			>
		</div>
	</div>
</template>

<script>
export default {
	name: "YuBaoEnding",
	data() {
		return {
			type: 0
		};
	},
	created() {
		this.type = Number(this.$route.params.type);
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/yuBao/yuBaoEnding";
</style>

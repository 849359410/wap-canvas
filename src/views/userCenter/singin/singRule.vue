<template>
	<van-row>
		<van-row class="singRule">
			<p v-html="ruleTitle.rule"></p>
		</van-row>
	</van-row>
</template>

<script>
export default {
	name: "SingRule",
	data() {
		return {
			ruleTitle: ""
		};
	},
	created() {
		this.setSingConfig();
	},
	methods: {
		setSingConfig() {
			// 签到是否开启
			this.$api.request("API_GET_USER_SIGN_CON_FIG").then(
				success => {
					this.ruleTitle = success.Data.sign_config;
				},
				error => this.$root.$emit("handleError", error)
			);
		}
	}
};
</script>

<style scoped lang="scss">
.singRule {
	padding: 10px;
	/*margin-top: 30px;*/
}
</style>
<style lang="scss">
.singRule {
	table {
		border-collapse: collapse;
		border-spacing: 0;
		width: 100%;
	}
}
</style>

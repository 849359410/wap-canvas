<template>
	<van-row class="help_notice">
		<van-row class="help_notice_content">
			<van-row v-html="lists"></van-row>
		</van-row>
	</van-row>
</template>
<script>
export default {
	name: "HelpGuideNotice",
	data() {
		return {
			lists: ""
		};
	},
	created() {
		this.getcookie();
	},
	methods: {
		getcookie() {
			const siteCode = this.$stores.get("load_img").site;
			let data = this.$stores.get(`helpGuide_${siteCode}`);
			if (data !== undefined) this.setLotteryies(data);
			else this.getSiteHelp(siteCode);
		},
		async getSiteHelp(siteCode) {
			await this.$api
				.request("GET_GUIDE", {
					site: siteCode
				})
				.then(success => {
					this.discoloration = success.Data;
					this.$stores.set(`helpGuide_${siteCode}`, this.discoloration);
					this.setLotteryies(this.discoloration);
				});
		},
		setLotteryies(data) {
			data.forEach(i => {
				if (i.id === Number(this.$route.params.id)) {
					this.$route.meta.name = i.name;
					this.lists = i.content;
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.help_notice {
	@at-root #{&}_content {
		margin: 10px;
		background: #ffffff;
		border-radius: 5px;
		box-shadow: 0 2px 4px 0 rgba(102, 102, 102, 0.2);
		div {
			padding: 15px 15px 20px;
			font-size: 14px;
		}
	}
}
</style>

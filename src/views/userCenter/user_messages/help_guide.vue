<template>
	<van-row class="help_guide">
		<van-list v-for="(v, k) in database" v-if="database" :key="k" class="help_guide_list">
			<router-link
				v-for="(item, index) in v"
				v-if="v"
				:key="index"
				:to="{ name: 'HelpGuideNotice', params: { id: item.id } }"
			>
				<van-cell :title="item.name" is-link />
			</router-link>
		</van-list>
	</van-row>
</template>

<script>
export default {
	name: "HelpGuide",
	data() {
		return {
			database: []
		};
	},
	created() {
		this.getcookie();
	},
	methods: {
		getcookie() {
			const siteCode = this.$stores.get("load_img").site;
			let data = this.$stores.get(`helpGuide_${siteCode}`);
			if (data !== undefined) {
				this.database = this.$helps.chunk(data, 4);
			} else this.getSiteHelp(siteCode);
		},
		getSiteHelp(siteCode) {
			this.$api
				.request("GET_GUIDE", {
					site: siteCode
				})
				.then(
					success => {
						this.database = this.$helps.chunk(success.Data, 4);
						this.$stores.set(`helpGuide_${siteCode}`, this.discoloration);
					},
					error => this.$root.$emit("handleError", error)
				);
		}
	}
};
</script>
<style lang="scss">
.help_guide {
	@at-root #{&}_list {
		position: relative;
		width: 94%;
		margin: 3% auto;
		box-shadow: 0 1px 3.2vw 0 rgba(0, 0, 0, 0.08);
	}
}
</style>

<template>
	<van-row class="system_notice">
		<van-list
			v-for="(value, index) of notices"
			v-show="value.ntype === 1"
			v-if="notices"
			:key="index"
		>
			<van-cell
				:title="value.name"
				:value="value.content"
				:label="value.add_time"
				@click="see($event)"
			/>
		</van-list>
		<nodata v-if="nodata" />
	</van-row>
</template>

<script>
import nodata from "../../../components/noData";
export default {
	name: "Montice",
	components: {
		nodata
	},
	data() {
		return {
			nodata: false, // 无数据
			notices: [] // 公告内容
		};
	},
	created() {
		this.getNotices();
	},
	methods: {
		getNotices() {
			this.$api.request("API_GET_WEB_COMMON_TO_WAP").then(
				success => {
					if (!success.Data.Notice) {
						this.nodata = true;
					} else {
						this.notices = success.Data.Notice;
					}
				},
				error => this.$root.$emit("handleError", error)
			);
		},
		see(e) {
			e = e || window.e;
			let h = e.currentTarget.children[1];
			if (h.className.indexOf("active") > -1) {
				h.classList.remove("active");
			} else {
				h.classList.add("active");
			}
		}
	}
};
</script>

<style lang="scss">
@import "../../../assets/css/views/userCenter/user_messges/montice";
</style>

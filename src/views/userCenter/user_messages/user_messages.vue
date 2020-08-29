<template>
	<van-row class="communication">
		<van-notice-bar :scrollable="false">
			温馨提示：系统将自动清空15天前的用户消息记录
		</van-notice-bar>
		<van-list v-for="(value, index) of notices" :key="index" class="communication_column">
			<p :class="value.state === 1 ? 'notColor' : 'okColor'"></p>
			<van-cell
				:title="value.title"
				:value="value.content"
				size="large"
				:label="value.add_time"
				@click="seeDetail($event, value)"
			/>
		</van-list>
		<nodata v-if="nodata" />
	</van-row>
</template>

<script>
import nodata from "../../../components/noData";
export default {
	name: "UserMessages",
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
			this.$api.request("API_GET_USER_MESSAGE").then(
				success => {
					if (!success.Data.Data) {
						this.nodata = true;
					} else {
						this.notices = success.Data.Data;
					}
				},
				error => this.$root.$emit("handleError", error)
			);
		},
		seeDetail(e, data) {
			this.see(e);
			if (data.state === 1) {
				this.$api.request("API_UPDATE_USER_MESSAGE", { id: data.id }).then(
					() => {
						this.notices.forEach(v => {
							if (v.id === data.id) {
								v.state = 2;
							}
						});
					},
					error => this.$root.$emit("handleError", error)
				);
			}
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
@import "../../../assets/css/views/userCenter/user_messges/user_messages";
</style>

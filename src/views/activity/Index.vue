<template>
	<div class="activity">
		<tabs
			:list="activeType"
			:tab-height="2"
			:display-id="true"
			:rendered="true"
			@getReturnTabs="getReturnTabs"
		></tabs>
		<van-row class="custom--list">
			<van-col v-for="(v, index) in arr" :key="index" class="custom--list_item" span="24">
				<van-image :src="v.img_wap" alt="" @click="showBox($event, index, v)" />
				<div v-show="currentIndex === index" class="contentActiv">
					<div v-html="activeContent"></div>
					<div v-show="v.etime && v.stime" style="font-size: 13px">
						活动时间：{{ v.stime }} ~ {{ v.etime }}
					</div>
					<div v-show="v.etime && !v.stime" style="font-size: 13px">
						活动时间：结束&nbsp;{{ v.etime }}
					</div>
					<div v-show="!v.etime && v.stime" style="font-size: 13px">
						活动时间：开始&nbsp;{{ v.stime }}
					</div>
				</div>
			</van-col>
		</van-row>
	</div>
</template>

<script>
import tabs from "../../components/Tabs";
export default {
	name: "Index",
	components: { tabs },
	data() {
		return {
			activeType: {},
			arr: [],
			contentArray: [],
			currentIndex: "",
			activeContent: ""
		};
	},
	created() {
		this.loadDiscountActivitiesList();
	},
	methods: {
		HTMLDecode(str) {
			if (str) {
				const arrEntities = {
					lt: "<",
					gt: ">",
					nbsp: " ",
					amp: "&",
					quot: '"'
				};
				return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, (all, t) => arrEntities[t]);
			}
			return str;
		},
		loadDiscountActivitiesList() {
			this.$helps.showLoading();
			this.$api.request("API_GET_SITE_ACTIVITY").then(res => {
				if (res.Data && res.Data.CDdata !== null && res.Data.Pdata !== null) {
					res.Data.Pdata.unshift({ id: "", title: "所有活动" });
					this.activeType = res.Data.Pdata;
					Object.keys(res.Data.CData).forEach(v => {
						if (Number(res.Data.CData[v].top_id) !== 0) {
							this.contentArray.push(res.Data.CData[v]);
						}
					});
				}
				this.$helps.hideLoading();
			});
		},
		getReturnTabs(ids) {
			this.arr = [];
			if (ids === "") {
				Object.keys(this.contentArray).forEach(v => {
					this.arr.push(this.contentArray[v]);
				});
			} else {
				Object.keys(this.contentArray).forEach(v => {
					if (this.contentArray[v].top_id === ids) {
						this.arr.push(this.contentArray[v]);
					}
				});
			}
			this.currentIndex = "";
			this.activeContent = "";
		},
		showBox(e, index, item) {
			if (e && e.stopPropagation) {
				e.stopPropagation();
			} else {
				window.event.cancelBubble = true;
			}
			this.currentIndex = this.currentIndex === index ? "" : index;
			this.activeContent = "";
			this.activeContent = this.HTMLDecode(item.content);
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/activity/Index";
</style>

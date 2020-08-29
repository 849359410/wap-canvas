<template>
	<van-row class="subAgentReports">
		<van-row>
			<van-row class="center">
				<DateChoose
					:list="perentDateList"
					:tab-height="2"
					:rendered="true"
					display-id="true"
					@getReturnTabs="getReturnTabs"
				></DateChoose>
			</van-row>
			<no-data v-if="nodata"></no-data>
			<van-row class="subAgentReports--content">
				<ul>
					<li v-for="record in data" :key="record.id">
						<p>
							<span class="gray">单号：{{ record.order_num }}</span>
						</p>
						<p>
							<span class="gray">用户：{{ record.username }}</span>
						</p>
						<p>
							<span
								>时间：<i class="red">{{ record.add_time }}</i></span
							>
						</p>

						<p>
							<span
								>金额：<i class="red">{{ record.money }}元</i></span
							>
						</p>
						<p>
							<span
								>余额：<i class="blue">{{ record.money }}元</i></span
							>
						</p>
						<p>
							<span
								>备注：<i class="blue">{{ record.remark }}</i></span
							>
						</p>
					</li>
				</ul>
			</van-row>
		</van-row>
	</van-row>
</template>

<script>
import DateChoose from "../../../components/Tabs";
import noData from "../../../components/noData";
export default {
	name: "SubAgentReports",
	components: {
		DateChoose,
		noData
	},
	data() {
		return {
			perentDateList: [
				{ id: 1, name: "今天" },
				{ id: 2, name: "昨天" },
				{ id: 5, name: "最近7天" }
			], // 向子组件传入想要显示的值
			data: [],
			streamTimes: {
				page: 1,
				pageSize: 10,
				pageIndex: 1,
				stime: "",
				etime: ""
			},
			nodata: false //无数据
		};
	},
	methods: {
		getReturnTabs(name) {
			this.streamTimes.stime = this.$helps.lately(name).stime;
			this.streamTimes.etime = this.$helps.lately(name).etime;
			this.loadCashStream();
		},
		loadCashStream() {
			this.$helps.showLoading();
			this.$api.request("API_GET_COMMISSION", this.streamTimes).then(
				success => {
					this.$helps.hideLoading();
					if (success.Data.Data !== "") {
						this.nodata = false;
					} else {
						this.nodata = true;
					}
					this.data = success.Data.Data;
				},
				error => {
					this.$root.$emit("handleError", error);
				}
			);
		}
	}
};
</script>
<style lang="scss" scoped>
@import "../../../assets/css/views/proxy/subAgentReports";
</style>

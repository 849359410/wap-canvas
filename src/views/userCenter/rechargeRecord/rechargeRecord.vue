<template>
	<van-row>
		<date-choose
			:list="perentDateList"
			:tab-height="2"
			:rendered="true"
			display-id="true"
			@getReturnTabs="getReturnTabs"
		></date-choose>
		<no-data v-if="nodata"></no-data>
		<van-list
			v-model="loading"
			:finished="finished"
			class="main-content main-bottom"
			@load="onLoad"
		>
			<van-collapse v-model="activeName" accordion>
				<van-collapse-item
					v-for="(v, index) in data"
					:key="index"
					class="list--ins"
					:name="index"
				>
					<template #title>
						<van-row class="caipiao-info">
							<van-col span="24" class="info_text">
								<span
									>方式:
									{{ v.bank_in_type | queryDictionary("INCOME_TYPES") }}</span
								>
								<span class="result" :class="v.state | filterStateColor">
									{{ v.state | queryDictionary("RECHARGE_TYPE") }}
								</span>
							</van-col>
							<van-col span="24" class="info_text">
								<span class="term-time"> 时间：{{ v.add_time }} </span>
								<span class="result-money">
									<b>&yen; {{ v.money }}</b>
								</span>
							</van-col>
						</van-row>
					</template>
					<van-row class="other-info">
						<van-col class="term-name">
							<span class="term">
								<b>单号：</b>
								{{ v.order_num }}
							</span>
						</van-col>
						<van-col class="term-lists">
							<span class="youhui">
								<b>优惠：</b>
								&yen; {{ v.dis_dep }} / {{ v.dis_oth }}
							</span>
							<span class="term">
								<b>金额：</b>
								&yen; {{ v.money }}
							</span>
						</van-col>
						<van-col class="odds">
							<span><b>备注：</b>{{ v.remark }}</span>
						</van-col>
						<van-col v-show="v.state === 2" class="odds doTips">
							<span><b>操作备注：</b>{{ v.do_remark }}</span>
						</van-col>
					</van-row>
				</van-collapse-item>
			</van-collapse>
		</van-list>
	</van-row>
</template>

<script>
import DateChoose from "../../../components/Tabs";
import noData from "../../../components/noData";
import R from "../../../config/record";
export default {
	name: "RechargeRecord",
	components: { DateChoose, noData },
	filters: {
		filterStateColor(c) {
			let cl = "";
			switch (c) {
				case 0:
					cl = "blue";
					break;
				case 1:
					cl = "green";
					break;
				default:
					break;
			}
			return cl;
		}
	},
	data: () => ({
		perentDateList: [
			{ id: 1, name: "今天" },
			{ id: 2, name: "昨天" },
			{ id: 5, name: "最近7天" }
		], // 向子组件传入想要显示的值
		activeName: "0",
		paData: {
			stime: "",
			etime: "",
			page: 1
		},
		data: [], //订单信息
		nodata: false,
		loading: true,
		finished: false,
		tipMsg: false
	}),
	methods: {
		getReturnTabs(name) {
			this.data = [];
			this.activeName = "";
			this.paData.page = 1;
			this.$helps.showLoading();
			this.paData.stime = this.$helps.lately(name).stime;
			this.paData.etime = this.$helps.lately(name).etime;
			this.loading = true;
			this.finished = false;
			this.getEnterData();
		},
		onLoad() {
			setTimeout(() => {
				this.paData.page++;
				this.getEnterData();
			}, 300);
		},
		getEnterData() {
			this.$api.request("API_GET_BANK_IN_DATA", this.paData).then(
				success => {
					let Data = success.Data;
					this.loading = false;
					R.do_data(Data.Data, Data.Page, this, Data.Total);
					if (!this.tipMsg) {
						this.loading = true;
						this.finished = true;
					}
					this.$helps.hideLoading();
				},
				() => this.$helps.hideLoading()
			);
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/userCenter/recordMain/recordMain";
</style>

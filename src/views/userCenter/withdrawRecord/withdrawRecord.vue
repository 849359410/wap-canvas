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
		<van-list v-model="loading" :finished="finished" class="main-content" @load="onLoad">
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
								<span>时间: {{ v.add_time }}</span>
								<span class="result" :class="v.state | filterStateColor">
									{{ v.state | queryDictionary("RECHARGE_BANK") }}
								</span>
							</van-col>
							<van-col span="24" class="info_text">
								<span> 会员余额：{{ v.balance }} </span>
								<span class="result-money">
									<b>&yen; {{ v.out_money }}</b>
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
						<van-col class="term-name">
							<span class="youhui">
								<b>会员优惠：</b>
								&yen; {{ v.dis_money }}
							</span>
						</van-col>
						<van-col class="term-lists">
							<span>
								<b>行政费用：</b>
								&yen; {{ v.xz_money }}
							</span>
							<span>
								<b>手续费用：</b>
								&yen; {{ v.fee_money }}
							</span>
						</van-col>
						<van-col class="odds">
							<span>
								<b>备注：</b>
								{{ v.remark }}
							</span>
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
	name: "WithdrawRecord",
	components: {
		DateChoose,
		noData
	},
	filters: {
		filterStateColor(c) {
			let cl = "";
			switch (c) {
				case 1:
					cl = "greenOk";
					break;
				case 2:
					cl = "redNo";
					break;
				default:
					break;
			}
			return cl;
		}
	},
	data() {
		return {
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
			tipMsg: false,
			loading: true,
			finished: false
		};
	},
	methods: {
		getReturnTabs(name) {
			this.data = [];
			this.$helps.showLoading();
			this.activeName = "";
			this.paData.page = 1;
			this.paData.stime = this.$helps.lately(name).stime;
			this.paData.etime = this.$helps.lately(name).etime;
			this.loading = true;
			this.finished = false;
			this.getOutData();
		},
		getOutData() {
			this.$api.request("API_GET_BANK_OUT_DATA", this.paData).then(
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
		},
		onLoad() {
			setTimeout(() => {
				this.paData.page++;
				this.getOutData();
			}, 500);
		},
		seeMore(index) {
			if (this.showRecord === index) {
				this.showRecord = -1;
			} else {
				this.showRecord = index;
			}
		},
		loadMore() {}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/userCenter/recordMain/recordMain";
</style>

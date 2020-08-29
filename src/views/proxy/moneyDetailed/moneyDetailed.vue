<template>
	<van-row class="moneyDetailed">
		<DateChoose
			:list="perentDateList"
			:tab-height="2"
			:rendered="true"
			display-id="true"
			@getReturnTabs="getReturnTabs"
		></DateChoose>
		<van-cell class="search-content" span="24">
			<van-field
				v-model="paData.username"
				center
				clearable
				left-icon="search"
				class="search-wrapper"
				placeholder="下级投注查询"
			>
				<template #button>
					<van-button size="small" type="info" @click="loadDef()">查询</van-button>
				</template>
			</van-field>
		</van-cell>
		<no-data v-if="nodata"></no-data>
		<van-list
			v-model="loading"
			:finished="finished"
			class="main-content main-list"
			@load="onLoad"
		>
			<van-collapse v-model="activeName" accordion>
				<van-collapse-item
					v-for="(record, index) in data"
					:key="index"
					class="list--ins"
					:name="index"
				>
					<template #title>
						<van-row class="caipiao-info">
							<van-col span="24" class="info_text">
								<span class="cash-type">
									{{ record.cash_type | queryDictionary("TRANSACTION_TYPES") }}
									-
									{{ record.username }}
								</span>
								<span class="result" :class="record.do_type | filterStateColor">
									{{ record.do_type | filterCQ(record.do_type) }}
								</span>
							</van-col>
							<van-col span="24" class="info_text">
								<span class="term-time"> 时间：{{ record.add_time }} </span>
								<span class="result-money">
									&yen; {{ record.money }}
									<em v-if="record.dis_money">
										/
										<em style="color: #ff5e00">&yen; {{ record.dis_money }}</em>
									</em>
								</span>
							</van-col>
						</van-row>
					</template>
					<van-row class="other-info">
						<van-col class="term-name">
							<span class="term">
								<b>单号：</b>
								{{
									record.order_num === "" || record.order_num === null
										? "--"
										: record.order_num
								}}
							</span>
						</van-col>
						<van-col class="term-lists">
							<span v-if="record.dis_money" class="youhui">
								<b>优惠：</b>
								{{
									record.dis_money === "" || record.dis_money === null
										? "--"
										: "&yen;" + record.dis_money
								}}
							</span>
							<span class="term">
								<b>余额：</b>
								{{
									record.balance === "" || record.balance === null
										? "--"
										: "&yen;" + record.balance
								}}
							</span>
						</van-col>
						<van-col class="odds">
							<span
								><b>备注：</b
								>{{
									record.remark === "" || record.remark === null
										? "--"
										: record.remark
								}}</span
							>
						</van-col>
					</van-row>
				</van-collapse-item>
			</van-collapse>
		</van-list>
		<total-subtotal :money-curr="moneyCurr" :tatal="tatal"></total-subtotal>
	</van-row>
</template>
<script>
import DateChoose from "../../../components/Tabs";
import noData from "../../../components/noData";
import R from "../../../config/record";
import totalSubtotal from "../../../components/totalSubtotal";
export default {
	name: "MoneyDetailed",
	components: {
		DateChoose,
		noData,
		totalSubtotal
	},
	filters: {
		filterCQ(t) {
			let type = "";
			switch (t) {
				case 1:
					type = "存入";
					break;
				case 2:
					type = "取出";
					break;
				default:
					break;
			}
			return type;
		},
		filterStateColor(c) {
			let cl = "";
			switch (c) {
				case 2:
					cl = "red";
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
	data() {
		return {
			perentDateList: [
				{ id: 1, name: "今天" },
				{ id: 2, name: "昨天" },
				{ id: 5, name: "最近7天" }
			], // 向子组件传入想要显示的值
			paData: {
				stime: "",
				etime: "",
				page: 1,
				username: ""
			}, // 提交的数据
			tatal: "", // 总计和总盈亏
			moneyCurr: {
				num: 0,
				money: 0,
				dis_money: 0
			}, //当前
			nodata: false, // 无数据
			data: [], //订单信息
			tipMsg: false,
			activeName: "0",
			loading: true,
			finished: false
		};
	},
	methods: {
		// 获取子组件选择的值
		getReturnTabs(name) {
			this.activeName = "";
			this.toDF();
			this.paData.stime = this.$helps.lately(name).stime;
			this.paData.etime = this.$helps.lately(name).etime;
			this.loadDefaulData();
			this.loading = true;
			this.finished = false;
		},
		loadDefaulData() {
			this.$helps.showLoading();
			this.$api.request("API_GET_SUB_CASH_RECORD", this.paData).then(
				success => {
					this.tatal = success.Data.Total;
					this.$helps.hideLoading();
					this.loading = false;
					if (success.Data.Data) {
						R.do_data(
							success.Data.Data,
							success.Data.Page,
							this,
							success.Data.Total.num
						);
					} else {
						this.data = [];
						this.tatal = { num: 0, valid_bet: 0, result: 0 };
						this.nodata = true;
						this.tipMsg = false;
					}
					if (!this.tipMsg) {
						this.loading = true;
						this.finished = true;
					}
					if (success.Msg === "下级账号不存在")
						this.$root.$emit("handleError", success.Msg);
				},
				error => {
					this.$helps.hideLoading();
					this.$root.$emit("handleError", error);
				}
			);
		},
		onLoad() {
			setTimeout(() => {
				this.paData.page++;
				this.loadDefaulData();
			}, 200);
		},
		loadDef() {
			this.toDF();
			this.loadDefaulData();
		},
		// 初始化统计
		toDF() {
			this.paData.page = 1;
			this.moneyCurr.money = 0;
			this.moneyCurr.num = 0;
			this.moneyCurr.dis_money = 0;
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/userCenter/recordMain/recordMain";
</style>
<style lang="scss">
.main-list {
	margin-top: 60px !important;
}
</style>

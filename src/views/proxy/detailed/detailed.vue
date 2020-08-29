<template>
	<van-row class="moneyDetailed">
		<head-switch :def-lottery="defLotterySort" @changePlayTypes="changePlayTypes"></head-switch>
		<DateChoose
			:list="perentDateList"
			:tab-height="2"
			:rendered="true"
			display-id="true"
			@getReturnTabs="getReturnTabs"
		></DateChoose>
		<van-cell class="search-content" span="24">
			<van-field
				v-model="paData.name"
				center
				clearable
				left-icon="search"
				class="search-wrapper"
				placeholder="下级投注查询"
			>
				<template #button>
					<van-button size="small" type="info" @click="inquire()">查询</van-button>
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
			<van-cell-group>
				<van-cell
					v-for="(v, index) in data"
					:key="index"
					class="list--ins"
					@click="seeMore(v.order_num, subIndex, v.play_details)"
				>
					<template #title>
						<van-row class="caipiao-info">
							<van-col span="24" class="info_text">
								<span class="term">
									{{ v.fc_name }}&nbsp;&nbsp;{{ v.username }}
								</span>
								<span class="result" :class="v.classN">
									{{ v.state | queryDictionary("BILLING_STATUS") }}
								</span>
							</van-col>
							<van-col span="24" class="info_text">
								<span class="term-time">{{ v.add_time }} </span>
								<span class="result-money">
									<b class="f3">
										<em v-if="v.state" class="f3">&yen; </em>
										{{ v.result | filterResult(v.state) }}
									</b>
								</span>
							</van-col>
						</van-row>
					</template>
				</van-cell>
			</van-cell-group>
		</van-list>
		<total-subtotal :money-curr="totalOthers" :tatal="tatal"></total-subtotal>
	</van-row>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import DateChoose from "../../../components/Tabs";
import noData from "../../../components/noData";
import R from "../../../config/record";
import totalSubtotal from "../../../components/totalSubtotal";
import headSwitch from "../../../components/headSwitch";
export default {
	name: "Detailed",
	components: {
		DateChoose,
		noData,
		totalSubtotal,
		headSwitch
	},
	filters: {
		filterResult: function(result, state) {
			if (!state) return "";
			return result;
		}
	},
	data() {
		return {
			perentDateList: [
				{ id: 1, name: "今天" },
				{ id: 2, name: "昨天" },
				{ id: 5, name: "最近7天" }
			], // 向子组件传入想要显示的值
			defLotterySort: [
				{ sort: 2, name: "官方彩" },
				{ sort: 1, name: "信用彩" }
			],
			paData: {
				stime: "",
				etime: "",
				page: 1,
				fc_type: "fc",
				name: "",
				state: ""
			}, // 提交的数据
			tatal: "", // 总计和总盈亏
			totalOthers: {
				num: 0,
				totalVbet: 0,
				totalResult: 0
			}, // 当前小计和当前盈亏
			nodata: false, // 无数据
			data: [], //订单信息
			tipMsg: false,
			subIndex: "", // 切换类型
			loading: true,
			finished: false
		};
	},
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery,
			currFcModule: state => state.common.webCommonWap.FcModule
		}),
		...mapGetters(["creditLotteries", "officialLotteries"]),
		lotteryList() {
			return this.subIndex === 1 ? this.creditLotteries : this.officialLotteries;
		}
	},
	created() {
		if (this.currFcModule[0] === "fc") {
			this.subIndex = 1;
			this.defLotterySort.reverse();
		} else {
			this.subIndex = 2;
			this.paData.fc_type = "fc_tra";
		}
	},
	methods: {
		inquire() {
			this.toDF();
			this.getDefaultData();
		},
		// 获取子组件选择的值
		getReturnTabs(name) {
			this.toDF();
			this.data = [];
			this.$helps.showLoading();
			this.paData.stime = this.$helps.lately(name).stime;
			this.paData.etime = this.$helps.lately(name).etime;
			this.loading = true;
			this.finished = false;
			this.getDefaultData();
		},
		onLoad() {
			setTimeout(() => {
				this.paData.page++;
				this.getDefaultData();
			}, 300);
		},
		changePlayTypes(name) {
			this.loading = true;
			this.finished = false;
			this.subIndex = name;
			if (this.subIndex === 1) {
				this.paData.fc_type = "fc";
			} else if (this.subIndex === 2) {
				this.paData.fc_type = "fc_tra";
			}
			this.toDF();
			this.getDefaultData();
		},
		//获取投注数据
		getDefaultData() {
			this.$api.request("API_GET_BETTING_SUBORDINATE", this.paData).then(success => {
				setTimeout(() => {
					this.$helps.hideLoading();
				}, 500);
				this.loading = false;
				this.tatal = success.Data.Total;
				if (success.Data.Data) {
					R.do_data(success.Data.Data, success.Data.Page, this, success.Data.Total.num);
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
				if (success.Msg === "会员账号不存在") this.$root.$emit("handleError", success.Msg);
				if (success.Msg === "该账号不是下级会员") this.$root.$emit("handleError", success);
			});
		},
		// 跳转开奖结果页面
		seeMore(num, index, n) {
			this.$router.push({
				name: "NoteDetails",
				query: { NoteNum: num, fcType: this.paData.fc_type, contentShow: false, pDetail: n }
			});
		},
		loadMore() {
			this.paData.page++;
			this.getDefaultData();
		},
		// 初始化统计
		toDF() {
			this.paData.page = 1;
			this.totalOthers.money = 0;
			this.totalOthers.num = 0;
			this.totalOthers.dis_money = 0;
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
.van-nav-bar__left {
	i {
		color: #fff !important;
	}
}
</style>

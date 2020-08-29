<template>
	<van-row class="moneyDetailed">
		<head-switch
			v-if="defLotterySort.length"
			:def-lottery="defLotterySort"
			:lottery-index="lotteryIndex"
			@changePlayTypes="changePlayTypes"
		></head-switch>
		<DateChoose
			:list="perentDateList"
			:tab-height="2"
			:rendered="true"
			display-id="true"
			@getReturnTabs="getReturnTabs"
		></DateChoose>
		<no-data v-if="nodata"></no-data>
		<van-list v-model="loading" :finished="finished" class="main-content" @load="onLoad">
			<van-cell-group>
				<van-cell
					v-for="(v, index) in data"
					:key="index"
					class="list--ins"
					@click="seeMore(v.order_num, lotteryIndex, v.play_details)"
				>
					<template #title>
						<van-row class="caipiao-info">
							<van-col span="24" class="info_text">
								<span v-if="lotteryIndex <= 1" class="term">
									{{ v.fc_name }}&nbsp;&nbsp;{{ v.period }}期
								</span>
								<span v-else class="term">
									{{ v.game_name }} &nbsp;{{ v.order_num }}
								</span>
								<span class="result" :class="v.classN">
									{{ v.state | queryDictionary("BILLING_STATUS") }}
								</span>
							</van-col>
							<van-col span="24" class="info_text">
								<span v-if="lotteryIndex <= 1" class="term-time">
									时间：{{ v.add_time }}
								</span>
								<div v-else class="time-ag">
									<span>开始时间：{{ v.bet_time }}</span>
									<span>结束时间：{{ v.settle_time }}</span>
								</div>
								<span
									class="result-money"
									:class="lotteryIndex > 1 ? 'money-ag' : ''"
								>
									<b class="f3">
										<em v-if="v.state" style="font-style: normal" class="f3"
											>&yen;
										</em>
										{{ v.result | filterResult(v.state) }}
									</b>
								</span>
								<span
									v-if="filterShow(v.fc_id) && v.state === 0"
									class="result-money result-money-img"
								>
									<img
										src="../../../assets/images/userCenter/mrecord/chedan.png"
									/>
								</span>
							</van-col>
						</van-row>
					</template>
				</van-cell>
			</van-cell-group>
		</van-list>
		<total-subtotal :money-curr="totalOthers" :tatal="tatal"></total-subtotal>
		<time-set
			:time-show="timeShow"
			:lottery-index="lotteryIndex"
			:show-all="true"
			:pa-data="paData"
			:color-pink="lotteryIndex <= 1"
			@clickLeft="clickLeft"
			@filterTime="filterTime"
		></time-set>
	</van-row>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import DateChoose from "../../../components/Tabs";
import noData from "../../../components/noData";
import R from "../../../config/record";
import timeSet from "../../../components/timeSet";
import totalSubtotal from "../../../components/totalSubtotal";
import headSwitch from "../../../components/headSwitch";
export default {
	name: "Mrecord",
	components: {
		DateChoose,
		noData,
		timeSet,
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
				{ id: 5, name: "最近7天" },
				{ id: 7, name: "自定义" }
			], // 向子组件传入想要显示的值
			defLotterySort: [],
			paData: {
				stime: "",
				etime: "",
				page: 1,
				fc_type: "fc",
				fc_id: "",
				state: "",
				game_type: ""
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
			menuType: "",
			timeShow: false,
			lotteryIndex: 0, // 切换类型
			isShowCancelOrder: null,
			loading: true,
			finished: false,
			urlInter: ""
		};
	},
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery,
			currFcModule: state => state.common.webCommonWap.FcModule
		}),
		...mapGetters(["creditLotteries", "officialLotteries"]),
		lotteryList() {
			return this.menuType === "fc" ? this.creditLotteries : this.officialLotteries;
		}
	},
	created() {
		if (this.currFcModule[0] === "fc") {
			this.menuType = "fc";
		} else {
			this.menuType = "fc_tra";
		}
		this.getWebConfig();
		this.getIsCancel();
	},
	methods: {
		// 获取子组件选择的值
		getReturnTabs(name) {
			this.paData.page = 1;
			this.paData.fc_id = "";
			this.timeShow = false;
			if (name === 7) {
				this.timeShow = true;
			} else {
				this.data = [];
				this.$helps.showLoading();
				this.paData.stime = this.$helps.lately(name).stime;
				this.paData.etime = this.$helps.lately(name).etime;
				this.getDefaultData();
				this.toDF();
				this.loading = true;
				this.finished = false;
			}
		},
		onLoad() {
			setTimeout(() => {
				this.paData.page++;
				this.getDefaultData();
			}, 200);
		},
		changePlayTypes(name, value) {
			this.loading = true;
			this.finished = false;
			this.data = [];
			this.lotteryIndex = name;
			this.toDF();
			this.menuType = value.key;
			if (this.lotteryIndex <= 1) {
				this.paData.fc_type = this.menuType === "fc" ? "fc" : "fc_tra";
				this.getIsCancel();
			} else {
				this.paData.game_type = this.menuType;
			}
			this.getDefaultData();
		},
		filterTime(time) {
			this.timeShow = false;
			this.paData.stime = time.stime;
			this.paData.etime = time.etime;
			const curName = this.lotteryList;
			this.toDF();
			let idIndex = "";
			if (time.name === "全部") {
				idIndex = "";
			} else {
				curName.forEach(i => {
					if (time.name === i.fc_name) {
						idIndex = i.fc_id;
					}
				});
			}
			this.paData.fc_id = idIndex;
			this.loading = true;
			this.finished = false;
			this.getDefaultData();
		},
		clickLeft() {
			this.timeShow = false;
		},
		// 撤单是否开启
		getIsCancel() {
			let url = this.menuType === "fc" ? "API_GET_FC_BY_CANCEL" : "API_GET_FC_TAR_BY_CANCEL";
			this.$api.request(url).then(success => {
				this.isShowCancelOrder = success.Data;
			});
		},
		//头部切换类型
		getWebConfig() {
			let arr = [],
				obj = {};
			this.$api.request("API_GET_WEB_DATA_TO_WAP_BY_REDIS").then(
				success => {
					let { Data } = success;
					Data.forEach(i => {
						if (i["key"] !== this.currFcModule[0]) {
							arr.push(i);
						} else obj = i;
					});
					arr.unshift(obj);
					this.defLotterySort = arr;
					if (this.$route.params.type) {
						this.defLotterySort.forEach((i, index) => {
							if (i.key === this.$route.params.type) {
								this.lotteryIndex = index;
								this.menuType = this.$route.params.type;
								this.getDefaultData();
							}
						});
					}
				},
				error => {
					this.$root.$emit("handleError", error);
				}
			);
		},
		// 是否显示测单
		filterShow(id) {
			if (
				this.isShowCancelOrder !== null &&
				Object.prototype.hasOwnProperty.call(this.isShowCancelOrder, id)
			) {
				if (this.isShowCancelOrder[id] === "1") {
					return true;
				}
			}
			return false;
		},
		//获取投注数据
		getDefaultData() {
			if (this.lotteryIndex <= 1) {
				this.paData.fc_type = this.menuType === "fc" ? "fc" : "fc_tra";
				this.urlInter =
					this.menuType === "fc" ? "API_GET_FC_BET_RECORD" : "API_GET_FC_BET_RECORD_TRA";
			} else {
				this.urlInter = "GET_VD_BET_RECORD_LIST";
			}
			this.$api.request(this.urlInter, this.paData).then(success => {
				this.$helps.hideLoading();
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
			});
		},
		// 跳转开奖结果页面
		seeMore(num, index, n) {
			if (index <= 1) {
				this.$router.push({
					name: "NoteDetails",
					query: { NoteNum: num, fcType: this.menuType, contentShow: true, pDetail: n }
				});
			}
		},
		// 初始化统计
		toDF() {
			this.paData.page = 1;
			this.totalOthers.money = 0;
			this.totalOthers.num = 0;
			this.totalOthers.dis_money = 0;
		},
		cancelOrder() {
			let url =
				this.menuType === "fc"
					? "API_GET_CANCEL_FC_BY_NONE"
					: "API_GET_CANCEL_FC_TRA_BY_NONE";
			this.$api.request(url, this.cancelParameter).then(
				success => {
					this.$root.$emit("handleSuccess", success.Msg);
					this.getDefaultData();
				},
				error => {
					this.$root.$emit("handleError", error);
					this.getDefaultData();
				}
			);
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/userCenter/recordMain/recordMain";
</style>
<style lang="scss">
.van-nav-bar__left {
	i {
		color: #fff !important;
	}
}
</style>

<template>
	<van-row class="moneyDetailed">
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
				<van-cell v-for="(v, index) in data" :key="index" class="list--ins">
					<template #title>
						<van-row class="caipiao-info">
							<van-col span="24" class="info_text">
								<span v-if="v.do_type === 1" class="term capital">
									系统转入{{ v.game_type }}
								</span>
								<span v-else class="term capital"> {{ v.game_type }}转入系统 </span>
								<span class="result" :class="v.do_type | filterStateColor">
									{{ v.do_type | filterCQ(v.do_type) }}
								</span>
							</van-col>
							<van-col span="24" class="info_text">
								<div class="time-ag">
									<span>时间：{{ v.add_time }}</span>
									<span>订单号：{{ v.order_num }}</span>
								</div>
								<span class="result-money money-ag">
									<b class="f3">
										<em style="font-style: normal" class="f3">&yen; </em>
										{{ v.money }}
									</b>
								</span>
							</van-col>
						</van-row>
					</template>
				</van-cell>
			</van-cell-group>
		</van-list>
		<time-set
			:time-show="timeShow"
			:show-all="true"
			:pa-data="paData"
			@clickLeft="clickLeft"
			@filterTime="filterTime"
		></time-set>
	</van-row>
</template>
<script>
import DateChoose from "../../../components/Tabs";
import noData from "../../../components/noData";
import timeSet from "../../../components/timeSet";
import R from "../../../config/record";
export default {
	name: "ConversionRecord",
	components: {
		DateChoose,
		noData,
		timeSet
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
				{ id: 5, name: "最近7天" },
				{ id: 7, name: "自定义" }
			], // 向子组件传入想要显示的值
			paData: {
				stime: "",
				etime: "",
				page: 1
			}, // 提交的数据
			nodata: false, // 无数据
			data: [], //订单信息
			tipMsg: false,
			menuIsOpen: false,
			timeShow: false,
			loading: true,
			finished: false
		};
	},
	methods: {
		// 获取子组件选择的值
		getReturnTabs(name) {
			this.paData.page = 1;
			this.timeShow = false;
			if (name === 7) {
				this.timeShow = true;
			} else {
				this.data = [];
				this.$helps.showLoading();
				this.paData.stime = this.$helps.lately(name).stime;
				this.paData.etime = this.$helps.lately(name).etime;
				this.getConversionData();
				this.loading = true;
				this.finished = false;
			}
		},
		onLoad() {
			setTimeout(() => {
				this.paData.page++;
				this.getConversionData();
			}, 200);
		},
		filterTime(time) {
			this.timeShow = false;
			this.paData.stime = time.stime;
			this.paData.etime = time.etime;
			this.loading = true;
			this.finished = false;
			this.getConversionData();
		},
		clickLeft() {
			this.timeShow = false;
		},
		//获取转换记录数据
		getConversionData() {
			this.$api.request("API_GET_CONVERSION_LIST", this.paData).then(success => {
				this.$helps.hideLoading();
				this.loading = false;
				if (success.Data.Data) {
					R.do_data(success.Data.Data, success.Data.Page, this);
				} else {
					this.data = [];
					this.nodata = true;
					this.tipMsg = false;
				}
				if (!this.tipMsg) {
					this.loading = true;
					this.finished = true;
				}
			});
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

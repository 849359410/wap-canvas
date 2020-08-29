<template>
	<van-row>
		<head-switch :def-lottery="budgetList" @changePlayTypes="changePlayTypes"></head-switch>
		<DateChoose
			:list="perentDateList"
			:tab-height="2"
			:rendered="true"
			display-id="true"
			@getReturnTabs="getReturnTabs"
		></DateChoose>
		<no-data v-if="no_content"></no-data>
		<van-row>
			<van-row v-for="i in data" :key="i.id" class="list">
				<van-col class="list-box" span="24">
					<span v-if="typeTable === 0">单号：{{ i.order_num }}</span>
					<span v-else>有效份额&nbsp;&nbsp;&nbsp;¥ {{ i.v_money }}</span>
					<span class="right">¥ {{ i.money }}</span>
				</van-col>
				<van-col class="list-box" span="24">
					<span class="time">时间：{{ i.add_time }}</span>
					<span v-if="typeTable === 0" class="right" :class="returnClass(i.ctype)">
						{{ i.ctype | filterType(i.ctype) }}</span
					>
					<span v-else class="right shouyi">收益</span>
				</van-col>
			</van-row>
		</van-row>
		<time-set
			:time-show="timeShow"
			:type-num="cType"
			:types-of="typesOf"
			:pa-data="paData"
			@clickLeft="clickLeft"
			@filterTime="filterTime"
		></time-set>
	</van-row>
</template>

<script>
import DateChoose from "../../components/Tabs";
import timeSet from "../../components/timeSet";
import R from "../../config/record";
import noData from "../../components/noData";
import headSwitch from "../../components/headSwitch";
export default {
	name: "BudgetDetails",
	components: { DateChoose, timeSet, noData, headSwitch },
	filters: {
		filterType(t) {
			let type = "";
			switch (t) {
				case 1:
					type = "余额转入";
					break;
				case 2:
					type = "收益";
					break;
				case 3:
					type = "转出到平台";
					break;
				case 4:
					type = "转出到银行卡";
					break;
				case 5:
					type = "转出冻结";
					break;
				/*case 6:
                    type = "转入冻结";
                    break;*/
				default:
					break;
			}
			return type;
		}
	},
	data() {
		return {
			typeTable: 0,
			perentDateList: [
				{ id: 1, name: "今天" },
				{ id: 2, name: "昨天" },
				{ id: 5, name: "最近7天" },
				{ id: 7, name: "自定义" }
			], // 向子组件传入想要显示的值
			budgetList: [
				{ sort: 0, name: "收支明细", path: "BudgetDetails" },
				{ sort: 1, name: "收益报表", path: "BudgetDetails" }
			],
			paData: {
				stime: "",
				etime: "",
				page: 1,
				username: "",
				ctype: 1
			},
			cType: 1,
			timeShow: false,
			tipMsg: false,
			data: [],
			no_content: false,
			typesOf: true
		};
	},
	methods: {
		getReturnTabs(name) {
			this.paData.ctype = "";
			this.timeShow = false;
			if (name === 7) {
				this.timeShow = true;
			} else {
				this.paData.stime = this.$helps.lately(name).stime;
				this.paData.etime = this.$helps.lately(name).etime;
				this.getIndex();
			}
		},
		changePlayTypes(name) {
			this.typeTable = name;
			this.typesOf = name !== 1;
			this.getIndex();
		},
		clickLeft() {
			this.timeShow = false;
		},
		filterTime(time) {
			this.timeShow = false;
			this.paData.stime = time.stime;
			this.paData.etime = time.etime;
			this.paData.ctype = time.ctype;
			this.cType = time.ctype;
			this.getIndex();
		},
		getIndex() {
			let url = "API_GET_YUEBAO_CASH_RECORD";
			if (this.typeTable === 1) url = "API_GET_PRIFIT_RECORD";
			this.$api.request(url, this.paData).then(
				success => {
					if (success.Data.Data) {
						this.no_content = false;
						if (this.typeTable === 1) {
							R.do_data(
								success.Data.Data,
								success.Data.Page,
								this,
								success.Data.Total
							);
						} else {
							R.do_data(
								success.Data.Data,
								success.Data.Page,
								this,
								success.Data.Total.num
							);
						}
					} else {
						this.data = [];
						this.no_content = true;
						this.tipMsg = false;
					}
				},
				error => {
					this.$root.$emit("handleError", error);
				}
			);
		},
		returnClass(type) {
			return [
				{
					type_num1: type === 1,
					type_num2: type === 2,
					type_num3: type === 3 || type === 4,
					type_num5: type === 5
					// type_num6: type === 6
				}
			];
		}
	}
};
</script>

<style scoped lang="scss">
.head {
	.head_center {
		margin-top: 8px;
	}
}
.list {
	background-color: #ffffff;
	margin-top: 10px;
	padding: 10px;
	> .list-box {
		font-size: 12px;
		span {
			display: inline-block;
			line-height: 20px;
			color: #000000;
			&.time {
				color: #666666;
			}
			&.type_num1 {
				color: #0a9000 !important;
			}
			&.type_num2 {
				color: #ff7800 !important;
			}
			&.type_num3 {
				color: #d0021b !important;
			}
			&.type_num5 {
				color: #298ff9 !important;
			}
			/*&.type_num6 {
                    color: #00a8ff !important;
                }*/
			&.right {
				float: right;
				font-weight: 600;
				&.yue {
					color: #0a9000;
				}
				&.shouyi {
					color: #ff7800;
				}
			}
		}
	}
}
</style>

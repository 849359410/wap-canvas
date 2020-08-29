<template>
	<div class="tab_container">
		<tabs
			:list="navName"
			:tab-height="2"
			:display-id="true"
			:rendered="true"
			class="tab-options"
			@getReturnTabs="getReturnTabs"
		></tabs>
		<van-row class="tab_container--header">
			<van-col v-for="(i, index) in toList" :key="index">{{ i }}</van-col>
		</van-row>
		<van-row class="tab_container--data">
			<van-col v-for="(v, index) in data" :key="index" span="24">
				<span>{{ v.name }}</span>
				<span>{{ v.num }}</span>
				<span>{{ v.bet }}</span>
				<span>{{ v.valid_bet }}</span>
				<span v-if="v.result === 0">{{ v.result }}</span>
				<span v-else :class="v.result > 0 ? 'win' : 'lose'">{{ v.result }}</span>
			</van-col>
		</van-row>
		<van-row class="tab_container--total">
			<van-row type="flex" justify="center">
				<van-col><span>总笔数:</span> {{ list.nums }}</van-col>
				<van-col style="margin-left: 10px"><span>总投注:</span> {{ list.bets }}元</van-col>
			</van-row>
			<van-row type="flex" justify="center">
				<van-col><span>有效投注:</span> {{ list.valid_bets }}元</van-col>
				<van-col style="margin-left: 15px"
					><span>输赢:</span> {{ list.results | numFilter }}元</van-col
				>
			</van-row>
		</van-row>
	</div>
</template>

<script>
import tabs from "../../components/Tabs";
export default {
	name: "Index",
	components: { tabs },
	filters: {
		filterType(v) {
			if (v === "fc") return "信";
			else if (v === "fc_tra") return "官";
		},
		numFilter(value) {
			let realVal = 0;
			if (value) {
				realVal = parseFloat(value).toFixed(3);
			}
			return realVal;
		}
	},
	data() {
		return {
			navName: [
				{ id: 1, name: "今日" },
				{ id: 2, name: "昨日" },
				{ id: 6, name: "本周" },
				{ id: 7, name: "上周" },
				{ id: 3, name: "本月" },
				{ id: 4, name: "上月" }
			],
			data: [],
			total: "",
			list: "",
			toList: ["项目", "总笔数", "总投注", "有效投注", "输赢"],
			paData: {
				stime: "",
				etime: ""
			}
		};
	},
	methods: {
		getReturnTabs(name) {
			this.$helps.showLoading();
			this.paData.stime = this.$helps.lately(name).stime;
			this.paData.etime = this.$helps.lately(name).etime;
			this.GetReports();
		},
		GetReports() {
			this.$api
				.request("API_GET_REPORTS", {
					stime: this.paData.stime,
					etime: this.paData.etime
				})
				.then(
					res => {
						this.data = res.Data.Data;
						this.list = res.Data.Total;
						this.data.forEach(v => {
							if (v.v_type === "fc") {
								v.name = "彩票【信】";
							} else if (v.v_type === "fc_tra") {
								v.name = "彩票【官】";
							} else if (v.v_type === "ag") {
								v.name = "AG视讯";
							} else if (v.v_type === "bg") {
								v.name = "BG视讯";
							} else if (v.v_type === "ag_dz") {
								v.name = "AG电子";
							} else if (v.v_type === "bg_by") {
								v.name = "BG捕鱼";
							} else if (v.v_type === "bg_dz") {
								v.name = "BG电子";
							} else if (v.v_type === "ag_by") {
								v.name = "AG捕鱼";
							} else if (v.v_type === "ky") {
								v.name = "KY棋牌";
							}
						});
						this.$helps.hideLoading();
					},
					error => this.$root.$emit("handleError", error)
				);
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/report/Index";
</style>
<style lang="scss">
.tab-options {
	width: 100%;
	.van-tab {
		font-size: 13px;
		padding: 0;
		flex-basis: 16.5% !important;
		span {
			width: 100%;
			height: 34%;
			line-height: 16px;
			border-left: 1px solid #e8e8e8;
		}
	}
	.van-tab:first-child {
		span {
			border: none;
		}
	}
	.van-tab--active {
		font-size: 14px;
		color: #ef384a;
	}
	.van-tabs__line {
		width: 17px !important;
		bottom: 24px;
	}
}

.icon {
	width: 25px;
	position: relative;
	top: 5px;
}
</style>

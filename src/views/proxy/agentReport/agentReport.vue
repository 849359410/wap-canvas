<template>
	<van-row class="agentReport">
		<DateChoose
			:list="perentDateList"
			:tab-height="2"
			:rendered="true"
			display-id="true"
			@getReturnTabs="getReturnTabs"
		></DateChoose>
		<van-cell class="search-content" span="24">
			<van-field
				v-model="user_name"
				center
				clearable
				left-icon="search"
				class="search-wrapper"
				placeholder="下级报表查询"
			>
				<template #button>
					<van-button size="small" type="info" @click="handleAgentReport(1)"
						>查询</van-button
					>
				</template>
			</van-field>
		</van-cell>
		<van-grid :column-num="3" class="agentReport--sub">
			<van-grid-item
				v-for="(item, index) in dataLists"
				:key="index"
				class="agentReport--sub--list"
			>
				<p class="agentReport--sub--list_p1">
					<span v-show="index !== 5 && index !== 6 && index !== 7 && index !== 8"
						>￥</span
					>
					{{ item.cont }}
				</p>
				<p class="agentReport--sub--list_p2">{{ item.text }}</p>
			</van-grid-item>
		</van-grid>
		<!--时间选择器-->
		<time-set
			:time-show="timeShow"
			:show-all="true"
			:pa-data="paData"
			:color-pink="false"
			@clickLeft="clickLeft"
			@filterTime="filterTime"
		></time-set>
	</van-row>
</template>

<script>
import DateChoose from "../../../components/Tabs";
import timeSet from "../../../components/timeSet";
import { mapState } from "vuex";
export default {
	name: "AgentReport",
	components: { DateChoose, timeSet },
	data() {
		return {
			user_name: "",
			perentDateList: [
				{ id: 1, name: "今天" },
				{ id: 2, name: "昨天" },
				{ id: 5, name: "最近7天" },
				{ id: 4, name: "自定义" }
			], // 向子组件传入想要显示的值
			divIndex: 0,
			lists: [],
			searchParams: {
				timeType: "1",
				page: 1,
				pid: "",
				user_name: "",
				stime: "",
				etime: ""
			},
			dataLists: [],
			timeShow: false,
			paData: {
				stime: "",
				etime: ""
			}
		};
	},
	computed: {
		...mapState({
			userMessage: state => state.user.userMessage
		})
	},
	created() {
		if (!this.$route.params.paData) {
			this.handleAgentReport();
		} else {
			this.searchParams = this.$route.params.paData;
			this.divIndex = this.$route.params.divIndex;
			this.user_name = this.$route.params.paData.username;
			this.handleAgentReport();
		}
	},
	methods: {
		getReturnTabs(name) {
			if (name === 4) {
				this.timeShow = true;
			} else {
				//自定义初始化时间
				this.timeShow = false;
				this.paData.stime = this.$helps.lately(name).stime;
				this.paData.etime = this.$helps.lately(name).etime;
				this.divIndex = name;
				this.searchParams.stime = this.$helps.lately(name).stime;
				this.searchParams.etime = this.$helps.lately(name).etime;
				this.handleAgentReport();
			}
		},
		handleAgentReport(item) {
			if (!this.searchParams.user_name) {
				if (typeof item === "function")
					this.searchParams.user_name = this.userMessage.username;
				else this.searchParams.user_name = this.user_name;
			} else {
				this.searchParams.user_name = this.user_name;
			}
			this.$helps.showLoading();
			this.$api.request("API_GET_REPORT_PYRAMID", this.searchParams).then(
				success => {
					setTimeout(() => {
						this.$helps.hideLoading();
					}, 500);
					this.lists = success.Data;
					this.lists.betAmount = parseFloat(
						success.Data.valid_bet_fc + success.Data.valid_bet_fc_tra
					).toFixed(3);
					this.lists.teamRebate = parseFloat(
						success.Data.commission_z_money + success.Data.commission_money
					).toFixed(3);
					this.lists.dis_hui = parseFloat(success.Data.dis_hui).toFixed(3);
					this.lists.winningAmount = parseFloat(
						success.Data.result_fc +
							success.Data.result_fc_tra +
							success.Data.valid_bet_fc +
							success.Data.valid_bet_fc_tra
					).toFixed(3);
					this.lists.teamProfit = (
						this.lists.winningAmount -
						this.lists.betAmount +
						(parseFloat(this.lists.teamRebate) + parseFloat(this.lists.dis_hui))
					).toFixed(3);
					this.lists.numberBets = success.Data.valid_nums;
					this.lists.rechargeAmount = success.Data.catm_in_money.toFixed(3);
					this.lists.withdrawalAmount = success.Data.catm_out_money.toFixed(3);

					this.dataLists = [
						{ cont: this.lists.betAmount, text: "投注金额" },
						{ cont: this.lists.winningAmount, text: "中奖金额" },
						{ cont: this.lists.dis_hui, text: "活动优惠" },
						{ cont: this.lists.teamRebate, text: "团队返点" },
						{ cont: this.lists.teamProfit, text: "团队盈利" },
						{ cont: this.lists.numberBets, text: "投注人数" },
						{ cont: success.Data.pid_num, text: "推广人数" },
						{ cont: success.Data.is_first_num, text: "首充人数" },
						{ cont: success.Data.is_second_num, text: "二充人数" },
						{ cont: success.Data.is_third_num, text: "三充人数" },
						{ cont: success.Data.add_num, text: "新增会员" },
						{ cont: this.lists.rechargeAmount, text: "充值金额" },
						{ cont: this.lists.withdrawalAmount, text: "提现金额" },
						{ cont: success.Data.balance_money, text: "团队余额" }
					];
				},
				error => {
					this.$helps.hideLoading();
					this.$root.$emit("handleError", error);
				}
			);
		},
		clickLeft() {
			this.timeShow = false;
		},
		filterTime(time) {
			this.searchParams.stime = time.stime;
			this.searchParams.etime = time.etime;
			this.handleAgentReport();
			this.timeShow = false;
		}
	}
};
</script>

<style scoped lang="scss">
.agentReport {
	.search-content {
		background: #eee;
		.search-wrapper {
			height: 50px;
			line-height: 50px;
			background: #fff;
			padding: 10px 2%;
		}
	}
	@at-root #{&}--sub {
		margin-left: 3%;
		margin-top: 10px;
		@at-root #{&}--list {
			flex-basis: 31.5% !important;
			width: 31.5%;
			border-radius: 4px;
			height: 100px;
			border: 1px solid #e6e6e6;
			margin-right: 5px;
			margin-bottom: 5px;
			box-shadow: 0 1px 4px 0 rgba(215, 215, 215, 0.5);
			@at-root #{&}_p1 {
				font-size: 15px;
				color: #333333;
				font-family: "Pingfang-SC-Medium";
				font-weight: 600;
				margin-bottom: 10px;
				display: flex;
			}
			@at-root #{&}_p2 {
				font-size: 12px;
				color: #666666;
				font-family: "PingFang SC - Regular";
			}
		}
	}
}
</style>

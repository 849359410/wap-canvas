<template>
	<van-row>
		<van-row class="subordinateReport--box">
			<DateChoose
				:list="perentDateList"
				:tab-height="2"
				:rendered="true"
				display-id="true"
				@getReturnTabs="getReturnTabs"
			></DateChoose>
			<van-row class="listBox">
				<van-row class="listBox--content">
					<van-row class="listBox--content_listTable">
						<table class="listBox--content_listTable-table">
							<thead>
								<tr>
									<th>账号</th>
									<th>下级</th>
									<th>投注人数</th>
									<th>盈利</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(v, index) in lists" :key="index" :data-id="v.pid">
									<td style="font-size: 13px">{{ v.username }}</td>
									<td style="font-size: 13px" :data-username="v.username">
										<span
											v-if="v.p_username !== userMessage.username"
											@click="getReportData(v.ppid)"
											>↑</span
										>
										<span @click="getReportData(v.id, v)">↓</span>
									</td>
									<td style="font-size: 13px">
										{{ v.valid_num + v.valid_num_tra }}
									</td>
									<td style="font-size: 13px" @click="toAgentReport(v.username)">
										{{ v.profit }}
									</td>
								</tr>
							</tbody>
						</table>
					</van-row>
				</van-row>
				<div v-if="nodata" id="no-data" class="no-data">
					<img src="../../../assets/images/userCenter/recording/nodata.png" alt="" />
					<p v-if="subPpid">
						暂无数据，
						<span @click="getReportData()">返回</span>
					</p>
					<p v-else>暂无数据</p>
				</div>
			</van-row>
		</van-row>
	</van-row>
</template>

<script>
import { mapState } from "vuex";
import DateChoose from "../../../components/Tabs";
export default {
	name: "SubordinateReport",
	components: {
		DateChoose
	},
	data() {
		return {
			perentDateList: [
				{ id: 1, name: "今天" },
				{ id: 2, name: "昨天" },
				{ id: 5, name: "最近7天" },
				{ id: 4, name: "上月" }
			], // 向子组件传入想要显示的值
			divIndex: 0,
			paData: {
				pid: "",
				stime: this.$helps.lately(1).stime,
				etime: this.$helps.lately(1).etime,
				username: ""
			},
			lists: [],
			storeUserId: [],
			tipMsg: false,
			pindex: 0, // 统计下级会员层级
			username: "",
			lastData: [],
			nodata: false,
			subPpid: ""
		};
	},
	computed: {
		...mapState({
			userMessage: state => state.user.userMessage
		})
	},
	beforeDestroy() {
		this.subPpid = "";
	},
	methods: {
		childIndexVals() {
			this.subPpid = "";
			this.paData.uid = "";
			this.paData.username = "";
		},
		// 获取子组件选择的值
		getReturnTabs(name) {
			this.childIndexVals();
			this.paData.stime = this.$helps.lately(name).stime;
			this.paData.etime = this.$helps.lately(name).etime;
			this.divIndex = name;
			this.getReportData();
		},
		results(arr) {
			let sum = 0;
			arr.forEach(i => {
				sum += this.numberZoom(i, 3);
			});
			return this.numberZoom(sum, -3);
		},
		// 金额计算
		numberZoom(num, m, needNumber = true) {
			let parts = String(num).split("."),
				integerLen = parts[0].length,
				decimalLen = parts[1] ? parts[1].length : 0,
				index = integerLen + m;
			if (m > 0) {
				let zeros = m - decimalLen;
				while (zeros > 0) {
					zeros -= 1;
					parts.push(0);
				}
			} else {
				let zeros = Math.abs(m) - integerLen;
				while (zeros > 0) {
					zeros -= 1;
					parts.push(0);
				}
			}
			parts = parts.join("").split("");
			if (parts.length > index) {
				parts.splice(index > 0 ? index : 0, 0, ".");
			}
			return needNumber ? parseFloat(parts.join("")) : parts.join("");
		},
		getReportData(id, item) {
			this.lists = [];
			this.paData.uid = id ? id : this.subPpid;
			this.$helps.showLoading();
			this.$api.request("API_GET_REPORT_NATE", this.paData).then(
				success => {
					let data = success.Data.Data;
					setTimeout(() => {
						this.$helps.hideLoading();
					}, 500);
					if (data === "") {
						if (item) this.subPpid = item.pid;
						this.nodata = true;
					} else {
						this.nodata = false;
						if (id) this.subPpid = id;
						data.forEach(v => {
							v.profit = this.results([
								v.result_fc,
								v.result_fc_tra,
								v.commission_z_money,
								Number(v.commission_money),
								v.in_dis
							]).toFixed(3);
						});
						this.lists = data.filter(v => {
							return v.valid_num + v.valid_num_tra > 0;
						});
						if (this.lists.length === 0 && this.subPpid) {
							this.subPpid = item.pid;
						}
						this.nodata = !(this.lists.length > 0);
					}
				},
				error => {
					this.$helps.hideLoading();
					this.$root.$emit("handleError", error);
				}
			);
		},
		toAgentReport(name) {
			this.paData.username = name;
			this.$router.push({
				name: "agentReport",
				params: {
					paData: this.paData,
					stime: this.paData.stime,
					etime: this.paData.etime,
					divIndex: this.divIndex
				}
			});
		}
	}
};
</script>
<style scoped lang="scss">
@import "../../../assets/css/views/proxy/subordinateReport";
</style>

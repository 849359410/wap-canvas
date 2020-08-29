<template>
	<van-row class="MbList">
		<van-row class="MbList--box">
			<div class="headList">
				<p
					v-for="i in headList"
					:key="i.id"
					:class="i.id === paData.sort ? 'active' : ''"
					@click="tabHead(i.id)"
				>
					<span>{{ i.name }}</span>
				</p>
			</div>
			<van-cell class="search-content" span="24">
				<van-field
					v-model="username"
					center
					clearable
					left-icon="search"
					class="search-wrapper"
					placeholder="请输入会员账号"
				>
					<template #button>
						<van-button size="small" type="info" @click="getUsername()"
							>查询</van-button
						>
					</template>
				</van-field>
			</van-cell>
			<van-row class="content">
				<div class="table1">
					<table class="table">
						<thead>
							<tr>
								<th>账号</th>
								<th>下级</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in data" :key="item.id">
								<td class="user-account" @click="checkDetails(item.user_code)">
									{{ item.username }}
								</td>
								<td :class="{ 'user-name': item.id }">
									<img
										v-if="item.ppid !== 0"
										src="../../../assets/images/userCenter/mrecord/upInquire.png"
										@click="upSelf(item.ppid)"
									/>
									<img
										src="../../../assets/images/userCenter/mrecord/subord.png"
										@click="toSelf(item.id, item.pid)"
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="table2">
					<table class="table">
						<thead>
							<tr>
								<th>编号</th>
								<th>类型</th>
								<th>余额</th>
								<th v-if="paData.sort === 0">注册时间</th>
								<th v-if="paData.sort === 1">登录时间</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in data" :key="item.id">
								<td>{{ item.id }}</td>
								<td>{{ item.is_agent === 1 ? "代理" : "普通" }}</td>
								<td>{{ item.money }}</td>
								<td v-if="paData.sort === 0">{{ item.add_time }}</td>
								<td v-if="paData.sort === 1">{{ item.login_time }}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<!--返点详情-->
				<div v-if="details" class="black_overlay" @click="details = false"></div>
				<div v-if="details" class="alert">
					<ul class="alert-content">
						<li class="zTitle">返点详情</li>
						<li class="li-content">
							<div v-for="v in detailData" :key="v.id" class="cz" :data-id="v.id">
								<div class="czm" style="font-size: 14px">
									{{ lotteriesRebateOptions[v.fc_id] }}
								</div>
								<div class="fds" style="font-size: 14px">{{ v.min }}</div>
							</div>
						</li>
					</ul>
					<div class="ack" @click="details = false">
						<span>确定</span>
					</div>
				</div>
			</van-row>
			<div v-if="nodata" class="no-data">
				<van-empty class="custom-image" :image="img"
					>暂无数据<span v-show="recordReturn !== 0" @click="upperLevel"
						>, <i>返回</i></span
					></van-empty
				>
			</div>
			<p v-if="tipMsg" class="rtips" @click="loadMore">点击加载更多</p>
		</van-row>
	</van-row>
</template>

<script>
import { LOTTERY_REBATE_OPTIONS } from "../../../config/deploy.config";
export default {
	name: "MbList",
	data() {
		return {
			data: [], // 订单信息
			tipMsg: false,
			nodata: true, // 无数据
			paData: {
				page: 1,
				pid: "",
				sort: 0,
				user_code: "",
				ppid: ""
			}, // 提交的数据
			details: false,
			detailData: [],
			storeUserId: [],
			lotteriesRebateOptions: LOTTERY_REBATE_OPTIONS,
			headList: [
				{ id: 0, name: "最近注册" },
				{ id: 1, name: "最近登录" }
			],
			username: "",
			recordReturn: 0,
			img: require("../../../assets/images/userCenter/recording/nodata.png")
		};
	},
	created() {
		this.GetAgentUser();
	},
	methods: {
		tabHead(id) {
			this.paData.page = 1;
			this.paData.sort = id;
			this.data = [];
			this.GetAgentUser();
		},
		upSelf(id) {
			this.paData.page = "";
			this.username = "";
			this.paData.username = "";
			this.GetAgentUser(id);
		},
		toSelf(id, pid) {
			this.paData.page = "";
			this.username = "";
			this.paData.username = "";
			this.recordReturn = pid;
			this.GetAgentUser(id);
		},
		upperLevel() {
			this.upSelf(this.recordReturn);
		},
		loadMore() {
			this.paData.page++;
			this.GetAgentUser();
		},
		getUsername() {
			this.paData.username = this.username;
			this.data = [];
			this.GetAgentUser();
		},
		do_data(allData, currPage) {
			if (allData === "" && currPage === 1) {
				// 第一次获取没有数据的时候
				this.nodata = true;
				this.data = [];
				this.tipMsg = false;
				return;
			}
			if (!allData) {
				this.nodata = false;
				this.tipMsg = false;
				return;
			}
			this.nodata = false;
			this.data = this.data.concat(allData);

			if (allData.length >= 12) this.tipMsg = true;
			else this.tipMsg = false;
		},
		// 获取会员列 查看下级人数
		GetAgentUser(id, flag = true) {
			// if (!(this.$route.path.indexOf("mbList") > -1)) return;
			if ((id && typeof id === "string") || (id && typeof id === "number")) {
				this.data = [];
				if (flag) {
					this.storeUserId.push({ id: id });
				}
				this.paData.pid = id;
			} else {
				this.paData.pid = "";
			}
			if (this.$route.params.code) this.paData.user_code = this.$route.params.code;
			this.$helps.showLoading();
			this.$api.request("API_GET_AGENT_USER", this.paData).then(
				res => {
					setTimeout(() => {
						this.$helps.hideLoading();
					}, 500);
					if (!res || !res.Data) {
						this.nodata = true;
						this.data = [];
						this.tipMsg = false;
						return;
					}
					this.do_data(res.Data, this.paData.page);
				},
				() => {
					this.$helps.hideLoading();
				}
			);
		},
		//查看返点详情
		checkDetails(code) {
			if (!code || typeof code === "undefined") return;
			this.$api
				.request("API_GET_FC_REBATE_DATA", {
					code: code
				})
				.then(
					res => {
						this.do_details(res.Data.sdata);
					},
					() => {}
				);
		},
		do_details(data) {
			this.details = true;
			if (!data || data.length < 8) {
				this.detailData = "0.0";
			} else {
				this.detailData = data;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/views/proxy/mbList";
</style>

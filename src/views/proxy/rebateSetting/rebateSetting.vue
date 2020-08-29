<template>
	<van-row class="rebateSetting">
		<van-row class="rebateSetting--box">
			<van-row class="topTab--row">
				<van-col
					v-for="(i, index) in RebateList"
					:key="index"
					:class="['topTab--row_col', lotteryIndex === i.sort ? 'active' : '']"
					@click="changePlayType(i.sort)"
				>
					{{ i.name }}
				</van-col>
			</van-row>
			<van-row class="tab-content">
				<van-row v-if="lotteryIndex === 0" class="con">
					<van-cell-group class="maxRebate">
						<van-field
							v-for="(lottery, index) in lotteriesMaxRebate"
							:key="index"
							v-model="paramsData[index].min"
							:label="lotteriesRebateOptions[lottery.fc_id] || '--'"
							:placeholder="
								`可为下级设置返点范围${
									lottery.limit > lottery.min ? lottery.min : lottery.limit
								}-${lottery.min}`
							"
							:min="lottery.limit > lottery.min ? lottery.min : lottery.limit"
							:max="lottery.min"
							@blur="
								isValidRebateSetting(
									paramsData[index].min,
									lottery.fc_id,
									lottery.min,
									lottery.limit
								)
							"
						></van-field>
					</van-cell-group>
					<van-button class="maxRow" @click="handleGenerateInviteCode"
						>生成邀请码</van-button
					>
					<van-col class="showFd" span="24" @click="$router.push({ name: 'rebateOdds' })">
						<p>返点赔率查看</p>
					</van-col>
				</van-row>
				<van-row v-if="lotteryIndex === 1" class="con">
					<table class="table">
						<thead>
							<tr>
								<th>邀请码</th>
								<th>生成时间</th>
								<th>注册人数</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody>
							<tr v-show="AgentUserShow">
								<td colspan="4">暂无记录</td>
							</tr>
							<tr v-for="v in inviteCodeList" :key="v.id" :data-id="v.id">
								<td>{{ v.id }}</td>
								<td>{{ v.add_time }}</td>
								<td
									:style="Number(v.reg_num) ? 'color: #3da8fe' : ''"
									@click="canGoToMember(v)"
								>
									{{ v.reg_num }}
								</td>
								<td>
									<span
										v-clipboard:copy="originUrl + '/register?' + v.id"
										v-clipboard:success="onCopy"
										v-clipboard:error="onCopyError"
										>复制</span
									>
									<span @click="checkDetails(v.id)">查看</span>
									<span @click="checkAgain(v.id)">删除</span>
								</td>
							</tr>
						</tbody>
					</table>
				</van-row>
			</van-row>
		</van-row>
		<van-row>
			<van-popup v-model="details" class="rebateList">
				<van-cell-group>
					<p class="top_text">返点详情</p>
					<van-cell v-for="v in detailData" :key="v.id" center="true">
						<template #default>
							<van-row class="custom-title color">
								<span>{{ v.min }}</span>
							</van-row>
						</template>
						<template #title>
							<van-row class="custom-title">
								<span> {{ lotteriesRebateOptions[v.fc_id] }}</span>
							</van-row>
						</template>
					</van-cell>
					<van-button class="maxRow" @click="details = false">确认</van-button>
				</van-cell-group>
			</van-popup>
			<van-dialog
				v-model="checkDelete"
				title="提示"
				class="allAlert"
				show-cancel-button="true"
				width="270px"
				@confirm="deleteCode(1)"
				@cancel="checkDelete = false"
			>
				是否确认删除？
			</van-dialog>
		</van-row>
	</van-row>
</template>
<script>
import { LOTTERY_REBATE_OPTIONS } from "../../../config/deploy.config";
export default {
	name: "RebateSetting",
	props: {
		id: {
			type: [String, Number],
			default: ""
		}
	},
	data() {
		return {
			lotteryIndex: 0,
			paramsData: [],
			lotteriesMaxRebate: [], // 最大返点设置
			lotteriesRebateOptions: LOTTERY_REBATE_OPTIONS,
			data: {},
			AgentUserShow: false,
			originUrl: "",
			inviteCodeList: [],
			detailData: [],
			details: false,
			checkDelete: false,
			propId: "",
			isCheck: true,
			RebateList: [
				{ sort: 0, name: "返点设置" },
				{ sort: 1, name: "邀请码管理" }
			]
		};
	},
	watch: {
		lotteryIndex: {
			handler() {},
			deep: true
		}
	},
	created() {
		this.lotteryIndex = this.$route.params.id || 0;
		this.handleGetMaxRebate();
		this.originUrl = window.location.host;
		this.InvitationCode();
	},
	methods: {
		canGoToMember(item) {
			if (item.reg_num) this.$router.push({ name: "MbList", params: { code: item.id } });
		},
		changePlayType(n) {
			this.lotteryIndex = n;
			if (n === 0) {
				this.handleGetMaxRebate();
			} else {
				this.InvitationCode();
			}
		},
		init() {
			this.paramsData = [];
			this.lotteriesMaxRebate = [];
		},
		checkAgain(id) {
			this.propId = id;
			this.checkDelete = true;
		},
		deleteCode() {
			this.$api.request("API_GET_DEL_USER_CODE", { id: this.propId }).then(() => {
				this.$root.$emit("handleSuccess", "删除成功");
				this.InvitationCode();
			});
			setTimeout(() => {
				this.checkDelete = false;
			}, 100);
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
		},
		InvitationCode() {
			this.$helps.showLoading();
			this.$api.request("API_GET_USER_CODE").then(
				success => {
					this.inviteCodeList = success.Data;
					setTimeout(() => {
						this.$helps.hideLoading();
					}, 500);
				},
				error => {
					this.$helps.hideLoading();
					this.$root.$emit("handleError", error);
				}
			);
		},
		onCopy() {
			this.$root.$emit("handleSuccess", "复制成功");
			event.stopPropagation();
		},
		onCopyError() {
			this.$root.$emit("handleError", "复制失败");
			event.stopPropagation();
		},
		isValidRebateSetting(val, target, maxRebate, minRebate) {
			this.isCheck = true;
			if (val !== "") {
				if (!/^\d+(?:\.\d{1})?$/.test(val)) {
					this.$root.$emit(
						"handleError",
						`${this.lotteriesRebateOptions[target]}只能输入数字且最多一位小数`
					);
					this.isCheck = false;
				}
				if (val < 0) {
					this.$root.$emit(
						"handleError",
						`${this.lotteriesRebateOptions[target]}设置的返点必须是大于等于0的数字`
					);
					this.isCheck = false;
				}
				if (minRebate < maxRebate) {
					if (val < minRebate) {
						this.$root.$emit(
							"handleError",
							`${this.lotteriesRebateOptions[target]}最小可设置${minRebate}`
						);
						this.isCheck = false;
					}
					if (val > maxRebate) {
						this.$root.$emit(
							"handleError",
							`${this.lotteriesRebateOptions[target]}最大可设置${maxRebate}`
						);
						this.isCheck = false;
					}
				} else {
					if (val < maxRebate) {
						this.$root.$emit(
							"handleError",
							`${this.lotteriesRebateOptions[target]}最小可设置${maxRebate}`
						);
						this.isCheck = false;
					}
					if (val > maxRebate) {
						this.$root.$emit(
							"handleError",
							`${this.lotteriesRebateOptions[target]}最大可设置${maxRebate}`
						);
						this.isCheck = false;
					}
				}
			}
		},
		handleGetMaxRebate() {
			this.$helps.showLoading();
			this.init();
			this.$api.request("API_GET_FC_REBATE").then(
				success => {
					setTimeout(() => {
						this.$helps.hideLoading();
					}, 500);
					this.data = success.Data;
					Object.keys(this.data).forEach(val => {
						this.lotteriesMaxRebate.push(this.data[val]);
						this.paramsData.push({ fc_id: this.data[val].fc_id, min: "" });
					});
				},
				error => {
					this.$helps.hideLoading();
					this.$root.$emit("handleError", error);
				}
			);
		},
		// 生成邀请码
		handleGenerateInviteCode() {
			const rebateOptions = this.lotteriesRebateOptions,
				lotteriesMaxRebate = this.lotteriesMaxRebate;
			Object.keys(this.paramsData).forEach(i => {
				if (this.paramsData[i].min) this.paramsData[i].min = Number(this.paramsData[i].min);
				const item = this.paramsData[i];
				if (item.min === "") {
					this.isCheck = false;
					return this.$root.$emit("handleError", `${rebateOptions[item.fc_id]}不能为空`);
				}
				if (!/^[\d.]+$/.test(item.min)) {
					this.isCheck = false;
					return this.$root.$emit(
						"handleError",
						`${rebateOptions[item.fc_id]}设置的返点必须是大于等于0的数字`
					);
				}
				if (!/^\d+(?:\.\d{1})?$/.test(item.min)) {
					this.isCheck = false;
					return this.$root.$emit(
						"handleError",
						`${rebateOptions[item.fc_id]}只能输入数字且最多一位小数`
					);
				}
				if (item.min > Number(lotteriesMaxRebate[i].min)) {
					this.isCheck = false;
					return this.$root.$emit(
						"handleError",
						`${rebateOptions[item.fc_id]}最大可设置${lotteriesMaxRebate[i].min}`
					);
				}
			});
			if (this.isCheck) {
				this.$helps.showLoading();
				this.$api
					.request("API_GET_CREARTE_REBATE", {
						params: this.paramsData
					})
					.then(
						() => {
							this.$root.$emit("handleSuccess", "设置成功");
							setTimeout(() => {
								this.$helps.hideLoading();
								this.lotteryIndex = 1;
								this.InvitationCode();
							}, 500);
						},
						error => {
							this.$root.$emit("handleError", error);
						}
					);
			}
		}
	}
};
</script>
<style lang="scss" scoped>
@import "../../../assets/css/views/proxy/rebateSetting";
</style>
<style lang="scss">
.van-dialog__content {
	color: #000000;
	text-align: center;
	padding: 10px 12px !important;
}
.rebateSetting {
	.van-field__label {
		flex: none;
	}
}
</style>

<template>
	<van-row class="noteDetail">
		<van-row>
			<div class="contents">
				<p class="lotteryInfo">{{ bettingInfo.fc_name }} {{ bettingInfo.period }}期</p>
				<p class="lotteryTime">{{ bettingInfo.add_time }}</p>
				<div
					class="detailInfo"
					:class="
						bettingInfo.state === 0
							? 'Unsettlement'
							: bettingInfo.state === 1
							? 'Won'
							: bettingInfo.state === 2
							? 'Missed'
							: bettingInfo.state === 3
							? 'with'
							: 'Cancelled'
					"
				>
					<p>
						<span class="tableName">单号:</span>
						<span>{{ bettingInfo.order_num }}</span>
					</p>
					<p>
						<span class="tableName">玩法名称:</span>
						<span>{{ bettingInfo.play_name }}</span>
					</p>
					<p>
						<span class="tableName">开奖结果:</span>
						<span v-if="bettingInfo.state === 0" class="orgColor">待开奖</span>
						<span v-else-if="bettingInfo.state === 6" class="orgColor">已撤单</span>
						<span v-else class="numColor">
							<em
								v-for="(i, index0) in prize"
								:key="index0"
								style="font-style: normal"
							>
								<em v-if="index0 !== 0">, </em>{{ i }}
							</em>
						</span>
					</p>
					<p>
						<span class="tableName">投注内容:</span>
						<span
							class="orgColor"
							style="font-style: normal;word-wrap:break-word;word-break: break-all"
							>{{ bettingInfo.play_name }}-{{ playInfo }}</span
						>
					</p>
					<p>
						<span class="tableName">赔率:</span>
						<span>{{ bettingInfo.content_name }} @ {{ bettingInfo.odds }}</span>
					</p>
					<p>
						<span class="tableName">倍数:</span>
						<span style="width: 125px;display: inline-block">{{
							fc_type === "fc" ? 1 : bettingInfo.bet_num
						}}</span>
						<span class="tableName">模式:</span>
						<span v-if="fc_type === 'fc'">元</span>
						<span v-else>{{ bettingInfo.bet_model | filterModel }}</span>
					</p>
					<p>
						<span class="tableName">盈亏:</span>
						<span>{{ bettingInfo.result }}</span>
					</p>
					<p>
						<span class="tableName">有效投注:</span>
						<span style="width: 125px;display: inline-block">{{
							bettingInfo.valid_bet
						}}</span>
						<span class="tableName">投注总额:</span>
						<span>&yen;{{ bettingInfo.bet }}</span>
					</p>
					<p>
						<span class="tableName">结算状态:</span>
						<span class="broColor">{{
							bettingInfo.state === 0
								? "未结算"
								: bettingInfo.state === 1
								? "已中奖"
								: bettingInfo.state === 2
								? "未中奖"
								: bettingInfo.state === 3
								? "和"
								: "已取消"
						}}</span>
					</p>
					<p style="border: none;">
						<span class="tableName">派彩金额:</span>
						<span class="orgColor"
							>&yen;{{
								[bettingInfo.valid_bet, bettingInfo.result] | summarize
							}}</span
						>
					</p>
				</div>
			</div>
			<div
				v-if="bettingInfo.state === 0 && filterShow(bettingInfo.fc_id) && contentShow"
				class="memCash-confirm"
			>
				<a
					class="withdraw"
					@click="
						createAlertDialog(
							bettingInfo.order_num,
							bettingInfo.fc_id,
							bettingInfo.add_time
						)
					"
					>撤回</a
				>
				<a class="again" @click="goLottery(bettingInfo.fc_id)">再来一注</a>
			</div>
			<div v-else class="memCash-confirms">
				<a
					class="again"
					style="width: 100%;display: block;margin: 0 auto;line-height: 40px;float: inherit"
					@click="goLottery(bettingInfo.fc_id)"
					>再来一注</a
				>
			</div>
		</van-row>
		<van-dialog
			v-model="isShow"
			title="温馨提示"
			class="allAlert"
			show-cancel-button="true"
			width="270px"
			@confirm="cancelOrder()"
			@cancel="isShow = false"
		>
			撤单不可恢复，确认撤单?
		</van-dialog>
	</van-row>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { fastThreeIds } from "../../../config/dictionary";
import R from "../../../config/record";
export default {
	name: "NoteDetails",
	filters: {
		filterModel: function(v) {
			return R.yjfMode(v);
		}
	},
	data() {
		return {
			bettingInfo: [],
			fc_type: "fc",
			NoteNumber: "",
			prize: "",
			isShowCancelOrder: null,
			cancelParameter: {
				order_num: "",
				fc_id: "",
				add_time: ""
			},
			contentShow: false,
			playInfo: "",
			isShow: false
		};
	},
	computed: {
		...mapState({
			liveLottery: state => state.lottery.liveLottery
		}),
		...mapGetters(["operableLotteries"])
	},
	created() {
		this.fc_type = this.$route.query.fcType;
		this.NoteNumber = this.$route.query.NoteNum;
		this.contentShow = this.$route.query.contentShow;
		this.playInfo = this.$route.query.pDetail;
		this.getNoteInfo();
		this.getIsCancel();
	},
	methods: {
		getNoteInfo() {
			let url =
				this.fc_type === "fc" ? "API_GET_SINGLE_NOTE_FC" : "API_GET_SINGLE_NOTE_FC_FRA";
			this.$api
				.request(url, {
					order_num: this.NoteNumber
				})
				.then(
					success => {
						this.bettingInfo = success.Data;
						this.getLotteryResult();
					},
					error => {
						this.$root.$emit("handleError", error);
					}
				);
		},
		getLotteryResult() {
			this.$api
				.request("API_GET_FC_AUTO_FOR_PERIOD", {
					fc_id: this.bettingInfo.fc_id,
					period: this.bettingInfo.period
				})
				.then(success => {
					if (success.Data) {
						this.prize = success.Data;
					}
				});
		},
		// 测单是否开启
		getIsCancel() {
			let url = this.fc_type === "fc" ? "API_GET_FC_BY_CANCEL" : "API_GET_FC_TAR_BY_CANCEL";
			this.$api.request(url).then(success => {
				this.isShowCancelOrder = success.Data;
			});
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
		createAlertDialog(order_num, fc_id, add_time) {
			this.cancelParameter.order_num = order_num;
			this.cancelParameter.fc_id = fc_id;
			this.cancelParameter.add_time = add_time;
			this.isShow = true;
		},
		confirmCancelOrder() {
			this.cancelOrder();
		},
		cancelOrder() {
			let url =
				this.fc_type === "fc"
					? "API_GET_CANCEL_FC_BY_NONE"
					: "API_GET_CANCEL_FC_TRA_BY_NONE";
			this.$api.request(url, this.cancelParameter).then(
				success => {
					this.$root.$emit("handleSuccess", success.Msg);
					this.isShow = false;
					this.getNoteInfo();
				},
				error => {
					this.$root.$emit("handleError", error);
					this.isShow = false;
					this.getNoteInfo();
				}
			);
		},
		goLottery(item) {
			let data = [];
			this.operableLotteries.forEach(v => {
				if (item === v.fc_id) {
					data.push(v);
				}
			});
			if (item === 54) {
				// 直播彩种
				data.push(this.liveLottery);
			}
			data.forEach(v => {
				if (this.fc_type === "fc" && (v.fc_maint !== 1 || v.fc_state !== 1)) {
					this.$root.$emit("handleError", "该彩种正在维护...");
					return;
				}
				if (this.fc_type === "fc_tra" && (v.tra_maint !== 1 || v.tra_state !== 1)) {
					this.$root.$emit("handleError", "该彩种正在维护...");
					return;
				}
				if (v.id === 54) {
					this.$router.push({ name: "liveIndex", params: { id: v.id } });
					return;
				}
				if (fastThreeIds.indexOf(v.id) > -1) {
					this.$router.push({ name: "FastThree", params: { id: v.id } });
				} else if (v.is_second === 1) {
					this.$router.push({ name: "SecondsOpen", params: { id: v.id } });
				} else if (this.fc_type === "fc_tra") {
					this.$router.push({ name: "Official", params: { id: v.id } });
				} else {
					this.$router.push({ name: "Credit", params: { id: v.id } });
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/mixins/mixin";
.contents {
	width: 95%;
	margin: auto;
	border-radius: 4px;
	background-color: #ffffff;
	padding-bottom: 25px;
	margin-top: 10px;
	.lotteryInfo {
		padding-top: 30px;
		font-size: 16px;
		color: #333333;
		text-align: center;
	}
	.lotteryTime {
		padding-top: 7px;
		font-size: 12px;
		color: #999999;
		text-align: center;
	}
	.detailInfo {
		padding-top: 40px;
		background-size: 150px;
		p {
			border-bottom: 1px dashed #eee;
			line-height: 25px;
			font-size: 12px;
			color: #333333;
			margin: 8px;
			overflow: hidden;
			span {
				padding-left: 10px;
			}
			.tableName {
				font-size: 12px;
				color: #0089ff;
				text-align: left;
				padding-left: 0;
			}
			.orgColor {
				color: #ff5e00;
			}
			.numColor {
				@include fontColor();
			}
			.broColor {
				color: #901e1b;
			}
		}
	}
}
.memCash-confirms {
	width: 95%;
	margin: 0 auto;
	margin-left: 10px;
	margin-right: 10px;
	padding-top: 30px;
	padding-bottom: 30px;
	a {
		width: 48%;
		height: 40px;
		color: #ffffff;
		@include bgColor();
		text-align: center;
		border: none;
		border-radius: 4px;
		display: block;
		float: left;
		line-height: 40px;
		font-size: 14px;
	}
}
.memCash-confirm {
	width: 90%;
	margin: 0 auto;
	padding-top: 30px;
	padding-bottom: 30px;
	/*position: absolute;
            bottom: 30px;*/
	a {
		width: 48%;
		height: 40px;
		color: #ffffff;
		@include bgColor();
		text-align: center;
		border: none;
		border-radius: 4px;
		display: block;
		float: left;
		line-height: 40px;
		font-size: 14px;
	}
	.withdraw {
		margin: 0 10px 0 0;
	}
}
.Unsettlement {
	background: url("../../../assets/images/userCenter/mrecord/unsettlement.png") top right
		no-repeat;
}
.Won {
	background: url("../../../assets/images/userCenter/mrecord/won.png") top right no-repeat;
}
.Missed {
	background: url("../../../assets/images/userCenter/mrecord/missed.png") top right no-repeat;
}
.Cancelled {
	background: url("../../../assets/images/userCenter/mrecord/cancelled.png") top right no-repeat;
}
.with {
	background: url("../../../assets/images/userCenter/mrecord/with.png") top right no-repeat;
}
</style>
<style lang="scss">
.van-dialog__content {
	color: #000000;
	text-align: center;
	font-size: 14px;
	padding: 0 12px !important;
	margin-bottom: 20px;
}
</style>

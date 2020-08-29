<template>
	<van-row class="details">
		<van-row class="details-title">
			<van-row v-if="isLogin" class="details-title-user">
				<p>
					账号：<span>{{ userMessage.username }}</span
					>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 余额：<span>{{
						userMessage["money"] | formatPenny
					}}</span>
				</p>
				<div class="right_ref">
					<refresh></refresh>
				</div>
			</van-row>
			<van-row class="details-title_name">
				[{{ currentLottery.game_name }}]{{ currentLottery.play_name }}
			</van-row>
			<van-row class="details-title_list">
				<van-col span="12" class="info_left">
					<span>{{ currentLottery.username }}</span>
					<van-image src="https://static.cloudywoo.com/img/userIcon/80.jpg" />
				</van-col>
				<van-col span="12" class="info_left info_right">
					<i class="icon-fans" />
					<span>{{ currentLottery.fan }}</span>
				</van-col>
			</van-row>
			<van-row class="details-title_explain">
				<van-row>
					{{ currentLottery.play_name
					}}<span>{{ userTotal.length }}期</span>统计，命中<span
						>{{ userTotal.quanZ }}期</span
					>， 命中率<span>{{ userTotal.lianRate }}%</span>，最大<span
						>连中{{ userTotal.lianZ }}期</span
					>，最大<span>连错{{ userTotal.lianC }}期</span>，当前<span
						>{{ userTotal.nowLianZ }}连中</span
					>，<span>{{ userTotal.nowLianC }}连错</span>
				</van-row>
			</van-row>
		</van-row>
		<van-row class="details-list">
			<van-row class="details-list_head">
				<van-col span="4">期数</van-col>
				<van-col span="8">预测结果</van-col>
				<van-col span="8">当期结果</van-col>
				<van-col span="4">准确</van-col>
			</van-row>
			<van-row class="details-list_current">
				<van-col span="4">
					<p v-if="nextIdShow()">----</p>
					<p v-else>{{ periods.period | formatString(-5) }}</p>
				</van-col>
				<van-col span="8">
					<span v-for="(i, indexs) in nextUserPlan.expect" :key="indexs">
						<em v-if="indexs !== 0">,</em>
						<em>{{ i.text }}</em>
					</span>
				</van-col>
				<van-col span="8">
					<p v-if="nextIdShow()">正在开奖...</p>
					<van-row v-else class="details-list_current_data">
						<span>开奖剩余</span>
						<lottery-countdown
							:lottery-id="currentLottery.fc_id"
							@otime="getTime"
							@getUserPlan="setgetUser"
						></lottery-countdown>
					</van-row>
				</van-col>
				<van-col span="4" class="killRight">
					<span
						v-if="
							resultDown.otimeState === -1 ||
								!periods.period ||
								!isLogin ||
								currentLottery.play_name === '独胆' ||
								nextIdShow()
						"
						class="noPeriods"
						>跟投</span
					>
					<span v-else @click="withBets">{{ nextUserPlan.corrText }}</span>
				</van-col>
			</van-row>
			<kill-list :list="userPlan" class="details-list_period"></kill-list>
			<van-popup v-model="popupShow" class="details-list_popup">
				<bet-popup
					:bet-order="betMessage.newOrder"
					:bet-tmp-code="$helps.cloneDeep(betMessage.betCodes)"
					:b-money="Number(betMessage.betMoney)"
					:bet-money-show="true"
					@bets-order-off="betsOrderOff"
					@getCross="popupShow = false"
				></bet-popup>
			</van-popup>
		</van-row>
	</van-row>
</template>

<script>
import plan from "../../assets/js/plan";
import killList from "./js/kill_list";
import lotteryCountdown from "../betting/lotteryCountdown";
import { mapState, mapGetters, mapActions } from "vuex";
import betPopup from "../betting/credit/betPopup";
import refresh from "../../components/refresh";
import { PlayingCredit } from "@server/singularity";
import chatWebSocket from "../../mixins/chatWebSocket";
export default {
	name: "KillerPlanDetails",
	components: { killList, lotteryCountdown, betPopup, refresh },
	mixins: [chatWebSocket],
	data() {
		return {
			currentLottery: {},
			searchParams: {
				userId: "",
				game: "",
				gameId: "",
				playId: ""
			},
			userTotal: {},
			nextUserPlan: [],
			userPlan: [],
			popupShow: false,
			betMessage: {
				newOrder: [],
				betCodes: [],
				betMoney: 1
			},
			startUpSocket: true,
			resultDown: {},
			setTime: null,
			one: true
		};
	},
	computed: {
		...mapState({
			userMessage: state => state.user.userMessage,
			periods: state => state.lottery.period,
			isLogin: state => state.user.isLogin,
			webCommonWap: state => state.common.webCommonWap
		}),
		...mapGetters(["webData"])
	},
	created() {
		clearInterval(this.setTime);
		if (this.$route.query.item) {
			this.currentLottery = JSON.parse(this.$route.query.item);
			this.searchParams.userId = this.currentLottery.userid;
			this.searchParams.game = this.currentLottery.class;
			this.searchParams.gameId = this.currentLottery.gameid;
			this.searchParams.playId = this.currentLottery.playid;
			this.returnCurrent(this.currentLottery);
		} else {
			this.returnCurrent();
		}
	},
	methods: {
		nextIdShow() {
			let show = false;
			if (this.periods.period !== "---" && this.userPlan.length) {
				show = Number(this.periods.period) - Number(this.userPlan[0].period) > 1;
			}
			if (show && this.one) {
				this.setTime = setInterval(() => {
					this.getUserPlan();
				}, 5000);
				this.one = false;
			}
			return show;
		},
		returnCurrent(n) {
			let short_name = "";
			if (n) {
				short_name = n.class;
				this.getChatInfo(n.fc_id);
			} else {
				let list = this.$stores.get("gameListTop"),
					id = this.$route.query.id;
				list.forEach(i => {
					if (i.id === id) {
						this.currentLottery = i;
					}
				});
				short_name = this.currentLottery.class;
				this.getChatInfo(this.currentLottery.fc_id);
				this.searchParams.userId = this.currentLottery.userid;
				this.searchParams.game = this.currentLottery.class;
				this.searchParams.gameId = this.currentLottery.gameid;
				this.$stores.set("gameId", this.currentLottery.gameid);
				this.searchParams.playId = this.currentLottery.playid;
			}
			this.$api
				.request("GET_PALY_LIST", {
					shortName: short_name
				})
				.then(
					success => {
						let playList = success.Data.playListData[this.currentLottery.class];
						playList.forEach(i => {
							if (i.PlayId === Number(this.currentLottery.playid)) {
								this.currentLottery.col_name = i.ColName;
								this.currentLottery.play_name = i.PlayName;
								this.currentLottery.short_name = i.ShortName;
							}
						});
						this.$stores.set("planLottery", JSON.stringify(this.currentLottery));
						this.getUserPlan();
					},
					error => {
						this.$root.$emit("handleError", error);
					}
				);
			this.getUserPlan();
		},
		// 查询是否可以分享到聊天室
		getChatInfo(fc_id) {
			if (!this.isLogin) return;
			if (this.webCommonWap.ChatRoom !== 1) return;
			this.$api.request("API_GET_DEFAULT_CHAT").then(
				success => {
					let list = success.Data.fc_id;
					this.startUpSocket = list.indexOf(fc_id) > -1;
					if (this.startUpSocket) {
						this.startLinkChat(success.Data);
					}
				},
				error => {
					this.$root.$emit("handleError", error);
				}
			);
		},
		// 返回的倒计时信息
		getTime(val) {
			this.resultDown = val;
		},
		setgetUser() {
			this.getUserPlan();
		},
		getUserPlan() {
			this.$api.request("GET_USER_PLAN", this.searchParams).then(
				success => {
					let data = success.Data,
						next = success.Next,
						nextData = {},
						keyNow = this.currentLottery.col_name,
						list = [];
					data.forEach(i => {
						list.push(plan.returnList(i, keyNow, this));
					});
					this.userTotal = plan.totalList(list);
					next.forEach(j => {
						let data = plan.returnNext(j, keyNow, this);
						nextData = data;
					});
					this.nextUserPlan = nextData;
					this.userPlan = list;
				},
				error => {
					this.$root.$emit("handleError", error);
				}
			);
		},
		betsOrderOff(val) {
			let order = this.$helps.cloneDeep(this.betMessage.newOrder);
			this.getLotteryGroup(order, Number(val));
		},
		getLotteryGroup(bet, betMoney) {
			let fast = this.$lotteryPub.isFastThree(this.currentLottery.fc_id),
				url = "API_GET_FC_COMMON_INDEX",
				num = "";
			if (fast) {
				url = "API_GET_TRA_COMMON_INDEX_K3";
				num = 1;
			}
			this.$api
				.request(url, {
					fc_id: this.currentLottery.fc_id,
					handicap: 1,
					is_plan: 1
				})
				.then(
					success => {
						const Data = success.Data,
							type = PlayingCredit.generatePlayingMessage(
								this.currentLottery.fc_id,
								Data.cdata,
								num
							);
						let data = plan.getOdds(this.currentLottery, type, bet);
						this.killerBet(data, betMoney);
					},
					error => {
						this.$root.$emit("handleError", error);
					}
				);
		},
		// 下注
		killerBet(data, betMoney) {
			const tmpOrder = this.$helps.cloneDeep(data);
			tmpOrder.forEach(i => {
				i.bet = Number(betMoney);
				delete i.odds;
			});
			let url = "API_POST_FC_BET",
				fast = this.$lotteryPub.isFastThree(this.currentLottery.fc_id);
			if (fast) url = "API_POST_BET_K3";
			this.$api
				.request(url, {
					fc_id: this.currentLottery.fc_id,
					params: tmpOrder,
					is_plan: 1
				})
				.then(
					() => {
						this.$helps.hideLoading();
						this.$root.$emit("getUserMessage"); // 刷新会员余额
						this.popupShow = false;
						if (this.startUpSocket && this.userMessage.is_share === 1) {
							this.sendChatSocket(tmpOrder, this.currentLottery);
						}
						return this.$root.$emit("handleError", "下注成功");
					},
					error => {
						this.$helps.hideLoading();
						this.$root.$emit("handleError", error);
					}
				);
		},
		...mapActions(["setCurrentLottery"]),
		withBets() {
			this.setCurrentLottery(Number(this.currentLottery.fc_id));
			this.betMessage.newOrder = [];
			this.betMessage.betCodes = [];
			this.nextUserPlan.expect.forEach(i => {
				let order = {
						bet: 0,
						content_id: 0,
						fc_id: this.currentLottery.fc_id,
						handicap: 1,
						odds: "0",
						play_details: "",
						play_id: Number(this.currentLottery.playid),
						source_type: Number(this.$stores.get("de"))
					},
					betCode = {
						place: this.currentLottery.play_name,
						play_id: Number(this.currentLottery.playid)
					};
				order.play_details = i.text;
				betCode.play_details = i.text;
				this.betMessage.newOrder.push(order);
				this.betMessage.betCodes.push(betCode);
			});
			this.popupShow = true;
		},
		beforeDestroy() {
			if (this.setTime) {
				//如果定时器还在运行 或者直接关闭，不用判断
				clearInterval(this.setTime); //关闭
			}
		}
	}
};
</script>

<style lang="scss">
.details {
	margin-bottom: 30px;
	@at-root #{&}-title {
		height: 180px;
		padding-top: 70px;
		background: url("../../assets/images/plan/kill/killer_bj.png") no-repeat;
		background-size: 100% 100%;
		@at-root #{&}-user {
			position: absolute;
			left: 10px;
			right: 10px;
			top: 0;
			background-color: #ffffff;
			border-radius: 0 0 4px 4px;
			p {
				height: 40px;
				line-height: 40px;
				font-size: 12px;
				color: #666666;
				text-align: center;
				span {
					color: #ff251b;
				}
			}
			.right_ref {
				width: 40px;
				height: 24px;
				position: absolute;
				border-radius: 15px 0 0 15px;
				background: linear-gradient(to right, #f76b1c 50%, #fda471);
				right: 0;
				top: 8px;
				text-align: center;
				line-height: 1.5;
			}
		}
		@at-root #{&}_name {
			text-align: center;
			color: #ffffff;
			font-size: 14px;
			font-weight: 600;
		}
		@at-root #{&}_list {
			text-align: center;
			margin-top: 15px;
			margin-bottom: 15px;
			.info_left {
				display: inline-block;
				padding-right: 5px;
				i {
					font-size: 14px;
					float: left;
					&:before {
						color: #ffffff;
					}
				}
				.van-image {
					width: 14px;
					float: right;
					margin-right: 2px;
					img {
						border-radius: 50%;
					}
				}
				span {
					float: right;
					font-size: 12px;
					color: #ffffff;
					line-height: 16px;
					margin-left: 2px;
				}
			}
			.info_right {
				padding-left: 5px;
				span {
					float: left;
				}
			}
		}
		@at-root #{&}_explain {
			width: 80%;
			margin: 0 10%;
			background-color: rgba(255, 255, 255, 0.6);
			border-radius: 5px;
			div {
				font-size: 12px;
				padding: 10px;
				color: #003993;
				line-height: 20px;
				span {
					color: #d0021b;
				}
			}
		}
	}
	@at-root #{&}-list {
		text-align: center;
		font-size: 12px;
		line-height: 30px;
		margin-top: -30px;
		background-color: rgba(255, 255, 255, 0.6);
		color: #666666;
		@at-root #{&}_head {
			color: #333333;
			font-weight: 600;
		}
		@at-root #{&}_current {
			em {
				font-style: normal;
			}
			@at-root #{&}_data {
				display: -webkit-box;
				.LotteryCountdown-row {
					margin: 6px;
					.countdown {
						color: #ef384a;
						font-size: 14px;
						margin: -5px;
					}
				}
			}
			.killRight {
				span {
					border-radius: 2px;
					font-size: 12px;
					color: #ffffff;
					line-height: 20px;
					padding: 3px 6px;
					background: linear-gradient(#c245fb, #e039fe);
				}
				span.noPeriods {
					background: #eeeeee;
					color: #999999;
				}
			}
		}
		@at-root #{&}_period {
			.van-row {
				background-color: #ffffff;
				&:nth-child(2n) {
					background-color: #f9f6f6;
				}
				span {
					display: inline-block;
					em {
						color: #666666;
						font-style: normal;
						&.active {
							color: #ff0000;
						}
					}
				}
				.killRight {
					span {
						border-radius: 2px;
						font-size: 12px;
						color: #ffffff;
						line-height: 20px;
						padding: 1px 6px;
						background: linear-gradient(#ff5a4a, #ff2419);
					}
					&.error {
						span {
							background: linear-gradient(#69d314, #52c240);
						}
					}
				}
			}
		}
		@at-root #{&}_popup {
			width: 300px;
			max-height: 352px;
			border-radius: 4px;
			position: fixed;
			overflow: hidden;
		}
	}
}
</style>

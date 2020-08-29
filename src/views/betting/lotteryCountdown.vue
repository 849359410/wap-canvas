<template>
	<div class="LotteryCountdown">
		<van-row type="flex" class="LotteryCountdown-row">
			<van-col
				v-show="$route.name === 'BettingHall' || $route.name === 'PlanLottery'"
				:span="$route.name === 'BettingHall' ? 15 : 24"
				class="LotteryCountdown-row--col details_period"
			>
				距离{{ periodsBell || "******" }}期封盘:
			</van-col>
			<van-col
				v-if="resultDown.otimeState === -1 || resultTime.otimeState === -1"
				class="countdown"
			>
				<span>已封盘</span>
			</van-col>
			<van-col v-else span="9" class="LotteryCountdown-row--col details_text">
				<van-count-down
					v-if="times"
					ref="countDown"
					class="times"
					:time="times"
					@finish="finish"
				></van-count-down>
			</van-col>
		</van-row>
	</div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
	name: "LotteryCountdown",
	props: {
		lotteryType: {
			type: Number,
			default: 2
		},
		lotteryId: {
			type: Number,
			default() {
				return {};
			}
		},
		resultTime: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			times: 0,
			periodsBell: "",
			resultDown: ""
		};
	},
	computed: {
		...mapState({
			periods: state => state.lottery.period,
			currentLottery: state => state.lottery.currentLottery
		}),
		...mapGetters(["singleLottery"])
	},
	watch: {
		resultTime(n) {
			this.periodsBell = n.period;
			this.times = n.Countdown ? n.Countdown * 1000 : 0;
			if (this.$route.params.type) this.$store.dispatch("setPeriod", n);
			this.$emit("returnPeriod", n);
		},
		lotteryId: {
			handler(n) {
				if (this.$route.name !== "BettingHall") this.loadCountdown(n);
			},
			deep: true
		}
	},
	created() {
		if (this.lotteryId && this.$route.name !== "BettingHall")
			this.loadCountdown(this.lotteryId);
	},
	methods: {
		finish() {
			this.loadCountdown(this.lotteryId);
			if (this.$route.name !== "BettingHall") {
				this.$root.$emit("handleError", `当前期已结束,开始下一期投注`);
			}
			this.$emit("getUserPlan");
		},
		loadCountdown(id) {
			let api = "API_GET_PC_FC_AUTO_DATA_BY_FC_ID",
				index = this.$route.name,
				type = this.lotteryType;
			if (type === 1) {
				api = "API_GET_FC_PERIOD_TRA";
			} else {
				if (index === "Official" || this.$lotteryPub.isFastThree(id)) {
					api = "API_GET_FC_PERIOD_TRA";
				}
			}
			this.$api
				.request(api, {
					fc_id: id
				})
				.then(
					success => {
						const result = success.Data;
						this.resultDown = result;
						if (result && typeof result !== "undefined") {
							this.times = result.Countdown ? result.Countdown * 1000 : 0;
							// if (this.$route.name === "BettingHall") {
							this.periodsBell = result.period;
							// } else {
							this.$store.dispatch("setPeriod", result);
							// }
							let otimeState = {
								time: result.otimeState,
								id: id
							};
							this.$emit("otime", otimeState);
						} else {
							this.handleCountdownRequestError();
						}
						if (Object.keys(this.$refs).length) {
							this.$refs.countDown.reset(); // 重置倒计时
						}
					},
					() => this.handleCountdownRequestError()
				);
		},
		handleCountdownRequestError() {
			let data = this.singleLottery(this.lotteryId);
			this.$root.$emit("handleError", `请求${data.fc_name || ""}开奖倒计时失败`);
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/betting/lotteryCountdown";
</style>

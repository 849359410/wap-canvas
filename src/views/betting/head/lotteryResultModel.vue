<script>
import LotteryCountdown from "../lotteryCountdown";
import { mapState } from "vuex";
import LotteryResult from "../../../mixins/lotteryResult";
import model from "../../../mixins/model";

export default {
	name: "LotteryResultModel",
	components: { LotteryCountdown },
	mixins: [LotteryResult, model],
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery,
			period: state => state.lottery.period
		})
	},
	watch: {
		currentLottery: {
			handler() {
				this.$store.dispatch("setPeriod", null);
			},
			deep: true
		}
	},
	methods: {
		getOpen() {
			this.$parent.openResults();
		},
		getTime(i) {
			this.$emit("otimeState", i);
		}
	},
	render(h) {
		return (
			<div onClick={() => this.getOpen()}>
				<div class="luckyResultFirst">
					<p>{this.period.period}期</p>
					{h("Lottery-countdown", {
						attrs: {
							class: "countdown"
						},
						props: {
							lotteryId: this.currentLottery.fc_id
						},
						on: {
							otime: this.getTime
						}
					})}
				</div>
				<div class="luckyResultSecond">
					<div class="first">
						<span>{this.$filters.formatString(this.period.pre_period, -3)}期</span>
					</div>
					{this.lotteryModel()}
					<div class="results_more">
						开奖
						<van-icon class="results_more--i" name="arrow-down" />
					</div>
				</div>
			</div>
		);
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/head/lotteryResultModel";
</style>

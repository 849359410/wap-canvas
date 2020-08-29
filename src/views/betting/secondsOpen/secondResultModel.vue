<script>
import { mapState } from "vuex";
import LotteryResult from "../../../mixins/lotteryResult";
import assign from "../../../mixins/assign";
import model from "../../../mixins/model";

export default {
	name: "SecondResultModel",
	mixins: [LotteryResult, model, assign],
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
				this.loadHistoryLotteryResult();
			},
			deep: true
		}
	},
	methods: {
		getOpen() {
			this.$parent.openResults();
		},
		getShow() {
			if (this.firstHistory.period) {
				return <span>{this.$filters.formatString(this.firstHistory.period, -3)}期</span>;
			} else return <span>暂无数据</span>;
		}
	},
	render() {
		return (
			<div onClick={() => this.getOpen()}>
				<div class="luckyResultSecond">
					<div class="first">{this.getShow()}</div>
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

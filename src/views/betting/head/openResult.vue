<script>
import LotteryResult from "../../../mixins/lotteryResult";
import model from "../../../mixins/model";
import assign from "../../../mixins/assign";

export default {
	name: "OpenResult",
	mixins: [LotteryResult, model, assign],
	data() {
		return {
			titleList: [],
			timeList: [
				[
					{ span: 5, text: "期数" },
					{ span: 10, text: "开奖号码" },
					{ span: 3, text: "和值" },
					{ span: 3, text: "大小" },
					{ span: 3, text: "单双" }
				],
				[
					{ span: 5, text: "期数" },
					{ span: 19, text: "开奖号码" }
				],
				[
					{ span: 5, text: "期数" },
					{ span: 7, text: "开奖号码" },
					{ span: 4, text: "和值" },
					{ span: 4, text: "大小" },
					{ span: 4, text: "单双" }
				]
			]
		};
	},
	created() {
		if (this.isTimeTime) this.titleList = this.timeList[0];
		else if (this.isFastThree) this.titleList = this.timeList[2];
		else this.titleList = this.timeList[1];
	},
	methods: {
		getReturnPeriods(period) {
			if (this.isFastThree) {
				return this.$filters.formatString(period, -5);
			} else return this.$filters.formatString(period, -3);
		}
	},
	render() {
		return (
			<div
				class={[
					"resultsList",
					this.isFastThree && this.iFastSecondOpen ? "resultsListSecond" : ""
				]}
			>
				<van-row class="resultsList_title">
					{this.titleList.map(i => {
						return <van-col span={i.span}>{i.text}</van-col>;
					})}
				</van-row>
				{this.otherHistory.map(i => {
					return (
						<van-row class="resultsList_list">
							<van-col
								span="5"
								class={[
									"firstChildCol",
									this.isHappyLottery || this.isMarkSixLottery
										? "happyPeriod"
										: ""
								]}
							>
								{this.getReturnPeriods(i.period)}
							</van-col>
							{this.openLotteryModel(i)}
						</van-row>
					);
				})}
			</div>
		);
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/head/openResult";
</style>

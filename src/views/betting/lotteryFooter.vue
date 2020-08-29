<script>
import lotteryResult from "../../mixins/lotteryResult";
export default {
	name: "LotteryFooter",
	mixins: [lotteryResult],
	props: {
		footerObj: {
			type: Object,
			default() {
				return {};
			}
		},
		typeIndex: {
			type: Number,
			default() {
				return 0;
			}
		}
	},
	data() {
		return {
			list: [
				[
					{ text: "历史开奖", img: require("../../assets/images/betting/hostoryNo.png") },
					{ text: "历史开奖", img: require("../../assets/images/betting/history.png") }
				],
				[
					{ text: "走势图表", img: require("../../assets/images/betting/trendNo.png") },
					{ text: "走势图表", img: require("../../assets/images/betting/trend.png") }
				]
			],
			gameImg: require("../../assets/images/betting/game.png")
		};
	},
	methods: {
		goLotteryResult(index) {
			if (index === 0) {
				// 进入历史开奖页面
				this.$router.push({ name: "LotteryResult", params: { id: this.footerObj.id } });
			} else {
				// 进入走势图表页面
				this.$router.push({ name: "TrendMap", params: { id: this.footerObj.id } });
			}
		},
		lottertColumn() {
			this.goLottery(this.footerObj);
		}
	},
	render() {
		return (
			<div class="LotteryFooter">
				<van-row class="LotteryFooter-row">
					{this.list.map((i, val) => {
						if (
							this.isLastSecondOpen(this.footerObj.fc_id) ||
							this.footerObj.fc_maint === 2
						) {
							return (
								<van-col span="8" class="LotteryFooter-row--col">
									<van-image class="img" src={i[0].img} /> {i[0].text}
								</van-col>
							);
						} else {
							return (
								<van-col
									span="8"
									class="LotteryFooter-row--col"
									onClick={() => this.goLotteryResult(val)}
								>
									<van-image class="img" src={i[1].img} /> {i[1].text}
								</van-col>
							);
						}
					})}
					<van-col
						span="8"
						class="LotteryFooter-row--col"
						onClick={() => this.lottertColumn()}
					>
						<van-image class="img" src={this.gameImg} /> 立即游戏
					</van-col>
				</van-row>
			</div>
		);
	}
};
</script>

<style scoped lang="scss">
.LotteryFooter {
	background: url("../../assets/images/betting/lineBj.png") repeat-x 100% 1px;
}
@import "../../assets/css/views/betting/lotteryFooter";
</style>

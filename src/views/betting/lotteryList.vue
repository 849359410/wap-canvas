<script>
import lotteryResult from "../../mixins/lotteryResult";
import LotteryCountdown from "./lotteryCountdown";
import lotteryFooter from "../betting/lotteryFooter";
export default {
	name: "LotteryList",
	components: { lotteryFooter, LotteryCountdown },
	mixins: [lotteryResult],
	props: {
		lottery: {
			type: Array,
			default() {
				return [];
			}
		},
		result: {
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
	methods: {
		lotteryColumn(i) {
			this.goLottery(i);
		}
	},
	render(h) {
		return (
			<van-row class="betting_list">
				{this.lottery.map(i => {
					return (
						<van-col class="betting_list_details" span="24">
							<div
								class="betting_list_details--logo"
								on-click={() => this.lotteryColumn(i)}
							>
								<van-image class="img" src={i.fc_logo} />
								<van-row
									type="flex"
									class={[
										"row",
										this.isLastSecondOpen(i.fc_id)
											? "betting_list_details--logo-p"
											: ""
									]}
								>
									<van-col span="12" class="col">
										{i.fc_name}
									</van-col>
									<van-col span="12" class={["col", "details_text"]}>
										{this.isLastSecondOpen(i.fc_id) ? "立刻开奖" : i.fc_text}
									</van-col>
								</van-row>
								{h(this.isLastSecondOpen(i.fc_id) ? "" : "Lottery-countdown", {
									props: {
										lotteryType: this.typeIndex,
										lotteryId: i.id,
										resultTime: this.result[i.fc_id]
									}
								})}
								<van-icon name="arrow" />
							</div>
							{h("lottery-footer", {
								props: {
									footerObj: i,
									typeIndex: this.typeIndex
								},
								ref: "lotteryFooter"
							})}
						</van-col>
					);
				})}
			</van-row>
		);
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/betting/lotteryList";
</style>

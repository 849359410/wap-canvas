<template>
	<div>
		<div class="stopLottery">
			<p>
				剩余开奖次数：<span>
					{{ second.quickTime || 0 }}
				</span>
			</p>
			<p>
				本次中奖金额：<span>
					{{
						autos.winState === 1 && autos.betResult ? autos.betResult.toFixed(3) : 0
					}}</span
				>
			</p>
			<van-image :src="closeKs" @click="stopLotteryOrder"></van-image>
		</div>
	</div>
</template>

<script>
import LotteryResult from "../mixins/lotteryResult";
export default {
	name: "StopLottery",
	mixins: [LotteryResult],
	props: {
		autos: {
			type: Object,
			default() {
				return {};
			}
		},
		second: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			closeKs: require("../assets/images/components/closeKs.png")
		};
	},
	methods: {
		stopLotteryOrder() {
			if (this.isLastSecondOpen(this.$route.params.id) && this.second.quickTime > 0) {
				this.second.whetherShow = true;
				this.second.sign = 1;
				this.second.text1 = "开奖进行中，是否中断开奖";
				this.second.text2 = "";
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import "../assets/css/views/components/stopLottery";
</style>

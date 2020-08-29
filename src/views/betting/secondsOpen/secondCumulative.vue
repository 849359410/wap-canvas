<template>
	<div class="resultsQuick">
		<div class="resultsQuick_left">
			<p>
				累计投注：<span> {{ accumulate | formatPenny }}</span>
			</p>
			<p>
				累计盈利：<span :class="secondDe.cumulative - accumulate > 0 ? 'spanColor' : ''">
					{{ (secondDe.cumulative - accumulate).toFixed(3) }}
				</span>
			</p>
		</div>
		<div class="resultsQuick_right">
			<p
				:class="isFastThree ? '' : 'moneyWin'"
				:style="isFastThree ? 'line-height: 19px' : ''"
			>
				累计中奖:
				<span>
					{{
						secondDe.cumulative > 0
							? secondDe.cumulative.toFixed(3)
							: secondDe.cumulative
					}}</span
				>
			</p>
			<p v-if="isFastThree" class="resultList">
				<span
					v-for="(vv, index) in autos"
					:key="index"
					:style="isFastThree ? 'margin: 0' : ''"
					class="red-ball"
					:class="[returnClass(vv)]"
				>
				</span>
			</p>
		</div>
	</div>
</template>

<script>
import lotteryResult from "../../../mixins/lotteryResult";
export default {
	name: "SecondCumulative",
	mixins: [lotteryResult],
	props: {
		secondDe: {
			type: Object,
			default() {
				return {};
			}
		},
		accumulate: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			autos: ["1", "1", "1"]
		};
	},
	methods: {
		returnClass(v) {
			return [
				"Dice",
				{
					Dice2: v === 2,
					Dice3: v === 3,
					Dice4: v === 4,
					Dice5: v === 5,
					Dice6: v === 6
				}
			];
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/secondsOpen/secondCumulative";
</style>

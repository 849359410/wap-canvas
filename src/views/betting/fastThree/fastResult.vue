<template>
	<van-row class="fastThree--dataList">
		<van-col v-if="iFastSecondOpen" class="period" span="4">
			<span v-if="firstHistory.period">{{ firstHistory.period | formatString(-5) }}期</span>
			<span v-else>暂无数据</span>
		</van-col>
		<van-col v-else class="period" span="4">
			{{ period.pre_period | formatString(-5) }}期
		</van-col>
		<van-col class="resultList" span="5">
			<span
				v-for="(vv, index) in firstHistory.number"
				:key="index"
				class="red-ball"
				:class="[returnClass(vv)]"
			>
			</span>
		</van-col>
		<van-col span="3">
			<span>{{ firstHistory.sum }}</span>
		</van-col>
		<van-col span="3">
			<span :class="changeColor(firstHistory.size)">{{ firstHistory.size }}</span>
		</van-col>
		<van-col span="3">
			<span :class="changeColor(firstHistory.single)">{{ firstHistory.single }}</span>
		</van-col>
		<van-col class="results_more" span="4">
			开奖
			<van-icon name="arrow-down" />
		</van-col>
	</van-row>
</template>

<script>
import lotteryResult from "../../../mixins/lotteryResult";
export default {
	name: "FastResult",
	mixins: [lotteryResult],
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
		},
		changeColor(name) {
			let className = "";
			switch (name) {
				case "大":
					className = "bigColor";
					break;
				case "小":
					className = "smallColor";
					break;
				case "单":
					className = "singleColor";
					break;
				case "双":
					className = "doubleColor";
					break;
			}
			return className;
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/fastThree/fastResult";
</style>

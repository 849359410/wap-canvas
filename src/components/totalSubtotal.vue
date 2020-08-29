<template>
	<van-row>
		<van-tabbar :placeholder="true">
			<van-row class="moneyDetailed--total">
				<van-col span="24">
					<span
						>小计:<b>{{ moneyCurr.num }}</b
						>笔,</span
					>
					<span
						>金额:<b>{{ moneyCurr.money }}</b
						>元,</span
					>
					<span
						>{{ profit }}:<b>{{ moneyCurr.dis_money }}</b
						>元</span
					>
				</van-col>
				<van-col span="24">
					<span
						>总计:<b>{{ tatal.num }}</b
						>笔,</span
					>
					<span
						>金额:<b>{{ tatal.money || tatal.valid_bet || 0 }}</b
						>元,</span
					>
					<span
						>{{ profit }}:<b>{{ tatal.dis_money || tatal.result || 0 }}</b
						>元</span
					>
				</van-col>
			</van-row>
		</van-tabbar>
	</van-row>
</template>

<script>
export default {
	name: "TotalSubtotal",
	props: {
		moneyCurr: {
			type: Object,
			default() {
				return {};
			}
		},
		tatal: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			profit: ""
		};
	},
	created() {
		if (this.$route.name === "Mrecord" || this.$route.name === "detailed") {
			this.profit = "盈亏";
		} else {
			this.profit = "优惠";
		}
	}
};
</script>

<style scoped lang="scss">
.moneyDetailed--total {
	z-index: 10;
	background: rgba(254, 252, 235, 1);
	text-align: center;
	color: #333333;
	padding: 3px 0;
	div {
		line-height: 22px;
		height: 22px;
		color: #333333;
		span {
			font-size: 12px;
			margin-left: 15px;
			b {
				color: #ff1042;
			}
		}
	}
}
</style>

<template>
	<van-row class="todayProfit">
		<van-row class="todayProfit--box">
			<van-col span="24" class="person_top">
				<van-row class="person_img">
					<van-col span="24" class="add_p">
						盈利金额(元)
					</van-col>
					<van-col
						v-if="data.totalMoney"
						span="24"
						style="font-size: 20px;color: white;line-height: 20px;padding: 20px 0;"
					>
						{{ data.totalMoney | formatPenny }}
					</van-col>
				</van-row>
			</van-col>
			<van-col class="person_FanDian">
				<span
					>注：盈亏=中奖-投注+活动优惠+返点(自身+下级){{
						data.is_chat_red === 1 ? "+聊天室红包" : ""
					}}</span
				>
			</van-col>
			<van-col class="person_content clearfix">
				<div v-for="(item, index) in lists" :key="index" class="person_content_liu">
					<div>
						<p class="top_p">￥{{ item.money | formatPenny }}</p>
						<p class="bottom_p">{{ item.text }}</p>
					</div>
				</div>
			</van-col>
		</van-row>
	</van-row>
</template>

<script>
export default {
	name: "TodayProfit",
	data() {
		return {
			data: {},
			searchParams: {
				timeType: "1"
			},
			lists: []
		};
	},
	created() {
		this.loadReport();
	},
	methods: {
		loadReport() {
			this.$helps.showLoading();
			this.$api.request("API_GET_PERSONAL_REPORT", this.searchParams).then(
				success => {
					this.data = success.Data;
					//中奖金额
					this.data.win = parseFloat(
						success.Data.valid_bet_fc +
							success.Data.valid_bet_fc_tra +
							success.Data.result_fc +
							success.Data.result_fc_tra
					).toFixed(3);
					//充值金额
					this.data.rechargeMoney = parseFloat(
						success.Data.catm_in_money +
							success.Data.ol_in_money +
							success.Data.bank_in_money -
							success.Data.ol_in_money
					).toFixed(3);
					//提现金额
					this.data.outMoney = parseFloat(
						success.Data.catm_out_money + success.Data.bank_out_money
					).toFixed(3);
					//返点
					this.data.rebate = parseFloat(
						success.Data.own_rebate + success.Data.down_rebate
					);
					//投注金额
					this.data.validBet = parseFloat(
						success.Data.valid_bet_fc + success.Data.valid_bet_fc_tra
					).toFixed(3);
					//今日盈亏
					this.data.totalMoney = parseFloat(
						this.data.win -
							this.data.validBet +
							this.data.rebate +
							success.Data.dis_dep +
							success.Data.red_money
					).toFixed(3);
					let redBagData = { money: success.Data.red_money, text: "聊天室红包" };
					this.lists = [
						{ money: this.data.validBet, text: "投注金额" },
						{ money: this.data.win, text: "中奖金额" },
						{ money: success.Data.dis_dep, text: "优惠活动" },
						{ money: success.Data.down_rebate, text: "下级返点" },
						{ money: this.data.rechargeMoney, text: "充值金额" },
						{ money: this.data.outMoney, text: "提现金额" },
						{ money: success.Data.own_rebate, text: "自身返点" }
					];
					if (success.Data.is_chat_red === 1) {
						this.lists.push(redBagData);
					}
				},
				error => this.$root.$emit("handleError", error)
			);
			this.$helps.hideLoading();
		}
	}
};
</script>
<style lang="scss" scoped>
@import "../../../assets/css/views/userCenter/todayProfit/todayProfit";
</style>

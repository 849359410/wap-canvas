<template>
	<div class="LongSon">
		<van-list v-if="data.length" finished-text="已显示全部" :finished="true">
			<van-cell v-for="(item, index) in data" :key="index">
				<long-sub :item="item" @SelectCode="betClick"></long-sub>
			</van-cell>
		</van-list>
		<no-data v-else :img-age="img"></no-data>
		<!-- 注单弹出框 -->
		<van-popup v-model="popupShow" :class="popupShow ? 'credit_up' : 'credit_down'">
			<bet-popup
				:bet-order="order"
				:bet-tmp-code="order"
				:b-money="betMoney"
				@bets-order-off="betsOrderOff"
				@getCross="getCross"
			></bet-popup>
		</van-popup>
		<long-footer
			:money="betMoney"
			:bet-num="betNum"
			@del="del"
			@inBetMoney="inBetMoney"
			@MoneyRule="moneyRule"
			@handlerBetting="handlerBetting"
		></long-footer>
	</div>
</template>

<script>
import { CDN_HOST } from "../../config/dictionary";
import longSub from "./longSub";
import noData from "../../components/noData";
import longFooter from "./longFooter";
import betPopup from "../betting/credit/betPopup";

export default {
	name: "LongSon",
	components: { longSub, noData, longFooter, betPopup },
	data() {
		return {
			data: [],
			timeData: null,
			popupShow: false,
			order: [],
			betNum: 0,
			betMoney: "",
			lotteryID: 0,
			img: require("../../assets/images/chimera/clNodata.png")
		};
	},
	watch: {
		order: {
			handler() {
				this.betNum = this.order.length;
			},
			deep: true
		}
	},
	created() {
		this.getData();
		this.timeData = setInterval(() => {
			this.getData();
			this.initializeBetCode();
			this.popupShow = false;
		}, 10000);
	},
	beforeDestroy() {
		window.clearInterval(this.timeData);
		this.timeData = null;
	},
	methods: {
		getData() {
			this.$helps.showLoading();
			const LOTTERY_ICON_LIST = this.$helps.getDictionary("EG_LOTTERY_ICON_LIST");
			this.$api
				.request("API_GET_LONG_QUERY_DATA_PC", {
					fc_id: 0
				})
				.then(
					success => {
						this.$helps.hideLoading();
						const data = success.Data;
						// 连开期数排序(从大到小)
						data.sort((a, b) => b.length - a.length);
						let eData = [];
						// 添加彩种logo
						data.forEach(obj => {
							LOTTERY_ICON_LIST.forEach(v => {
								if (v.name.indexOf(obj.fc_id) > -1) {
									obj.img = `${CDN_HOST}/img/lottery/eg_y/${v.id}.png`;
								}
							});
							obj.Odds.forEach(i => {
								i.active = false;
							});
							if (obj.length >= 5) eData.push(obj);
						});
						this.data = eData;
					},
					error => this.$root.$emit("handleError", error)
				);
		},
		del() {
			this.betMoney = "";
			this.initializeBetCode();
		},
		inBetMoney(money) {
			this.betMoney = money;
		},
		moneyRule(money) {
			if (money) this.betMoney = parseFloat(money).toString();
		},
		// 初始化注单号码
		initializeBetCode() {
			this.order = [];
			this.data.forEach(i => {
				i.Odds.forEach(item => {
					item.active = false;
				});
			});
		},
		betClick(data, name) {
			if (!name) return;
			if (this.order.length) this.order = [];
			this.data.forEach(i => {
				i.Odds.forEach(item => {
					item.active = item.id === data.id;
				});
			});
			this.lotteryID = data.fc_id;
			this.order.push({
				play_id: data.play_id,
				content_id: data.id,
				play_details: data.content_name,
				fc_id: data.fc_id,
				handicap: data.handicap,
				source_type: Number(this.$stores.get("de")),
				odds: data.odds,
				place: name
			});
		},
		handlerBetting() {
			if (!this.order.length) return this.$root.$emit("handleAlert", "请选择注单");
			if (Number(this.betMoney) < 1)
				return this.$root.$emit("handleError", "下注金额不能小于1元");
			// 下注
			this.order.forEach(i => {
				i.bet = Number(this.betMoney);
			});
			this.popupShow = true;
		},
		betsOrderOff() {
			this.placeOrder();
			this.popupShow = false;
		},
		async placeOrder() {
			await this.$api
				.request("API_POST_FC_BET", {
					fc_id: this.lotteryID,
					params: this.order
				})
				.then(
					() => {
						this.$root.$emit("getUserMessage"); // 刷新会员余额
						this.betMoney = "";
						return this.$root.$emit("handleAlert", "下注成功");
					},
					error => this.$root.$emit("handleError", error)
				);
			this.initializeBetCode();
		},
		getCross() {
			this.popupShow = false;
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/chimera/longSon";
</style>

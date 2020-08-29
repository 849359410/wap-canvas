<template>
	<van-row class="middle_contentBox">
		<!--微信支付宝扫码方式-->
		<scan-code
			v-if="[1, 17, 18, 19, 20].indexOf(itemList.passTrpe) > -1"
			:item-list="itemList"
			:acount-type="acountType"
			:recharge-money="money"
			:money-choose="moneyVal"
			@checkMoney="checkMoneyChildLimit"
			@depositChannel="depositChannel"
		></scan-code>
		<!--在线支付-->
		<online-payments
			v-else
			:item-list="itemList"
			:acount-type="acountType"
			:rule-content="ruleContent"
			:recharge-money="money"
			:money-choose="moneyVal"
			@depositChannel="depositChannel"
			@checkMoney="checkMoneyChildLimit"
			@bankCodeChild="bankCodePickerChild"
		></online-payments>
		<van-row v-if="itemList.passTrpe" class="setMoneyr_submyOrder">
			<van-button @click="payMoney">提交充值订单</van-button>
		</van-row>
		<!--提示文本-->
		<text-prompt v-if="itemList.passTrpe" :item-list="itemList"></text-prompt>
		<!--暂无通道-->
		<noData v-if="!itemList.passTrpe" :no-text="noText"></noData>
	</van-row>
</template>

<script>
import { APP_IMG_HOST } from "../../../config/deploy.config";
import scanCode from "./scanCode";
import onlinePayments from "./onlinePayments";
import textPrompt from "./textPrompt";
import noData from "../../../components/noData";
export default {
	name: "RechargeContent",
	components: { scanCode, onlinePayments, textPrompt, noData },
	props: {
		itemList: {
			type: Object,
			default() {
				return {};
			}
		},
		acountType: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			rechargeMoney: null,
			testDate: "",
			ruleContent: "",
			ruleShow: false,
			moneyVal: ["100", "200", "500", "1000", "5000"],
			noText: "暂无通道",
			money: ""
		};
	},
	watch: {
		itemList: {
			handler(n) {
				if (n.banckCodeTypes.length > 0 && n.bankImg === "") {
					n.bankImg = `${APP_IMG_HOST}/img/bank/smallLogo/${n.banckCodeTypes[0].bankId}.png`;
				}
				if (
					[1, 17, 18, 19, 20].indexOf(n.passTrpe) === -1 &&
					n.money_rule.indexOf("-") > -1
				) {
					this.moneyVal = n.money_rule.split("-").slice(0, 5);
				} else if (n.fast_money !== "") {
					this.moneyVal = n.fast_money.split(",").slice(0, 5);
				} else {
					this.moneyVal = ["100", "200", "500", "1000", "5000"];
				}
				if (n.money_rule && n.money_rule.indexOf("-") > -1) {
					let data = n.money_rule.split("-");
					this.ruleContent = `请充值指定金额${data.filter(a => a !== "")}`;
				}
			},
			deep: true
		},
		rechargeMoney: {
			handler(n) {
				this.money = n;
			}
		}
	},
	methods: {
		// 选择通道
		passPickerChild() {
			this.$emit("passPickerChild");
		},
		// 选择银行
		bankCodePickerChild() {
			this.$emit("bankCodePickerChild");
		},
		// 提交订单
		payMoney() {
			this.$emit("payMoney");
		},
		onCopy() {
			this.$root.$emit("handleSuccess", "复制成功");
			event.stopPropagation();
		},
		onError() {
			this.$root.$emit("handleError", "当前浏览器不支持复制");
			event.stopPropagation();
		},
		checkMoneyChildLimit(n) {
			this.rechargeMoney = n;
			this.$emit("checkMoneyChildLimit");
		},
		MoneyRule() {
			let money = this.rechargeMoney;
			this.ruleShow = false;
			if (
				this.itemList.passTrpe > 1 &&
				this.itemList.passTrpe < 17 &&
				this.acountType.length > 0
			) {
				let moneyRule = this.itemList.money_rule;
				switch (true) {
					case moneyRule === "B": // 整10数
						if (Number(money) % 10 !== 0) {
							this.ruleShow = true;
							this.ruleContent = "请充值指定金额10、20...";
							return;
						} else {
							this.ruleContent = "";
						}
						break;
					case moneyRule === "C": // 整100数
						if (Number(money) % 100 !== 0) {
							this.ruleShow = true;
							this.ruleContent = "请充值指定金额100、200...";
							return;
						} else {
							this.ruleContent = "";
						}
						break;
					case moneyRule === "D": // 正整数
						if (parseInt(Number(money)) === Number(money)) {
							this.ruleShow = false;
						} else {
							this.ruleShow = true;
							this.ruleContent = "充值金额只能为整数";
						}
						break;
					case moneyRule.indexOf("-") > -1: // 指定金额
						if (
							!moneyRule
								.split("-")
								.some(
									j =>
										this.$helps.numberZoom(money, 3) ===
										this.$helps.numberZoom(j, 3)
								)
						) {
							this.ruleShow = true;
							let data = moneyRule.split("-");
							this.ruleContent = `请充值指定金额${data.filter(a => a !== "")}`;
							return;
						}
						break;
					default:
						// 任意金额(包含2位内小数)
						this.ruleShow = false;
				}
			}
		},
		// 存款通道
		depositChannel(n) {
			this.$emit("confirm", n);
		}
	}
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/views/userCenter/recharge/rechargeContent";
</style>

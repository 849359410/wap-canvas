<template>
	<van-row v-if="itemList.banckCodeTypes" class="recharge_scanCode">
		<van-cell-group class="scanCode_box">
			<van-cell>
				选择通道：
				<van-radio-group v-model="radio" class="scanCode_checkbox">
					<van-radio
						v-for="(item, index) in acountType"
						:key="index"
						:name="index"
						:class="radio === index ? 'van-radio-two' : ''"
						shape="square"
						@click="activeSm(item)"
						>{{ item.name }}
						<span>({{ item.limit_low }}-{{ item.limit_max }}元)</span></van-radio
					>
				</van-radio-group>
			</van-cell>
			<van-cell
				v-if="itemList.banckCodeTypes.length > 1 && itemList.passTrpe > 1"
				:center="true"
				:is-link="itemList.banckCodeTypes.length > 1"
				arrow-direction="down"
				@click="bankChild"
			>
				<template #title>
					选择银行：
					<img class="bank_img" :src="itemList.bankImg" alt="" />
					<span>{{ itemList.bankCodeName }}</span>
				</template>
			</van-cell>
			<choose-money
				ref="onlineMoney"
				:money-choose="moneyChoose"
				class="online_money"
				:recharge-money="rechargeMoney"
				@callCheckMoney="checkMoneyChildLimit"
			>
				<div class="slotMoney">
					充值金额：<span v-if="itemList.money_rule.indexOf('-') > -1">{{
						ruleContent
					}}</span>
					<span v-if="itemList.remark" style="color: #ff1042; font-weight: bold;"
						>（{{ itemList.remark }}）</span
					>
				</div>
			</choose-money>
		</van-cell-group>
	</van-row>
</template>

<script>
import chooseMoney from "./chooseMoney";
export default {
	name: "OnlinePayments",
	components: { chooseMoney },
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
		},
		ruleContent: {
			type: String,
			default() {
				return "";
			}
		},
		rechargeMoney: {
			type: [String, Number],
			default() {
				return "";
			}
		},
		moneyChoose: {
			type: [Array, String],
			default() {
				return ["100", "200", "500", "1000", "5000"];
			}
		}
	},
	data() {
		return {
			radio: 0
		};
	},
	methods: {
		checkMoneyChildLimit(n) {
			this.$emit("checkMoney", n);
		},
		bankChild() {
			this.$emit("bankCodeChild");
		},
		activeSm(n) {
			this.$emit("depositChannel", n);
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/userCenter/recharge/rechargeContent";
</style>
<style lang="scss">
.scanCode_box {
	.van-cell {
		padding: 6px 15px 6px 15px;
		.van-cell__value {
			font-size: 12px;
		}
	}
}
.scanCode_checkbox {
	margin: 0 0 0 40px;
	.van-radio {
		.van-radio__icon {
			padding-top: 4px;
			.van-icon {
				font-size: 12px;
				width: 15px;
				height: 15px;
				border-radius: 3px;
			}
		}
		.van-radio__label {
			font-size: 14px;
			font-weight: 500;
			span {
				font-weight: bold !important;
				color: #ff0019;
			}
		}
	}
	.van-radio-two {
		.van-radio__label {
			color: #0b7ad4;
		}
	}
}
</style>

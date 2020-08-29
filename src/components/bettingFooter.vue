<template>
	<div class="credit_footer">
		<div class="credit_footer-title">
			已选
			<span>{{ betting.numbers || 0 }}</span>
			注，总计
			<span>{{ betting.amount | formatPenny }}</span>
			元 余额:
			<span>{{ userMessage.money | formatPenny }}</span>
			<refresh :img="img.refresh" :size="size"></refresh>
		</div>
		<div
			v-if="iFastSecondOpen && betting.numbers > 0 && quickShowStyle"
			class="credit_footer--quickChioce"
		>
			<p>连续开奖：</p>
			<div class="quickChioce_box">
				<div
					v-for="i in quickChoiceData"
					:key="i.id"
					:class="activeQuick === i.id ? 'active' : ''"
					@click="getSetQuickChoice(i)"
				>
					{{ i.text }}
				</div>
			</div>
		</div>
		<div class="order">
			<van-row type="flex" class="detail_footer_box">
				<van-col class="delete-box">
					<van-image :src="img.delete" @click="deleteOrder()"></van-image>
				</van-col>
				<van-col v-if="ruleShow" class="read-box">
					<van-button @click="creditRuleShow()">游戏规则</van-button>
				</van-col>
				<van-col
					class="input-box"
					:class="$route.name === 'Official' ? 'input-official' : ''"
					:style="!ruleShow ? 'width: 72%' : ''"
				>
					<van-field
						v-model="money"
						type="number"
						maxlength="7"
						:placeholder="placeholder"
						@input="inBetMoney"
						@blur="MoneyRule"
					></van-field>
				</van-col>
				<van-col class="order-box">
					<van-image :src="img.confirm" @click="handlerBetting"></van-image>
				</van-col>
			</van-row>
		</div>
	</div>
</template>

<script>
import playingCredits from "../mixins/playing.credit";
import lotteryResult from "../mixins/lotteryResult";
import refresh from "./refresh";

export default {
	name: "CreditFooter",
	components: { refresh },
	mixins: [playingCredits, lotteryResult],
	props: {
		betting: {
			type: Object,
			default() {
				return {};
			}
		},
		money: {
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
		},
		quickShowStyle: {
			type: Boolean,
			default() {
				return false;
			}
		},
		ruleShow: {
			type: Boolean,
			default() {
				return true;
			}
		},
		placeholder: {
			type: String,
			default() {
				return "";
			}
		}
	},
	data() {
		return {
			img: {
				refresh: require("../assets/images/betting/shuax.svg"),
				delete: require("../assets/images/betting/delete.png"),
				confirm: require("../assets/images/betting/confirm.png")
			},
			refreshMoney: false,
			activeQuick: 1,
			quickChoiceData: [
				{ id: 1, text: 1 },
				{ id: 2, text: 5 },
				{ id: 3, text: 10 },
				{ id: 4, text: 20 }
			],
			size: {
				witch: "20px",
				height: "20px"
			}
		};
	},
	watch: {
		quickShowStyle() {
			this.activeQuick = 1;
		}
	},
	methods: {
		inBetMoney() {
			this.$emit("inBetMoney", this.money);
		},
		deleteOrder() {
			this.$emit("del");
		},
		MoneyRule() {
			this.$emit("moneyRule", this.money);
		},
		handlerBetting() {
			this.$emit("handlerBetting");
		},
		creditRuleShow() {
			this.$emit("creditRuleShow");
		},
		getSetQuickChoice(i) {
			this.activeQuick = i.id;
			this.$parent.setQuickChoice(i);
		}
	}
};
</script>

<style scoped lang="scss">
@import "../assets/css/views/components/bettingFooter";
</style>

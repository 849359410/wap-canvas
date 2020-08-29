<template>
	<div class="credit_footer">
		<div class="credit_footer-title">
			已选
			<span>{{ betNum }}</span>
			注，总计
			<span>{{ betNum * money }}</span>
			元 余额:
			<span>{{ userMessage.money | formatPenny }}</span>
			<refresh :img="img.refresh"></refresh>
		</div>
		<div class="order">
			<van-row type="flex" class="detail_footer_box">
				<van-col class="delete-box">
					<van-image :src="img.delete" @click="deleteOrder()"></van-image>
				</van-col>
				<van-col class="name-box">每注金额</van-col>
				<van-col class="input-box" style="width: 50%">
					<van-field
						v-model="money"
						type="number"
						maxlength="7"
						placeholder="请输入要投注的金额"
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
import { mapState } from "vuex";
import refresh from "../../components/refresh";
export default {
	name: "LongFooter",
	components: { refresh },
	props: {
		betNum: {
			type: Number,
			default() {
				return 0;
			}
		},
		money: {
			type: [Number, String],
			default() {
				return 0;
			}
		}
	},
	data() {
		return {
			img: {
				refresh: require("../../assets/images/betting/shuax.svg"),
				delete: require("../../assets/images/betting/delete.png"),
				confirm: require("../../assets/images/betting/confirm.png")
			},
			refreshMoney: false
		};
	},
	computed: {
		...mapState({
			userMessage: state => state.user.userMessage
		})
	},
	methods: {
		inBetMoney() {
			let reg = /(^\d$)|(^\d+[0-9]{1,2}$)/;
			this.money = this.money.replace(/[^\d\\.]/g, "");
			if (!reg.test(this.money)) {
				this.money = "";
			} else if (Number(this.money) === 0) {
				this.money = 1;
			} else if (Number(this.money) > 1000000) {
				this.money = 1000000;
			}
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
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/components/bettingFooter";
</style>

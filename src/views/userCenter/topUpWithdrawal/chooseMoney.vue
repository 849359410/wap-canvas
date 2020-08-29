<!--suppress ALL11 -->
<template>
	<van-row class="setMoney">
		<div class="setMoney_box">
			<div class="setMoney_title">
				<slot></slot>
			</div>
			<van-row class="setMoney_input">
				<van-field
					v-model="money"
					class="ts-input"
					readonly
					type="number"
					placeholder="请输入金额"
					@touchstart.native.stop="moneyBoard = true"
				></van-field>
			</van-row>
			<key-board
				:show-keyboard="moneyBoard"
				@onInput="getInput"
				@onDelete="onDelete"
				@onBlue="onBlue"
			></key-board>
		</div>
		<div class="setMoney_chooseBox">
			<div class="setMoney_choose">
				<div
					v-for="(i, index) in moneyChoose.filter(a => a !== '')"
					:key="index"
					@click="chooseM(i)"
				>
					{{ i }}
				</div>
			</div>
		</div>
	</van-row>
</template>

<script>
import input from "../../../assets/js/input";
import keyBoard from "../../../components/keyBoard";
export default {
	name: "ChooseMoney",
	components: { keyBoard },
	props: {
		rechargeMoney: {
			type: String,
			default() {
				return "";
			}
		},
		moneyChoose: {
			type: [Array, String],
			default() {
				return ["100", "200", "500", "1000", "5000"];
			}
		},
		number: {
			type: Number,
			default() {
				return 0;
			}
		},
		showKeyboard: {
			type: Boolean,
			default() {
				return false;
			}
		}
	},
	data() {
		return {
			money: "",
			moneyBoard: false
		};
	},
	watch: {
		rechargeMoney: {
			handler(n) {
				this.money = n;
			},
			immediate: true,
			deep: true
		},
		showKeyboard: {
			handler() {
				this.moneyBoard = false;
			}
		},
		money(n) {
			if (n) {
				this.$emit("callCheckMoney", Number(n));
			}
		}
	},
	methods: {
		chooseM(money) {
			if (this.number === 0 && this.$route.name === "withdrawCash") return;
			this.money = money;
		},
		MoneyRule(n) {
			this.$emit("MoneyRule", n);
			this.money = input.defocusInput(this.money);
		},
		inpAmount() {
			let reg = /(^\d+\.?$)|(^\d+\.[0-9]{1,2}$)/;
			if (!reg.test(this.money)) this.money = this.isNumber(this.money);
			if (Number(this.money) === 0) this.money = "";
		},
		getInput(key) {
			this.money = this.money + key;
			this.inpAmount();
		},
		onBlue() {
			this.moneyBoard = false;
		},
		onDelete() {
			this.money = this.money.slice(0, this.money.length - 1);
		},
		isNumber(num) {
			if (Number(num)) {
				let x = String(num).indexOf(".") + 1; //小数点的位置
				let y = String(num).length - x; //小数的位数
				if (y > 2) {
					return num.substring(0, num.indexOf(".") + 3).toString();
				}
			}
			return "";
		}
	}
};
</script>

<style lang="scss" scoped>
$background-url: "../../../assets/images/userCenter/recharge/1.png",
	"../../../assets/images/userCenter/recharge/2.png",
	"../../../assets/images/userCenter/recharge/3.png",
	"../../../assets/images/userCenter/recharge/4.png",
	"../../../assets/images/userCenter/recharge/5.png";
.setMoney {
	.setMoney_box {
		padding: 0 15px;
		.setMoney_title {
			font-size: 12px;
			padding: 10px 0;
			span {
				white-space: normal;
				color: #ff0019;
			}
		}
	}
	.setMoney_chooseBox {
		padding: 15px 24px 15px 24px;
		.setMoney_choose {
			width: 100%;
			overflow: hidden;
			display: flex;
			justify-content: center;
			div {
				width: 50px;
				height: 50px;
				line-height: 50px;
				text-align: center;
				font-size: 12px;
				margin-right: 9px;
				&:last-of-type {
					margin-right: 0;
				}
				@for $i from 1 through 5 {
					&:nth-child(#{$i}) {
						background: url(nth($background-url, $i)) no-repeat;
						background-size: 100%;
					}
				}
			}
		}
	}
}
</style>
<style lang="scss">
.setMoney_input {
	.ts-input {
		.van-cell__value {
			.van-field__body {
				input {
					height: 35px;
					border: 0.5px solid #bbbbbb;
					font-size: 12px;
					text-indent: 1em;
					width: 99.6%;
					border-radius: 2px;
				}
			}
		}
	}
}
</style>

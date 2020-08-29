<template>
	<div class="turnInfo">
		<van-row class="turnInfo-main">
			<van-col class="turnInfo-main_input" span="24">
				<p class="input_title">转入金额(元)</p>
				<van-cell-group>
					<van-field
						v-model="turnMoney"
						type="number"
						center
						label-class="labelLeft"
						label="¥"
						:placeholder="`本次最多可转入${placeMoney}元`"
						@input="judgeMoney()"
						@blur="moneyRule"
					>
						<template #button>
							<van-button size="small" color="#ef384a" @click="allMoney"
								>全部</van-button
							>
						</template>
					</van-field>
				</van-cell-group>
			</van-col>
			<van-col v-show="tipsShow" class="turnInfo-main_tips" span="24">{{ tipsText }}</van-col>
			<van-col class="turnInfo-main_audit" span="24">
				<p>
					有效投注：<span>{{ yuBaoInContent.valid_bet }}</span>
				</p>
				<p class="right">
					还需打码：<span>{{ yuBaoInContent.dif_money }}</span>
				</p>
			</van-col>
			<van-col class="turnInfo-main_button" span="24">
				<van-button :class="showClick ? 'button_no_click' : ''" @click="clickPass()"
					>确认转入</van-button
				>
			</van-col>
			<van-col class="tips" span="24">注：账户余额转账到余额宝，同线上出款规则一致</van-col>
		</van-row>
		<turn-dialog
			ref="dialog"
			:pass-word-show="passWordShow"
			:turn-money="turnMoney"
			:tips="'账户余额'"
			:show-keyboard="showKeyboard"
			@postPass="postPass"
		></turn-dialog>
		<key-board
			:show-keyboard="showKeyboard"
			@onInput="onInput"
			@onDelete="onDelete"
			@onBlue="onBlue"
		></key-board>
	</div>
</template>

<script>
import turn from "../../mixins/turn";
import turnDialog from "./turnDialog";
import keyBoard from "../../components/keyBoard";
export default {
	name: "TurnInto",
	components: { turnDialog, keyBoard },
	mixins: [turn],
	created() {
		this.getTotalInMoney(1);
	},
	methods: {
		allMoney() {
			this.turnMoney = this.yuBaoInMoney;
			this.judgeMoney();
		},
		getTurnData() {
			if (this.yuBaoInContent.in_state === 2 && this.yuBaoInContent.state === 1) {
				return this.getErr("暂不支持转入余额宝，详情请咨询客服！", "YuBao");
			}
			if (this.yuBaoInContent.state === 2) {
				return this.getErr("余额宝已关闭，请联系客服开启！", "YuBao");
			}
			if (!this.inMoneyToday) return;
			let money = Number(this.yuBaoInContent.day_in_max);
			if (money !== 0) {
				if (this.inMoneyToday.user_money > money) {
					this.balanceMoney = false;
					let inMoney = this.$helps.floatSubtraction(money, this.inMoney);
					this.yuBaoInMoney = inMoney > 0 ? inMoney : 0;
				} else {
					if (money === this.inMoney) {
						this.balanceMoney = true;
						this.yuBaoInMoney = 0;
					} else {
						let moneyLimit = money - this.inMoney;
						if (moneyLimit < this.inMoneyToday.user_money) {
							this.yuBaoInMoney = moneyLimit > 0 ? moneyLimit : 0;
						} else {
							this.balanceMoney = true;
							this.yuBaoInMoney = this.inMoneyToday.user_money;
						}
					}
				}
			} else {
				this.balanceMoney = true;
				this.yuBaoInMoney = this.inMoneyToday.user_money;
			}
			this.placeMoney = this.yuBaoInMoney;
		},
		getTips(input_money) {
			let inDataCon = this.yuBaoInContent;
			if (input_money > Number(this.yuBaoInMoney)) {
				this.tipsShow = true;
				if (this.balanceMoney) {
					this.tipsText = "当前账户余额不足，请先充值！";
				} else {
					this.tipsText = "转入已超出当前限额，详情请联系客服！";
				}
			} else if (input_money < inDataCon.in_min) {
				this.tipsText = `转入金额最低为${inDataCon.in_min}元！`;
				this.tipsShow = true;
			}
		},
		postPass(password) {
			if (!password) {
				this.passWordShow = false;
				return this.$root.$emit("handleError", "安全密码不能为空");
			} else {
				if (this.turnMoney > this.yuBaoInMoney) this.$root.$emit("handleError", "");
				this.postFromIn.out_money = Number(this.turnMoney);
				this.postFromIn.qk_pwd = password;
				this.$api.request("API_POST_IN_YUE_BAO", this.postFromIn).then(
					() => {
						this.$router.push({
							name: "YuBaoEnding",
							params: { type: 1 }
						});
					},
					error => this.$root.$emit("handleError", error)
				);
				this.$refs.dialog.passWord = "";
				this.passWordShow = false;
			}
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/yuBao/turnInto";
</style>

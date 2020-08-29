<template>
	<div class="turnInfo">
		<van-row class="turnInfo-main">
			<van-col class="turnInfo-main_input" span="24">
				<p class="input_title">转出金额(元)</p>
				<van-cell-group>
					<van-field
						v-model="turnMoney"
						type="number"
						center
						label-class="labelLeft"
						label="¥"
						:placeholder="`本次最多可转出${placeMoney}元`"
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
					>确认转出</van-button
				>
			</van-col>
			<van-col class="tips" span="24"
				>注：余额宝转账到账户余额，将享有线上存款同等优惠</van-col
			>
		</van-row>
		<turn-dialog
			ref="dialog"
			:pass-word-show="passWordShow"
			:turn-money="turnMoney"
			:tips="'余额宝余额'"
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
	name: "TurnOut",
	components: { turnDialog, keyBoard },
	mixins: [turn],
	created() {
		this.getTotalInMoney(2);
	},
	methods: {
		allMoney() {
			this.turnMoney = this.yuBaoMoney;
			this.judgeMoney();
		},
		getTurnData() {
			if (this.yuBaoInContent.out_state === 2 && this.yuBaoInContent.state === 1) {
				return this.getErr("暂不支持转出到账户余额，详情请咨询客服！", "YuBao");
			}
			if (this.yuBaoInContent.out_state === 2 && this.yuBaoInContent.state === 2) {
				return this.getErr("余额宝已关闭，请联系客服开启!", "YuBao");
			}
		},
		getTips(input_money) {
			if (input_money > this.yuBaoMoney) {
				this.tipsText = "超出可转金额上限！";
				this.tipsShow = true;
			} else if (input_money < 10) {
				if (input_money === "") {
					this.tipsShow = false;
				} else {
					this.tipsText = "转出最低金额为10元";
					this.tipsShow = true;
				}
			}
		},
		postPass(password) {
			if (!password) {
				this.passWordShow = false;
				return this.$root.$emit("handleError", "安全密码不能为空");
			} else {
				this.postFromOut.money = Number(this.turnMoney);
				this.postFromOut.qk_pwd = password;
				this.$api.request("API_POST_OUT_YUE_BAO", this.postFromOut).then(
					() => {
						this.$router.push({
							name: "YuBaoEnding",
							params: { type: 2 }
						});
					},
					error => {
						this.$root.$emit("handleError", error);
					}
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

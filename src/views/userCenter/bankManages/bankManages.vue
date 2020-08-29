<template>
	<div class="bankManages">
		<van-row class="bankBox">
			<van-col v-if="nodata" class="bankBox--content">
				<p class="bankBox--content_p">
					<span>温馨提示：</span>
					您已绑定0张银行卡，还可以绑定{{ bankNum }}张银行卡，
					为了您的资金安全，成功提现的银行卡会自动锁定，无法删除和修改！
				</p>
				<div class="bankBox--content_addBank" @click="addBank">+ 添加银行卡</div>
			</van-col>
			<van-col v-if="showBank" class="bankBox--haveDate">
				<p class="bankBox--haveDate_title">收款人信息</p>
				<div v-if="showBank" class="bankBox--haveDate_bankList">
					<van-cell-group
						v-for="vv in bankData.data"
						:key="vv.id"
						class="bankBox--haveDate_bankList-li"
					>
						<van-cell
							class="bankBox--haveDate_bankList-li__bank"
							:icon="ion"
							:title="vv.card_id | queryDictionary('BANK_LISTS')"
						></van-cell>
						<div>
							<van-cell
								:border="false"
								title="银行:"
								size="large"
								:value="vv.card_id | queryDictionary('BANK_LISTS')"
							></van-cell>
							<van-cell :border="false" title="收款人:" :value="vv.name"></van-cell>
							<van-cell :border="false" title="账号:" :value="vv.card_num"></van-cell>
							<van-cell
								:border="false"
								title="开户地址:"
								:value="vv.card_address"
							></van-cell>
						</div>
					</van-cell-group>
				</div>
				<p
					v-if="bankData.data && bankData.data.length < bankData.num"
					class="bankBox--content_comfirmUpdate addBankBut"
					@click="addBank"
				>
					添加银行卡
				</p>
				<p v-if="bankData.data" class="bankBox--haveDate_p">
					<span>温馨提示：</span>
					您已绑定{{ bankData.data.length }}张银行卡，还可以绑定{{
						bankData.num - bankData.data.length >= 0
							? bankData.num - bankData.data.length
							: 0
					}}张银行卡， 为了您的资金安全，成功提现的银行卡会自动锁定，无法删除和修改！
				</p>
			</van-col>
		</van-row>
		<van-dialog
			v-model="isShow"
			class="alertAll"
			show-cancel-button="true"
			width="270"
			@confirm="getGo"
			@cancel="isShow = false"
		>
			<van-password-input
				:value="verCode"
				info="安全密码"
				:length="4"
				:focused="showKeyboard"
				@focus="showKeyboard = true"
			/>
		</van-dialog>
		<key-board
			:show-keyboard="showKeyboard"
			@onInput="getInput"
			@onDelete="onDelete"
			@onBlue="showKeyboard = false"
		></key-board>
		<qk-alert v-if="isShowObj.isShow" :msg-show="isShowObj" @closeShow="closeShow"></qk-alert>
	</div>
</template>
<script>
import QkAlert from "../../../components/qkAlert";
import withdrawals from "../../../mixins/withdrawals";
import keyBoard from "../../../components/keyBoard";
export default {
	name: "BankManages",
	components: {
		QkAlert,
		keyBoard
	},
	mixins: [withdrawals],
	data() {
		return {
			isShow: false,
			nodata: false,
			bankData: {}, //银行卡信息
			showBank: false,
			bank: "",
			verCode: "",
			bankNum: 0,
			isShowObj: {},
			ion: require("../../../assets/images/userCenter/bank/47.jpg"),
			show: false,
			showKeyboard: false
		};
	},
	created() {
		this.getBank();
	},
	methods: {
		getGo() {
			let params = {
				qk_pwd: this.verCode
			};
			if (this.verCode === "") {
				this.$root.$emit("handleError", "安全密码不能为空");
				return;
			}
			this.$api.request("API_GET_USER_CHECK_QK_PWD", params).then(
				success => {
					this.$root.$emit("handleError", `验证${success.Msg}`);
					this.isShow = false;
					this.verCode = "";
					this.$router.push({ name: "AddBank" });
				},
				error => {
					this.$root.$emit("handleError", error);
					this.verCode = "";
				}
			);
		},
		getInput(key) {
			this.verCode = (this.verCode + key).slice(0, 4);
		},
		onDelete() {
			this.verCode = this.verCode.slice(0, this.verCode.length - 1);
		},
		addBank() {
			this.$api.request("API_GET_CHECK_USER_QK_PWD").then(
				success => {
					let data = success.Data;
					if (data === 1) {
						this.isShowObj.isShow = true;
						this.isShowObj.text = "您还未设置安全密码,是否先去设置安全密码？";
						this.isShowObj.path = "UpdatePwd";
					} else this.isShow = true;
				},
				error => this.$root.$emit("handleError", error)
			);
		},
		getBank() {
			this.$api.request("API_GET_USER_BANKS").then(
				success => {
					this.bankData = success.Data;
					this.bankNum = success.Data.num;
					if (!this.bankData.data) {
						this.showBank = false;
						this.nodata = true;
						return;
					}
					this.nodata = false;
					this.showBank = true;
				},
				error => this.$root.$emit("handleError", error)
			);
		}
	}
};
</script>
<style scoped lang="scss">
@import "../../../assets/css/views/userCenter/bank/bankManages";
</style>
<style scoped lang="scss">
.alertAll {
	.van-dialog__content {
		.van-password-input {
			margin: 20px 4.26667vw;
			li {
				border: 1px solid #cfcfcf;
				margin: 0 0 -1px -1px;
				i {
					margin: 0;
				}
			}
		}
	}
	.title {
		display: block;
		font-size: 16px;
		font-weight: bold;
		margin: 10px auto;
	}
	.van-field {
		line-height: 40px;
	}
}
.van-number-keyboard {
	z-index: 3000;
}
</style>

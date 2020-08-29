<template>
	<van-row class="withdraw" :class="showKeyboard ? 'state' : ''">
		<date-choose
			:list="perentDateList"
			:tab-height="2"
			:rendered="true"
			:tab-active="perentDateList[1].id"
			display-id="true"
			@getReturnTabs="getReturnTabs"
		></date-choose>
		<van-row v-show="isShowOut">
			<van-cell-group class="withdraw_box">
				<van-cell>
					<template #title>
						<span>账户余额：</span>
						<van-tag class="withdraw_box_tag">{{ userMessage.money }}</van-tag>
					</template>
				</van-cell>
				<van-cell>
					<template #title>
						<span>手&nbsp;续&nbsp;费：</span>
						<van-tag class="withdraw_box_tag">{{ audit.outfee }}</van-tag>
					</template>
				</van-cell>
				<van-cell v-if="audit.is_out_num > -1">
					<template #title>
						<span>今天剩余提现次数：</span>
						<van-tag class="withdraw_box_tag">{{ audit.is_out_num }}</van-tag>
					</template>
				</van-cell>
				<van-cell is-link :center="true" arrow-direction="down" @click="bankBer">
					<template #title>
						<span>提现账户：</span>
						<van-image class="bank_img" :src="bankImg" alt="" />
						<van-tag class="bank_text">
							<span>{{ card_id | queryDictionary("BANK_LISTS") }}</span>
							<span>{{ bankName }}</span>
						</van-tag>
					</template>
				</van-cell>
				<choose-money
					ref="onlineMoney"
					class="withdraw_money"
					:rule-show="false"
					:show-keyboard="showKeyboard"
					:number="audit.is_out_num"
					@callCheckMoney="callCheckMoney"
				>
					<div class="content_helpBox-div">
						<p>
							提现金额：
							<span
								>单笔最低限额： <a>{{ minMoney }}</a></span
							>
							，
							<span
								>最高限额： <a>{{ maxMoney }}</a></span
							>
						</p>
					</div>
				</choose-money>
				<van-password-input
					:value="outParams.qk_pwd"
					info="安全密码"
					:length="4"
					:focused="showKeyboard"
					@focus="showKeyboard = audit.is_out_num === 0 ? false : true"
				/>
				<key-board
					:show-keyboard="showKeyboard"
					@onInput="getInput"
					@onDelete="onDelete"
					@onBlue="onBlue"
				></key-board>
			</van-cell-group>
			<van-collapse
				v-model="activeName"
				class="withdraw_remark"
				:class="showKeyboard ? 'prevent' : ''"
				accordion
			>
				<van-collapse-item name="0">
					<template #title>
						<div class="withdraw_remark_top">
							※温馨提示: <br />
							可提现金额=账户余额-手续费-行政费用-充值优惠（详情请见会员中心>帮助指南)
							<span>查看流水</span>
						</div>
					</template>
					<van-row class="withdraw_remark_bottom">
						<van-col span="24">优惠稽核：</van-col>
						<van-col span="24">自出款后第一次存款之后：</van-col>
						<van-col span="24"
							>有效投注：<span>{{ audit.bet }}</span></van-col
						>
						<van-col span="24"
							>还需打码：<span>{{ Number(audit.bet_less).toFixed(2) }}</span></van-col
						>
						<van-col span="12"
							>优惠：<span>{{ Number(audit.dis_money).toFixed(2) }}</span></van-col
						>
						<van-col span="12"
							>行政费：<span>{{ Number(audit.catm_xz).toFixed(2) }}</span></van-col
						>
						<van-col span="12"
							>手续费：<span>{{ audit.outfee }}</span></van-col
						>
						<van-col span="12"
							>共需扣除：<span>{{
								audit.dis_money + audit.outfee + audit.catm_xz
							}}</span></van-col
						>
					</van-row>
				</van-collapse-item>
			</van-collapse>
			<van-row class="setMoneyr_submyOrder">
				<van-button :class="showKeyboard ? 'prevent' : ''" @click="sentOutMoney"
					>确认出款</van-button
				>
			</van-row>
			<van-popup v-model="bankShow" position="bottom">
				<van-picker
					title="请选择卡号"
					show-toolbar
					:columns="columns"
					:default-index="0"
					@confirm="onConfirmBank"
					@cancel="bankShow = false"
				></van-picker>
			</van-popup>
			<van-popup v-model="successPup" class="withdraw_success">
				<van-row>
					<van-col class="error" span="24"
						><van-icon name="cross" @click="successPup = false"
					/></van-col>
					<van-col span="24"
						><van-icon name="checked" color="#00d625" size="38"
					/></van-col>
					<van-col span="24" class="green">提交成功</van-col>
					<van-col span="24" class="text">{{ CashNotice }}</van-col>
					<van-button :to="{ name: 'Index' }" color="#ef384a" size="small"
						>返回首页</van-button
					>
					<van-button :to="{ name: 'WithdrawRecord' }" size="small"
						>查看出款记录</van-button
					>
				</van-row>
			</van-popup>
		</van-row>
		<!-- 余额不足提示-->
		<van-row v-show="isShowNo" class="withdraw_noMoney">
			<div class="withdraw_noMoney_noMoneyBox">
				<van-icon name="warning" size="30" color="#ef384a" />
				<p>余额不足10元，无法进行提款操作！</p>
				<van-button :to="{ name: 'Recharge' }" size="small">快速存款</van-button>
			</div>
		</van-row>
	</van-row>
</template>
<script>
import { mapState } from "vuex";
import chooseMoney from "./chooseMoney";
import { APP_IMG_HOST } from "../../../config/deploy.config";
import DateChoose from "../../../components/Tabs";
import keyBoard from "../../../components/keyBoard";
export default {
	name: "WithdrawCash",
	components: {
		chooseMoney,
		DateChoose,
		keyBoard
	},
	data() {
		return {
			perentDateList: [
				{
					id: 1,
					name: "充值",
					icon: require("../../../assets/images/userCenter/home/reCharge.png")
				},
				{
					id: 2,
					name: "提现",
					icon: require("../../../assets/images/userCenter/home/cash.png")
				}
			], // 向子组件传入想要显示的值
			outParams: {
				out_money: "",
				qk_pwd: ""
			}, //出款提交参数
			cardData: "",
			currentMoney: "",
			successPup: false,
			num: null,
			bankName: "",
			isShowOut: false,
			isShowNo: false,
			audit: {},
			maxMoney: "",
			minMoney: "",
			timer: null,
			isOutOfMoney: false,
			bankImg: "",
			card_id: "",
			CashNotice: "",
			activeName: "",
			columns: [],
			bankShow: false,
			showKeyboard: false
		};
	},
	computed: {
		...mapState({
			userMoney: state => state.user.userMoney,
			userMessage: state => state.user.userMessage
		})
	},
	created() {
		this._loading();
		this.setTimer();
	},
	mounted() {
		this.getIDcard();
	},
	beforeDestroy() {
		clearInterval(this.timer);
		this.timer = null;
	},
	methods: {
		getReturnTabs(name) {
			if (name === 1) this.$router.replace({ name: "Recharge" });
		},
		callCheckMoney(n) {
			this.outParams.out_money = n;
		},
		setTimer: function() {
			if (!(this.$route.name.indexOf("withdrawCash") > -1)) return;
			this.timer = setInterval(() => {
				this.getCashRecord();
			}, 30000);
		},
		getInput(key) {
			this.outParams.qk_pwd = (this.outParams.qk_pwd + key).slice(0, 4);
		},
		onDelete() {
			this.outParams.qk_pwd = this.outParams.qk_pwd.slice(
				0,
				this.outParams.qk_pwd.length - 1
			);
		},
		onBlue() {
			this.showKeyboard = false;
		},
		_loading() {
			this.outParams.out_money = "";
			this.outParams.qk_pwd = "";
			this.outParams.source_type = 2;
			this.getCashRecord();
			setTimeout(() => {
				this.currentMoney = this.userMessage.money;
				if (this.currentMoney >= 10) {
					this.isShowOut = true;
					this.isShowNo = false;
				} else {
					this.isShowOut = false;
					this.isShowNo = true;
				}
			}, 10);
		},
		bankBer() {
			this.columns = [];
			this.cardData.forEach(v => {
				this.columns.push(this.formatBankNumber(v.card_num));
			});
			this.bankShow = true;
		},
		onConfirmBank(value, name) {
			this.outParams.user_bank_id = this.cardData[name].id;
			this.bankName = value;
			this.card_id = this.cardData[name].card_id;
			this.bankImg = `${APP_IMG_HOST}/img/bank/smallLogo/${this.cardData[name].card_id}.png`;
			this.bankShow = false;
		},
		checkMoney(d) {
			return Object.values(d).some(v => v === "");
		},
		sentOutMoney() {
			if (!this.outParams.out_money) {
				this.$root.$emit("handleError", "提现金额不能为空！");
				return;
			}
			if (this.outParams.out_money < this.minMoney) {
				this.$root.$emit("handleError", `取款金额最少为${this.minMoney}元！`);
				return;
			}
			if (parseInt(this.outParams.out_money) !== Number(this.outParams.out_money)) {
				this.$root.$emit("handleError", "出款金额只能为整数");
				return;
			}
			if (this.outParams.user_bank_id < 1) {
				this.$root.$emit("handleError", "请选择银行卡");
				return;
			}

			if (this.checkMoney(this.outParams)) {
				this.$root.$emit("handleError", "请完善信息");
				return;
			}
			let a = this.outParams.out_money,
				b = this.currentMoney;
			if (this.maxMoney !== 0) {
				if (a > this.maxMoney) {
					this.$root.$emit("handleError", "金额不能超过上限值");
					return;
				}
			}
			if (a < this.minMoney) {
				this.$root.$emit("handleError", "金额不能低于下限值");
				return;
			}
			if (a > b) {
				this.$root.$emit("handleError", "所剩余额不足");
				return;
			}
			if (a - (this.audit.dis_money + this.audit.outfee + this.audit.catm_xz) <= 0) {
				this.$root.$emit("handleError", "打码不足,最终出款为0");
				return;
			}
			if (this.isOutOfMoney) return;
			this.isOutOfMoney = true;
			this.$helps.showLoading();
			setTimeout(() => {
				this.$api.request("API_GET_BANK_OUT_MONEY", this.outParams).then(
					success => {
						if (success.Data) {
							this.CashNotice = success.Data;
						} else {
							this.CashNotice = `正在等待系统处理,请注意查看钱包余额`;
						}
						this.$helps.hideLoading();
						this.isOutOfMoney = false;
						this.listen(success);
					},
					error => {
						this.$helps.hideLoading();
						this.$root.$emit("handleError", error);
						this.isOutOfMoney = false;
					}
				);
			}, 500);
		},
		getIDcard() {
			if (!(this.$route.path.indexOf("withdrawCash") > -1)) return;
			this.$api.request("API_GET_USER_BANKS").then(
				success => {
					if (!success.Data) {
						this.$root.$emit("handleError", "请先绑定银行卡");
						return this.$router.push({ name: "BankManages" });
					} else {
						this.cardData = success.Data.data;
						this.bankName = this.formatBankNumber(this.cardData[0].card_num);
						this.card_id = this.cardData[0].card_id;
						this.outParams.user_bank_id = this.cardData[0].id;
						this.bankImg = `${APP_IMG_HOST}/img/bank/smallLogo/${this.cardData[0].card_id}.png`;
					}
				},
				error => {
					this.$root.$emit("handleError", error);
				}
			);
		},
		formatBankNumber(bankNumber) {
			return "************" + bankNumber.substr(-4);
		},
		getCashRecord() {
			// 获取流水单
			if (!(this.$route.name.indexOf("withdrawCash") > -1)) return;
			this.$api.request("API_GET_NOW_AUDIT_DATA").then(success => {
				this.audit = success.Data;
				this.minMoney = success.Data.min;
				this.maxMoney = success.Data.max;
			});
		},
		listen(data) {
			if (data.Code === "1101") {
				this.num--;
				window.localStorage.setItem("time", this.num);
				this.successPup = true;
			} else {
				this.$root.$emit("success", data.Msg);
			}
		}
	}
};
</script>
<style lang="scss" scoped>
@import "../../../assets/css/views/userCenter/withdrawCash/withdrawCash";
</style>
<style lang="scss">
.prevent {
	pointer-events: none;
}
.withdraw_remark {
	padding: 10px;
	.van-collapse-item {
		.van-cell {
			background: #fefceb !important;
		}
		.van-collapse-item__wrapper {
			.van-collapse-item__content {
				background: #fefceb !important;
			}
		}
	}
}
.van-password-input {
	.van-password-input__security {
		width: 80%;
		margin: auto;
		i {
			margin: 0;
		}
	}
	.van-password-input__info {
		padding-bottom: 10px;
	}
}
</style>

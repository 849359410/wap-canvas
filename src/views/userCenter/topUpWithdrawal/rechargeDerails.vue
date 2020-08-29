<template>
	<van-row>
		<van-nav-bar
			:title="item.name"
			left-arrow
			class="head"
			:fixed="true"
			@click-left="$router.go(-1)"
		></van-nav-bar>
		<!--线上支付 跳转连接-->
		<recharge-content
			ref="onlineMoney"
			v-model="itemList"
			:item-list="itemList"
			:acount-type="acountType"
			@checkMoneyChildLimit="checkMoneyLimit"
			@bankCodePickerChild="bankCodePicker"
			@confirm="onConfirm"
			@payMoney="payMoney"
		></recharge-content>
		<!--存款通道-->
		<van-popup v-model="channelShow" position="bottom" :style="{ height: '40%' }">
			<van-picker
				title="请选支付通道"
				show-toolbar
				:columns="columns"
				:default-index="0"
				@confirm="onConfirm"
				@cancel="channelShow = false"
			></van-picker>
		</van-popup>
		<!--银行通道-->
		<van-popup v-model="bankShow" position="bottom" :style="{ height: '40%' }">
			<van-picker
				title="请选择银行"
				show-toolbar
				:columns="columns"
				:default-index="0"
				@confirm="onConfirmBank"
				@cancel="bankShow = false"
			></van-picker>
		</van-popup>
		<!--充值成功弹窗-->
		<van-popup v-model="isPorder" class="rechargeDialog">
			<van-row class="recharge-orderBox">
				<div class="recharge-orderBox--box">
					<div class="success_img">
						<van-icon name="checked" color="#37b14a" size="40" />
					</div>
				</div>
				<div class="clear_img" @click="cloosePorder">
					<van-icon name="cross" />
				</div>
				<div
					v-if="[1, 17, 18, 19, 20].indexOf(itemList.passTrpe) > -1"
					class="success_title1"
				>
					<span>订单：</span>
					<span>{{ orderNum }}</span>
					<div>
						<span
							v-clipboard:copy="orderNum"
							v-clipboard:success="onCopy"
							v-clipboard:error="onError"
							class="copy"
							>复制</span
						>
					</div>
				</div>
				<div
					:class="
						[1, 17, 18, 19, 20].indexOf(itemList.passTrpe) > -1
							? 'success_title'
							: 'success_title2'
					"
				>
					订单提交成功，我们将在3分钟内为您添加额度 !
				</div>
				<van-button class="operatingBen" @click="goBet">立即投注</van-button>
				<van-button class="operatingBen" @click="skipPage('RechargeRecord')"
					>查看充值记录</van-button
				>
			</van-row>
		</van-popup>
	</van-row>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import rechargeContent from "./rechargeContent";
import { BANK_LISTS } from "@server/singularity";
import { APP_IMG_HOST } from "../../../config/deploy.config";
export default {
	name: "RechargeDerails",
	components: { rechargeContent },
	data() {
		return {
			dataBankName: BANK_LISTS,
			orderNum: 0,
			item: {},
			acountType: [],
			isPayment: true,
			isPaymentShow: true,
			isPorder: false,
			itemList: {}, // 充值内容需要的参数.
			channelShow: false,
			columns: [],
			in_type: "",
			bankShow: false
		};
	},
	computed: {
		...mapState({
			userMessage: state => state.user.userMessage
		}),
		...mapGetters(["webData"])
	},
	created() {
		this.getItemChangeWay();
	},
	methods: {
		// 获取接口数据
		getItemChangeWay() {
			if (this.$stores.get("rechargeList")) {
				let itemChangeWay = JSON.parse(this.$stores.get("rechargeList"));
				this.in_type = itemChangeWay.in_type;
				this.getAccoun(itemChangeWay);
				this.item = itemChangeWay;
			}
		},
		onCopy() {
			this.$root.$emit("handleSuccess", "复制成功");
			event.stopPropagation();
		},
		onError() {
			this.$root.$emit("handleError", "当前浏览器不支持复制");
			event.stopPropagation();
		},
		goBet() {
			this.$router.push({ name: "BettingHall" });
		},
		// 判断是否有银行通道信息存在
		isBankData(paymentBankfirst) {
			if (paymentBankfirst && paymentBankfirst.length > 0) {
				this.itemList.bankCodeName = paymentBankfirst[0].name;
				this.itemList.bankCode = paymentBankfirst[0].code;
			}
		},
		skipPage(name) {
			this.$router.replace({ name: name });
		},
		cloosePorder() {
			this.$refs.onlineMoney.rechargeMoney = "";
			this.itemList.remarkTipe = "";
			this.isPorder = false;
			this.itemList.rechargePass = this.acountType[0].name;
			this.isBankData(this.acountType[0].PaymentBank);
			this.getItemChangeWay();
		},
		getAccoun(item) {
			let api = "";
			if (item.in_type > 1 && item.in_type < 17) {
				api = "API_GET_BANK_IN_PAYMENT";
			} else api = "API_GET_BANK_IN_ACCOUNT";
			this.$api.request(api, { device_type: 2, top_id: item.id }).then(
				success => {
					if (!success.Data || success.Data.length === 0) return;
					this.itemList.qr_code = success.Data[0].qr_code;
					this.acountType = success.Data;
					this.acountType.forEach(i => {
						if (["A", "B", "C", "D"].indexOf(i.money_rule) < 0) {
							if (i.money_rule && i.money_rule.indexOf("-") < 0) {
								i.money_rule = `${i.money_rule}-`;
							}
						}
					});
					if (this.acountType instanceof Array && this.acountType.length > 0) {
						this.itemList = this.acountType[0];
						this.itemList.passTrpe = item.in_type;
						this.itemList.banckCodeTypes = [];
						this.itemList.bankImg = "";
						this.itemList.payName = this.userMessage.name;
						this.getBankImg(this, this.acountType[0].card_bank, 1);
						this.acountType.forEach(val => {
							if (
								val["id"] === this.itemList.id &&
								val.hasOwnProperty("PaymentBank") &&
								val["PaymentBank"].length
							) {
								this.itemList.banckCodeTypes = this.formatePaymentBank(
									val["PaymentBank"]
								);
							}
						});
						this.isBankData(this.acountType[0].PaymentBank);
					}
				},
				error => this.$root.$emit("handleError", error)
			);
		},
		onConfirm(value) {
			this.acountType.forEach(v => {
				if (v.name === value.name) {
					this.itemList = v;
					this.itemList.passTrpe = this.in_type;
					this.itemList.banckCodeTypes = [];
					this.itemList.payName = this.userMessage.name;
					this.itemList.bankImg = "";
					this.getBankImg(this, value.card_bank);
					if (
						v.PaymentBank &&
						v.PaymentBank instanceof Array &&
						v.PaymentBank.length > 0
					) {
						this.itemList.banckCodeTypes = this.formatePaymentBank(v.PaymentBank);
						this.isBankData(v.PaymentBank);
					}
					this.channelShow = false;
				}
			});
		},
		// 控制支付方式的图标
		getBankImg(self, name) {
			let cardId = null;
			self.dataBankName.forEach(k => {
				let title = k.name;
				if (name !== undefined && name.indexOf(title) > -1) {
					cardId = k.id;
				}
			});
			self.itemList.bankImg1 = `${APP_IMG_HOST}/img/bank/smallLogo/${cardId}.png`;
		},
		// 格式化银行通道
		formatePaymentBank(data) {
			let arr = [];
			for (let k in data) {
				arr.push({ text: data[k].name, value: data[k].code });
			}
			arr.forEach(i => {
				this.dataBankName.forEach(k => {
					if (i.text === k.name) {
						i.bankId = k.id;
					}
				});
			});
			return arr;
		},
		onConfirmBank(value) {
			let self = this;
			this.itemList.banckCodeTypes.forEach(v => {
				if (value === v.text) {
					self.itemList.bankCodeName = v.text;
					self.itemList.bankCode = v.value;
					self.itemList.bankImg = `${APP_IMG_HOST}/img/bank/smallLogo/${v.bankId}.png`;
					this.itemList.immediate = true;
					this.itemList = Object.assign({}, self.itemList);
				}
			});
			this.bankShow = false;
		},
		bankCodePicker() {
			this.columns = [];
			if (this.itemList.banckCodeTypes.length > 1) {
				this.itemList.banckCodeTypes.forEach(v => {
					this.columns.push(v.text);
				});
				this.bankShow = true;
			}
		},
		async payMoney() {
			let listMain = this.acountType,
				list;
			listMain.forEach(i => {
				if (i.id === this.itemList.id) {
					list = i;
				}
			});
			// 充值付款
			if (this.item.in_type > 1 && this.item.in_type < 17) {
				if (list && list.is_order === 2 && list.order_num > 0) {
					this.$root.$emit("handleError", "您还有未处理订单，请勿重复提交");
					return;
				}
			} else {
				if (list && list.is_acount_order === 2 && list.order_num > 0) {
					this.$root.$emit("handleError", "您还有未处理订单，请勿重复提交");
					return;
				}
			}
			if (!this.isPayment) {
				this.$root.$emit("handleError", "该入款通道金额达到上限!");
				return;
			}
			if (!this.$refs.onlineMoney.rechargeMoney) {
				this.$root.$emit("handleError", "金额不能为空");
				return;
			}
			if (this.acountType.length < 1) {
				this.$root.$emit("handleError", "请选择通道");
				return;
			}
			if (this.itemList.passTrpe > 1 && this.itemList.passTrpe < 17) {
				this.$refs.onlineMoney.MoneyRule();
				if (this.$refs.onlineMoney.ruleShow) {
					let msg = "请充值指定金额";
					if (this.itemList.money_rule === "B") msg = "充值金额只能为整十";
					if (this.itemList.money_rule === "C") msg = "充值金额只能为整百";
					if (this.itemList.money_rule === "D") msg = "充值金额只能为正整数";
					this.$root.$emit("handleError", msg);
					return;
				}
			}
			if (this.itemList.limit_max !== 0) {
				if (
					parseInt(this.$refs.onlineMoney.rechargeMoney) <
					parseInt(this.itemList.limit_low)
				) {
					this.$root.$emit("handleError", `单笔金额最低${this.itemList.limit_low}`);
					return;
				}
				if (parseInt(this.$refs.onlineMoney.rechargeMoney) < 10) {
					this.$root.$emit("handleError", "单笔金额最低10元");
					return;
				}
				if (
					parseInt(this.$refs.onlineMoney.rechargeMoney) >
					parseInt(this.itemList.limit_max)
				) {
					this.$root.$emit("handleError", `单笔金额最高${this.itemList.limit_max}`);
					return;
				}
			}
			if (this.itemList.banckCodeTypes.length && this.itemList.bankCode === "") {
				this.$root.$emit("handleError", "银行通道为必选！");
				return;
			}
			let typeList = [1, 17, 18, 19, 20];
			if (typeList.indexOf(this.itemList.passTrpe) > -1) {
				if (!this.itemList.payName) {
					this.$root.$emit("handleError", "存款姓名不能为空！");
					return;
				}
				if (this.itemList.payName.length > 12) {
					this.$root.$emit("handleError", "存款姓名2到12个汉字");
					return;
				}
				if (this.buttonLimit === true) {
					return;
				}
				this.buttonLimit = true;
				this.$helps.showLoading();
				setTimeout(() => {
					this.$api
						.request("API_POST_BANK_IN_MONEY", {
							account_id: parseInt(this.itemList.id),
							top_id: parseInt(this.itemList.top_id),
							source_type: 2,
							pass_type: this.itemList.passTrpe,
							in_name: this.itemList.payName,
							remark: this.itemList.remarkTipe,
							money: this.$refs.onlineMoney.rechargeMoney
						})
						.then(
							success => {
								this.$helps.hideLoading();
								this.isPorder = true;
								this.orderNum = success.Data;
								this.buttonLimit = false;
								this.logRecord(success, "PostBankInMoney");
							},
							error => {
								this.buttonLimit = false;
								this.$root.$emit("handleError", error);
								this.logRecord(error, "PostBankInMoney");
							}
						);
				}, 1000);
			} else {
				const isApp = Number(this.$stores.get("de"));
				let newWindow = "";
				if (isApp === 2) {
					newWindow = window.open();
				}
				await this.$api
					.request("API_GET_ONLINE_BANK_IN_MONEY", {
						account_id: this.itemList.id,
						top_id: this.itemList.top_id,
						source_type: 2,
						pass_type: this.itemList.passTrpe,
						in_name: this.itemList.payName,
						remark: this.remark,
						money: this.$refs.onlineMoney.rechargeMoney,
						bank_code: this.itemList.bankCode
					})
					.then(
						success => {
							let data = success.Data;
							this.thirdRechargeUrl = data;
							this.orderNum = data;
							if (isApp === 2) {
								newWindow.location.href = this.thirdRechargeUrl;
							} else {
								window.location.href = this.thirdRechargeUrl;
							}
							setTimeout(() => {
								this.isPorder = true;
							}, 2000);
							this.$helps.hideLoading();
							this.logRecord(success, "PostOnlineBankInMoney");
						},
						error => {
							this.$root.$emit("handleError", error);
							this.logRecord(error, "PostOnlineBankInMoney");
						}
					);
			}
		},
		// 查询金额是否达到上限
		checkMoneyLimit() {
			if (!this.isPaymentShow) return;
			this.isPaymentShow = false;
			this.$api
				.request("API_IS_OVER_LIMIT", {
					id: this.itemList.id,
					max_money: parseInt(this.itemList.max_money)
				})
				.then(
					success => {
						this.isPayment = true;
						this.isPaymentShow = true;
						this.logRecord(success, "IsOverLimit");
					},
					error => {
						this.isPayment = false;
						this.isPaymentShow = true;
						this.logRecord(error, "IsOverLimit");
					}
				);
		},
		logRecord(item, url) {
			this.$api
				.request("LOG_RECORD", {
					params: {
						user_name: this.userMessage.username,
						action: url,
						content: item,
						site_type: window.location.href
					}
				})
				.then();
		}
	}
};
</script>
<style lang="scss">
@import "../../../assets/css/views/userCenter/recharge/recharge";
</style>

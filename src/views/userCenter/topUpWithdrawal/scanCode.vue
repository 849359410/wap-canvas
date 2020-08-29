<template>
	<van-row class="scanCode_container">
		<van-row
			v-for="(j, key) in TransferList"
			v-show="j.id.indexOf(itemList.passTrpe) > -1"
			:key="key"
			class="recharge_scanCode"
		>
			<van-cell-group class="scanCode_box van-ellipsis">
				<van-cell :center="true" @click="passPicker">
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
				<van-cell :center="true">
					<template #title>
						<span v-if="arry.some(i => i === itemList.card_id)">收款姓名：</span>
						<span v-else>{{ j.receiptName }}：</span>
						<span>{{ itemList.card_name }}</span>
					</template>
					<span
						v-clipboard:copy="itemList.card_name"
						v-clipboard:success="onCopy"
						v-clipboard:error="onError"
						class="copy"
						>复制</span
					>
				</van-cell>
				<van-cell :center="true">
					<template #title>
						<span v-if="arry.some(i => i === itemList.card_id)">收款银行：</span>
						<span v-else>{{ j.receiptAccount }}：</span>
						<span>{{ itemList.card_num }}</span>
					</template>
					<span
						v-clipboard:copy="itemList.card_num"
						v-clipboard:success="onCopy"
						v-clipboard:error="onError"
						class="copy"
						>复制</span
					>
				</van-cell>
				<!--银行账户-->
				<van-cell v-if="j.banckName" :center="true">
					<template #title>
						<span>{{ j.banckName }}：</span>
						<span v-if="j.id.indexOf(itemList.passTrpe) > -1" class="bankLogo"
							><img :src="itemList.bankImg1"
						/></span>
						<span>{{ itemList.card_bank }}</span>
					</template>
					<span
						v-clipboard:copy="itemList.card_bank"
						v-clipboard:success="onCopy"
						v-clipboard:error="onError"
						class="copy"
						>复制</span
					>
				</van-cell>
				<van-cell v-if="j.receipBank && itemList.card_subbranch" :center="true">
					<template #title>
						<span>{{ j.receipBank }}：</span>
						<span>{{ itemList.card_subbranch }}</span>
					</template>
					<span
						v-clipboard:copy="itemList.card_subbranch"
						v-clipboard:success="onCopy"
						v-clipboard:error="onError"
						class="copy"
						>复制</span
					>
				</van-cell>

				<choose-money
					ref="onlineMoney"
					class="choose_money"
					:recharge-money="rechargeMoney"
					@callCheckMoney="checkMoneyChildLimit"
				>
					<div class="slotMoney">
						充值金额：
						<span v-if="itemList.remark" style="color: #ff1042; font-weight: bold;"
							>（{{ itemList.remark }}）</span
						>
					</div>
				</choose-money>
			</van-cell-group>
			<div class="scanCode_boxTow">
				<div>{{ j.nickName }}：</div>
				<div>
					<input v-model="itemList.payName" type="text" :placeholder="j.placeholder" />
				</div>
			</div>
			<div class="scanCode_boxTow">
				<div>备<span>注</span>：</div>
				<div>
					<input
						v-model="itemList.remarkTipe"
						type="text"
						placeholder="转账生成的后4位订单尾号"
					/>
				</div>
			</div>
		</van-row>
		<div v-if="itemList.qr_code" class="tow_code">
			<img :src="itemList.qr_code" alt="" />
		</div>
	</van-row>
</template>

<script>
import chooseMoney from "./chooseMoney";
export default {
	name: "ScanCode",
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
		rechargeMoney: {
			type: [String, Number],
			default() {
				return "";
			}
		}
	},
	data() {
		return {
			TransferList: [
				{
					id: [1, 19],
					receiptName: "收款姓名",
					receiptAccount: "收款账号",
					banckName: "收款银行",
					receipBank: "开户支行",
					nickName: "存款姓名",
					placeholder: "转账真实姓名或者转账昵称"
				},
				{
					id: [17],
					receiptName: "支付宝姓名",
					receiptAccount: "支付宝账号",
					banckName: "",
					receipBank: "",
					nickName: "存款姓名",
					placeholder: "转账真实姓名或者转账昵称"
				},
				{
					id: [18],
					receiptName: "微信姓名",
					receiptAccount: "微信账号",
					banckName: "",
					nickName: "存款姓名",
					placeholder: "转账真实姓名或者转账昵称"
				},
				{
					id: [20],
					receiptName: "云闪付姓名",
					receiptAccount: "云闪付账号",
					banckName: "",
					nickName: "存款姓名",
					placeholder: "转账真实姓名或者转账昵称"
				}
			],
			radio: 0,
			arry: [203, 204, 206]
		};
	},
	created() {},
	methods: {
		checkMoneyChildLimit(n) {
			this.$emit("checkMoney", n);
		},
		onCopy() {
			this.$root.$emit("handleSuccess", "复制成功");
			event.stopPropagation();
		},
		onError() {
			this.$root.$emit("handleError", "当前浏览器不支持复制");
			event.stopPropagation();
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

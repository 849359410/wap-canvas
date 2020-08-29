<template>
	<van-row>
		<div v-if="[1, 17, 18, 19, 20].indexOf(itemList.passTrpe) > -1">
			<div v-if="itemList.passTrpe === 1" class="online_remark">
				<p class="tip">※ 温馨提示：</p>
				<div>
					<p v-for="(j, i) in bankRemarks" :key="i">{{ j }}</p>
				</div>
			</div>
			<div v-else class="online_remark">
				<p class="tip">※ 温馨提示：</p>
				<div>
					<p v-for="(j, i) in copywritingList" :key="i">{{ j }}</p>
				</div>
			</div>
		</div>
		<div v-else class="online_remark">
			<p class="tip">※ 温馨提示：</p>
			<div>
				<p v-for="(j, i) in onlineRemarks" :key="i">{{ j }}</p>
			</div>
		</div>
	</van-row>
</template>

<script>
export default {
	name: "TextPrompt",
	props: {
		itemList: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			copywritingList: [
				"1、扫一扫弹出的二维码进行充值。",
				"2、可以使用其他手机扫二维码进行充值，也可以将二维码存到相册再使用微信的识别相册中的二维码进行充值，该二维码仅当前有效，每次充值务必更新最新的二维码。"
			],
			bankRemarks: [
				"1、请正确填写您的账号，姓名和充值金额。",
				"2、请务必转账后，再提交充值订单。",
				"3、转账一笔提交1次，请勿重复提交订单。",
				"4、转账时，务必增加小数点（如：500.77），以便财务查款。",
				"5、转账后请保留单据作为核对证明。"
			],
			onlineRemarks: [
				"点击提交充值订单按钮，进入到支付页面进行支付，支付成功，系统自动到账。"
			]
		};
	}
};
</script>

<style scoped lang="scss">
.online_remark {
	font-size: 12px;
	padding: 10px;
	background: #fefceb;
	color: #f88b44;
	width: 89%;
	margin: 0 auto 40px auto;
	border: 0.5px solid #ffbf95;
	border-radius: 2px;
}
</style>

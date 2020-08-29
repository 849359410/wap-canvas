<template>
	<van-row>
		<date-choose
			:list="perentDateList"
			:tab-height="2"
			:tab-active="tabActive"
			:rendered="true"
			display-id="true"
			@getReturnTabs="getReturnTabs"
		></date-choose>
		<van-cell-group>
			<van-cell
				v-for="(type, key) in payType"
				:key="key"
				class="box--"
				:icon="type.img"
				is-link
				:center="true"
				:label="type.in_remark"
				@click="changeWay(type)"
			>
				<template #title>
					<span class="custom-title">{{ type.name }}</span>
					<van-image
						v-if="type.is_commend === 1"
						:src="is_commend"
						width="2rem"
						height="1rem"
					></van-image>
				</template>
			</van-cell>
		</van-cell-group>
		<qk-alert v-if="isShowObj.isShow" :msg-show="isShowObj" @closeShow="closeShow"></qk-alert>
	</van-row>
</template>

<script>
import { mapState } from "vuex";
import DateChoose from "../../../components/Tabs";
import QkAlert from "../../../components/qkAlert";
import withdrawals from "../../../mixins/withdrawals";
export default {
	name: "Recharge",
	components: { DateChoose, QkAlert },
	mixins: [withdrawals],
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
			payType: [],
			imgIcon: [
				{
					id: [3, 18],
					src: require("../../../assets/images/userCenter/recharge/weChat.png")
				},
				{
					id: [4, 17],
					src: require("../../../assets/images/userCenter/recharge/zfb.png")
				},
				{
					id: [1, 11],
					src: require("../../../assets/images/userCenter/recharge/unionPay.png")
				},
				{
					id: [8],
					src: require("../../../assets/images/userCenter/recharge/jindong.png")
				},
				{
					id: [5, 19],
					src: require("../../../assets/images/userCenter/recharge/cft.png")
				},
				{
					id: [6],
					src: require("../../../assets/images/userCenter/recharge/QQ.png")
				},
				{
					id: [7],
					src: require("../../../assets/images/userCenter/recharge/baidu.png")
				},
				{
					id: [9],
					src: require("../../../assets/images/userCenter/recharge/fastPay.png")
				},
				{
					id: [2, 10],
					src: require("../../../assets/images/userCenter/recharge/onlinePlay.png")
				},
				{
					id: [20],
					src: require("../../../assets/images/userCenter/recharge/yunshanf.png")
				}
			],
			is_commend: require("../../../assets/images/userCenter/recharge/recommend.png"),
			tabActive: 1
		};
	},
	computed: {
		...mapState({
			isLogin: state => state.user.isLogin
		})
	},
	created() {
		this.getPayType();
	},
	methods: {
		changeWay(item) {
			this.$stores.set("rechargeList", JSON.stringify(item));
			this.$router.push({ name: "RechargeDerails" });
		},
		getPayType() {
			this.$api.request("API_GET_BANK_IN_TYPE", { device_type: 2 }).then(success => {
				if (success.Data !== "" && success.Data !== null) {
					this.payType = success.Data;
					this.payType.forEach(i => {
						this.imgIcon.forEach(j => {
							if (j.id.indexOf(i.in_type) > -1) {
								i.img = j.src;
							}
						});
					});
				}
			});
		},
		getReturnTabs(name) {
			if (name === 2) {
				this.tabActive = 2;
				this.getQkpwd(1);
			}
		}
	}
};
</script>

<style scoped lang="scss">
.van-cell-group {
	margin-top: 10px;
	.box-- {
		.van-cell__left-icon {
			width: 40px;
			height: 40px;
			img {
				width: 40px;
				height: 40px;
			}
		}
	}
}
</style>

<template>
	<div class="LongRecord myBetting">
		<van-row v-for="(v, k) in recordData" v-show="k < 5" :key="k" class="myBetting--box">
			<van-col class="left_content" span="14">
				<p>
					{{ v.fc_name }} <span>￥:&nbsp;{{ v.bet }}</span>
				</p>
				<p>{{ v.period }} 期</p>
			</van-col>
			<van-col class="right_content" span="10">
				<div v-if="v.state === 1" class="van-ellipsis color1">￥{{ v.result }}</div>
				<div class="color1 van-ellipsis" :style="`color: ${v.classN}`">
					{{ v.state | queryDictionary("BILLING_STATUS") }}
				</div>
			</van-col>
		</van-row>
		<no-data v-if="!recordData.length" :img-age="img"></no-data>
		<div class="foot">
			<div class="foot-cell">
				<div>
					<span>我的余额:</span>
					<span v-if="showMoney">{{ userMoney }}</span>
					<span class="buttonFor">
						<van-button @click="getMoney()">显示</van-button>
						<van-button @click="hideMoney()">隐藏</van-button>
					</span>
				</div>
			</div>
			<div class="foot-record">
				更多记录请到<span @click="linkRecord">【投注记录】</span>查看
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import noData from "../../components/noData";

export default {
	name: "LongRecord",
	components: { noData },
	data() {
		return {
			userMoney: "",
			recordData: [],
			showMoney: false,
			img: require("../../assets/images/chimera/clNodata.png")
		};
	},
	computed: {
		...mapState({
			userMessage: state => state.user.userMessage
		})
	},
	created() {
		this.getRecord();
	},
	methods: {
		getRecord() {
			this.$helps.showLoading();
			this.$api.request("API_GET_FC_BET_RECORD").then(success => {
				this.$helps.hideLoading();
				this.recordData = success.Data.Data.slice(0, 5);
				this.recordData.forEach(i => {
					switch (i.state) {
						case 0:
							i.classN = "#0a9000";
							break;
						case 1:
							i.classN = "#ef384a";
							break;
						case 2:
							i.classN = "#666666";
							break;
						case 3:
							i.classN = "#bule";
							break;
						case 6:
							i.classN = "#b16c05";
							break;
						default:
							i.classN = "#1abc65";
							break;
					}
				});
			});
		},
		getMoney() {
			this.userMoney = this.userMessage.money;
			this.showMoney = true;
		},
		hideMoney() {
			this.showMoney = false;
		},
		linkRecord() {
			this.$router.push({ name: "Mrecord", params: { type: "fc" } });
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/chimera/longRecord";
</style>

<template>
	<div class="toolbar_index">
		<van-row v-show="showTang" class="tangList">
			<van-col class="logoImg">
				<van-image :src="logoSrc"></van-image>
			</van-col>
			<van-col class="top" span="24">
				<van-row>
					<van-col class="left">
						<van-image :src="timeImg"></van-image>
						<span>{{ timeNumber }}</span>
					</van-col>
					<van-col class="right">
						<p class="date">星期{{ week }}</p>
						<p>{{ time }}</p>
						<p>{{ webLogo }}</p>
					</van-col>
				</van-row>
			</van-col>
			<van-col class="center" span="24">
				<van-row>
					<van-col v-for="i in clickList" :key="i.id" span="6" @click="goDetails(i)">
						<van-grid :border="false" :column-num="4">
							<van-grid-item>
								<van-image :src="i.logo" />
								<p>{{ i.text }}</p>
							</van-grid-item>
						</van-grid>
					</van-col>
				</van-row>
			</van-col>
			<van-col class="bottom" @click="showTang = false">
				<van-icon name="cross" />
			</van-col>
		</van-row>
		<qk-alert v-if="isShowObj.isShow" :msg-show="isShowObj" @closeShow="closeShow"></qk-alert>
	</div>
</template>

<script>
import { Bus } from "../../main";
import { mapGetters, mapState } from "vuex";
import img1 from "../../assets/images/yuBao/withdrawal.png";
import img2 from "../../assets/images/yuBao/recharge.png";
import img3 from "../../assets/images/yuBao/yuBao.png";
import img4 from "../../assets/images/userCenter/home/edzh.png";
import qkAlert from "../../components/qkAlert";
import withdrawals from "../../mixins/withdrawals";
export default {
	name: "YuIndex",
	components: { qkAlert },
	mixins: [withdrawals],
	data() {
		return {
			logoSrc: "",
			timeImg: require("../../assets/images/yuBao/time.png"),
			showTang: false,
			clickList: [
				{ text: "充值", page: "Recharge", logo: img1 },
				{ text: "提现", page: "withdrawCash", logo: img2 },
				{ text: "余额宝", page: "YuBao", logo: img3 },
				{ text: "额度转换", page: "quotaConversion", logo: img4 }
			],
			time: "",
			timeNumber: "",
			week: "",
			tabActive: 1,
			webLogo: ""
		};
	},
	computed: {
		...mapGetters(["webData"]),
		...mapState({
			userMessage: state => state.user.userMessage,
			isLogin: state => state.user.isLogin,
			webCommonWap: state => state.common.webCommonWap
		})
	},
	watch: {
		showTang(n) {
			if (n) {
				this.logoSrc = Object.hasOwnProperty.call(this.webData, "logo_wap")
					? this.webData.logo_wap
					: "";
			}
		}
	},
	mounted() {
		Bus.$on("yu-bao-show", () => {
			this.showTang = true;
			this.geiTime();
			this.webLogo = this.webCommonWap.WebData.slogan;
		});
	},
	methods: {
		geiTime() {
			let date = this.$helps.getEastDate(0, "yyyy-MM-dd");
			this.timeNumber = date.split("-")[2];
			this.time = this.$helps.getEastDate(0, "yyyy-MM-dd h:m:s");
			let arr = ["日", "一", "二", "三", "四", "五", "六"],
				week = new Date().getDay();
			this.week = arr[week];
		},
		goDetails(item) {
			if (item.text === "提现") {
				if (!this.isLogin) {
					this.$router.push({ name: "login" });
				} else {
					return this.getQkpwd();
				}
				this.showTang = false;
			}
			if (item.text === "余额宝") {
				if (this.userMessage.name === "") {
					this.$root.$emit("handleError", "请先完善个人资料");
					this.showTang = false;
					return this.$router.push({ name: "BankManages" });
				}
			}
			this.$router.push({ name: item.page });
			this.showTang = false;
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/yuBao/yuIndex";
</style>

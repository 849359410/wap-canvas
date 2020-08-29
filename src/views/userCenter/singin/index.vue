<template>
	<van-row class="singContent">
		<van-row class="inside">
			<van-row class="inside--contentOne">
				<van-row class="inside--contentOne_box">
					<van-col class="dayInfo" span="24">
						已连续<span v-for="(i, k) in singDayNum" :key="k">{{ i }}</span
						>天签到
					</van-col>
					<van-col class="moreDay" span="24">
						<img src="../../../assets/images/userCenter/singin/newEdition/money.png" />
						再连续签到<span class="dayMoney">{{ rema_day }}天</span>,即可领取<span
							class="dayMoney"
							>{{ money }}元</span
						>彩金!
					</van-col>
				</van-row>
			</van-row>
			<sign-child
				v-if="singConfig"
				:nor-sing="norSing"
				:sing-config="singConfig"
				:sing-day-list="singDayList"
				@conDay="conDay"
			></sign-child>
			<receive-bonus
				:sing-config-fil="singConfigFil"
				@getSingJack="getSingJack"
			></receive-bonus>
			<van-dialog
				v-show="singDay"
				:popup-show="popupShow"
				:sing-day="singDay"
				:max-days="maxDays"
			></van-dialog>
			<!--领取彩金提示-->
			<van-popup v-model="singJackShow" class="grade_dig">
				<div class="reve_main">
					<div class="rewardMain">
						<p class="rewardMoney">{{ Number(getMoney).toFixed(3) }}<span>元</span></p>
						<p>已存入余额，可直接使用</p>
					</div>
					<div class="WinningRecords" @click="$router.push({ name: 'MoneyRecord' })">
						查看彩金记录
					</div>
				</div>
			</van-popup>
			<LastPage></LastPage>
		</van-row>
	</van-row>
</template>

<script>
import SignChild from "./sign";
import ReceiveBonus from "./receive";
import VanDialog from "./dialog";
import LastPage from "./lastPage";
export default {
	name: "Index",
	components: {
		SignChild,
		ReceiveBonus,
		VanDialog,
		LastPage
	},
	data() {
		return {
			singShow: false,
			singDay: "",
			singDayList: "",
			singConfig: {},
			singConfigFil: "",
			popupShow: false,
			singJackShow: false,
			maxDays: "",
			maxMoney: 0,
			getMoney: 0,
			singDayNum: [],
			NumSingC: 0,
			rema_day: "",
			money: "",
			norSing: ""
		};
	},
	created() {
		this.setSingConfig();
		this.getChecked();
		this.norSing = Number(this.$stores.get("norSing"));
	},
	methods: {
		//签到可领取彩金数
		getChecked() {
			this.$api
				.request("API_GET_USER_SING_IS_OR_NOT", {
					source_type: Number(this.$stores.get("de"))
				})
				.then(
					success => {
						this.money = success.Data.money;
						this.rema_day = success.Data.rema_day;
					},
					error => this.$root.$emit("handleError", error)
				);
		},
		// 彩金列表
		setSingConfig() {
			this.$api.request("API_GET_USER_SING_LIST").then(
				success => {
					this.singDayList = success.Data.sign_day;
					let Days =
						this.singDayList < 10
							? "00" + this.singDayList
							: this.singDayList > 10 && this.singDayList < 100
							? "0" + this.singDayList
							: "";
					this.singDayNum = Days.split("");
					// 签到列表
					this.singConfig = success.Data.sign_data;
					this.NumSingC = this.singConfig.length;
					this.maxDays = this.singConfig[this.singConfig.length - 1].is_con;
					this.maxMoney = this.singConfig[this.singConfig.length - 1].money;
					// 领取列表
					this.singConfigFil = success.Data.sign_data.filter(i => i.filter === 1);
				},
				message => this.$root.$emit("handleError", message)
			);
		},
		// 会员签到
		conDay() {
			this.$helps.showLoading();
			this.$api
				.request("API_POST_UPDATE_UESR_CON_DAY", {
					source_type: Number(this.$stores.get("de"))
				})
				.then(
					success => {
						this.getChecked();
						setTimeout(() => {
							this.$helps.hideLoading();
						}, 500);
						this.singDay = success.Data;
						this.popupShow = !this.popupShow;
						this.setSingConfig();
						this.$stores.set("norSing", 1);
						this.norSing = 1;
					},
					error => {
						this.$helps.hideLoading();
						this.$root.$emit("handleError", error);
					}
				);
		},
		// 会员领取彩金
		getSingJack() {
			this.$helps.showLoading();
			this.$api
				.request("API_POST_ISSUE_USER_SIGN_JACK", {
					source_type: Number(this.$stores.get("de"))
				})
				.then(
					success => {
						setTimeout(() => {
							this.$helps.hideLoading();
						}, 500);
						this.popupShow = false;
						this.setSingConfig();
						this.getMoney = success.Data;
						this.singJackShow = !this.singJackShow;
					},
					message => {
						this.$helps.hideLoading();
						this.$root.$emit("handleError", message);
					}
				);
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/userCenter/singin/singin";
</style>
<style lang="scss">
.singSurePopup,
.grade_dig {
	.dialog-container {
		background-color: initial;
	}
}
.dialog {
	min-width: 250px !important;
}
</style>

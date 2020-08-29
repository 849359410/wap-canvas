<template>
	<div class="quotaConversion">
		<div class="quotaConversion-top">
			<div class="quotaConversion-top--quota">
				<van-row>
					<van-col
						v-for="(i, index) in turnList"
						:key="index"
						:span="i.span"
						@click="getIsShow(i, index)"
					>
						<van-image :src="i.img" />
						<span>{{ i.name }}</span>
						<van-icon :name="i.icon" />
					</van-col>
				</van-row>
			</div>
			<div class="quotaConversion-top--money">
				<van-row>
					<van-col span="24">
						由<em>{{ turnList[0].name }}</em
						>转入<em>{{ turnList[2].name }}</em>
					</van-col>
					<van-col span="24">
						<van-cell-group>
							<van-field
								v-model="money"
								type="number"
								center
								readonly
								label-class="labelLeft"
								:placeholder="`可用余额${turnList[0].money}元`"
								@touchstart.native.stop="moneyBoard = true"
							>
							</van-field>
							<span @click="getAllMoney">全部</span>
						</van-cell-group>
					</van-col>
					<van-col span="24" @click="getSubmit">
						<img
							src="../../../assets/images/userCenter/quotaConversion/tj.png"
							alt=""
						/>
					</van-col>
				</van-row>
			</div>
		</div>
		<div class="quotaConversion-content">
			<van-row class="quotaConversion-content--one">
				<van-col span="12">
					资产列表
				</van-col>
				<van-col span="12">
					<refresh
						:img="refresh"
						:size="{ width: 24, height: 24 }"
						:refresh-system="true"
						@getRefresh="getRequestMoney(true, 'API_GET_REFRESH_VD_V1_MONEY')"
					></refresh>
				</van-col>
			</van-row>
			<van-row v-for="(item, key) in moneyList" :key="key">
				<van-col v-for="(i, index) in item.list" :key="index" span="12">
					<van-image v-if="i.img" :src="i.img" />
					<span v-if="i.name">{{ i.name }}</span>
					<span v-else>{{ i.money | formatPenny }} <i>元</i></span>
				</van-col>
			</van-row>
		</div>
		<!--		<van-button class="quotaConversion-button" round type="primary" block @click="getAllSubmit"-->
		<!--			>一键归户</van-button-->
		<!--		>-->
		<action-sheet :list="list" :turn-obj="turnObj"></action-sheet>
		<key-board
			:show-keyboard="moneyBoard"
			@onInput="getInput"
			@onDelete="onDelete"
			@onBlue="onBlue"
		></key-board>
		<qk-alert
			:msg-show="isShowObj"
			@closeShow="closeShow"
			@newDevelopment="getNewDevelopment"
		></qk-alert>
	</div>
</template>

<script>
import { mapState } from "vuex";
import actionSheet from "../../../components/actionSheet";
import keyBoard from "../../../components/keyBoard";
import qkAlert from "../../../components/qkAlert";
import refresh from "../../../components/refresh";

export default {
	name: "Index",
	components: { actionSheet, keyBoard, qkAlert, refresh },
	data() {
		return {
			refresh: require("../../../assets/images/userCenter/quotaConversion/sx.png"),
			turnList: [
				{
					name: "系统余额",
					img: require("../../../assets/images/userCenter/quotaConversion/ye.png"),
					icon: "arrow",
					span: "9",
					system: true,
					vd_type: "",
					money: 0,
					money_type: "user_money"
				},
				{
					img: require("../../../assets/images/userCenter/quotaConversion/qh.png"),
					span: "6"
				},
				{
					name: "BG余额",
					img: require("../../../assets/images/userCenter/quotaConversion/bg.png"),
					icon: "arrow",
					span: "9",
					system: false,
					vd_type: "bg"
				}
			],
			turnObj: {
				index: 0,
				name: "系统余额"
			},
			lName: "系统余额",
			list: {
				show: false,
				actions: [
					{ name: "系统余额" },
					{ name: "BG余额" },
					{ name: "AG余额" },
					{ name: "KY余额" }
				]
			},
			moneyBoard: false,
			money: "",
			moneyList: [
				{
					list: [
						{
							img: require("../../../assets/images/userCenter/quotaConversion/ye.png"),
							name: "系统余额"
						},
						{
							key: "user_money",
							money: 0
						}
					]
				},
				{
					list: [
						{
							img: require("../../../assets/images/userCenter/quotaConversion/bg.png"),
							name: "BG余额"
						},
						{
							key: "bg_money",
							money: 0
						}
					]
				},
				{
					list: [
						{
							img: require("../../../assets/images/userCenter/quotaConversion/ag.png"),
							name: "AG余额"
						},
						{
							key: "ag_money",
							money: 0
						}
					]
				},
				{
					list: [
						{
							img: require("../../../assets/images/userCenter/quotaConversion/ky.png"),
							name: "KY余额"
						},
						{
							key: "ky_money",
							money: 0
						}
					]
				}
			],
			isShowObj: {
				isShow: false,
				text: "",
				path: "",
				confirmButtonText: "",
				confirmButtonColor: "",
				cancelButtonText: "",
				cancelButtonColor: "",
				confirmButtonRouter: "newDevelopment",
				cancelButtonRouter: "",
				closeOnClickOverlay: true
			},
			moneyData: {},
			submitShow: true
		};
	},
	computed: {
		...mapState({
			userMessage: state => state.user.userMessage
		})
	},
	watch: {
		money(n) {
			if (Number(n) > parseInt(this.turnList[0].money)) {
				this.money = parseInt(this.turnList[0].money).toString();
			}
		},
		moneyData: {
			handler() {
				this.getReturnMoney();
			},
			deep: true
		},
		turnList: {
			handler(n) {
				let type = n[2].vd_type;
				if (type) {
					if (this.$stores.get(type) !== type) {
						this.getPostByType();
					}
				}
			},
			deep: true
		}
	},
	created() {
		this.$on("getName", (item, obj) => {
			this.money = "";
			this.turnList[obj.index].name = item.name;
			this.list.show = false;
			if (obj.index === 0) {
				this.turnList[0].vd_type = item.vd_type;
				this.turnList[0].money_type = item.money_type;
				if (item.name !== "系统余额") {
					this.turnList[2].name = "系统余额";
					this.turnList[0].img = require(`../../../assets/images/userCenter/quotaConversion/${item.vd_type}.png`);
					this.turnList[2].img = require(`../../../assets/images/userCenter/quotaConversion/ye.png`);
					this.turnList[2].vd_type = "";
				} else {
					this.turnList[2].name = "BG余额";
					this.turnList[2].vd_type = "bg";
					this.turnList[0].img = require(`../../../assets/images/userCenter/quotaConversion/ye.png`);
					this.turnList[2].img = require(`../../../assets/images/userCenter/quotaConversion/bg.png`);
				}
				this.getReturnMoney();
			} else {
				if (item.vd_type) {
					this.turnList[2].vd_type = item.vd_type;
					this.turnList[2].img = require(`../../../assets/images/userCenter/quotaConversion/${item.vd_type}.png`);
				} else {
					this.turnList[2].img = require(`../../../assets/images/userCenter/quotaConversion/ye.png`);
				}
			}
		});
		this.getRequestMoney(false, "API_GET_VD_MONEY_DATA");
	},
	methods: {
		getPostByType() {
			let type = this.turnList[2].vd_type,
				data = {
					vd_type: type
				};
			this.$api.request("API_POST_BALANCE_BY_VD_TYPE", data).then(
				() => {
					this.$stores.set(type, type);
				},
				error => this.$root.$emit("handleError", error)
			);
		},
		getRequestMoney(state, url) {
			this.$api.request(url).then(
				success => {
					let { Data } = success;
					this.moneyData = Data;
					this.moneyList.forEach(item => {
						item.list.forEach(j => {
							Object.keys(Data).forEach(k => {
								if (j.key === k) {
									j.money = Data[j.key];
								}
							});
						});
					});
					if (state) this.$root.$emit("handleSuccess", "刷新成功");
				},
				error => this.$root.$emit("handleError", error)
			);
		},
		getIsShow(item, index) {
			if (index === 1) return;
			if (!item.system) {
				if (this.turnList[0].name === "系统余额") {
					this.list.actions = [
						{ name: "BG余额", vd_type: "bg", money_type: "bg_money" },
						{ name: "AG余额", vd_type: "ag", money_type: "ag_money" },
						{ name: "KY余额", vd_type: "ky", money_type: "ky_money" }
					];
				} else {
					this.list.actions = [
						{ name: "系统余额", vd_type: "", money_type: "user_money" }
					];
				}
			} else {
				this.list.actions = [
					{ name: "系统余额", vd_type: "", money_type: "user_money" },
					{ name: "BG余额", vd_type: "bg", money_type: "bg_money" },
					{ name: "AG余额", vd_type: "ag", money_type: "ag_money" },
					{ name: "KY余额", vd_type: "ky", money_type: "ky_money" }
				];
			}
			this.turnObj.index = index;
			this.turnObj.name = item.name;
			this.list.show = true;
		},
		getInput(key) {
			this.money = this.money + key;
		},
		onDelete() {
			this.money = this.money.slice(0, this.money.length - 1);
		},
		onBlue() {
			this.moneyBoard = false;
		},
		getAllMoney() {
			this.money = parseInt(this.turnList[0].money).toString();
		},
		getSubmit() {
			if (this.turnList[0].money < 1) {
				return this.$root.$emit("handleError", "余额不足，请先充值");
			}
			if (!this.money) return this.$root.$emit("handleError", "请输入转换金额");
			if (!this.submitShow) return;
			this.submitShow = false;
			let vdType = this.turnList[2].vd_type
				? this.turnList[2].vd_type
				: this.turnList[0].vd_type;
			let data = {
				media: this.$stores.get("de"),
				vd_type: vdType,
				money: this.money,
				c_type: this.turnList[2].vd_type ? "IN" : "OUT"
			};
			this.$api.request("API_POST_TRANSFER_CREDIT", data).then(
				() => {
					this.submitShow = true;
					this.money = "";
					this.isShowObj.text = "转换成功！";
					this.isShowObj.confirmButtonText = "立即游戏";
					this.isShowObj.confirmButtonColor = "#007aff";
					this.isShowObj.cancelButtonText = "查看记录";
					this.isShowObj.cancelButtonColor = "#007aff";
					this.isShowObj.cancelButtonRouter = "ConversionRecord"; // 查看记录
					this.isShowObj.isShow = true;
					this.getRequestMoney(false, "API_GET_REFRESH_VD_V1_MONEY");
				},
				error => {
					this.submitShow = true;
					this.$root.$emit("handleError", error);
				}
			);
		},
		closeShow() {
			this.isShowObj.isShow = false;
		},
		getNewDevelopment() {
			let data = {
					media: this.$stores.get("de"),
					vd_type: this.turnList[2].vd_type
				},
				dataHead = {
					SiteCode: this.$stores.get("load_img").site,
					Username: this.userMessage.username
				},
				newWindow = window.open("", "_blank");
			this.$api.request("API_POST_LOGIN_FORWARD_GAME", data, dataHead).then(
				success => {
					let { Data } = success;
					newWindow.location.href = Data.login_url;
				},
				error => this.$root.$emit("handleError", error)
			);
		},
		getReturnMoney() {
			for (let i in this.moneyData) {
				if (this.turnList[0].money_type === i) {
					this.turnList[0].money = this.moneyData[i];
				}
			}
		}
	}
};
</script>

<style scoped lang="scss">
.quotaConversion {
	background: url("../../../assets/images/userCenter/quotaConversion/bg-img.png") no-repeat;
	background-size: 100% 35%;
}
@import "../../../assets/css/views/userCenter/quotaConversion/Index";
</style>

<template>
	<van-row class="personalData">
		<van-row class="personalData--box">
			<van-row class="login_time">
				上次登录：{{ userData.login_time }}，不是我登录？
				<u @click="$router.push({ name: 'UpdatePwd' })">修改密码</u>
			</van-row>
			<van-row>
				<van-cell-group class="personalData--pContent">
					<van-cell
						v-for="(item, index) in dataList"
						:key="index"
						:is-link="item.arrow"
						:class="{ Separate: item.Separate }"
						:to="item.to"
					>
						{{ item.text }}
						<div
							class="item-after"
							:class="[{ rightText: item.arrow }, { rightColor: item.color }]"
						>
							<van-image v-if="item.img" class="img" round :src="userIcon" />
							{{ item.name || item.content }}
						</div>
					</van-cell>
				</van-cell-group>
			</van-row>
			<van-row>
				<van-button v-if="isLogin" class="comfirm-update" @click="loginOut()">
					退出登录
				</van-button>
			</van-row>
		</van-row>
	</van-row>
</template>

<script>
import { mapState } from "vuex";
import { APP_IMG_HOST } from "../../../config/deploy.config";
export default {
	name: "PersonalData",
	data() {
		return {
			userData: "",
			userIcon: "",
			dataList: [
				{
					id: 0,
					text: "头像",
					key: "",
					name: "",
					arrow: true,
					img: true,
					to: "ModifyIcon"
				},
				{ id: 1, text: "会员名", key: "username", name: "" },
				{ id: 2, text: "真实姓名", key: "name", name: "" },
				{ id: 3, text: "生日", key: "birth_date", arrow: true, name: "", to: "UpdateUser" },
				{
					id: 4,
					text: "手机号码",
					key: "mobile",
					Separate: true,
					arrow: true,
					name: "",
					content: "立即绑定",
					to: "UpdateUser"
				},
				{
					id: 5,
					text: "电子邮箱",
					key: "email",
					arrow: true,
					name: "",
					content: "立即绑定",
					to: "UpdateUser"
				},
				{
					id: 6,
					text: "腾讯QQ",
					key: "qq",
					arrow: true,
					name: "",
					to: "UpdateUser"
				},
				{
					id: 7,
					text: "微信",
					key: "weixin",
					arrow: true,
					name: "",
					content: "立即绑定",
					to: "UpdateUser"
				},
				{ id: 8, text: "账户余额", key: "money", Separate: true, name: "", color: true },
				{ id: 9, text: "最近存款", key: "bank_in_time", name: "" },
				{ id: 10, text: "最近取款", key: "bank_out_time", name: "" },
				{ id: 11, text: "上次登录", key: "login_time", Separate: true, name: "" },
				{ id: 12, text: "上次访问IP", key: "login_ip", name: "" }
			]
		};
	},
	computed: {
		...mapState({
			userMessage: state => state.user.userMessage,
			isLogin: state => state.user.isLogin
		})
	},
	created() {
		this.loadData();
		this.userIcon = `${APP_IMG_HOST}/img/userIcon/${this.userMessage.pic_id}.jpg`;
	},
	methods: {
		loadData() {
			this.$api.request("API_GET_USER").then(
				success => {
					let user = success.Data;
					user.money = user.money.toFixed(3);
					this.dataList.forEach(i => {
						i.name = user[i.key];
					});
					this.userData = user;
				},
				error => this.$root.$emit("handleError", error)
			);
		},
		UpdateUser() {
			this.$router.push({ name: "UpdateUser" });
		},
		// 退出
		loginOut() {
			this.$root.$emit("handleUserLoginOut");
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/userCenter/personData/personData";
</style>

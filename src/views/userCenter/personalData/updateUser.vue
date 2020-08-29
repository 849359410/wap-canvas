<template>
	<van-row class="personalData">
		<van-row class="personalData--box">
			<van-row>
				<van-cell-group class="personalData--pContent">
					<van-cell
						v-model="user.birth_date"
						is-link
						title="生日:"
						@click="show = true"
					></van-cell>
					<van-popup v-model="show" position="bottom" :style="{ height: '40%' }">
						<van-datetime-picker
							v-model="currentDate"
							type="date"
							:min-date="minDate"
							:max-date="maxDate"
							@cancel="show = false"
							@confirm="endTimeChange"
						></van-datetime-picker>
					</van-popup>
					<van-field
						v-for="(item, index) in list"
						:key="index"
						v-model="item.key"
						:label="item.text"
						:type="item.type"
						input-align="right"
						:class="{ Separate: item.Separate }"
						@input="dealWith(item)"
					>
					</van-field>
				</van-cell-group>
			</van-row>
			<van-button class="comfirm-update" @click="subymitUpdate">确认修改</van-button>
		</van-row>
	</van-row>
</template>

<script>
export default {
	name: "UpdateUser",
	data() {
		return {
			user: {
				birth_date: "",
				qq: "",
				weixin: "",
				mobile: "",
				email: ""
			},
			list: [],
			show: false,
			minDate: new Date(1900, 0, 1),
			maxDate: new Date(2100, 10, 1),
			currentDate: new Date(1900, 0, 1)
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		dealWith(item) {
			switch (item.name) {
				case "QQ":
					this.user.qq = item.key;
					break;
				case "WeChat":
					this.user.weixin = item.key;
					break;
				case "phone":
					this.user.mobile = item.key;
					break;
				case "mailbox":
					this.user.email = item.key;
			}
		},
		endTimeChange(value) {
			let year = value.getFullYear();
			let month = value.getMonth() + 1;
			let dates = value.getDate();
			this.user.birth_date = year + "-" + month + "-" + dates;
			this.show = false;
		},
		loadData() {
			this.$api.request("API_GET_USER").then(
				success => {
					this.user = success.Data;
					this.assignment(success.Data);
				},
				error => this.$root.$emit("handleError", error)
			);
		},
		assignment(data) {
			this.list = [
				{ id: 1, text: "QQ号码:", key: data.qq, name: "QQ", type: "digit" },
				{ id: 2, text: "微信号:", key: data.weixin, name: "WeChat" },
				{
					id: 3,
					text: "手机号码:",
					key: data.mobile,
					name: "phone",
					Separate: true,
					type: "digit"
				},
				{ id: 4, text: "电子邮箱:", key: data.email, name: "mailbox" }
			];
		},
		IsMobile() {
			if (this.user.mobile === "") {
				return true;
			}
			if (!/^[1][34578]\d{9}$/.test(this.user.mobile)) {
				this.$root.$emit("handleError", "手机号码输入错误！");
				return false;
			} else {
				return true;
			}
		},
		IsQ() {
			if (this.user.qq === "") {
				return true;
			}
			if (!/^[1-9]\d{4,10}$/.test(this.user.qq)) {
				this.$root.$emit("handleError", "QQ为5-11位的数字！");
				return false;
			} else {
				return true;
			}
		},
		isWx() {
			if (this.user.weixin === "") {
				return true;
			}
			if (!/^[a-zA-Z1-9]{1}[-_a-zA-Z0-9]{4,19}$/.test(this.user.weixin)) {
				this.$root.$emit("handleError", "微信号格式不正确！");
				return false;
			} else {
				return true;
			}
		},
		IsEmail() {
			if (this.user.email === "") {
				return true;
			}
			if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(this.user.email)) {
				this.$root.$emit("handleError", "邮箱号码格式不正确");
				return false;
			} else {
				return true;
			}
		},
		subymitUpdate() {
			if (!this.IsEmail() || !this.IsMobile() || !this.IsQ() || !this.isWx()) return;
			this.$helps.showLoading();
			this.$api.request("API_POST_UP_USER_DATA", this.user).then(
				success => {
					setTimeout(() => {
						this.$helps.hideLoading();
					}, 500);
					this.$root.$emit("handleSuccess", success.Msg);
					this.$router.push({ name: "PersonalData" });
				},
				error => {
					this.$helps.hideLoading();
					this.$root.$emit("handleError", error);
				}
			);
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/userCenter/personData/personData";
</style>

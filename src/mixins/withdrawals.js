export default {
	data() {
		return {
			isShowObj: {
				isShow: false,
				text: "",
				path: ""
			}
		};
	},
	methods: {
		//判断是否有安全密码
		getQkpwd(type) {
			if (!this.isLogin) return this.$router.push({ name: "login" });
			this.showTang = false;
			this.$api.request("API_GET_CHECK_USER_QK_PWD").then(
				success => {
					let data = success.Data;
					if (data === 1) {
						this.isShowObj.isShow = true;
						this.isShowObj.text =
							"您还未设置安全密码和绑定银行卡，无法提现，是否先去设置安全密码?";
						this.isShowObj.path = "UpdatePwd";
					} else this.getQkBank(type);
				},
				error => this.$root.$emit("handleError", error)
			);
		},
		// 判断是否有银行卡
		getQkBank(type) {
			this.$api.request("API_GET_USER_BANKS").then(
				success => {
					let data = success.Data.data;
					if (data === "") {
						this.isShowObj.isShow = true;
						this.isShowObj.text = "您还没有绑定银行卡，无法提现，是否先去绑定银行卡";
						this.isShowObj.path = "BankManages";
					} else {
						this.showTang = false;
						if (type === 1) {
							this.$router.replace({ name: "withdrawCash" });
						} else {
							this.$router.push({ name: "withdrawCash" });
						}
					}
				},
				error => this.$root.$emit("handleError", error)
			);
		},
		// 重置关闭按钮
		closeShow(msg) {
			this.showTang = msg;
			this.tabActive = 1;
			this.isShowObj.isShow = false;
			if (msg) {
				this.addBankData();
			}
		}
	}
};

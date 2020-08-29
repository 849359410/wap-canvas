export default {
	created() {
		let original = this.$stores.get("s"),
			de =
				this.$helps.getUrlParam("de") ||
				this.$stores.get("de").value ||
				this.$stores.get("de") ||
				2;
		if (this.$helps.getUrlParam("s") && de !== 2) {
			const data = this.$route.query.de;
			this.$router.replace({ name: "Index", query: { de: data } });
		}
		this.$stores.set("de", Number(de));
		Number(de) === 2
			? this.$store.dispatch("setIsApp", false)
			: this.$store.dispatch("setIsApp", true);
		this.$store.dispatch("setPlatformFlag", Number(de));
		if (original) {
			this.$stores.set("s", original);
			this.$store.dispatch("setToken", original);
			this.handleLoadUserMessage();
		} else {
			this.$store.dispatch("setLoginStatus", false);
			this.$stores.remove("s");
		}
		this.getLotteryEg();
	},
	mounted() {
		// 监听成功信息
		this.$on("handleSuccess", successMsg => this.handleToast(successMsg, 1));

		// 监听错误信息
		this.$on("handleError", (errorMsg, typeStatus = 0) => {
			this.$helps.hideLoading();
			const errorType = typeof errorMsg;
			switch (errorType) {
				case "string":
					this.handleToast(errorMsg, 2);
					break;
				case "object":
					if (errorMsg.hasOwnProperty("Code")) {
						this.handleErrorEvent(errorMsg, typeStatus);
					}
					if (errorMsg.hasOwnProperty("status")) {
						console.warn(errorMsg.message);
					}
					break;
				default:
			}
		});

		// 监听弹窗提示
		this.$on("handleAlert", alertMsg => {
			this.$dialog.alert({
				title: "温馨提示",
				message: alertMsg,
				confirmButtonColor: "#ef384a"
			});
		});

		// 处理用户登录
		this.$on("handleUserLogin", loginInfo => {
			this.$store.dispatch("setUserMessage", loginInfo);
			this.$stores.set("s", loginInfo.Token);
		});

		// 处理用户退出
		this.$on("handleUserLoginOut", () => {
			this.$api.request("API_USER_LOGIN_OUT").then(
				success => {
					this.$emit("handleSuccess", success.Msg);
					this.handleClearLoginInformation();
				},
				message => {
					this.$emit("handleError", message);
					this.$router.push({ name: "Index" });
				}
			);
		});

		// 处理拉取用户信息
		this.$on("getUserMessage", () => this.handleLoadUserMessage());

		// 监听页面状态
		document.addEventListener("visibilitychange", () => {
			this.$store.dispatch("setPageStatus", document.visibilityState);
		});
	},
	methods: {
		async handleLoadUserMessage() {
			await this.$api.request("API_GET_USER").then(
				success => this.$store.dispatch("setUserMessage", success.Data),
				error => {
					if (
						error.hasOwnProperty("Code") &&
						error.Code === "1109" &&
						this.$route.name === "Index"
					) {
						this.handleClearLoginInformation();
					} else {
						this.$emit("handleError", error);
					}
				}
			);
		},
		async getLotteryEg() {
			// 获取直播彩种信息
			this.$api.request("API_GET_FC_GAME_BY_CATE_LIVE").then(
				success => {
					this.$store.dispatch("setLiveLottery", success.Data[0]);
				},
				error => {
					this.$root.$emit("handleError", error);
				}
			);
		},
		// 清除登录信息
		handleClearLoginInformation() {
			this.$router.push({ name: "Index" });
			this.$store.dispatch("setLoginStatus", false);
			this.$stores.remove("s");
			this.$stores.remove("bg");
			this.$stores.remove("ag");
			this.$stores.remove("ky");
		},
		// 处理烤面包提示
		handleToast(message, num) {
			if (document.visibilityState !== "visible") return;
			if (typeof message === "undefined" || !message) return;
			if (num === 1) this.$toast.success(message);
			else this.$toast.fail(message);
		},
		// 处理错误事件
		handleErrorEvent(errorMsg, type) {
			if (type === 1) this.handleToast(errorMsg.Data, 2);
			else this.handleToast(errorMsg.Msg, 2);
			if (
				errorMsg.hasOwnProperty("Code") &&
				errorMsg.Code === "1109" &&
				this.$route.name !== "login"
			) {
				this.handleClearLoginInformation();
			}
		}
	}
};

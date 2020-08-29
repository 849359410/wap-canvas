export default {
	data() {
		return {
			showClick: true,
			passWordShow: false,
			placeMoney: "",
			yuBaoInContent: "",
			yuBaoInMoney: "",
			yuBaoMoney: "",
			turnMoney: "",
			inMoney: "",
			inMoneyToday: "",
			tipsShow: false,
			tipsText: "",
			balanceMoney: false,
			postFromOut: {
				source_type: Number(this.$stores.get("de")),
				qk_pwd: "",
				money: 0
			},
			postFromIn: {
				source_type: Number(this.$stores.get("de")),
				out_money: 0,
				qk_pwd: ""
			},
			showKeyboard: false
		};
	},
	watch: {
		turnMoney(n) {
			if (n === 0) return;
			if (this.tipsShow) {
				this.showClick = true;
			} else this.showClick = n === "";
		},
		passWordShow(n) {
			if (n === false) this.$refs.dialog.passWord = "";
		}
	},
	created() {
		this.type = Number(this.$route.params.type);
	},
	methods: {
		isNumber(num) {
			if (Number(num)) {
				let x = String(num).indexOf(".") + 1; //小数点的位置
				let y = String(num).length - x; //小数的位数
				if (y > 2) {
					return num.substring(0, num.indexOf(".") + 3).toString();
				}
			}
			return "";
		},
		judgeMoney() {
			let reg = /(^\d+\.?$)|(^\d+\.[0-9]{1,2}$)/;
			if (!reg.test(this.turnMoney)) this.turnMoney = this.isNumber(this.turnMoney);
			if (Number(this.turnMoney) === 0) this.turnMoney = "";
			this.tipsShow = false;
			let input_money = Number(this.turnMoney);
			this.getTips(input_money);
		},
		allMoney() {
			if (this.type === 1) {
				this.turnMoney = this.yuBaoInMoney;
			} else this.turnMoney = this.yuBaoMoney;
			this.judgeMoney();
		},
		clickPass() {
			if (this.showClick) return;
			if (this.yuBaoInContent.dif_money > 0) {
				return this.$root.$emit(
					"handleError",
					`未满足打码要求，无法${this.$route.meta.name}，还差【${this.yuBaoInContent.dif_money}】打码量`
				);
			}
			this.passWordShow = true;
		},
		// type 1转入 2转出
		getYuMoney(type) {
			this.$api
				.request("API_GET_YUEBAO_CONFIG", {
					etype: type
				})
				.then(
					success => {
						this.yuBaoInContent = success.Data;
						this.getTurnData();
					},
					error => this.$root.$emit("handleError", error)
				);
			if (type === 2) {
				this.$api.request("API_Y_GET_USER_MONEY").then(
					success => {
						this.yuBaoMoney = success.Data;
						this.placeMoney = this.yuBaoMoney;
					},
					error => {
						this.$root.$emit("handleError", error);
					}
				);
			}
		},
		moneyRule() {
			if (this.turnMoney) this.turnMoney = parseFloat(this.turnMoney).toString();
		},
		async getTotalInMoney(type) {
			await this.$api.request("API_GET_USER_TOTAL_IN_MONEY_TODAY").then(
				success => {
					this.inMoneyToday = success.Data;
					this.inMoney = Number(success.Data.tolal_in_money);
					this.getYuMoney(type);
				},
				error => this.$root.$emit("handleError", error)
			);
		},
		getErr(errMsg, path) {
			this.$root.$emit("handleError", errMsg);
			this.$router.push({ name: path });
		},
		onInput(key) {
			this.$refs.dialog.getInput(key);
		},
		onDelete() {
			this.$refs.dialog.getDelete();
		},
		onBlue() {
			this.showKeyboard = false;
		}
	}
};

<template>
	<div class="updatePwd">
		<van-tabs v-model="liIndex" @click="changePwd">
			<van-tab title="登录密码">
				<van-cell-group class="updatePwd--box">
					<van-field
						v-for="(item, index) in liData[0]"
						:key="index"
						v-model="item.value"
						type="password"
						:label="item.title"
						:placeholder="item.text"
						input-align="right"
						@input="dealWith(item)"
					></van-field>
				</van-cell-group>
				<p>
					<i class="tips">温馨提示:</i>
					登录密码由
					<i>6-12</i>
					个字符组成，区分大小写，为了提升您的安全性，请使用
					<i>英文加数字密码</i>
				</p>
			</van-tab>
			<van-tab title="安全密码">
				<van-cell-group class="updatePwd--box">
					<van-field
						v-for="(item, index) in liData[1]"
						:key="index"
						v-model="item.value"
						type="password"
						:label="item.title"
						:placeholder="item.text"
						input-align="right"
						@input="dealWith(item)"
					></van-field>
				</van-cell-group>
				<p>
					<i class="tips">温馨提示:</i>
					安全密码由
					<i>4</i>
					位数字组成
				</p>
			</van-tab>
			<div class="comfirm-update" @click="updatePwd">确认修改</div>
		</van-tabs>
		<qk-Alert v-if="isShowObj.isShow" :msg-show="isShowObj"></qk-Alert>
	</div>
</template>

<script>
import QkAlert from "../../../components/qkAlert";
export default {
	name: "UpdatePwd",
	components: {
		QkAlert
	},
	data() {
		return {
			isShowObj: {
				isShow: false,
				text: "安全密码已设置成功，是否立即绑定银行卡？",
				path: ""
			},
			isOpen: 1,
			liIndex: 0,
			tips: {
				opwd: "原密码",
				npwd: "新密码",
				cpwd: "确认密码"
			},
			liData: [
				[
					{ title: "原密码:", text: "请输入原密码", key: "olpass", value: "" },
					{ title: "新密码:", text: "请输入新密码", key: "nlpass", value: "" },
					{
						title: "确认密码:",
						text: "确认密码，须与新密码一致",
						key: "clpass",
						value: ""
					}
				],
				[
					{ title: "原密码:", text: "请输入原密码", key: "ompass", value: "" },
					{ title: "新密码:", text: "请输入新密码", key: "nmpass", value: "" },
					{
						title: "确认密码:",
						text: "确认密码，须与新密码一致",
						key: "cmpass",
						value: ""
					}
				]
			],
			password: {
				olpass: "", //原来登录密码
				nlpass: "", //新的登录密码
				clpass: "", //确认密码
				ompass: "", //原来取款密码
				nmpass: "", //新的取款密码
				cmpass: "" // 确认密码
			}
		};
	},
	created() {
		this.isHave();
		if (this.$route.params.num || this.$route.query.num) {
			this.liIndex = Number(this.$route.params.num || this.$route.query.num);
			this.changePwd(this.liIndex);
		}
	},
	methods: {
		isHave() {
			this.$api.request("API_GET_CHECK_USER_QK_PWD").then(success => {
				let data = success.Data;
				if (data === 1) {
					this.isOpen = 1;
					this.liData[1].splice(0, 1);
					this.liData[1][0].title = "密码:";
				} else {
					this.isOpen = 2;
				}
			});
		},
		dealWith(item) {
			switch (item.key) {
				case "olpass":
					this.password.olpass = item.value;
					break;
				case "nlpass":
					this.password.nlpass = item.value;
					break;
				case "clpass":
					this.password.clpass = item.value;
					break;
				case "ompass":
					this.password.ompass = item.value;
					break;
				case "nmpass":
					this.password.nmpass = item.value;
					break;
				case "cmpass":
					this.password.cmpass = item.value;
					break;
			}
		},
		//切换修改密码
		changePwd(index) {
			this.liIndex = index;
		},
		//验证6-12位数字加字母
		checkLoginPwd(obj) {
			let reg = /^[0-9A-Za-z]{6,12}$/,
				msg = true;
			for (let k in obj) {
				msg = reg.test(obj[k]);
			}
			return msg;
		},
		//验证4位数字
		checkMoneyPwd(obj) {
			let reg = /^[0-9]{4}$/,
				msg = true;
			for (let k in obj) {
				if (this.isOpen === 2) {
					if (!reg.test(obj[k])) msg = reg.test(obj[k]);
				} else {
					msg = !(!reg.test(obj.npwd) || !reg.test(obj.cpwd));
				}
			}
			return msg;
		},
		//验证两个密码是否相等
		checkSame(obj) {
			if (obj["npwd"] == obj["cpwd"]) {
				return true;
			} else return false;
		},
		//刷新密码框
		isClear() {
			this.liData.forEach(v => {
				v.forEach(i => {
					i.value = "";
				});
			});
			this.password.ompass = "";
			this.password.cmpass = "";
			this.password.nmpass = "";
			this.password.olpass = "";
			this.password.clpass = "";
			this.password.nlpass = "";
		},
		// 修改密码
		updatePwd() {
			let obj = {},
				params = {},
				url =
					this.liIndex === 0 ? "API_POST_UPDATE_USER_PWD" : "API_POST_UPDATA_USER_QK_PWD";
			if (this.isOpen === 1) {
				obj =
					this.liIndex === 0
						? {
								opwd: this.password.olpass,
								npwd: this.password.nlpass,
								cpwd: this.password.clpass
						  }
						: {
								npwd: this.password.nmpass,
								cpwd: this.password.cmpass
						  };
			} else if (this.isOpen === 2) {
				obj =
					this.liIndex === 0
						? {
								opwd: this.password.olpass,
								npwd: this.password.nlpass,
								cpwd: this.password.clpass
						  }
						: {
								opwd: this.password.ompass,
								npwd: this.password.nmpass,
								cpwd: this.password.cmpass
						  };
			}
			params =
				this.liIndex === 0
					? {
							opass: this.password.olpass,
							pass: this.password.nlpass
					  }
					: {
							opass: this.password.ompass,
							pass: this.password.nmpass
					  };
			//验证是否为空
			this.isOpen === 1 ? (this.tips.npwd = "密码") : (this.tips.npwd = "新密码");
			let Tips = false,
				tipsMsg = "";
			if (obj.opwd === obj.npwd) {
				Tips = true;
				tipsMsg = "新密码不能与原密码相同";
			}
			for (let v in obj) {
				if (obj[v] === "") {
					Tips = true;
					tipsMsg = this.tips[v] + "不能为空";
					break;
				}
			}
			if (Tips) {
				this.$root.$emit("handleError", tipsMsg);
				return false;
			}
			if (this.liIndex === 0) {
				if (!this.checkLoginPwd(obj)) {
					this.$root.$emit("handleError", "密码格式错误");
					this.isClear();
					return;
				}
			}
			if (this.liIndex === 1) {
				if (!this.checkMoneyPwd(obj)) {
					this.$root.$emit("handleError", "密码格式错误");
					this.isClear();
					return;
				}
			}
			//验证密码是否相等
			if (!this.checkSame(obj)) {
				this.$root.$emit("handleError", "两次密码输入不一致");
				this.isClear();
				return;
			}
			this.$helps.showLoading();
			this.$api.request(url, params).then(
				success => {
					this.$root.$emit("handleSuccess", success.Msg);
					this.$api.request("API_GET_USER_BANKS").then(
						success => {
							setTimeout(() => {
								this.$helps.hideLoading();
							}, 500);
							let data = success.Data.data;
							if (!data && this.liIndex === 1) {
								this.isShowObj.isShow = true;
								this.isShowObj.text = "安全密码已设置成功，是否立即绑定银行卡？";
								this.isShowObj.path = "BankManages";
							} else {
								this.isShowObj.isShow = false;
								this.$router.push({ name: "MemberCenter" });
							}
						},
						error => this.$root.$emit("handleError", error)
					);
				},
				error => {
					this.$helps.hideLoading();
					if (this.isOpen === 2) {
						if (error.Code === "1106") {
							this.$root.$emit("handleError", "原密码错误");
							return;
						}
						this.$root.$emit("handleError", error);
					}
				}
			);
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/userCenter/updatePwd/updatePwd";
</style>
<style lang="scss">
.updatePwd {
	.van-field__label {
		width: 80px;
		flex: none;
	}
}
</style>

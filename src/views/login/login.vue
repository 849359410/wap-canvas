<template>
	<van-row class="login">
		<van-nav-bar class="top" title="登录">
			<template #left>
				<van-icon class="left" name="arrow-left" @click="$router.push({ name: 'Index' })" />
			</template>
		</van-nav-bar>
		<van-row class="login_logo">
			<img :src="logo" alt="" />
		</van-row>
		<van-row class="content">
			<FieldInput
				v-for="(v, k) of fieldArr"
				:key="k"
				ref="login"
				:ver-code-list="verCodeList"
				:input-msg="v"
				@getVerVode="getVerCode"
				@checkbox="checkboxbtn"
			></FieldInput>
			<van-row class="btm">
				<van-field name="checkbox">
					<template #input>
						<van-checkbox v-model="checkbox" shape="square">记住密码</van-checkbox>
					</template>
				</van-field>
				<div class="forget_password" @click="contactUs">忘记密码?</div>
			</van-row>
			<van-row class="log_in">
				<van-button round block type="info" native-type="submit" @click="onSubmit">
					立即登录
				</van-button>
			</van-row>
			<van-row class="free_account">
				<van-button round block @click="$router.push({ name: 'Register' })">
					免费开户
				</van-button>
			</van-row>
		</van-row>
	</van-row>
</template>

<script>
import { mapState } from "vuex";
import { Base64 } from "@server/singularity";
import login from "../../mixins/login";
import FieldInput from "../register/field_input";
export default {
	name: "Login",
	components: {
		FieldInput
	},
	mixins: [login],
	data() {
		return {
			username: "",
			password: "",
			verCode: "",
			verCodeList: "",
			checkbox: false
		};
	},
	computed: {
		...mapState({
			//页面LOGO图片
			logo: state => state.common.webCommonWap.WebData.logo_wap
		})
	},
	watch: {
		//获取Input框值
		fieldArr: {
			handler(v) {
				v.forEach(i => {
					if (i.name === "username") {
						this.username = i.text;
					} else if (i.name === "password") {
						this.password = i.text;
					} else if (i.name === "yzm") {
						this.verCode = i.text;
					}
				});
			},
			deep: true
		}
	},
	created() {
		//初始化验证码
		this.getVerCode();
	},
	methods: {
		//获取记住密码按钮
		checkboxbtn(i) {
			this.checkbox = i;
		},
		// 获取验证码图片
		getVerCode() {
			this.$api.request("API_GET_CODE").then(
				success => {
					this.verCodeList = success.Data;
				},
				error => {
					this.$root.$emit("handleError", error);
				}
			);
		},

		//忘记密码
		contactUs() {
			this.$root.$emit("handleError", "请联系客服");
		},
		onSubmit() {
			this.$refs.login.forEach(v => {
				v.InputRules(v.inputMsg);
			});
			if (this.username && this.password && this.verCode) {
				this.$root.$emit("restocking", "de");
				this.$api
					.request("API_LOGIN", {
						username: this.username,
						password: this.password,
						yzm: this.verCode,
						source_type: Number(this.$stores.get("de")),
						idkey: this.verCodeList.idKey
					})
					.then(
						success => {
							const data = success.Data;
							this.$stores.set("s", data.Token);
							// 记住密码
							if (this.checkbox) {
								this.$stores.set("username", this.username);
								this.$stores.set("password", new Base64(this.password).encode());
							} else {
								this.$stores.remove("password");
								this.$stores.remove("username");
							}
							this.$store.dispatch("setToken", data.Token);
							this.$root.$emit("handleUserLogin", data);
							this.$root.$emit("handleSuccess", success.Msg);
							this.$router.replace({ name: "Index", params: { active: true } });
							this.logRecord();
						},
						error => {
							this.$root.$emit("handleError", error);
							//如果验证码错误则自动清空
							this.$refs.login.forEach(v => {
								if (v.inputMsg.name === "yzm") {
									v.inputMsg.text = "";
								}
							});
						}
					);
			}
		},
		logRecord() {
			this.$api
				.request("LOG_RECORD", {
					params: {
						user_name: this.username,
						action: "login",
						content: "",
						site_type: window.location.href
					}
				})
				.then();
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../src/assets/css/views/login/login.scss";
</style>
<style lang="scss">
.top {
	.van-nav-bar__title {
		color: #ffffff !important;
	}
}
.AgentLogin_label {
	.van-field__label {
		flex: none;
		box-sizing: border-box;
		width: 29%;
	}
}
.btm {
	.van-cell:after {
		border: none;
	}
	.van-icon-success {
		border-radius: 100%;
	}
	.van-checkbox__label {
		color: #ccc;
	}
	.van-checkbox__icon--checked .van-icon {
		background-color: #ef3e29;
		border-color: #ef3e29;
	}
	.van-field__label {
		flex: none;
		box-sizing: border-box;
		width: 22%;
	}
}
</style>

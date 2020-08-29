<template>
	<van-row class="register">
		<register-head :active="`Register`"></register-head>
		<van-row class="register_box">
			<van-row class="register_from">
				<van-row class="register_header_tips" v-html="headerContent"></van-row>
				<van-row class="register_form_count">
					<van-cell-group>
						<fieldInput
							v-for="(v, k) in fieldArr"
							ref="register"
							:key="k"
							:field-arr="fieldArr"
							:input-msg="v"
							:time-popup-layer="timePopupLayer"
							:new-time="newTime"
							:ver-code-list="verCodeList"
							:password="password"
							@gettime="ShowBirthday"
							@getVerVode="getVerVode"
						/>
					</van-cell-group>
				</van-row>
				<van-row class="register_memCash_confirm">
					<button class="left_button" @click="reset()">
						重新设定
					</button>
					<button class="right_button" type="submit" @click="registered">
						立即注册
					</button>
				</van-row>
				<van-row class="register_bottom">
					已有账户! &nbsp;<router-link :to="{ name: 'login' }">现在登录</router-link>
				</van-row>
			</van-row>
		</van-row>
		<datetime-picker
			v-show="timePopupLayer"
			:time-popup-layer="timePopupLayer"
			@closeBirthday="showPicker"
		></datetime-picker>
	</van-row>
</template>
<script>
import RegisterHead from "./register_head";
import DatetimePicker from "../../components/datetimePicker";
import props from "../../mixins/props";
import fieldInput from "./field_input";
export default {
	name: "Register",
	components: {
		RegisterHead,
		DatetimePicker,
		fieldInput
	},
	mixins: [props],
	data() {
		return {
			headerContent: "",
			timePopupLayer: false,
			newTime: "",
			status: {},
			fieldArr: [],
			params: {},
			verCodeList: {},
			password: ""
		};
	},
	created() {
		this.getUserRegConfig();
		this.getVerVode();
	},
	methods: {
		// 复制邀请码或介绍人.
		CopyICode() {
			let code = document.URL.split("?");
			if (code.length === 2) {
				this.$stores.set("user_code", code[1]);
			}
			let at_id = this.$stores.get("at_id"),
				user_code = this.$stores.get("user_code");
			if (typeof at_id === "string" && at_id.length > 0) {
				this.fieldArr.forEach(v => {
					if (v.name === "intrs") {
						v.text = at_id;
					}
				});
			}
			if (typeof user_code === "string" && user_code.length > 0) {
				this.fieldArr.forEach(v => {
					if (v.name === "pid") {
						v.text = user_code;
					}
				});
			}
		},
		//获取验证码图片
		getVerVode() {
			this.$api.request("API_GET_CODE").then(
				success => {
					this.verCodeList = success.Data;
				},
				error => {
					this.$root.$emit("handleError", error);
				}
			);
		},
		//获取会员注册设定.
		getUserRegConfig() {
			this.$api.request("API_GET_USER_REG_CONFIG").then(
				success => {
					if (success.Data.r.is_work === 2 || success.Data.r === "") {
						this.$root.$emit("handleError", "系统禁用了会员注册，请联系客服！");
						let arr = ["username", "password", "pwdUnanimous", "name", "qk_pwd"];
						this.member_data.forEach(v => {
							if (arr.indexOf(v.name) > -1) {
								this.fieldArr.push(v);
							}
						});
					} else {
						if (success.Data.i instanceof Array && success.Data.i.length > 0) {
							this.headerContent = success.Data.i[0].content || "";
						}
						//获取所有状态
						this.status = Object.assign(this.status, success.Data.r);
						//获取所有已开启的
						this.fieldArr = this.member_data.filter(
							v => (v.correspond && this.status[v.correspond] === 1) || !v.correspond
						);
						//是否必填或是否唯一
						this.fieldArr.forEach(v => {
							if (v.correspond) {
								switch (v.name) {
									default:
										//验证码单独处理
										if (v.name === "yzm") {
											v.required = true;
										} else {
											v.required = this.status[`${v.name}_must`] === 1;
										}
										v.only = this.status[`${v.name}_only`] === 1;
										break;
								}
							}
						});
						this.CopyICode();
					}
				},
				error => this.$root.$emit("handleError", error)
			);
		},
		//立即注册信息
		changeValue() {
			this.fieldArr.forEach(v => {
				this.params[v.Registered_name] = v.text;
			});
			this.params.source_type = Number(this.$stores.get("de"));
			this.params.idkey = this.$refs.register.verCodeList
				? this.$refs.register.verCodeList.idKey
				: "";
			this.params.at_id = this.params.at_id === "" ? 0 : parseInt(this.params.at_id, 10);
			this.params.user_code =
				this.params.user_code === "" ? null : parseInt(this.params.user_code, 10);
		},
		//生日弹框开启
		ShowBirthday(i) {
			this.timePopupLayer = i;
		},
		//关闭生日弹框
		showPicker(v, k) {
			this.timePopupLayer = v;
			this.newTime = k;
		},
		//重新设定
		reset() {
			let a = document.getElementsByTagName("input");
			for (let i = 0; i < a.length; i++) {
				a[i].blur();
			}
			let allInput = this.$refs.register;
			allInput.forEach(v => {
				v.error = "";
				v.inputMsg.text = "";
			});
		},
		//立即注册
		registered() {
			this.$refs.register.forEach(v => {
				v.InputRules(v.inputMsg);
			});

			let error = this.$refs.register.find(v => v.error !== "");
			if (error) return;
			this.changeValue();
			this.$helps.showLoading();
			setTimeout(() => {
				this.$api.request("API_POST_USER_REG_TO_WAP", { params: this.params }).then(
					success => {
						this.$helps.hideLoading();
						const data = success.Data;
						data.is_sw = success.IsDemo;
						this.$root.$emit("handleUserLogin", data);
						this.$stores.remove("password");
						this.$root.$emit("handleSuccess", success.Msg);
						this.logRecord();
						this.$router.push({ name: "Index" });
					},
					error => {
						this.$root.$emit("handleError", error.Msg);
					}
				);
			}, 1000);
		},
		//日志打点
		logRecord() {
			this.$api
				.request("LOG_RECORD", {
					params: {
						user_name: this.params.name,
						action: "register",
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
@import "../../assets/css/views/register/register";
</style>

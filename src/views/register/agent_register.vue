<template>
	<van-row class="agentRegister">
		<register-head :active="`AgentRegister`"></register-head>
		<van-row class="agentRegister_box">
			<van-row class="agentRegister_from">
				<van-row class="agentRegister_header-tips" v-html="agentInfo"></van-row>
				<van-row class="agentRegister_form_count">
					<van-row>
						<van-row class="info_title">
							<FieldInput
								v-for="(v, k) in fieldArr"
								ref="child"
								:key="k"
								:field-arr="fieldArr"
								:password="password"
								:input-msg="v"
								:show-picker="showPicker"
								@secretCode="secretCode"
								@showPickerChange="showPickerChange"
							></FieldInput>
						</van-row>
						<van-row class="info_fill">
							<van-checkbox v-model="Agreement" class="checkBt" shape="square"
								>本人同意<router-link :to="{ name: 'AllianceAgreement' }"
									>《联盟协议》</router-link
								></van-checkbox
							>
						</van-row>
						<van-row class="agentRegister_memCash_confirm">
							<van-button class="left_button" native-type="button" @click="Reset">
								重新设定
							</van-button>
							<van-button class="right_button" type="info" @click="submit">
								立即注册
							</van-button>
						</van-row>
					</van-row>
				</van-row>
			</van-row>
		</van-row>
		<picker :show-picker="showPicker" @getback="getback" @closeback="closeback"></picker>
	</van-row>
</template>

<script>
import RegisterHead from "./register_head";
import picker from "../../components/picker";
import FieldInput from "./field_input";
import data from "../../mixins/data";
export default {
	name: "AgentRegister",
	components: {
		RegisterHead,
		picker,
		FieldInput
	},
	mixins: [data],
	data() {
		return {
			Agreement: true,
			agentInfo: "",
			status: {},
			fieldArr: [],
			params: {},
			password: "",
			value: "",
			showPicker: false
		};
	},
	created() {
		this.getInfoConfig();
	},
	methods: {
		//出款银行
		getback(show, val, id) {
			this.showPicker = show;
			this.fieldArr.forEach(v => {
				if (v.name === "bank_id") {
					v.text = val;
					this.params.bank_id = id;
				}
			});
		},
		//出款银行取消按钮
		closeback(show) {
			this.showPicker = show;
		},
		// 显示出款银行弹框
		showPickerChange(show) {
			this.showPicker = show;
		},
		//获取密码
		secretCode(i) {
			this.password = i;
		},
		// 注册
		submit() {
			if (this.Agreement === false) {
				return this.$root.$emit("handleError", "请先同意服务条款");
			}
			this.$refs.child.forEach(v => {
				v.InputRules(v.inputMsg);
			});
			let error = this.$refs.child.find(v => v.error !== "");
			if (error) return;
			this.changeValue();
			setTimeout(() => {
				this.$api.request("API_POST_USER_AGENT_API", { params: this.params }).then(
					success => {
						this.$root.$emit("handleSuccess", success.Msg);
						setTimeout(() => {
							this.$router.push({ name: "Index" });
						}, 2000);
					},
					error => {
						this.$helps.hideLoading();
						this.$root.$emit("handleError", error.Msg);
					}
				);
			}, 1000);
		},
		// 注册接口所需参数
		changeValue() {
			this.fieldArr.forEach(v => {
				if (v.Registered_name !== "bank_id") {
					this.params[v.Registered_name] = v.text;
				}
			});
		},
		// 获取代理注册所有参数
		getInfoConfig() {
			if (this.$route.name === "AgentRegister") {
				this.$api.request("API_GET_USER_AGENT_API_CONFIG").then(
					success => {
						if (
							success.Data.data.is_work === 0 ||
							success.Data.data.is_work === 2 ||
							success.Data.data === ""
						) {
							this.$router.push({ name: "Index" });
							this.$root.$emit("handleError", "系统停用代理注册，请联系客服！");
						} else {
							this.status = Object.assign(this.status, success.Data.data);
							this.agentInfo = success.Data.tdata.content;
							this.fieldArr = this.member_data.filter(
								v =>
									(v.correspond && this.status[v.correspond] === 1) ||
									!v.correspond
							);
							this.fieldArr.forEach((v, k) => {
								if (v.correspond) {
									switch (v.name) {
										case "bank_id":
										case "bank_account":
										case "bank_address":
											v.required = this.status.bank_must === 1;
											break;
										default:
											v.required = this.status[`${v.name}_must`] === 1;
											v.only = this.status[`${v.name}_only`] === 1;
											break;
									}
								}
								if (k === 3 && v.name !== "bank_id") {
									v.topTitle = "代理基本资料";
								}
							});
						}
					},
					error => this.$root.$emit("handleError", error)
				);
			}
		},
		//重新设定
		Reset() {
			let a = document.getElementsByTagName("input");
			for (let i = 0; i < a.length; i++) {
				a[i].blur();
			}
			let allInput = this.$refs.child;
			allInput.forEach(v => {
				v.inputMsg.text = "";
				v.error = "";
			});
		}
	}
};
</script>

<style lang="scss">
@import "../../assets/css/views/register/agent_register";
</style>

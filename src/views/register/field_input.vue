<template>
	<van-row class="fieldInput" :style="inputMsg.name === 'yzm' ? 'position: relative' : ''">
		<van-row v-if="inputMsg.topTitle" class="fieldInput_title">{{ inputMsg.topTitle }}</van-row>
		<van-field
			v-model="inputMsg.text"
			class="fieldInput_label"
			:type="inputMsg.type"
			:name="inputMsg.name"
			:label="inputMsg.label"
			:minlength="inputMsg.minLength"
			:maxlength="inputMsg.maxLength"
			:placeholder="inputMsg.placeholder"
			:required="inputMsg.required"
			autocomplete="off"
			:readonly="inputMsg.name === 'bank_id' || inputMsg.name === 'birthday'"
			:error-message="error"
			:right-icon="inputMsg.name === 'bank_id' || inputMsg.name === 'birthday' ? 'arrow' : ''"
			@click="showPickerchange(inputMsg.name)"
			@input="InputRules(inputMsg)"
		></van-field>
		<img v-if="inputMsg.show" :src="verCodeList.Img" @click="code()" />
		<div v-show="inputMsg.tips" class="regtips">{{ inputMsg.tips }}</div>
	</van-row>
</template>
<script>
import validator from "../../mixins/validator";
import { Base64 } from "@server/singularity";
export default {
	mixins: [validator],
	props: {
		inputMsg: {
			type: Object,
			default: () => {}
		},
		timePopupLayer: {
			type: Boolean,
			default() {
				return false;
			}
		},
		newTime: {
			type: String,
			default() {
				return "";
			}
		},
		verCodeList: {
			type: Object,
			default() {
				return {};
			}
		},
		fieldArr: {
			type: Array,
			default() {
				return [];
			}
		},
		showPicker: {
			type: Boolean,
			default() {
				return false;
			}
		}
	},
	data() {
		return {
			error: ""
		};
	},
	watch: {
		//更新生日model
		newTime(value) {
			if (this.inputMsg.name === "birthday") {
				this.inputMsg.text = value;
			}
		}
	},
	created() {
		if (this.$route.name === "login") {
			//获取已记住的密码
			if (this.inputMsg.name === "password") {
				if (this.$stores.get("password")) {
					this.inputMsg.text = new Base64(this.$stores.get("password")).decode();
					this.checkbox = true;
					this.$emit("checkbox", this.checkbox);
				}
			}
			if (this.inputMsg.name === "username") {
				//获取已记住的账号
				if (this.$stores.get("username")) {
					this.inputMsg.text = this.$stores
						.get("username")
						.replace('"', "")
						.replace('"', "");
				}
			}
		}
	},
	methods: {
		//切换验证码
		code() {
			this.$emit("getVerVode");
		},
		//生日弹框与银行弹框
		showPickerchange(name) {
			if (name === "bank_id") {
				this.showPicker = !this.showPicker;
				this.$emit("showPickerChange", this.showPicker);
			}
			if (name === "birthday") {
				this.timePopupLayer = !this.timePopupLayer;
				this.$emit("gettime", this.timePopupLayer);
			}
		},
		/**
		 * @return {string}
		 */
		//验证规则, item为当前数据
		InputRules(item) {
			//禁用空格
			if (item.text) {
				item.text = item.text.replace(/\s+/g, "");
			}
			let name = item.name;
			switch (name) {
				case "intrs":
				case "pid":
				case "agent_registration":
				case "password":
				case "email":
				case "mobile":
				case "qq":
				case "weixin":
				case "bank_id":
				case "bank_account":
				case "bank_address":
				case "qk_pwd":
					return this.isJsr(item, this.inputMsg.text);
				case "username":
				case "yzm":
					return this.agentNameRule(item, this.inputMsg.text, this.verCodeList);
				case "pwdUnanimous":
					this.fieldArr.forEach(i => {
						if (i.name === "password") {
							this.password = i.text;
						}
					});
					return this.pwdUnanimousRule(this.inputMsg.text, this.password);
				case "name":
					return this.realNameRule(item, this.inputMsg.text);
			}
		}
	}
};
</script>
<style lang="scss">
@import "../../assets/css/views/register/field_input";
</style>

export default {
	methods: {
		//介绍人,邀请码,代理注册账号,密码,邮箱,手机,qq,微信
		isJsr(item, value) {
			if (item.rule) {
				if ((value && item.rule.test(value)) || (!value && !item.required))
					return (this.error = "");
				else if (!value) this.error = `${item.label}不能为空`;
				else this.error = `${item.label}格式错误`;
			} else if (item.name === "password") {
				if ((value && value.length >= 6) || (!value && !item.required))
					return (this.error = "");
				else if (!value) this.error = `${item.label}不能为空`;
				else this.error = `${item.label}最小长度为6位`;
			} else {
				if (value || (!value && !item.required)) return (this.error = "");
				else if (!value) this.error = `${item.label}不能为空`;
			}
		},
		//会员注册账号,验证码,姓名唯一
		agentNameRule(item, value, key) {
			let params = {};
			if (item.name === "yzm") {
				params.idkey = key.idKey;
				params.code = value;
			} else if (item.name === "username") {
				params.username = value;
			} else {
				params.name = value;
			}
			let times = null;
			if (item.api) {
				this.$api.request(item.api, params).then(
					success => {
						clearInterval(times);
						if (item.label === "账号") {
							// 为0表示返回的是错误信息
							if (success.Data === 0) {
								this.error = success.Msg;
							}
						} else if (item.label === "真实姓名") {
							if (success.Data === 0) {
								this.error = success.Msg;
								times = setTimeout(() => {
									this.inputMsg.text = "";
								}, 1000);
							}
						} else {
							this.error = "";
						}
					},
					() => {
						if (item.label === "验证码") {
							if (!value) this.error = `${item.label}不能为空`;
							else this.error = `${item.label}错误`;
						}
					}
				);
			}
			if (item.rule) {
				if ((value && item.rule.test(value)) || (!value && !item.required))
					return (this.error = "");
				else if (!value) this.error = `${item.label}不能为空`;
				else this.error = `${item.label}格式错误`;
			} else {
				if (value) this.error = "";
				else if (!value) this.error = `${item.label}不能为空`;
			}
		},
		//确认密码
		pwdUnanimousRule(value, pwd) {
			if (value && value === pwd) return (this.error = "");
			else if (!value) this.error = "确认密码不能为空";
			else this.error = "两次密码不一致";
		},
		//验证姓名
		realNameRule(item, value) {
			if (value && item.only) this.agentNameRule(item, value);
			if (
				(value && item.rule1.test(value)) ||
				(value && item.rule2.test(value)) ||
				(!value && !item.required)
			)
				return (this.error = "");
			else if (!value) this.error = "真实姓名不能为空";
			else this.error = "姓名格式错误";
		}
	}
};

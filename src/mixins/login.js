export default {
	data() {
		return {
			fieldArr: [
				{
					name: "username",
					text: "",
					Registered_name: "username",
					label: "用户名",
					type: "text",
					placeholder: "请输入用户名",
					required: true
				},
				{
					name: "password",
					text: "",
					Registered_name: "password",
					type: "password",
					label: "密码",
					placeholder: "请输入密码",
					required: true
				},
				{
					name: "yzm",
					text: "",
					Registered_name: "yzm",
					type: "tel",
					maxLength: "4",
					label: "验证码",
					placeholder: "请输入验证码",
					show: true,
					required: true
				}
			]
		};
	}
};

export default {
	data() {
		return {
			member_data: [
				{
					name: "intrs",
					text: "",
					Registered_name: "at_id",
					label: "介绍人",
					type: "tel",
					placeholder: "请输入介绍人",
					maxLength: "9",
					correspond: "is_intrs",
					required: false,
					error: "",
					rule: /^[0-9]*$/
				},
				{
					name: "pid",
					text: "",
					Registered_name: "user_code",
					label: "邀请码",
					type: "text",
					placeholder: "请输入邀请码",
					correspond: "is_pid",
					required: false,
					error: ""
				},
				{
					name: "username",
					text: "",
					Registered_name: "username",
					label: "账号",
					type: "text",
					maxLength: "11",
					minLength: "4",
					placeholder: "4-11位 (小写字母，数字或组合)",
					required: true,
					error: "",
					rule: /^[0-9a-z\d][0-9a-z\d]{3,11}$/,
					api: "API_GET_USER_CHECK_USER_NAME"
				},
				{
					name: "password",
					text: "",
					Registered_name: "password",
					label: "密码",
					type: "password",
					maxLength: "12",
					minLength: "6",
					placeholder: "6-12位 (大小写字母加数字组合)",
					required: true,
					error: "",
					rule: /^[0-9A-Za-z]{6,12}$/
				},
				{
					name: "pwdUnanimous",
					text: "",
					label: "确认密码",
					type: "password",
					maxLength: "12",
					minLength: "6",
					placeholder: "请确认密码",
					required: true,
					error: ""
				},
				{
					name: "name",
					text: "",
					Registered_name: "name",
					label: "真实姓名",
					type: "text",
					maxLength: "12",
					minLength: "2",
					placeholder: "请输入真实姓名",
					required: false,
					correspond: "is_name",
					only: false,
					tips: "请输入与银行账户名称相同的姓名【提款认证依据】 !",
					error: "",
					api: "API_GET_USER_CHECK_NAME",
					rule1: /^[\u4E00-\u9FA5\uf900-\ufa2d]+[·•●][\u4E00-\u9FA5\uf900-\ufa2d]{1,9}$/,
					rule2: /^[\u4E00-\u9FA5\uf900-\ufa2d]{2,10}$/
				},
				{
					name: "birthday",
					text: "",
					Registered_name: "birth_date",
					label: "生日",
					type: "text",
					placeholder: "年-月-日",
					required: false,
					correspond: "is_birth_date",
					tips: "例:1991-01-01",
					error: ""
				},
				{
					name: "email",
					text: "",
					Registered_name: "email",
					label: "邮箱",
					type: "text",
					placeholder: "请输入邮箱",
					correspond: "is_email",
					required: false,
					error: "",
					rule: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
				},
				{
					name: "mobile",
					text: "",
					Registered_name: "mobile",
					label: "手机号",
					type: "tel",
					placeholder: "请输入手机号",
					correspond: "is_mobile",
					only: false,
					required: false,
					error: "",
					rule: /^1([3578][0-9]|4[57])[0-9]{8}$/
				},
				{
					name: "qq",
					text: "",
					Registered_name: "qq",
					label: "QQ号码",
					type: "text",
					placeholder: "请输入QQ号码",
					correspond: "is_qq",
					required: false,
					error: "",
					rule: /^[1-9]\d{4,10}$/
				},
				{
					name: "weixin",
					text: "",
					Registered_name: "weixin",
					label: "微信号码",
					type: "text",
					placeholder: "请输入微信号码",
					correspond: "is_weixin",
					required: false,
					error: "",
					rule: /^[a-zA-Z1-9]{1}[-_a-zA-Z0-9]{4,19}$/
				},
				{
					name: "qk_pwd",
					text: "",
					Registered_name: "qk_pwd",
					label: "安全密码",
					type: "text",
					placeholder: "请输入4位数字安全密码",
					required: false,
					correspond: "is_qk_pwd",
					tips: "4位取款密码【提款认证必须，请务必记住】!",
					error: "",
					rule: /^[0-9]{4}$/
				},
				{
					name: "yzm",
					text: "",
					Registered_name: "yzm",
					label: "验证码",
					type: "tel",
					maxLength: "4",
					placeholder: "请输入验证码",
					required: false,
					correspond: "is_code",
					show: true,
					img: "verCodeList.Img",
					error: "",
					api: "API_CHECK_CODE"
				}
			]
		};
	}
};

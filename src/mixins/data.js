export default {
	data() {
		return {
			member_data: [
				{
					topTitle: "注册账号",
					text: "",
					name: "agent_registration",
					Registered_name: "username",
					label: "代理账号",
					type: "text",
					minLength: "4",
					maxLength: "15",
					placeholder: "字母开头,4-15个小写字母,数字或组合",
					required: true,
					error: "",
					rule: /^[a-z]\w{3,14}$/
				},
				{
					name: "password",
					text: "",
					Registered_name: "password",
					label: "设置密码",
					type: "password",
					minLength: "6",
					maxLength: "12",
					placeholder: "6-12个字符(大小写字母加数字组合)",
					required: true,
					error: "",
					rule: /^[0-9A-Za-z]{6,12}$/
				},
				{
					name: "pwdUnanimous",
					text: "",
					label: "确认密码",
					type: "password",
					minLength: "6",
					maxLength: "12",
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
					only: false,
					minLength: "2",
					maxLength: "10",
					placeholder: "请输入真实姓名",
					required: false,
					correspond: "is_name",
					tips: "银行账户名称相同的姓名【提款认证依据】 !",
					error: "",
					api: "API_GET_USER_CHECK_NAME",
					rule1: /^[\u4E00-\u9FA5\uf900-\ufa2d]{2,10}$/,
					rule2: /^[\u4E00-\u9FA5\uf900-\ufa2d]+[·•●][\u4E00-\u9FA5\uf900-\ufa2d]{1,9}$/
				},
				{
					name: "email",
					text: "",
					Registered_name: "email",
					label: "邮箱",
					type: "text",
					minLength: "6",
					maxLength: "18",
					placeholder: "请输入邮箱",
					required: false,
					correspond: "is_email",
					error: "",
					rule: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
				},
				{
					name: "mobile",
					text: "",
					Registered_name: "mobile",
					label: "手机号",
					type: "text",
					maxLength: "11",
					placeholder: "请输入手机号",
					required: false,
					correspond: "is_mobile",
					error: "",
					rule: /^1([3578][0-9]|4[57])[0-9]{8}$/
				},
				{
					name: "qq",
					text: "",
					Registered_name: "qq",
					label: "QQ号码",
					type: "text",
					minLength: "5",
					maxLength: "11",
					placeholder: "请输入QQ号码",
					required: false,
					correspond: "is_qq",
					error: "",
					rule: /^[1-9]\\d{4,10}$/
				},
				{
					topTitle: "代理银行资料",
					name: "bank_id",
					text: "",
					Registered_name: "bank_id",
					label: "出款银行",
					type: "text",
					placeholder: "请选择取款银行",
					required: false,
					correspond: "is_bank",
					error: ""
				},
				{
					name: "bank_account",
					text: "",
					Registered_name: "bank_account",
					label: "银行账号",
					type: "text",
					minLength: "16",
					maxLength: "19",
					placeholder: "请输入16-19为纯数字",
					required: false,
					correspond: "is_bank",
					error: "",
					rule: /^([0-9]{16,19})$/
				},
				{
					name: "bank_address",
					text: "",
					Registered_name: "bank_address",
					label: "开户地址",
					type: "text",
					placeholder: "请输入开户地址",
					required: false,
					correspond: "is_bank",
					error: ""
				}
			]
		};
	}
};

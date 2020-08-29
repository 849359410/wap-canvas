export default {
	data() {
		return {
			img: require("../assets/images/userCenter/news/dsBanner.png"),
			list: [
				{
					content: [
						{
							content: "加入代理既不影响您的正常下注，还可以发展下级，赚取返点佣金。"
						}
					]
				},
				{
					content: [
						{
							icon: require("../assets/images/userCenter/news/1.png"),
							title: "如何赚取返点？"
						},
						{
							icon: require("../assets/images/userCenter/news/quan.png"),
							content:
								"可获得的返点，等于自身返点与下级返点的差值，如自身返点5，下级返点3，你将能获得下级投注金额2%的返点，如下级投注100元，你将会获得2元。\n"
						},
						{
							icon: require("../assets/images/userCenter/news/quan.png"),
							content: "点击下级开户，可查看自身返点，也可为下级设置返点。"
						}
					]
				},
				{
					content: [
						{
							icon: require("../assets/images/userCenter/news/2.png"),
							title: "如何为下级开户？"
						},
						{
							icon: require("../assets/images/userCenter/news/quan.png"),
							content:
								"点击下级开户，然后为您的下级设置返点，设置成功后生成一条邀请码，将邀请码发送给您的下级注册，注册后他就是您的下级，点击会员管理，就能查看他注册的账号；\n"
						},
						{
							icon: require("../assets/images/userCenter/news/quan.png"),
							content:
								"您的下级还能继续发展下级，他发展的下级下注你一样可以赚取返点佣金；"
						}
					]
				},
				{
					content: [
						{
							icon: require("../assets/images/userCenter/news/3.png"),
							title: "温馨提示："
						},
						{
							icon: require("../assets/images/userCenter/news/quan.png"),
							content:
								"返点不同赔率不同。返点越低，赔率就越低，建议为下级设置的返点不要过低；\n"
						},
						{
							icon: require("../assets/images/userCenter/news/quan.png"),
							content: "可在代理报表、投注明细、交易明细查看代理的发展情况；\n"
						},
						{
							icon: require("../assets/images/userCenter/news/quan.png"),
							content: "当然下级无论发展了几级，您都能获得返点。"
						}
					]
				}
			]
		};
	}
};

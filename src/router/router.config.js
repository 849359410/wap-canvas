/**
 * @requireRule 1显示信用玩法规则 2显示官方玩法规则
 * handBar 会员中心头部 true 显示
 * TailShow 底部导航 true 显示
 * @scrollTop 是否在content启用滚动(false 代表启动)
 * isHeight 不实用公共头部适应高度
 * */
export default [
	{
		path: '*"',
		redirect: "/"
	},
	{
		// 首页
		path: "/",
		name: "Index",
		component: () => import("../views/home/Index"),
		meta: { name: "首页", parent: "ChatRoom", rightShow: false, TailShow: true, isHeight: true }
	},
	{
		// 高手计划
		path: "/Plan",
		name: "Plan",
		component: () => import("../views/lottery_plan/plan.vue"),
		meta: { name: "计划", parent: "Index", rightShow: true, handBar: true, TailShow: true }
	},
	{
		// 高手计划
		path: "/PlanLottery",
		name: "PlanLottery",
		component: () => import("../views/lottery_plan/planLottery.vue"),
		meta: { name: "彩种计划", parent: "Plan", rightShow: true, TailShow: true }
	},
	{
		// 计划-单个计划详情
		path: "/killerPlanDetails",
		name: "killerPlanDetails",
		component: () => import("../views/lottery_plan/killerPlanDetails.vue"),
		meta: {
			name: "计划详情",
			parent: "KillerPlanIndex",
			rightShow: true,
			handBar: true,
			TailShow: true
		}
	},
	{
		// 计划-高手计划
		path: "/killerPlanIndex",
		name: "killerPlanIndex",
		component: () => import("../views/lottery_plan/killerPlanIndex.vue"),
		meta: { name: "高手计划", parent: "Plan", rightShow: true, handBar: true, TailShow: true }
	},
	{
		// 长龙助手
		path: "/LongQuery",
		name: "LongQuery",
		component: () => import("../views/chimera/Index.vue"),
		meta: { name: "长龙助手", parent: "Index", handBar: true, requireAuth: true }
	},
	{
		// 长龙说明
		path: "/LongRule",
		name: "LongRule",
		component: () => import("../views/chimera/longRule.vue"),
		meta: { name: "说明", parent: "Index", handBar: true, rightShow: false, requireAuth: true }
	},
	{
		// 购彩大厅
		path: "/BettingHall",
		name: "BettingHall",
		component: () => import("../views/betting/Index"),
		meta: {
			name: "游戏大厅",
			parent: "betting",
			rightShow: false,
			TailShow: true,
			handBar: true
		}
	},
	{
		//登录
		path: "/login",
		name: "login",
		component: () => import("../views/login/login.vue"),
		meta: { name: "登录", parent: "Index", rightShow: false }
	},
	{
		// 注册
		path: "/register",
		name: "Register",
		component: () => import("../views/register/register.vue"),
		meta: { name: "注册", parent: "Index", rightShow: true, scrollTop: true }
	},
	{
		// 代理注册
		path: "/agentRegister",
		name: "AgentRegister",
		component: () => import("../views/register/agent_register.vue"),
		meta: {
			name: "代理注册",
			parent: "Index",
			rightShow: true,
			keepAlive: true,
			scrollTop: true
		}
	},
	{
		// 联盟协议
		path: "/allianceAgreement",
		name: "AllianceAgreement",
		component: () => import("../views/register/alliance_agreement.vue"),
		meta: { name: "联盟协议", parent: "Index", rightShow: true, scrollTop: true }
	},
	{
		// 信用购彩详情
		path: "/betting/credit/:id",
		name: "Credit",
		props: true,
		component: () => import("../views/betting/credit/Index.vue"),
		meta: { parent: "BettingHall", requireAuth: true, requireRule: 1, scrollTop: true }
	},
	{
		// 秒开购彩详情
		path: "/betting/secondsOpen/:id",
		name: "SecondsOpen",
		props: true,
		component: () => import("../views/betting/secondsOpen/Index.vue"),
		meta: { parent: "BettingHall", requireAuth: true, requireRule: 1 }
	},
	{
		//快三购彩详情
		path: "/betting/fastThree/:id",
		name: "FastThree",
		props: true,
		component: () => import("../views/betting/fastThree/Index.vue"),
		meta: { parent: "BettingHall", requireAuth: true, scrollTop: true }
	},
	{
		// 官方购彩详情
		path: "/betting/official/:id",
		name: "Official",
		props: true,
		component: () => import("../views/betting/official/Index.vue"),
		meta: { parent: "BettingHall", requireAuth: true, requireRule: 2 }
	},
	{
		// 走势图
		path: "/trendMap/:id",
		name: "TrendMap",
		props: true,
		component: () => import("../views/trendMap/Index.vue"),
		meta: { parent: "BettingHall", handBar: true, scrollTop: true }
	},
	{
		// 开奖结果页面
		path: "/lotteryResult/:id",
		name: "LotteryResult",
		props: true,
		component: () => import("../views/result/index.vue"),
		meta: { name: "历史开奖", parent: "BettingHall", handBar: true, rightShow: true }
	},
	{
		// 投注报表
		path: "/report",
		name: "Report",
		component: () => import("../views/report/index.vue"),
		meta: {
			name: "投注报表",
			parent: "MemberCenter",
			rightShow: true,
			requireAuth: true,
			handBar: true
		}
	},
	{
		// 优惠活动
		path: "/discountActivity",
		name: "DiscountActivity",
		component: () => import("../views/activity/Index.vue"),
		meta: { name: "优惠活动", parent: "Index", rightShow: true, handBar: true }
	},
	{
		// 余额宝
		path: "/yuBao",
		name: "YuBao",
		component: () => import("../views/yuBao/Index.vue"),
		meta: {
			name: "余额宝",
			parent: "Index",
			handBar: true,
			rightShow: true,
			requireAuth: true
		}
	},
	{
		// 余额宝 转入
		path: "/turnInto",
		name: "TurnInto",
		component: () => import("../views/yuBao/turnInto.vue"),
		meta: { name: "转入", parent: "YuBao", handBar: true, rightShow: false, requireAuth: true }
	},
	{
		// 余额宝 转出
		path: "/turnOut",
		name: "TurnOut",
		component: () => import("../views/yuBao/turnOut.vue"),
		meta: { name: "转出", parent: "YuBao", handBar: true, rightShow: false, requireAuth: true }
	},
	{
		// 余额宝 转入转出确认页面
		path: "/yuBaoEnding/:type",
		name: "YuBaoEnding",
		component: () => import("../views/yuBao/yuBaoEnding.vue"),
		meta: {
			name: "结果详情",
			parent: "YuBao",
			handBar: true,
			rightShow: false,
			requireAuth: true
		}
	},
	{
		// 余额宝 收支明细
		path: "/budgetDetails",
		name: "BudgetDetails",
		component: () => import("../views/yuBao/budgetDetails.vue"),
		meta: {
			name: "收支明细",
			parent: "YuBao",
			rightShow: true,
			isHeight: true,
			requireAuth: true
		}
	},
	{
		// 余额宝 规则
		path: "/yuBaoService",
		name: "YuBaoService",
		component: () => import("../views/yuBao/yuBaoService.vue"),
		meta: {
			name: "我的客服",
			parent: "YuBao",
			rightShow: false,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 会员中心
		path: "/MemberCenter",
		name: "MemberCenter",
		component: () => import("../views/userCenter/userCenter"),
		meta: {
			name: "会员中心",
			rightShow: true,
			handBar: true,
			TailShow: true
		}
	},
	{
		//  在线充值页面
		path: "/Recharge",
		name: "Recharge",
		component: () => import("../views/userCenter/topUpWithdrawal/recharge.vue"),
		meta: { name: "在线充值", requireAuth: true, handBar: true }
	},
	{
		// 提现页面
		path: "/withdrawCash",
		name: "withdrawCash",
		component: () => import("../views/userCenter/topUpWithdrawal/withdrawCash.vue"),
		meta: { name: "在线提现", requireAuth: true, handBar: true }
	},
	{
		// 公司入款及线上入款 有微信支付的跳转改页面
		path: "/rechargeDerails",
		name: "RechargeDerails",
		component: () => import("../views/userCenter/topUpWithdrawal/rechargeDerails.vue"),
		meta: { name: "", parent: "Recharge", requireAuth: true }
	},
	{
		// 签到
		path: "/Singin",
		name: "SingIn",
		component: () => import("../views/userCenter/singin/index.vue"),
		meta: { name: "每日签到", parent: "MemberCenter", handBar: true, requireAuth: true }
	},
	{
		// 签到规则
		path: "/Singin/SingRule",
		name: "SingRule",
		component: () => import("../views/userCenter/singin/singRule.vue"),
		meta: { name: "签到规则", parent: "SingIn", handBar: true, requireAuth: true }
	},
	{
		// 等级头衔
		path: "/grade",
		name: "Grade",
		component: () => import("../views/userCenter/grade/index.vue"),
		meta: {
			name: "等级头衔",
			parent: "MemberCenter",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 个人资料
		path: "/personalData",
		name: "PersonalData",
		component: () => import("../views/userCenter/personalData/personalData.vue"),
		meta: {
			name: "个人资料",
			parent: "MemberCenter",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 编辑个人资料
		path: "/updateUser",
		name: "UpdateUser",
		component: () => import("../views/userCenter/personalData/updateUser.vue"),
		meta: {
			name: "编辑个人资料",
			parent: "PersonalData",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 设置个人头像
		path: "/ModifyIcon",
		name: "ModifyIcon",
		component: () => import("../views/userCenter/personalData/modifyIcon.vue"),
		meta: {
			name: "设置个人头像",
			parent: "PersonalData",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 修改密码
		path: "/updatePwd",
		name: "UpdatePwd",
		component: () => import("../views/userCenter/updatePwd/updatePwd.vue"),
		meta: {
			name: "会员中心",
			parent: "MemberCenter",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 银行卡管理
		path: "/bankManages",
		name: "BankManages",
		component: () => import("../views/userCenter/bankManages/bankManages.vue"),
		meta: {
			name: "银行卡管理",
			parent: "MemberCenter",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 添加银行卡
		path: "/addBank",
		name: "AddBank",
		component: () => import("../views/userCenter/bankManages/addBank.vue"),
		meta: {
			name: "添加银行卡",
			parent: "BankManages",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 入款记录
		path: "/rechargeRecord",
		name: "RechargeRecord",
		component: () => import("../views/userCenter/rechargeRecord/rechargeRecord.vue"),
		meta: {
			name: "入款记录",
			parent: "MemberCenter",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 出款记录
		path: "/withdrawRecord",
		name: "WithdrawRecord",
		component: () => import("../views/userCenter/withdrawRecord/withdrawRecord.vue"),
		meta: {
			name: "出款记录",
			parent: "MemberCenter",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 资金记录
		path: "/moneyRecord",
		name: "MoneyRecord",
		component: () => import("../views/userCenter/moneyRecord/moneyRecord.vue"),
		meta: {
			name: "资金记录",
			parent: "MemberCenter",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 投注记录
		path: "/mrecord",
		name: "Mrecord",
		props: true,
		component: () => import("../views/userCenter/mrecord/mrecord.vue"),
		meta: {
			name: "投注记录",
			parent: "MemberCenter",
			rightShow: true,
			isHeight: true,
			requireAuth: true,
			downMenu: true
		}
	},
	{
		// 注单详情
		path: "/noteDetails",
		name: "NoteDetails",
		component: () => import("../views/userCenter/mrecord/noteDetails.vue"),
		meta: { name: "注单详情", rightShow: true, handBar: true, requireAuth: true }
	},
	{
		// 转换记录
		path: "/conversionRecord",
		name: "ConversionRecord",
		component: () => import("../views/userCenter/conversionRecord/conversionRecord.vue"),
		meta: { name: "额度转换记录", rightShow: true, handBar: true, requireAuth: true }
	},
	{
		// 今日盈亏
		path: "/todayProfit",
		name: "TodayProfit",
		component: () => import("../views/userCenter/todayProfit/todayProfit.vue"),
		meta: {
			name: "今日盈亏",
			parent: "MemberCenter",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 自助返水
		path: "/returnWater",
		name: "ReturnWater",
		component: () => import("../views/userCenter/returnWater/returnWater"),
		meta: {
			name: "自助返水",
			parent: "MemberCenter",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 代理中心
		path: "/proxy",
		name: "Proxy",
		component: () => import("../views/proxy/Proxy.vue"),
		meta: {
			name: "推广赚钱",
			parent: "MemberCenter",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 会员列表
		path: "/mbList",
		name: "MbList",
		component: () => import("../views/proxy/mbList/mbList.vue"),
		meta: {
			name: "会员列表",
			parent: "Proxy",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 返点设置
		path: "/rebateSetting",
		name: "RebateSetting",
		component: () => import("../views/proxy/rebateSetting/rebateSetting.vue"),
		meta: {
			name: "返点设置",
			parent: "Proxy",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 返点赔率表
		path: "/rebateOdds",
		name: "rebateOdds",
		component: () => import("../views/proxy/rebateSetting/rebateOdds.vue"),
		meta: { name: "返点赔率表", parent: "RebateSetting", rightShow: true, requireAuth: true }
	},
	{
		// 佣金记录
		path: "/subAgentReports",
		name: "SubAgentReports",
		component: () => import("../views/proxy/subAgentReports/subAgentReports.vue"),
		meta: {
			name: "佣金记录",
			parent: "Proxy",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 资金明细
		path: "/moneyDetailed",
		name: "MoneyDetailed",
		component: () => import("../views/proxy/moneyDetailed/moneyDetailed.vue"),
		meta: {
			name: "资金明细",
			parent: "Proxy",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 代理说明
		path: "/agentDescription",
		name: "agentDescription",
		component: () => import("../views/proxy/agent_description.vue"),
		meta: {
			name: "代理说明",
			parent: "Proxy",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 代理报表
		path: "/agentReport",
		name: "agentReport",
		component: () => import("../views/proxy/agentReport/agentReport.vue"),
		meta: {
			name: "代理报表",
			parent: "Proxy",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 下级报表
		path: "/subordinateReport",
		name: "subordinateReport",
		component: () => import("../views/proxy/subordinateReport/subordinateReport.vue"),
		meta: {
			name: "下级报表",
			parent: "Proxy",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 投注明细
		path: "/detailed",
		name: "detailed",
		component: () => import("../views/proxy/detailed/detailed.vue"),
		meta: { name: "", parent: "Proxy", rightShow: true, isHeight: true, requireAuth: true }
	},
	{
		// 会员消息
		path: "/userMessages",
		name: "UserMessages",
		component: () => import("../views/userCenter/user_messages/user_messages.vue"),
		meta: {
			name: "会员消息",
			parent: "MemberCenter",
			rightShow: true,
			handBar: true,
			requireAuth: true
		}
	},
	{
		// 系统公告
		path: "/mnotice",
		name: "Mnotice",
		component: () => import("../views/userCenter/user_messages/montice.vue"),
		meta: {
			name: "系统公告",
			parent: "MemberCenter",
			rightShow: true,
			handBar: true
		}
	},
	{
		// 帮助指南
		path: "/helpGuide",
		name: "HelpGuide",
		component: () => import("../views/userCenter/user_messages/help_guide.vue"),
		meta: { name: "帮助指南", parent: "MemberCenter", rightShow: true, handBar: true }
	},
	{
		//帮助指南详情
		path: "/helpGuideNotice/:id",
		props: true,
		name: "HelpGuideNotice",
		component: () => import("../views/userCenter/user_messages/help_guide_notice.vue"),
		meta: { name: "", parent: "HelpGuide", rightShow: true, handBar: true }
	},
	{
		path: "/liveIndex/:id",
		name: "liveIndex",
		props: true,
		meta: { requireAuth: true },
		component: () => import("../views/liveBroadcast/Index.vue")
	},
	{
		path: "/pageLiveIndex",
		name: "pageLiveIndex",
		component: () => import("../views/liveBroadcast/liveIndex.vue"),
		meta: { name: "视讯直播", rightShow: false, isHeight: true, TailShow: true, handBar: true }
	},
	{
		path: "/liveTrend/:id",
		name: "liveTrend",
		props: true,
		component: () => import("../views/liveBroadcast/liveTrend.vue"),
		meta: { name: "走势图" }
	},
	{
		path: "/liveRule",
		name: "liveRule",
		component: () => import("../views/liveBroadcast/liveRule.vue"),
		meta: { name: "玩法规则" }
	},
	{
		path: "/quotaConversion",
		name: "quotaConversion",
		component: () => import("../views/userCenter/quotaConversion/Index.vue"),
		meta: {
			name: "额度转换",
			parent: "MemberCenter",
			handBar: true,
			requireAuth: true,
			scrollTop: true
		}
	}
];

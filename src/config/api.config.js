/**
 * @description
 *  url: 接口地址
 *  method: 请求类型 post/get 默认为get
 *  requestType: 请求数据类型 form/json  默认为form
 *  请求方式为post时，才会判断requestType数据类型
 */

export default [
	{
		prefix: "/api/",
		maps: {
			//自助返水
			API_GET_DISCOUNT_REPORT_SELF: {
				url: "GetDiscountReportSelf"
			},
			// 领取返水
			API_POST_REPORT_SELF: {
				url: "PostReportSelf",
				method: "post"
			},
			// 查询返水
			API_GET_REPORT_SELF: {
				url: "GetReportSelf"
			},
			API_IS_OVER_LIMIT: {
				// 查询通道充值金额是否达到上限
				url: "IsOverLimit"
			},
			API_GET_FC_AUTO_DATA_BY_FC_IDS: {
				// 最近开奖结果
				url: "GetFcAutoDataByFcIds"
			},
			API_GET_SINGLE_NOTE_FC: {
				// 投注记录详情 信用 暂无
				url: "GetSingleNoteFc"
			},
			API_GET_SINGLE_NOTE_FC_FRA: {
				// 投注记录详情 官方 暂无
				url: "GetSingleNoteFcTra"
			},
			API_LOGIN: {
				// 会员登录 待确认
				url: "PostUserLogin",
				method: "post",
				urlParams: ["yzm", "idkey"]
			},
			API_LOGIN_PC: {
				// PC-会员登录 待确认
				url: "PostUserLoginPc",
				method: "post",
				urlParams: ["yzm", "idkey"]
			},
			API_GET_SPREAD_RANK: {
				// 中奖排行 暂无
				url: "GetSpreadRank"
			},
			API_GET_FC_AUTO_TO_NUM: {
				// 获取开奖结果记录 stime etime fc_id page limit 暂无
				url: "GetFcAutoToNum"
			},
			API_GET_CASH_RECORD: {
				// 现金记录 往来记录
				url: "GetCashRecord",
				method: "get"
			},
			API_GET_POST_BANK_IN_MONEY: {
				// 出款提交申请
				url: "PostBankInMoney",
				method: "get"
			},
			API_GET_FC_GAME_BY_CATE: {
				// 彩种列表
				url: "GetFcGameByCate"
			},
			API_POST_USER_DEMO_REG: {
				// 注册试玩会员
				url: "PostUserDemoReg",
				method: "post",
				requestType: "json"
			},
			API_GET_USER_CHECK_USER_NAME: {
				// 会员注册检测账号是否存在
				url: "GetUserCheckUsername"
			},
			API_USER_LOGIN_OUT: {
				// 会员退出
				url: "PostUserLoginOut",
				method: "post"
			},
			API_GET_CODE: {
				// 获取验证码
				url: "GetCode"
			},
			API_GET_INTO_BEADS_LAST_DATA_FC_IDS: {
				// 不知道
				url: "GetIntoBeadsLastDataFcIds"
			},
			API_GET_USER_MONEY: {
				// 获取会员金额
				url: "GetUserMoney"
			},
			API_GET_USER: {
				// 获取用户信息
				url: "GetUser"
			},
			API_GET_BANK_IN_TYPE: {
				// 存款充值方式
				url: "GetBankInType"
			},
			API_GET_ONLINE_BANK_IN_MONEY: {
				// 不知道
				url: "PostOnlineBankInMoney"
			},
			API_GET_SITE_ACTIVITY: {
				// 优惠活动
				url: "GetSiteActivity"
			},
			API_GET_FC_MODULE_TRA: {
				// 不知道
				url: "GetFcModuleTra"
			},
			API_GET_FC_MODULE_BY_CATE: {
				// 信用 大彩种
				url: "GetFcModuleByCate",
				method: "get"
			},
			API_GET_BANK_IN_ACCOUNT: {
				// 获取存款充值支付通道
				url: "GetBankInAccount"
			},
			API_GET_BANK_IN_PAYMENT: {
				// 获取银行支付通道
				url: "GetBankInPayment"
			},
			API_POST_BANK_IN_MONEY: {
				// 提交入款申请
				url: "PostBankInMoney"
			},
			API_GET_WEB_COMMON_TO_WAP: {
				// 手机端站点信息 待确认
				url: "GetWebCommonToWap"
			},
			API_GET_INTO_BEADS_LAST_DATA: {
				// 获取开奖结果记录 fc_id,limit
				url: "GetIntoBeadsLastData"
			},
			API_GET_FC_AUTO_LAST_DATA: {
				// 获取最近多期开奖结果 fc_id,limit
				url: "GetFcAutoLastDataS"
			},
			API_POST_UP_USER_DATA: {
				// 修改个人资料 账号信息
				url: "PostUpUserData",
				method: "post",
				headers: "json"
			},
			API_GET_AGENT_REPORT: {
				// 不知道
				url: "GetAgentReport",
				method: "get"
			},
			API_GET_AGENT_CASH_RECORD: {
				// 团队流水
				url: "GetAgentCashRecord"
			},
			API_GET_WEB_SITE_BY_CODE: {
				url: "GetWebSiteByCode"
			},
			API_GET_HISTORY_DATA: {
				url: "GetHistoryData"
			},
			API_GET_AGENT_CHECK_USER_NAME: {
				url: "GetAgentCheckUsername"
			},
			API_GET_AGENT_REG_CONFIG: {
				url: "GetAgentRegConfig"
			},
			API_POST_USER_REF: {
				// 2019年08月21日15:10:10 暂无用处
				url: "PostUserReg",
				method: "post"
			},
			// 删除银行卡
			API_DEL_USER_BANK: {
				url: "DelUserBank",
				method: "post"
			},
			// 设置默认银行卡
			API_UPDATE_USER_BANK_DEFAULT: {
				url: "UpdateUserBankDefault",
				method: "post"
			},
			API_GET_PC_FC_AUTO_LAST_DATA: {
				url: "GetPcFcAutoLastData5"
			},
			API_POST_USER_LOGIN_SIX_PC: {
				url: "PostUserLoginSixPc",
				method: "post"
			},
			API_GET_APP_DOWN_LOAD: {
				// app 下载链接
				url: "GetAppDownload"
			},
			API_POST_USER_REG_TO_WAP: {
				// 手机端会员注册
				url: "PostUserRegToWap",
				method: "post",
				requestType: "json"
			},
			API_POST_USER_AGE_REG: {
				// 注册代理
				url: "PostUserAgentReg",
				method: "post",
				requestType: "json"
			},
			API_GET_USER_REG_CONFIG: {
				// 获取会员注册设定
				url: "GetUserRegConfig"
			},
			API_GET_USER_CHECK_NAME: {
				// 检查姓名是否唯一
				url: "GetUserCheckName"
			},
			API_GET_APP_CODE_DOWN_LOAD: {
				// 获取app下载url
				url: "GetAppCodeDownload"
			},
			API_FIND_BANK_IN_ACCOUNT: {
				// 获取公司入款账号 暂无
				url: "FindBankInAccount"
			},
			API_GET_WEB_COMMON: {
				// PC端站点信息 暂无
				url: "GetWebCommon"
			},
			API_GET_WEB_CONFIG: {
				// 获取当前站点是否支持撤单
				url: "GetWebConfig"
			},
			API_GET_IS_CONFIG: {
				// 获取当前彩种是否支持撤单
				url: "GetIsCancel"
			},
			API_GET_REPORT_PYRAMID: {
				// 代理报表接口
				url: "GetReportPyramid"
			},
			API_GET_PERSONAL_REPORT: {
				// 个人盈亏接口
				url: "GetPersonalReport"
			},
			API_GET_GAIN_RANK: {
				// 中奖排行榜
				url: "GetGainRank"
			},
			API_GET_REPORT_NATE: {
				// 下级报表
				url: "GetReportSubordinate"
			},
			API_GET_BETTING_SUBORDINATE: {
				// 代理报表投注明细
				url: "GetBettingSubordinate"
			},
			API_GET_SUB_CASH_RECORD: {
				// 代理中心交易明细账户明细
				url: "GetSubCashRecord"
			},
			API_GET_SUB_BANK_IN_DATA: {
				// 代理中心交易明细充值记录
				url: "GetSubBankInData"
			},
			API_GET_SUB_BANK_OU_DATA: {
				// 代理中心交易明细体现记录
				url: "GetSubBankOutData"
			},
			API_POST_UPDATE_BIRTH_DAY: {
				// 修改生日
				url: "PostUpdateBirthday",
				method: "post"
			},
			API_GET_RED_BAG_DO: {
				// 红包接口
				url: "GetRedBagDo"
			},
			API_GET_RED_BAG: {
				// 获取红包
				url: "GetRedBag"
			},
			API_GET_USERNAME_LOGIN_NOTICE: {
				// 登录成功之后的弹窗
				url: "GetUsrnameLoginNotice"
			},
			API_CHECK_CODE: {
				// 验证码验证接口
				url: "CheckCode"
			},
			API_CHECK_MOBILE: {
				// 手机号验证接口
				url: "CheckMobile",
				method: "post"
			},
			API_GET_GAIN_RANK_COM: {
				// 首页中奖信息和排行榜
				url: "GetGainRankCom"
			},
			API_GET_INFO_FOR_PK: {
				// pk那边的pc验证个人信息
				url: "member/getInfo"
			},
			API_GET_LINK_FOR_PK: {
				// pk那边的pc获取在线客服链接
				url: "member/getLink"
			},
			API_POST_USER_AGENT_API: {
				//代理注册请求接口
				url: "PostUserAgentApl",
				method: "post",
				requestType: "json"
			},
			API_GET_USER_AGENT_API_CONFIG: {
				//代理注册配置
				url: "GetUserAgentAplcongfig"
			},
			API_POST_UPDATE_USER_NOTICE: {
				// 网站公告未读已读
				url: "UpdateUserNotice",
				method: "post"
			},
			API_GET_USE_IS_PLAN: {
				//高手计划是否开启
				url: "GetUserIsPlan"
			},
			API_GET_WEB_IS_PLAN_STATE: {
				url: "GetWebIsPlanState"
			},
			API_GET_FC_GAME_BY_CATE_LIVE: {
				url: "GetFcGameByCateLive"
			},
			API_GET_APP_CONFIG: {
				url: "GetLAppConfig" // app分享
			},
			API_GET_WEB_DATA_TO_WAP_BY_REDIS: {
				url: "GetWebConfigDataToWapByRedis" //投注记录头部下拉选项
			},
			GET_VD_BET_RECORD_LIST: {
				url: "GetVdGameBetRecordList" // 视讯下注记录
			},
			API_GET_GAME_MODULE: {
				url: "GetWebModule" // 彩票大厅获取游戏数据
			}
		}
	},
	{
		prefix: "/lottery_api/",
		maps: {
			// API_GET_FC_AUTO_LAST_DATA5: { // 获取最近5期开奖结果
			//     url: 'GetFcAutoLastData5'
			// },
			// API_GET_FC_AUTO_DATA_BY_FC_IDS: { // 最近开奖结果
			//     url: 'GetFcAutoDataByFcIds'
			// },
			API_GET_SITE_POP_AD: {
				// ad 暂无
				url: "GetSitePopAd"
			},
			API_GET_FC_MODULE_HOT: {
				// 获取菜单 暂无
				url: "GetFcModuleHot"
			},
			// API_FIND_BANK_IN_ACCOUNT: { // 获取公司入款账号 暂无
			//     url: 'FindBankInAccount'
			// },
			API_GET_FC_AUTO_LAST_DATA5: {
				// 不知道 暂无
				url: "GetFcAutoLastData5"
			},
			API_GET_FC_AUTO: {
				// 历史开奖 2019年04月09日15:34:55 gyz 再提交一遍
				url: "GetFcAuto"
			},
			API_GET_FC_MODULE: {
				// 不知道 暂无
				url: "GetFcModule"
			},
			API_GET_FC_PERIOD: {
				// GetFcPeriod => GetFcPeriodSix
				url: "GetFcPeriodSix"
			},
			API_GET_FC_COMMON_INDEX: {
				// 获取信用玩法数据 GetSixFcCommonIndex => GetFcCommonIndex
				url: "GetFcCommonIndex"
			},
			API_GET_TRA_COMMON_INDEX_K3: {
				// 获取当前期数 开盘 封盘状态 赔率接口快三
				url: "GetFcCommonIndexK3"
			},
			API_POST_FC_BET: {
				// 信用玩法注单
				url: "PostFcBet",
				method: "post",
				requestType: "json",
				urlParams: ["fc_id"]
			},
			API_GET_CANCEL_FC_SINGLE_NONE: {
				// 信用彩撤单
				url: "CancelFcSingleNote"
			},
			API_GET_CANCEL_FC_BY_NONE: {
				// [新]信用彩撤单
				url: "CancelFcSingleNoteByIsCancel"
			},
			API_GET_FC_BY_CANCEL: {
				// 获取信用玩法彩种是否支持撤单
				url: "GetIsCancel"
			},
			API_GET_FC_AUTO_NUM: {
				// 信用彩最近5条开奖结果
				url: "GetFcAutoToNum5"
			},
			API_GET_FC_BET_CORD: {
				// 信用彩最近5条投注信息
				url: "GetFcBetRecord5"
			},
			API_POST_BET_K3: {
				// 快三玩法接口
				url: "PostFcBetK3",
				method: "post",
				requestType: "json",
				urlParams: ["fc_id"]
			},
			API_POST_BET_LIVE_K3: {
				// 直播彩种下注
				url: "PostFcBetLiveK3",
				method: "post",
				requestType: "json",
				urlParams: ["fc_id"]
			},
			API_GET_LONG_QUERY_DATA_PC: {
				// 长龙列表
				url: "LongQueuetDataPC"
			},
			API_GET_PC_FC_AUTO_DATA_BY_FC_ID: {
				// 新的开奖倒计时
				url: "GetFcPeriod"
			},
			API_GET_FC_PERIODS_TRA: {
				url: "GetFcPeriods"
			},
			API_GET_NOTICE_LOTTERY: {
				// 彩票公告
				url: "GetNotice"
			},
			API_GET_GAIN_RANKS: {
				//排行榜
				url: "GetGainRank"
			},
			API_GET_FC_REPORT: {
				//报表统计
				url: "GetFcReport"
			},
			API_GET_FC_GAME_BY_CATE_FOR_PK: {
				// 给pk用的彩种列表
				url: "GetFcGameByCate"
			},
			API_GET_USER_MONEY_FOR_PK: {
				// 给pk获取会员金额
				url: "GetUserMoney"
			},
			API_GET_USER_FOR_PK: {
				// 给pk获取用户信息
				url: "GetUser"
			},
			API_GET_FC_AUTO_TO_NUM_FOR_PK: {
				// 给pk用，获取开奖结果记录 stime etime fc_id page limit 暂无
				url: "GetFcAutoToNum"
			},
			API_GET_WEB_COMMON_FOR_PK: {
				// 给pk用的PC端站点信息
				url: "GetWebCommon"
			},
			API_GET_CASH_RECORD_PK: {
				// 给PK用 现金记录 往来记录
				url: "GetCashRecord"
			},
			API_GET_FC_AUTO_FOR_PERIOD_PK: {
				// 给pk用的 获取开奖结果
				url: "GetFcAutoForPeriod"
			},
			API_GET_FC_BET_RECORD_PK: {
				// 给Pk用 信用投注列表
				url: "GetFcBetRecord"
			},
			API_GET_LONG_QUERY_DATA_PC_ONE: {
				// 获取单彩种长龙数据
				url: "LongQueuetDataPCOne"
			},
			API_GET_PERIOD_AND_CONTENT_ID: {
				// 聊天室计划新接口查询倒计时
				url: "GetPeriodAndContentId"
			},
			API_GET_ALL_CHAT_PLAN: {
				// 获取聊天室计划
				url: "GetAllChatPlan"
			}
		}
	},
	{
		prefix: "/member_api/",
		maps: {
			//聊天室开启的计划彩种
			API_GET_CHAT_PLAN_LOTTERYS: {
				url: "GetChatPlanLotterys"
			},
			//聊天室计划历史
			API_GET_CHAT_PLAN_RECORD: {
				url: "GetChatPlanRecord"
			},
			//聊天室修改会员昵称
			API_UPDATE_USER_CHAT_NICK_NAME: {
				url: "UpdateUserChatNickname",
				method: "post"
			},
			//聊天室收到的红包
			API_GET_GRAB_CHAT_RED_DETAILS: {
				url: "GetGrabChatRedDetails"
			},
			//聊天室发出的红包
			API_GET_SENT_CHAT_RED_DETAILS: {
				url: "GetSentChatRedDetails"
			},
			//聊天室会员抢红包
			API_POST_GOT_CHAT_REDBAG: {
				url: "PostGotChatRedBag",
				method: "post"
			},
			//聊天室发包者查看红包详情
			API_GET_CHAT_REDBAG_DETAIL: {
				url: "GetChatRedBagDetail"
			},
			//聊天室会员抢红包时，打开发包详情
			API_GET_SEND_CHAT_REDBAG_DETAIL: {
				url: "GetSendChatRedBagDetail"
			},
			//聊天室会员发包
			API_POST_SEND_CHAT_REDBAG: {
				url: "PostSendChatRedBag",
				method: "post"
			},
			//聊天室红包配置
			API_GET_CHAT_REDBAG_CONFIG: {
				url: "GetChatRedBagConfig"
			},
			// 聊天室接口
			API_GET_CHAT_ROOM_CONFIG: {
				url: "GetChatRoomConfig"
			},
			// 聊天室公告
			API_GET_CHAT_ROOM_NOTICE: {
				url: "GetChatRoomnotice"
			},
			// 聊天室计划
			API_GET_CHAT_ROOM_PLAN: {
				url: "GetChatRoomplan"
			},
			// 聊天室配置
			API_GET_CHAT_ROOM_CONFIGS: {
				url: "GetChatRoomConfigs"
			},
			// 聊天室列表
			API_GET_CHAT_ROOM_LIST: {
				url: "GetChatRoomlist"
			},
			//聊天室公告，虚拟会员
			API_NEW_GET_CHAT_LIST_USER_REDIS: {
				url: "NewGetChatlistuserredis"
			},
			// 聊天室多彩种
			API_GET_CHAT_GET_USER_BET_RECORD: {
				url: "GetuserBetrecord"
			},
			//当前聊天室房间所有会员
			API_GET_USER_ROOM_MEMBER: {
				url: "GetuserRoommember"
			},
			// 查询默认聊天室信息
			API_GET_DEFAULT_CHAT: {
				url: "GetDefaultChat"
			},
			// 查询聊天室玩家主页信息
			API_GET_THE_PLAYER_INDEX_DATA: {
				url: "GetThePlayerIndexData"
			},
			// 聊天室会员禁言与封号
			API_UPDATE_USER_CHAT_DATA: {
				url: "UpdateUserChatData",
				method: "post"
			},
			// 聊天室隐藏/显示金额
			API_UPDATE_USER_SUM_HIDE: {
				url: "UpChatUserSumHide",
				method: "post"
			},
			// 登录聊天
			API_POST_CHAT_LIST_PASSWORD: {
				url: "PostChatlistpossword",
				method: "post"
			},
			// 聊天室虚拟数据账号
			API_GET_LIST_USER_REDIS: {
				url: "GetChatlistuserredis"
			},
			// 聊天室 喜欢的彩种
			API_GET_FOND_FC_ID: {
				url: "GetFondFcId"
			},
			// 聊天室 查询会员是否被封号
			API_GET_CHAT_USER_STATE: {
				url: "GetChatUserState"
			},
			// 会员头像id
			API_POST_UPDATE_USE_PICID: {
				url: "PostUpdateUsePicId",
				method: "post"
			},
			API_POST_INSERT_USER_BANK: {
				// 修改银行卡信息
				url: "InsertUserBank",
				method: "post"
			},
			API_GET_USER_FC_PLAY_REBATE: {
				// 返点赔率表
				url: "GetUserFcPlayRebate",
				method: "get"
			},
			API_POST_UPDATE_USER_PWD: {
				// 修改登录密码
				url: "PostUpdataUserPwd",
				method: "post"
			},
			API_POST_UPDATE_USER_QKPWD: {
				// 修改取款密码
				url: "PostUpdataUserQkPwd",
				method: "post"
			},
			API_GET_NOTICE_OR_MESSAGE: {
				// 获取公告或信息列表
				url: "GetNewNoticeOrMess"
			},
			API_GET_NOTICE: {
				// 获取公告列表
				url: "GetNotice"
			},
			API_GET_ONE_NOTICE: {
				// 获取单条公告详情
				url: "GetOneNotice"
			},
			API_GET_FC_BET_RECORD: {
				// 投注记录列表 信用 GetFcBetRecord => GetNoteFcList
				url: "GetNoteFcList"
			},
			API_GET_FC_BET_RECORD_TRA: {
				// 投注记录列表 官方 GetFcBetRecordTra => GetNoteFcListTra
				url: "GetNoteFcListTra"
			},
			API_GET_BANK_OUT_MONEY: {
				// 申请出款
				url: "GetBankOutMoney"
			},
			API_GET_USER_MESSAGE: {
				// 获取会员消息
				url: "GetUserMessage",
				method: "get"
			},
			API_GET_AGENT_USER: {
				// 会员管理 会员列表
				url: "GetAgentUser",
				method: "get"
			},
			API_GET_FC_REBATE_DATA: {
				// 查看邀请码详情
				url: "GetFcRebateData",
				method: "get"
			},
			API_GET_COMMISSION: {
				// 佣金记录
				url: "GetCommission",
				method: "get"
			},
			API_GET_FC_REBATE: {
				// 不知道
				url: "GetFcRebate",
				method: "get"
			},
			API_GET_USER_CODE: {
				// 不知道
				url: "GetUserCode",
				method: "get"
			},
			API_GET_DEL_USER_CODE: {
				// 删除邀请码
				url: "DelUserCode",
				method: "get"
			},
			API_GET_BANK_IN_DATA: {
				// 充值记录
				url: "GetBankInData",
				method: "get"
			},
			API_GET_BANK_OUT_DATA: {
				// 出款记录
				url: "GetBankOutData",
				method: "get"
			},
			API_GET_CREARTE_REBATE: {
				// 生成邀请码
				url: "AddFcRebate",
				method: "post",
				requestType: "json"
			},
			API_UPDATE_USER_MESSAGE: {
				url: "UpdateUserMessage"
			},
			API_POST_UPDATA_USER_SET_QK_PWD: {
				url: "PostUpdataUserSetQkPwd",
				method: "post"
			},
			API_GET_GAME_NOTICE: {
				// 获取游戏公告
				url: "GetGameNotice",
				method: "get"
			},
			API_POST_UPDATE_USER_EMAIL: {
				// 修改邮箱
				url: "PostUpdataUserMail",
				method: "post"
			},
			API_POST_UPDATE_USER_MOBILE: {
				// 修改手机号码
				url: "PostUpdataUserMobile",
				method: "post"
			},
			API_POST_UPDATE_USER_QQ: {
				// 修改QQ
				url: "PostUpdataUserQq",
				method: "post"
			},
			API_GET_NOW_AUDIT_DATA: {
				// 获取稽核信息 暂无
				url: "GetNowAuditData"
			},
			API_GET_USER_LIMIT: {
				// 投注资讯 信用彩票
				url: "GetUserLimit",
				method: "get"
			},
			API_GET_DIS_RATIO: {
				// 自助返水
				url: "GetDisRatio",
				method: "get"
			},
			API_GET_REPORTS: {
				// 报表统计
				url: "GetReports",
				method: "get"
			},
			API_GET_USER_VD_MONEY: {
				// 获取棋牌金额
				url: "GetUserVdMoney",
				method: "get"
			},
			API_GET_FC_AUTO_FOR_PERIOD: {
				url: "GetFcAutoForPeriod",
				method: "get"
			},
			API_GET_REFRESH_VD_MONEY: {
				url: "GetRefreshVdMoney"
			},
			API_GET_USER_CODE_STATE: {
				// 会员中心是否有权限开启会员管理页面
				url: "GetUserCodeState"
			},
			API_GET_USER_CON_DAY: {
				// 查询会员签到天数
				url: "GetUserConDay"
			},
			API_POST_UPDATE_UESR_CON_DAY: {
				//会员签到
				url: "UpdateUserConDay",
				method: "post"
			},
			API_GET_USER_SIGN_CON_FIG: {
				//获取签到配置
				url: "GetUserSignConfig"
			},
			API_POST_ISSUE_USER_SIGN_JACK: {
				// 会员领取签到彩金
				url: "IssueUserSignJack",
				method: "post"
			},
			API_GET_USER_SING_LIST: {
				// 会员可领取的彩金列表
				url: "GetUserSignList"
			},
			API_GET_USER_SING_IS_OR_NOT: {
				// 查询会员是否已签到
				url: "GetUserUserSignIsOrNot"
			},
			API_GET_ACTIVITY_LEVEL_CONFIG: {
				// 查询会员晋级活动消息
				url: "GetActivityLevelConfig"
			},
			API_GET_ACTIVITY_LEVEL: {
				// 查询会员等级信息
				url: "GetActivityLevel"
			},
			API_POST_ISSUE_USER_PRO_RECORD: {
				// 领取成长晋级彩金
				url: "IssueUserProRecord",
				method: "post"
			},
			API_GET_ACTIVITY_REWARD_CONFIG: {
				// 获取等级嘉奖配置
				url: "GetActivityRewardConfig"
			},
			API_GET_ACTIVITY_REWARD: {
				// 获取等级嘉奖信息
				url: "GetActivityReward"
			},
			API_POST_ISSUE_USER_REWARD_RECORD: {
				// 领取等级嘉奖奖金
				url: "IssueUserRewardRecord",
				method: "post"
			},
			API_GET_AUDIT_LIST: {
				// 及时稽核结果
				url: "GetAuditList"
			},
			API_GET_IS_FD: {
				// 是否开启自动反水
				url: "GetIsSelfFd"
			},
			// 检测取款密码是否为空
			API_GET_CHECK_USER_QK_PWD: {
				url: "GetCheckUserQkPwd",
				method: "get"
			},
			// 判断取款密码是否正确
			API_GET_USER_CHECK_QK_PWD: {
				url: "GetUserCheckUserQkPwd",
				method: "get"
			},
			// 修改取款密码
			API_POST_UPDATA_USER_QK_PWD: {
				url: "PostUpdataUserQkPwd",
				method: "post"
			},
			// 检测微信是否为空
			API_GET_CHECK_USER_WX: {
				url: "GetCheckUserWeixin",
				method: "get"
			},
			// 修改微信号码
			API_POST_UPDATA_USER_WX: {
				url: "PostUpdataUserWeiXin",
				method: "post"
			},
			API_GET_USER_BANKS: {
				// New获取用户银行信息
				url: "GetUserBanks"
			},
			API_GET_USER_BANK: {
				// Old获取用户银行信息（即将删除）
				url: "GetUserBank"
			},
			API_POST_OUT_YUE_BAO: {
				url: "PostOutYuebao", // 转出余额宝
				method: "post"
			},
			API_POST_IN_YUE_BAO: {
				url: "PostInYuebao", // 转入余额宝
				method: "post"
			},
			API_GET_YUEBAO_CONFIG: {
				url: "GetYuebaoConfig" // 余额宝配置（转入上限)
			},
			API_Y_GET_USER_MONEY: {
				url: "YGetUserMoney" // 余额宝余额
			},
			API_GET_YINDEX_INDEX_DATA: {
				url: "GetYuEBaoIndexData" // 余额宝首页接口数据
			},
			API_GET_YUEBAO_CASH_RECORD: {
				url: "GetYuEBaoCashRecord" // 余额宝收支明细 PC端总览查询
			},
			API_GET_PRIFIT_RECORD: {
				url: "GetPrifitRecord" // 余额宝收益明细
			},
			API_UP_SUM_HIDE_REDIS: {
				url: "UpSumHideRedis", // 显示/隐藏金额
				method: "post"
			},
			API_Y_GET_USER: {
				url: "YGetUser" // 显示/隐藏金额
			},
			API_GET_USER_TOTAL_IN_MONEY_TODAY: {
				url: "GetUserTotalInMoneyToday" // 会员余额和会员今日总转入金额
			},
			API_GET_HEAD_PORTRAIT: {
				// 查询会员头像
				url: "GetHeadPortrait"
			},
			API_GET_CONVERSION_LIST: {
				url: "GetConversionList" //额度转换记录
			},
			API_GET_VD_MONEY_DATA: {
				url: "GetVdMoneyData" // 额度转换资产列表
			}
		}
	},
	{
		prefix: "/lottery_tra_api/",
		maps: {
			API_GET_PERIODS_TRA: {
				// 倒计时 批量更改
				url: "GetFcPeriods"
			},
			API_GET_FC_PERIOD_TRA: {
				// 官方倒计时 2019年04月15日14:41:33 后端调整的
				url: "GetFcPeriod"
			},
			API_GET_FC_GAME_TRA: {
				// 获取玩法数据 2019年04月06日10:29:48 叶哥说要改回来 套站组有聊天记录
				url: "GetFcGameTra"
			},
			API_GET_FC_COMMON_INDEX_TRA: {
				// 不知道
				url: "GetFcCommonIndexTra"
			},
			API_GET_PC_FC_COMMON_INDEX_TRA: {
				// 不知道
				url: "GetPcFcCommonIndexTra"
			},
			API_POST_FC_TRA_BET: {
				// 官方玩法注单
				url: "PostFcBet",
				method: "post",
				requestType: "json", // 0.form 1.json
				urlParams: ["fc_id", "cs"]
			},
			API_GET_CANCEL_FC_TRA_SINGLE_NONE: {
				// 官方彩撤单
				url: "CancelFcTraSingleNote"
			},
			API_GET_CANCEL_FC_TRA_BY_NONE: {
				// [新]官方彩撤单
				url: "CancelFcTraSingleNoteByIsCancel"
			},
			API_GET_FC_TAR_BY_CANCEL: {
				// 获取官方玩法彩种是否支持撤单
				url: "GetIsCancel"
			},
			API_GET_FC_AUTO_NUM_TRA: {
				// 官方彩开奖结果
				url: "GetFcAutoToNum5"
			},
			API_GET_FC_BET_CORD_TRA: {
				// 官方彩最近5条投注信息
				url: "GetFcBetRecordTra5"
			},
			API_GET_FC_REPORT_TRA: {
				//官方报表统计
				url: "GetFcReportTra"
			},
			API_GET_GAIN_RANK: {
				//官方排行榜
				url: "GetGainRank"
			},
			API_GET_FC_BET_RECORD_TRA_PK: {
				// 给Pk用 官方投注列表
				url: "GetFcBetRecordTra"
			},
			API_GET_TRA_PERIOD_AND_CONTENT_ID: {
				// 官方聊天室计划倒计时
				url: "GetPeriodAndContentId"
			}
		}
	},
	{
		prefix: "/vd_api/",
		maps: {
			API_TRANS_FER_CREDIT_CHESS: {
				// 棋牌额度转换
				url: "TransferCreditChess",
				method: "post"
			}
		}
	},
	{
		prefix: "/sport_api/",
		maps: {
			API_GET_LEG_NAME: {
				// 联赛接口
				url: "GetLegName",
				method: "get"
			},
			API_GET_MATCH: {
				// 赛事接口
				url: "GetMatch",
				method: "get"
			},
			API_POST_CHECK_BET: {
				// 下注赔率接口
				url: "PostCheckBet",
				method: "post"
			}
		}
	},
	{
		prefix: "/log/",
		maps: {
			LOG_RECORD: {
				// 日志打点
				url: "logrecord",
				method: "post",
				requestType: "json" // 0.form 1.json
			}
		}
	},
	{
		prefix: "/app/",
		maps: {
			GET_USER_INFO_FOR_PK: {
				// pk那边的wap验证个人信息pk
				url: "api/v2/lottery/getUserInfo"
			},
			GET_USER_LINK_FOR_PK: {
				// pk那边的wap客服链接
				url: "api/v2/lottery/getUserLink"
			}
		}
	},
	{
		prefix: "/lotteryPlan/",
		maps: {
			GET_PLAN_LIST: {
				// 计划列表
				url: "planList"
			},
			GET_GAME_LIST: {
				// 彩种列表
				url: "gameList"
			},
			GET_USER_PLAN: {
				// 􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷用户计划列表
				url: "userPlan"
			},
			GET_PALY_LIST: {
				// 􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷􏰝􏰞􏰔􏰕􏰶􏰷玩法列表
				url: "playList"
			},
			GET_USER_PLAN_TOP: {
				// 􏰅􏰆􏰇􏰅􏰆􏰇排行榜
				url: "getUserPlanTop"
			}
		}
	},
	{
		prefix: "/chat_api/",
		maps: {
			API_POST_UP_LOAD_IMAGE: {
				// 聊天室发送图片
				url: "UploadImage",
				method: "post"
			},
			API_GET_PUB_LIC_MSG: {
				// 获取群聊消息
				url: "GetPublicMsg"
			},
			API_GET_PRIVATE_MSG: {
				// 获取私聊消息
				url: "GetPrivateMsg"
			},
			API_GET_ADMIN: {
				// 获取管理员
				url: "GetAdmin"
			},
			API_GET_USER_ONLINE_STATE: {
				// 获取会员在线状态（踢线前判断会员是否在线）
				url: "GetUserOnlineState"
			},
			API_GET_MESSAGE_LIST: {
				// 获取在线列表
				url: "GetMessageList"
			},
			API_GET_UPDATE_MESSAGE: {
				// 删除聊天记录接口
				url: "UpdateMessage"
			},
			API_GET_DEL_MESSAGE_LIST_CACHE: {
				//  删除消息列表缓存
				url: "DelMessageListCache"
			}
		}
	},
	{
		prefix: "/primordial/",
		maps: {
			GET_CREDIT_RULE: {
				// 获取信用玩法规则
				url: "credit_rule"
			},
			GET_OFFICIAL_RULE: {
				// 获取官方玩法规则
				url: "official_rule"
			},
			GET_LOTTERY_TIME: {
				// 获取开奖时间
				url: "lottery_time"
			},
			GET_GUIDE: {
				// 获取站点的帮助中心文案
				url: "guide"
			}
		}
	},
	{
		prefix: "/vdgame_api/v1/",
		maps: {
			API_POST_LOGIN_FORWARD_GAME: {
				// 登录创建会员接口
				url: "LoginForwardGame",
				method: "post"
			},
			API_POST_TRANSFER_CREDIT: {
				// 额度转换接口
				url: "TransferCredit",
				method: "post"
			},
			API_POST_BALANCE_BY_VD_TYPE: {
				// 会员创建账号判断
				url: "PostBalanceByVdType",
				method: "post"
			},
			API_GET_REFRESH_VD_V1_MONEY: {
				// 资产列表刷新接口
				url: "GetRefreshVdMoney"
			}
		}
	}
];

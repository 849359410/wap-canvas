<template>
	<div class="rightNav">
		<div class="rightNav_arrow" @click="openNav()">
			<van-image :src="leftImg"></van-image>
		</div>
		<van-popup v-model="navShow" position="right" class="rightNav_list">
			<div class="nav_list">
				<div class="nav_list--title">
					<div class="nav_list--right">
						<van-image :src="userIcon" class="nav_list--right_img"></van-image>
						<div>
							<p class="nav_list--right_name">{{ userMessage.username }}</p>
							<p class="nav_list--right_money">
								余额：<span>{{ userMessage["money"] | formatPenny }}</span
								>元
							</p>
						</div>
					</div>
					<div class="nav_list--main">
						<van-cell-group class="nav_list--main_list">
							<van-cell v-for="i in rightListNew" :key="i.id" @click="goQuickPage(i)">
								<span :class="i.img"></span>
								<span>{{ i.text }}</span>
							</van-cell>
						</van-cell-group>
					</div>
					<van-button class="nav_list--but" @click="loginOut()">
						注销登录
					</van-button>
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
import { APP_IMG_HOST } from "../config/deploy.config";
import { mapState, mapGetters } from "vuex";
export default {
	name: "RightNav",
	data() {
		return {
			rightList: [
				{ path: "BettingHall", text: "游戏大厅", img: "bg-gcdt" },
				{ path: "Recharge", text: "充值/提现", img: "cztx" },
				{ path: "PersonalData", text: "个人资料", img: "person" },
				{ path: "BankManages", text: "银行卡管理", img: "blank" },
				{ path: "UpdatePwd", text: "修改密码", img: "pwd" },
				{ path: "RechargeRecord", text: "入款记录", img: "charge" },
				{ path: "WithdrawRecord", text: "出款记录", img: "tx" },
				{ path: "MoneyRecord", text: "资金记录", img: "money" },
				{ path: "Mrecord", text: "投注记录", img: "bg-tzjl" },
				{ path: "LotteryResult", text: "开奖记录", img: "bg-kjjl" },
				{ path: "TodayProfit", text: "今日盈亏", img: "bg-cztx" },
				{ path: "Proxy", text: "代理中心", img: "proxy" },
				{ path: "UserMessages", text: "会员消息", img: "bg-xxzx" },
				{ path: "Mnotice", text: "系统公告", img: "notice" },
				{ path: "", text: "在线客服", img: "zxkf" }
			],
			rightListNew: [],
			navShow: false,
			userIcon: "",
			leftImg: require("../assets/images/components/rightNav/rightNavArrow.png")
		};
	},
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery,
			userMessage: state => state.user.userMessage
		}),
		...mapGetters(["webData"])
	},
	watch: {
		"$route.params.id"() {
			this.returnList();
		}
	},
	created() {
		this.returnList();
		this.userIcon = `${APP_IMG_HOST}/img/userIcon/${this.userMessage.pic_id}.jpg`;
	},
	methods: {
		openNav() {
			this.navShow = !this.navShow;
		},
		returnList() {
			const data = this.$helps.cloneDeep(this.rightList);
			data.forEach((i, index) => {
				if (this.currentLottery.is_second === 1) {
					if (i.text === "开奖记录") {
						data.splice(index, 1);
					}
				}
			});
			this.rightListNew = data;
		},
		goQuickPage(item) {
			let id = this.$route.params.id;
			if (item.path === "LotteryResult") {
				this.$router.push({ name: item.path, params: { id: id } });
			} else if (item.path === "Mrecord") {
				const name = this.$route.name,
					type = name === "Official" || name === "FastThree" ? "fc_tra" : "fc";
				this.$router.push({ name: item.path, params: { type: type } });
			} else if (item.path === "") {
				const ws = this.webData.web_cs;
				if (ws === "" || null) {
					this.$root.$emit("handleError", "没有在线客服");
				} else {
					window.open(ws);
				}
			} else {
				this.$router.push({ name: item.path });
			}
		},
		// 退出
		loginOut() {
			this.$root.$emit("handleUserLoginOut");
		}
	}
};
</script>

<style scoped lang="scss">
@import "../assets/css/views/components/rigthNav";
.nav_list {
	@at-root #{&}--main {
		.bg-gcdt {
			background-image: url("../assets/images/components/rightNav/rBarIcon01.png");
		}
		.cztx {
			background-image: url("../assets/images/components/rightNav/rBarIcon02.png");
		}

		.person {
			background-image: url("../assets/images/components/rightNav/rBarIcon03.png");
		}
		.blank {
			background-image: url("../assets/images/components/rightNav/rBarIcon04.png");
		}
		.pwd {
			background-image: url("../assets/images/components/rightNav/rBarIcon05.png");
		}

		.charge {
			background-image: url("../assets/images/components/rightNav/rBarIcon06.png");
		}
		.tx {
			background-image: url("../assets/images/components/rightNav/rBarIcon07.png");
		}
		.money {
			background-image: url("../assets/images/components/rightNav/rBarIcon08.png");
		}
		.bg-tzjl {
			background-image: url("../assets/images/components/rightNav/rBarIcon09.png");
		}
		.bg-kjjl {
			background-image: url("../assets/images/components/rightNav/rBarIcon10.png");
		}

		.bg-cztx {
			background-image: url("../assets/images/components/rightNav/rBarIcon11.png");
		}
		.proxy {
			background-image: url("../assets/images/components/rightNav/rBarIcon12.png");
		}

		.bg-xxzx {
			background-image: url("../assets/images/components/rightNav/rBarIcon13.png");
		}
		.notice {
			background-image: url("../assets/images/components/rightNav/rBarIcon14.png");
		}
		.zxkf {
			background-image: url("../assets/images/components/rightNav/rBarIcon15.png");
		}
	}
}
</style>
<style lang="scss">
.nav_list--right_img {
	.van-image__img {
		border-radius: 50% !important;
	}
}
</style>

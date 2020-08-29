<template>
	<van-row>
		<van-grid class="mainRow" column-num="5" :border="false" icon-size="40px">
			<van-grid-item
				v-for="(item, index) in mainTabs"
				:key="index"
				:icon="item.img"
				:text="item.label"
				@click="mainTapsNav(item)"
			></van-grid-item>
		</van-grid>
		<div v-if="isLogin">
			<div v-show="conSing === 1 && norSing === 0" class="indexPage--sing" @click="goSing">
				<SignGif></SignGif>
				<div class="signText">
					连续签到 {{ norCon.is_con }} 天领 {{ norCon.is_con_money }} 元彩金!
				</div>
			</div>
		</div>
	</van-row>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import SignGif from "../../components/SignGif";
export default {
	name: "Navs",
	components: { SignGif },
	data: () => ({
		mainTabs: [
			{
				id: 1,
				label: "优惠活动",
				img: require("../../assets/images/index/quick/index_activity.png"),
				routerName: "DiscountActivity"
			},
			{
				id: 3,
				label: "高手计划",
				img: require("../../assets/images/index/quick/index_plan.png"),
				routerName: "Plan"
			},
			{
				id: 2,
				label: "聊天室",
				img: require("../../assets/images/index/quick/index_chat.png"),
				routerName: "ChatRoom"
			},
			{
				id: 4,
				label: "长龙助手",
				img: require("../../assets/images/index/quick/index_long.png"),
				routerName: "LongQuery"
			},
			{
				id: 5,
				label: "在线客服",
				img: require("../../assets/images/index/quick/index_serv.png")
			}
		],
		norSing: "",
		norCon: {},
		conSing: ""
	}),
	computed: {
		...mapState({
			isLogin: state => state.user.isLogin,
			webCommonWap: state => state.common.webCommonWap
		}),
		...mapGetters(["webData"])
	},
	created() {
		this.singOpen();
	},
	methods: {
		// 是否开启签到
		singOpen() {
			if (!this.isLogin) return;
			// 会员是否今日已签到
			this.$api
				.request("API_GET_USER_SING_IS_OR_NOT", {
					source_type: 2
				})
				.then(
					success => {
						this.norSing = success.Data.is_cancel;
						this.$stores.set("norSing", this.norSing);
						this.$stores.set("get_vip", success.Data.level);
						this.norCon = success.Data;
						this.conSing = success.Data.state;
					},
					error => this.$root.$emit("handleError", error)
				);
		},
		goSing() {
			this.$router.push({ name: "SingIn" });
		},
		//在线客服
		mainTapsNav(item) {
			if (item.id === 2) {
				if (this.webCommonWap.ChatRoom === 1) {
					window.location.href = `${
						document.location.href
					}chat_home/index/0?s=${this.$stores.get("s")}`;
				} else {
					this.$root.$emit("handleError", "暂不开放");
				}
			} else if (item.id === 3) {
				if (this.webCommonWap.WebData.is_plan && this.webCommonWap.WebData.is_plan !== 1) {
					this.$root.$emit("handleError", "暂不开放");
				} else {
					this.$router.push({ name: item.routerName });
				}
			} else if (item.id === 5) {
				const ws = this.webData.web_cs;
				if (ws === "" || null) {
					this.$root.$emit("handleError", "没有在线客服");
				} else {
					window.open(ws);
				}
			} else {
				this.$router.push({ name: item.routerName });
			}
		}
	}
};
</script>

<style scoped lang="scss">
.mainRow {
	border-bottom: 1px solid #eee;
	margin-bottom: 10px;
}
.indexPage--sing {
	height: 100px;
	margin-top: -10px;
	position: relative;
	background-color: #ffffff;
	@at-root #{&}_singBj {
		height: 70px;
		background-image: url("../../assets/images/userCenter/singin/singInBj.png");
		background-size: 100% 100%;
		position: relative;
		width: 100%;
		p {
			padding-left: 30px;
			font-size: 15px;
			color: #ffffff;
			line-height: 20px;
			font-weight: 700;
			&:first-child {
				padding-top: 15px;
			}
		}
		.cycle {
			font-size: 12px;
			span {
				font-size: 14px;
				background: linear-gradient(90deg, #fbe2aa, #f2d740);
				-webkit-background-clip: text;
				color: transparent;
				text-shadow: 3px 0 2px rgba(#8d0006, 0.35);
			}
		}
		.gif_sing {
			position: absolute;
			top: 15px;
			right: 15px;
			width: 30%;
		}
	}
	.signText {
		position: absolute;
		width: 100%;
		text-align: center;
		bottom: 24px;
		color: #ffffff;
		font-size: 12px;
	}
}
</style>

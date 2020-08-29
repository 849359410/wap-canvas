<template>
	<div id="app">
		<div
			ref="scroll"
			:class="[
				'content',
				{ TailHeight: $route.meta.TailShow },
				{ handBar: $route.meta.handBar },
				{ scrollTop: !$route.meta.scrollTop },
				{ handBar: $route.meta.isHeight }
			]"
		>
			<head-title v-show="$route.meta.handBar"></head-title>
			<router-view></router-view>
			<TabBar v-show="$route.meta.TailShow"></TabBar>
		</div>
		<loading></loading>
		<yu-index></yu-index>
	</div>
</template>
<script>
import HeadTitle from "./components/HeadTitle";
import popConfig from "./mixins/popConfig";
import newSocket from "./mixins/newSocket";
import loading from "./components/loading";
import TabBar from "./components/TabBar";
import yuIndex from "./views/yuBao/yuIndex";
export default {
	name: "App",
	components: { HeadTitle, loading, TabBar, yuIndex },
	mixins: [popConfig, newSocket],
	watch: {
		$route: {
			handler() {
				this.$refs.scroll.scrollTo(0, 0);
			},
			deep: true
		}
	},
	created() {
		this.setVPage(2);
		this.lotteryResultSocket();
		this.initGlobal()
			.then(() => {
				this.$store.dispatch("setIsReady", true);
				this.getAppConfig();
			})
			.catch(message => {
				this.$root.$emit("handleError", message);
			});
		const intr = this.$helps.getUrlParam("intr"),
			u = this.$helps.getUrlParam("u");
		if (intr && intr.length > 0) this.$stores.set("at_id", intr);
		if (u && u.length > 0) this.$stores.set("user_code", u);
		if (intr || u) {
			this.$router.push({ name: "Register" });
		}
	},
	methods: {
		async initGlobal() {
			this.$helps.showLoading();
			// 获取站点信息以及首页轮播图
			await this.$api.request("API_GET_WEB_COMMON_TO_WAP").then(success => {
				document.getElementById("web_title_id").innerHTML =
					success.Data.WebData.web_name || "";
				this.$store.dispatch("setWebCommonWap", success.Data);
			});
			// 获取彩种列表
			await this.$api.request("API_GET_FC_GAME_BY_CATE").then(success =>
				this.$store.dispatch("setLotteries", {
					data: success.Data,
					platform: 3
				})
			);
			this.$api.request("API_GET_WEB_SITE_BY_CODE").then(res => {
				this.$stores.set("load_img", res.Data);
			});
			this.$helps.hideLoading();
		},
		async getAppConfig() {
			// 获取app配置
			await this.$api.request("API_GET_APP_CONFIG").then(success => {
				const data = success.Data.Data;
				if (data && Reflect.has(data, "state")) {
					const { state, writer, note_state } = data;
					this.$stores.set("isShare", state);
					this.$stores.set("shareMsg", writer);
					this.$stores.set("isNoteState", note_state);
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
#app {
	.content {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		background-color: #f4f4f4;
	}
	.scrollTop {
		overflow-y: scroll;
	}
	.handBar {
		top: 44px;
	}
	.TailHeight {
		bottom: 44px;
	}
}
</style>
<style lang="scss">
/*幸运赛车的样式*/
$color-10: #d5b900, #0d82ba, #646464, #d97e01, #00a7ab, #9b5db6, #9f9f9f, #d53022, #91332f, #f3ad43;
@for $i from 1 through 10 {
	.luckyCarClass#{$i} {
		background-color: nth($color-10, $i) !important;
	}
}
.lucky_green {
	background: #38b366 !important;
}
.lucky_red {
	background: #dc3b40 !important;
}
.lucky_blue {
	background: #218ddd !important;
}
.lucky_other {
	background: #8e8e8e !important;
}
.van-toast--middle {
	z-index: 1000 !important;
}
</style>

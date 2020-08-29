<template>
	<van-row class="headHome">
		<van-nav-bar class="index" :fixed="true" :border="false">
			<template v-if="!isApp" #left>
				<img class="app" :src="app" alt="" @click="mainTapsNav()" />
			</template>
			<template #title>
				<img
					class="logo"
					:src="Object.hasOwnProperty.call(webData, 'logo_wap') ? webData.logo_wap : ''"
				/>
			</template>
			<template #right>
				<div v-show="isLoRe" class="button-text">
					<van-button
						plain
						color="#ef384a"
						type="default"
						size="mini"
						:to="{ name: 'login' }"
					>
						登录
					</van-button>
					<van-button color="#f0ad4e" size="mini" :to="{ name: 'Register' }">
						注册
					</van-button>
				</div>
			</template>
		</van-nav-bar>
	</van-row>
</template>
<script>
import { mapGetters, mapState } from "vuex";
export default {
	name: "HomeHead",
	data: () => ({
		app: require("../assets/images/index/head/appDown.png"),
		logoSrc: "",
		isLoRe: true
	}),
	computed: {
		...mapGetters(["webData"]),
		...mapState({
			isLogin: state => state.user.isLogin,
			isApp: state => state.common.isApp
		})
	},
	created() {
		if (this.$route.name === "Index") {
			this.isLoRe = !this.isLogin;
		}
	},
	methods: {
		mainTapsNav() {
			window.location.href = `${document.location.href}app_download/index`;
		}
	}
};
</script>

<style scoped lang="scss">
@import "../assets/css/mixins/mixin";
.index {
	height: 44px;
	@include bgColor();
	.app {
		width: 44px;
	}
	.logo {
		width: 125px;
		vertical-align: middle;
	}
	.button-text {
		margin: -10px;
		button {
			border-radius: 5px;
		}
	}
}
</style>

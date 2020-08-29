<template>
	<van-row>
		<van-tabbar
			v-model="active"
			:border="false"
			class="tabbars"
			active-color="#ef384a"
			@change="onChange"
		>
			<van-tabbar-item
				v-for="(item, index) in tabs"
				:key="index"
				:class="{ YueBao: item.page === 'YueBao' }"
				:name="item.page"
				:icon="active === item.page ? item.sel : item.nor"
			>
				{{ item.label }}</van-tabbar-item
			>
		</van-tabbar>
	</van-row>
</template>
<script>
import nor_01 from "../assets/images/index/nav/bar/home.png";
import nor_02 from "../assets/images/index/nav/bar/game.png";
import nor_04 from "../assets/images/liveBroadcast/lotteryHall/zb_na.png";
import nor_05 from "../assets/images/index/nav/bar/personal center.png";
import sel_01 from "../assets/images/index/nav/bar/homes.png";
import sel_02 from "../assets/images/index/nav/bar/games.png";
import sel_04 from "../assets/images/liveBroadcast/lotteryHall/zb.png";
import sel_05 from "../assets/images/index/nav/bar/personalcenter.png";
import sel_06 from "../assets/images/index/nav/bar/homeRecharge.png";
import { Bus } from "../main";

export default {
	name: "TabBar",
	data: () => ({
		tabs: [
			{ label: "首页", nor: nor_01, sel: sel_01, page: "Index" },
			{ label: "游戏大厅", nor: nor_02, sel: sel_02, page: "BettingHall" },
			{ label: "余额宝", nor: sel_06, sel: sel_06, page: "YueBao" },
			{ label: "视讯直播", nor: nor_04, sel: sel_04, page: "pageLiveIndex" },
			{ label: "用户中心", nor: nor_05, sel: sel_05, page: "MemberCenter" }
		],
		active: "Index"
	}),
	watch: {
		$route(to) {
			this.active = to.name;
		}
	},
	methods: {
		onChange(name) {
			if (name === "YueBao") {
				Bus.$emit("yu-bao-show", 1);
				this.active = this.$route.name;
			} else {
				this.active = name;
				this.$router.push({ name: name });
			}
		}
	}
};
</script>
<style scoped lang="scss">
.tabbars {
	bottom: 0;
	box-sizing: border-box;
	padding-bottom: 0;
	background: url("../assets/images/index/nav/bar/homeBack.png") no-repeat;
	background-size: 100% 100%;
	overflow: visible;
	height: 55px;
	padding-top: 7px;
}
</style>
<style lang="scss">
.YueBao {
	.van-tabbar-item__icon {
		.van-icon {
			img {
				width: 75px !important;
				height: 75px !important;
				position: absolute;
				top: -62px;
				left: -29px;
			}
		}
	}
	.van-tabbar-item__text {
		margin-bottom: -20px;
	}
}
</style>

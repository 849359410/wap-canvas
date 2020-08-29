<template>
	<div class="index" style="height: 100%">
		<van-row class="swipe_hall">
			<Swipe :images="images"></Swipe>
		</van-row>

		<van-sticky :offset-top="headHeight">
			<game-tab @change-game-type="changeGameType"></game-tab>
		</van-sticky>
		<lottery-tab v-if="gameLabel === 'cp'"></lottery-tab>
		<gameList v-if="gameLabel !== 'cp'" :type="gameLabel" :game="gameList"></gameList>
	</div>
</template>
<script>
import { mapState } from "vuex";
import gameTab from "./gameTab";
import lotteryTab from "./lotteryTab";
import gameList from "./gameList/electronic";
import Swipe from "../../components/Swipe";
import image1 from "../../assets/images/betting/nav/sxzb_1.png";
import image2 from "../../assets/images/betting/nav/sxzb_2.png";
import image3 from "../../assets/images/betting/nav/sxzb_3.png";

export default {
	name: "Index",
	components: { Swipe, gameTab, lotteryTab, gameList },
	data() {
		return {
			gameLabel: "cp",
			gameList: [],
			images: [image1, image2, image3],
			headHeight: 0
		};
	},
	computed: {
		...mapState({
			isLogin: state => state.user.isLogin,
			igState: state => state.lottery.liveLottery.tra_state
		})
	},
	mounted() {
		let el = document.getElementsByClassName("head");
		this.headHeight = el[0].clientHeight;
	},
	methods: {
		changeGameType(label) {
			this.gameLabel = label;
			switch (label) {
				case "sx":
				case "dz":
				case "by":
				case "qp":
					return this.getGameModelList(label);
			}
		},
		getGameModelList(type) {
			this.$api.request("API_GET_GAME_MODULE", { vd_type: type }).then(
				success => {
					this.gameList = success.Data ? success.Data : [];
					if (type === "sx" && this.gameList.length > 0) {
						let ig = this.gameList.find(v => v.vd_type === "ig");
						if (ig) ig.vd_state = this.igState;
					}
				},
				error => this.$root.$emit("handleError", error)
			);
		}
	}
};
</script>
<style lang="scss">
.swipe_hall {
	background: #fff url("https://static.cloudywoo.com/img/game/yxdt_bj.png");
	background-size: 100% 100%;
	padding: 10px;
	.van-swipe__indicators {
		right: 0;
		left: auto;
	}
}
</style>

<template>
	<div class="home main">
		<plan-trans :list="head_list" :game-list="gameList" />
		<div class="rank">
			<plan-rank
				:game-list="gameList"
				:search-params="searchParams"
				:api-url="url"
			></plan-rank>
			<div class="bottom-box">
				<van-row class="rank-head">高手计划</van-row>
				<plan-trans :list="gameList" />
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import PlanTrans from "./js/plan_trans";
import PlanRank from "./planRank";
import plan from "../../assets/js/plan";
import history from "../../assets/images/plan/plan_history.png";
import hight from "../../assets/images/plan/plan_hight.png";
import map from "../../assets/images/plan/plan_map.png";
import lottery from "../../assets/images/plan/plan_lottery.png";
export default {
	name: "Home",
	components: {
		PlanTrans,
		PlanRank
	},
	data() {
		return {
			head_list: [
				{ id: 0, GameName: "历史开奖", logo: history, router: "LotteryResult" },
				{ id: 1, GameName: "高手计划", logo: hight, router: "killerPlanIndex" },
				{ id: 2, GameName: "走势图", logo: map, router: "TrendMap" },
				{ id: 3, GameName: "游戏大厅", logo: lottery, router: "BettingHall" }
			],
			DATA: [],
			gameList: [],
			url: "GET_USER_PLAN_TOP",
			searchParams: {
				gameId: "",
				playId: "",
				orderBy: 0,
				page: 1
			}
		};
	},
	computed: {
		...mapGetters(["operableLotteries", "singleLottery"])
	},
	created() {
		this.getPlanList();
	},
	methods: {
		async getPlanList() {
			// 高手计划
			let that = this;
			this.gameList = [];
			await this.$api.request("GET_GAME_LIST").then(
				success => {
					let data = success.Data;
					Object.keys(data).forEach(function(key) {
						let dataKey = data[key],
							key1 = key;
						Object.keys(dataKey).forEach(key => {
							if (that.operableLotteries.length === 0) {
								dataKey[key] = plan.getLogo(dataKey[key], key1);
							} else {
								let lottery = that.$helps.find(
									that.operableLotteries,
									k => k.fc_id === dataKey[key].SourceId
								);
								if (lottery) dataKey[key].logo = lottery.fc_logo;
								else dataKey[key] = plan.getLogo(dataKey[key], key1);
							}
							dataKey[key].class = key1;
							if (dataKey[key].GameName === "极速PK10")
								dataKey[key].GameName = "极速飞车";
							if (dataKey[key].GameName === "北京PK10")
								dataKey[key].GameName = "北京PK拾";
							that.gameList.push(dataKey[key]);
						});
					});
					this.gameList.forEach(i => {
						if (this.singleLottery(i.SourceId).fc_state === 1) {
							this.DATA.push(i);
						}
						this.gameList = this.DATA;
					});
					this.$stores.set("gameList", JSON.stringify(that.gameList));
				},
				error => {
					this.$root.$emit("handleError", error);
				}
			);
		}
	}
};
</script>
<style lang="scss">
@import "../../assets/css/mixins/mixin";
@import "../../assets/css/views/plan/head";
</style>

<template>
	<div class="second-header">
		<div class="headMain">
			<div class="head">
				<div class="left">
					<van-icon class="icon" name="arrow-left" @click="goBack()" />
				</div>
				<div class="center">
					<van-dropdown-menu>
						<van-dropdown-item ref="item" :title="playName" @open="setType">
							<!-- 玩法选择 -->
							<tabs
								:list="playingTypeList"
								:tab-height="2"
								:rendered="false"
								@getReturnTabs="getCreditName"
							></tabs>
						</van-dropdown-item>
					</van-dropdown-menu>
				</div>
				<div class="right" @click="touchPlay()">
					<p class="right_play--name">{{ currentLottery.fc_name }}</p>
					<van-icon
						name="arrow-down"
						class="right_play--name_close nameIcon"
						:class="playingDialog ? 'right_play--name_open' : ''"
					></van-icon>
				</div>
				<!-- 更多彩种 -->
				<lottery-list v-show="playingDialog" :id="playId"></lottery-list>
			</div>
			<second-cumulative :second-de="secondDe" :accumulate="accumulate"></second-cumulative>
			<!--开奖号码-->
			<div class="results">
				<secondResultModel :class="returnResultsClass(currentLottery)"></secondResultModel>
			</div>
			<!-- 历史开奖结果 -->
			<open-result v-show="openResultsShow"></open-result>
			<div v-show="openResultsShow" class="maskResultsList" @click="openResults"></div>
			<!-- 右侧导航菜单 -->
			<right-nav></right-nav>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import tabs from "../../../components/Tabs";
import lotteryList from "../head/lotteryList";
import creditPlaying from "../../../mixins/creditPlaying";
import secondCumulative from "./secondCumulative";
import secondResultModel from "./secondResultModel";
import openResult from "../head/openResult";
import rightNav from "../../../components/RightNav";
import lotteryResult from "../../../mixins/lotteryResult";
export default {
	name: "SecondHead",
	components: { lotteryList, tabs, secondCumulative, secondResultModel, openResult, rightNav },
	mixins: [creditPlaying, lotteryResult],
	props: {
		playId: {
			type: Number,
			default: 0
		},
		secondDe: {
			type: Object,
			default() {
				return {};
			}
		},
		accumulate: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			playName: "",
			playingDialog: false,
			openResultsShow: false
		};
	},
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery
		})
	},
	watch: {
		playId(n) {
			this.setCurrentLottery(Number(n));
			this.loadPlayingCreditType();
		},
		playingTypeList(n) {
			this.playName = n[0].name;
			this.getCreditName(n[0]);
		}
	},
	created() {
		this.loadPlayingCreditType(1, Number(this.playId));
	},
	methods: {
		...mapActions(["setCurrentLottery"]),
		goBack() {
			this.$router.push({ name: this.$route.meta.parent });
		},
		setType() {
			if (this.playingDialog) this.touchPlay();
		},
		touchPlay() {
			this.playingDialog = !this.playingDialog;
		},
		getCreditName(name) {
			this.playName = name.name;
			this.$refs.item.toggle(false);
			this.$parent.creditNameIndex(name);
			if (this.openResultsShow) this.openResultsShow = false;
		},
		openResults() {
			this.openResultsShow = !this.openResultsShow;
		},
		returnResultsClass() {
			if (this.isHappyLottery) return "luckyResultisHappyLottery";
			else if (this.isMarkSixLottery) return "luckyResultisixLottery";
			else return "luckyResulpk";
		}
	}
};
</script>

<style scoped lang="scss">
.second-header {
	@import "../../../assets/css/views/betting/head/Index";
	@import "../../../assets/css/views/betting/secondsOpen/secondHead";
}
</style>
<style lang="scss">
.headMain {
	.head {
		.center {
			.van-dropdown-menu__bar {
				background-color: initial;
			}
			.van-dropdown-menu__title {
				color: white;
			}
		}
	}
}
</style>

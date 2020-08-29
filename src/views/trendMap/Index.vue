<template>
	<div class="trendMap">
		<van-nav-bar
			:title="lottery.fc_name"
			left-arrow
			:fixed="true"
			class="head"
			:class="showHist ? 'histShow' : ''"
			@click-left="onClickLeft"
		>
			<template #right>
				<van-icon name="wap-nav" @click="showHistMenu" />
			</template>
		</van-nav-bar>
		<div v-show="!showHist" class="trendMain">
			<div id="trend_main" class="trend_main">
				<div class="top_tabSelect">
					<div v-if="positionTabs.length > 0" class="ball">
						<span
							v-for="(tab, index) in positionTabs"
							:key="index"
							class="ball-wei topButton"
							:class="{ 'ball-wei__select': activeTab === index }"
							@click="getLotteryResult(index)"
						>
							{{ tab }}
						</span>
					</div>
					<div class="ballTow">
						<span
							v-for="(item, index) in numberPeriods"
							:key="index"
							class="ballTow-wei"
							@click="getNumberPeriods(item)"
						>
							<button
								:class="{ 'ballTow-wei__select': numberPeriodsTab === item.limit }"
							>
								{{ item.name }}
							</button>
						</span>
					</div>
				</div>
			</div>
			<Trend-canvas ref="canvas" :table-data="tableData" :height="height"></Trend-canvas>
		</div>
		<Hist-menu v-show="showHist" :id="id"></Hist-menu>
	</div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import HistMenu from "./histMenu";
import TrendCanvas from "./trendCanvas";
export default {
	name: "Index",
	components: { HistMenu, TrendCanvas },
	props: {
		id: {
			type: [Number, String],
			default: ""
		}
	},
	data() {
		return {
			showHist: false,
			tableData: [],
			activeTab: 0,
			lotteryResults: [],
			numberPeriods: [
				{ limit: 30, name: "30期" },
				{ limit: 50, name: "50期" },
				{ limit: 80, name: "80期" }
			],
			searchParams: {
				limit: 30
			},
			height: 0,
			numberPeriodsTab: 0
		};
	},
	computed: {
		...mapState({
			lottery: state => state.lottery.currentLottery
		}),
		// 计算当前彩种开奖结果位数名称sdfas
		positionTabs() {
			return this.$lotteryPub.generateTrendMapHead(this.lottery);
		}
	},
	watch: {
		id(n) {
			this.setCurrentLottery(Number(n));
			this.showHist = false;
			this.tableData = [];
			this.searchParams.limit = 30;
			this.lotteryResultAll();
			this.numberPeriodsTab = 30;
			this.activeTab = 0;
		},
		currentLottery(n) {
			this.$route.meta.name = n.fc_name;
		},
		positionTabs(n) {
			if (n.length) {
				this.height = window.innerHeight - 44 - 90;
			} else {
				this.height = window.innerHeight - 44 - 45;
			}
		}
	},
	mounted() {
		this.height = window.innerHeight - 44 - document.getElementById("trend_main").offsetHeight;
	},
	created() {
		this.setCurrentLottery(Number(this.id));
		this.lotteryResultAll();
		this.numberPeriodsTab = 30;
	},
	methods: {
		...mapActions(["setCurrentLottery"]),
		onClickLeft() {
			this.$router.go(-1);
		},
		showHistMenu() {
			this.showHist = !this.showHist;
		},
		getLotteryResult(index) {
			this.activeTab = index;
			this.tableData = this.$lotteryPub.handleLotteryTrendMap(
				this.lottery,
				this.lotteryResults,
				index
			);
		},
		getNumberPeriods(item) {
			this.numberPeriodsTab = item.limit;
			this.searchParams.limit = item.limit;
			this.lotteryResultAll();
		},
		// 获取开奖结果
		lotteryResultAll() {
			this.searchParams.fc_id = this.lottery.id ? this.lottery.id : 81;
			this.$api.request("API_GET_FC_AUTO_TO_NUM", this.searchParams).then(
				success => {
					const { Data } = success.Data;
					this.lotteryResults = Data;
					this.getLotteryResult(this.activeTab);
				},
				error => this.$root.$emit("handleError", error)
			);
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/trendMap/index";
</style>
<style lang="scss">
.trendMap {
	height: 100%;
	width: 100%;
	position: relative;
	overflow: hidden;
	.trendMain {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}
}
.trend_main {
	height: auto !important;
	overflow: hidden;
}
</style>

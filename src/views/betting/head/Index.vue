<template>
	<div class="headMain">
		<div class="head">
			<div class="left">
				<van-icon class="icon" name="arrow-left" @click="goBack()" />
			</div>
			<div class="center">
				<p
					v-show="currentLottery.tra_state === 1 && currFcModule.length > 1"
					class="takeName"
					@click="switchLottery(isOfficial ? 0 : 1)"
				>
					<span>{{ isOfficial ? "官方" : "信用" }}</span>
					<span>玩法</span>
				</p>
				<p>{{ currentLottery.fc_name }}</p>
			</div>
			<div class="right" @click="touchPlay">
				<p class="right_play--name">{{ currentLottery.fc_name }}</p>
				<van-icon
					name="arrow-down"
					class="right_play--name_close nameIcon"
					:class="playingDialog ? 'right_play--name_open' : ''"
				></van-icon>
			</div>
		</div>
		<lottery-list v-show="playingDialog" :id="playId" :is-official="isOfficial"></lottery-list>
		<!-- 信用玩法选择 -->
		<tabs
			v-if="isCredit"
			ref="tabs"
			style="position: sticky;z-index: 10"
			:tab-height="2"
			:list="playingTypeList"
			:rendered="true"
			@getReturnTabs="getCreditName"
		></tabs>
		<!-- 官方玩法选择 -->
		<officialTank v-if="isOfficial" :id="playId" ref="tank"></officialTank>
		<div class="results">
			<div v-if="otimeState" :class="returnResultsClass(currentLottery)">
				<div class="luckyResultFirst">
					<p>已封盘</p>
				</div>
				<div class="luckyResultSecond">
					<div class="first">已封盘</div>
				</div>
			</div>
			<lottery-result-model
				v-else
				:class="returnResultsClass(currentLottery)"
				@otimeState="getTime"
			></lottery-result-model>
		</div>
		<open-result v-show="openResultsShow"></open-result>
		<div v-show="openResultsShow" class="maskResultsList" @click="openResults"></div>
		<!-- 右侧导航菜单 -->
		<right-nav></right-nav>
		<van-dialog
			v-model="otimeState"
			confirm-button-text="返游戏大厅"
			:message="`${currentLottery.fc_name}-已封盘`"
			@confirm="
				$router.push({
					name: 'BettingHall'
				})
			"
		>
		</van-dialog>
	</div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import lotteryList from "./lotteryList";
import lotteryResultModel from "./lotteryResultModel";
import openResult from "./openResult";
import LotteryResult from "../../../mixins/lotteryResult";
import tabs from "../../../components/Tabs";
import rightNav from "../../../components/RightNav";
import officialTank from "./officialTank";

export default {
	name: "Index",
	components: { lotteryList, lotteryResultModel, openResult, tabs, rightNav, officialTank },
	mixins: [LotteryResult],
	props: {
		playId: {
			type: Number,
			default: 0
		},
		playingDialog: {
			type: Boolean,
			default: false
		},
		playingTypeList: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			isCredit: false,
			isOfficial: false,
			otimeState: false,
			openResultsShow: false
		};
	},
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery,
			currFcModule: state => state.common.webCommonWap.FcModule
		})
	},
	watch: {
		playId(n) {
			this.setCurrentLottery(Number(n));
			this.openResultsShow = false;
			if (this.$route.name === "Credit") {
				this.$refs.tabs.getReset();
			} else {
				this.$refs.tank.$refs.tabs.getReset();
			}
		}
	},
	created() {
		this.checkRouteName();
	},
	methods: {
		...mapActions(["setCurrentLottery"]),
		goBack() {
			this.$router.push({ name: this.$route.meta.parent });
		},
		checkRouteName() {
			if (this.$route.name === "Official") this.isOfficial = true;
			else {
				this.isCredit = true;
				this.$parent.loadPlayingCreditType(1, Number(this.id));
			}
		},
		getCreditName(val) {
			this.$stores.set("lhcAB", 1);
			this.$stores.set("selIndex", 0);
			this.$stores.set("selIndexSL", 0);
			this.openResultsShow = false;
			this.$parent.creditNameIndex(val);
		},
		closePlayDialog() {
			this.playingDialog = false;
		},
		touchPlay() {
			this.playingDialog = !this.playingDialog;
		},
		getTime(i) {
			this.otimeState = i.time === -1;
		},
		returnResultsClass() {
			if (this.isHappyLottery) return "luckyResultisHappyLottery";
			else if (this.isMarkSixLottery) return "luckyResultisixLottery";
			else return "luckyResulpk";
		},
		openResults() {
			this.openResultsShow = !this.openResultsShow;
		},
		//  type 0 :跳转信用 1 跳转官方
		switchLottery(type) {
			let maint = type ? this.currentLottery.tra_maint : this.currentLottery.fc_maint;
			if (maint === 1) {
				this.$router.push({
					name: type ? "Official" : "Credit",
					params: { id: this.currentLottery.fc_id }
				});
			} else {
				this.$root.$emit("handleError", `该彩种${type ? "官方" : "信用"}玩法已维护`);
			}
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/head/Index";
</style>

<template>
	<div class="fastHead">
		<div class="headMain">
			<div class="head">
				<div class="left">
					<van-icon class="icon" name="arrow-left" @click="goBack()" />
				</div>
				<div class="center">
					<van-dropdown-menu>
						<van-dropdown-item ref="item" :title="activeTypeVal.name" @open="setType">
							<!-- 玩法选择 -->
							<fast-tank
								:playing-fast-three="playingTypeList"
								:fast-play-onclick="activeTypeVal"
								@childPlayingType="childPlayingType"
							></fast-tank>
						</van-dropdown-item>
					</van-dropdown-menu>
				</div>
				<div class="right" @click="touchPlay">
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
			<!--倒计时-->
			<div v-if="oTimeState" class="results">
				<p>已封盘</p>
			</div>
			<!-- 秒开 -->
			<second-cumulative
				v-if="iFastSecondOpen"
				class="kuai3SeCond"
				:second-de="secondDe"
				:accumulate="accumulate"
			></second-cumulative>
			<div v-else class="results">
				<p>{{ period.period }}期</p>
				<lottery-countdown
					:lottery-id="currentLottery.fc_id"
					class="fastHead-coun"
					@otime="getTime"
				></lottery-countdown>
			</div>
			<!--历史开奖结果-->
			<div v-if="oTimeState" class="fastThree">
				<van-row class="fastThree--dataList">
					<van-col class="period" span="24">已封盘</van-col>
				</van-row>
			</div>
			<div v-else class="fastThree" @click="openResults()">
				<fast-result></fast-result>
			</div>
			<open-result v-if="openResultsShow"></open-result>
			<div v-show="openResultsShow" class="maskResultsList" @click="openResults"></div>
			<right-nav></right-nav>
			<van-dialog
				v-model="oTimeState"
				confirm-button-text="返回购彩大厅"
				:message="`${currentLottery.fc_name}-已封盘`"
				@confirm="
					$router.push({
						name: 'BettingHall'
					})
				"
			>
			</van-dialog>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import fastTank from "./fastTank";
import lotteryList from "../head/lotteryList";
import lotteryResult from "../../../mixins/lotteryResult";
import secondCumulative from "../secondsOpen/secondCumulative";
import lotteryCountdown from "../lotteryCountdown";
import fastResult from "./fastResult";
import openResult from "../head/openResult";
import rightNav from "../../../components/RightNav";

export default {
	name: "FastHead",
	components: {
		fastTank,
		lotteryList,
		secondCumulative,
		lotteryCountdown,
		fastResult,
		openResult,
		rightNav
	},
	mixins: [lotteryResult],
	props: {
		playingTypeList: {
			type: Object,
			default() {
				return {};
			}
		},
		activeTypeVal: {
			type: Array,
			default() {
				return [];
			}
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
		},
		playId: {
			type: Number,
			default: 0
		},
		playingDialog: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			oTimeState: false,
			openResultsShow: false
		};
	},
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery,
			currentPlaying: state => state.lottery.currentPlaying
		})
	},
	watch: {
		playId() {
			this.openResultsShow = false;
		}
	},
	methods: {
		goBack() {
			this.$router.push({ name: this.$route.meta.parent });
		},
		touchPlay() {
			this.playingDialog = !this.playingDialog;
		},
		setType() {
			if (this.playingDialog) this.touchPlay();
		},
		childPlayingType(val) {
			this.$refs.item.toggle(false);
			this.$parent.clickPlay(val);
		},
		getTime(i) {
			this.oTimeState = i.time === -1;
		},
		openResults() {
			this.openResultsShow = !this.openResultsShow;
			this.$emit("getScroll", this.openResultsShow);
		}
	}
};
</script>

<style scoped lang="scss">
.fastHead {
	margin-bottom: 10px;
	z-index: 30;
	box-shadow: 0 0.53333vw 1.06667vw 0 rgba(0, 0, 0, 0.07);
	@import "../../../assets/css/views/betting/head/Index";
	@import "../../../assets/css/views/betting/secondsOpen/secondHead";
	.headMain {
		.head {
			position: fixed;
			width: 100%;
		}
		.results {
			padding-top: 44px;
		}
	}
}
</style>
<style lang="scss">
.kuai3SeCond {
	top: 44px;
}
.headMain {
	.head {
		.center {
			.van-dropdown-menu__title {
				color: white;
			}
			.van-dropdown-menu__bar {
				background-color: #ef384a;
				height: 44px;
			}
		}
	}
}
</style>

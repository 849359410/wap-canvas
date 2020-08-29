<template>
	<van-row class="lottery" :class="{ stateEry: openResultsShow }">
		<van-nav-bar left-arrow :fixed="true" class="lottery-first" @click-left="$router.go(-1)">
			<template #title>
				<van-dropdown-menu class="lottery--" active-color="#fff">
					<van-dropdown-item
						ref="game"
						active-color="#fff"
						:title="currentLottery.fc_name"
						@open="openResultsShow = false"
					>
						<van-row>
							<plan-trans :list="gamelist" @gameCol="gameCol" />
						</van-row>
					</van-dropdown-item>
				</van-dropdown-menu>
			</template>
		</van-nav-bar>
		<van-row class="lottery-head">
			<van-col span="18"> 高手计划：{{ currentLottery.fc_name }} > {{ gameName }} </van-col>
			<van-col span="6" class="lottery-head_right">
				<van-dropdown-menu class="lottery-head_right_title" active-color="#ff2435">
					<van-dropdown-item
						ref="gameMeun"
						v-model="gameName"
						class="lottery-head_right_game"
						title="切换玩法"
						@open="openResultsShow = false"
					>
						<game-list
							:list="playList"
							:game-name="gameName"
							@gameActive="gameActive"
						></game-list>
					</van-dropdown-item>
				</van-dropdown-menu>
			</van-col>
		</van-row>
		<van-row class="lottery-num" @click="getOpen">
			<van-col class="lottery-num_logo" span="4">
				<van-image :src="currentLottery.fc_logo" />
			</van-col>
			<van-col class="lottery-num_title lottery-head_right_game" span="18">
				<span>近期开奖 <i class="triangle"></i> </span>
				<plan-draw></plan-draw>
			</van-col>
			<van-col class="lottery-num_title">
				<lottery-countdown :lottery-id="currentLottery.fc_id"></lottery-countdown>
			</van-col>
		</van-row>
		<lottery-result v-if="openResultsShow"></lottery-result>
		<!--<van-overlay :show="openResultsShow" @click="openResults"></van-overlay>-->
		<div v-show="openResultsShow" class="maskResultsList" @click="openResults"></div>
		<plan-rank :game-list="gameList" :search-params="searchParams" :api-url="url"></plan-rank>
	</van-row>
</template>

<script>
import { mapState, mapActions } from "vuex";
import PlanRank from "./planRank";
import GameList from "./js/game_list";
import PlanTrans from "./planTrans";
import lotteryCountdown from "../betting/lotteryCountdown";
import lotteryResult from "../betting/head/openResult";
import PlanDraw from "./planDraw";
import Lottery from "../../mixins/lotteryResult";
export default {
	name: "PlanLottery",
	components: {
		PlanRank,
		GameList,
		lotteryCountdown,
		PlanTrans,
		lotteryResult,
		PlanDraw
	},
	mixins: [Lottery],
	data() {
		return {
			gameList: [],
			url: "GET_PLAN_LIST",
			searchParams: {
				gameId: 7,
				playId: 1,
				orderBy: 0,
				page: 1
			},
			// currentLottery: {},
			playList: [],
			gameName: "和值八码",
			playName: {},
			openResultsShow: false
		};
	},
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery
		})
	},
	watch: {
		"$route.query.id": function() {
			this.searchParams.gameId = this.$route.query.id;
			this.getCurrentLottery();
			this.loadHistoryLotteryResult();
		}
	},
	created() {
		this.gamelist = JSON.parse(this.$stores.get("gameList"));
		this.searchParams.gameId = this.$route.query.id;
		this.getCurrentLottery();
		this.loadHistoryLotteryResult();
	},
	methods: {
		...mapActions(["setCurrentLottery"]),
		getCurrentLottery() {
			this.gamelist.forEach(i => {
				if (i.GameId === Number(this.searchParams.gameId)) {
					this.playName = i;
					this.setCurrentLottery(Number(i.SourceId));
				}
			});
			this.getCurrentGame();
		},
		getOpen() {
			this.openResultsShow = !this.openResultsShow;
		},
		openResults() {
			this.openResultsShow = !this.openResultsShow;
		},
		getCurrentGame() {
			this.$api
				.request("GET_PALY_LIST", {
					shortName: this.currentLottery.class
				})
				.then(
					success => {
						this.playList = success.Data.playListData[this.playName.class];
						this.playList.forEach(i => (i.value = i.PlayName));
						this.gameName = this.playList[0].PlayName;
					},
					error => {
						this.$root.$emit("handleError", error);
					}
				);
		},
		gameActive(item) {
			this.gameName = item.PlayName;
			this.searchParams.playId = item.PlayId;
			this.$refs.gameMeun.toggle();
		},
		gameCol() {
			this.$refs.game.toggle();
		}
	}
};
</script>

<style lang="scss">
@import "../../assets/css/views/plan/head";
.stateEry {
	position: fixed;
	width: 100%;
}
.lottery {
	margin: 44px 0 25px 0;
	font-size: 12px;
	color: #666666;
	.lottery-first {
		height: 44px;
		background-color: #ef384a;
		z-index: 100;
		.van-nav-bar__left {
			i {
				color: #fff;
			}
		}
		.lottery-- {
			height: 44px;
			background-color: #ef384a;
			.main-head {
				.main-head_list {
					p {
						line-height: initial;
					}
				}
			}
			.van-dropdown-menu__bar {
				background-color: #ef384a;
				margin-right: 10px;
				height: 43px;
				.van-dropdown-menu__title {
					font-size: 17px;
				}
			}
			span {
				color: #fff;
			}
		}
	}
	@at-root #{&}-head {
		background-color: #ffffff;
		padding: 10px;
		line-height: 20px;
		border-bottom: 1px solid #dddddd;
		z-index: 20;
		position: relative;
		@at-root #{&}_right {
			color: #ff2435;
			text-align: right;
			i {
				float: right;
				margin-top: 3px;
			}
			@at-root #{&}_title {
				height: 20px;
			}
			.game {
				padding-bottom: 10px;
			}
			@at-root #{&}_game {
				position: relative;
				.van-dropdown-item {
					margin-top: 10px;
				}
				.game_list {
					color: #666666;
					text-align: center;
					padding: 5px 0;
					span {
						display: inline-block;
						border: 1px solid #d4d4d4;
						width: 70%;
						border-radius: 4px;
						&.active {
							background-color: #ff1f15;
							color: #ffffff;
							border-color: #ff5a4a;
						}
					}
				}
			}
			.lottery-head_right_title {
				float: right;
				margin-right: 10px;
				.van-dropdown-menu__bar {
					height: 20px;
					font-size: 12px;
					box-shadow: none;
				}
				.van-ellipsis {
					font-size: 12px;
				}
			}
		}
	}
	@at-root #{&}-num {
		padding: 10px 10px 14px 10px;
		background-color: #ffffff;
		position: relative;
		z-index: 10;
		@at-root #{&}_logo {
			width: 40px;
		}
		@at-root #{&}_title {
			padding-left: 10px;
			span:first-child {
				line-height: 20px;
				display: inline-block;
				.triangle {
					margin-left: 5px;
					margin-top: 7px;
					float: right;
					width: 0;
					height: 0;
					border-width: 5px;
					border-style: solid;
					border-color: #000000 transparent transparent transparent;
				}
				&:last-child {
					/*float: right;*/
				}
			}
			.luckyResultSecond {
				.thisBoll {
					margin-left: 0;
				}
			}
		}
		.LotteryCountdown-row--col {
			position: absolute;
		}
		.details_period {
			right: 13px;
			text-align: right;
		}
		.details_text {
			top: 40px;
			right: -6px;
			.times {
				color: #63b7ff !important;
				font-family: "PingFang SC - Medium", sans-serif;
				font-size: 3.46667vw;
			}
		}
		.countdown {
			top: 40px;
			position: absolute;
			right: 14px;
			font-size: 3.2vw;
			color: #666;
		}
	}
	.maskResultsList {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 9;
		background-color: rgba(0, 0, 0, 0.7);
	}
}
</style>
<style lang="scss">
.Dice {
	margin: 0 3px;
	background: url(../../assets/images/betting/dice.png);
	display: inline-block;
	background-size: 200% 600%;
	vertical-align: middle;
	height: 20px;
	width: 20px;
}
.Dice2 {
	background-position: 0 -100%;
}
.Dice3 {
	background-position: 0 -200%;
}
.Dice4 {
	background-position: 0 -300%;
}
.Dice5 {
	background-position: 0 -400%;
}
.Dice6 {
	background-position: 0 -500%;
}
.bigColor {
	color: #e5283b !important;
}
.smallColor {
	color: #272d94 !important;
}
.singleColor {
	color: #1bbe2c !important;
}
.doubleColor {
	color: #ff6a00 !important;
}
</style>

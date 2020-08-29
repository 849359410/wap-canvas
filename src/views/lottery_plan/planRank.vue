<template>
	<div class="rank">
		<van-row class="rank-head">
			<van-col span="12">计划排行</van-col>
			<van-col span="12" class="rank-sele">
				<p>
					<span
						v-for="i in rank_select"
						:key="i.id"
						:class="rank_se === i.id ? 'rank-sele_pitch' : ''"
						@click="rankSelect(i)"
						>{{ i.title }}</span
					>
				</p>
			</van-col>
		</van-row>
		<plan-list class="rank-list" :game-list-top="gameListTop" />
		<van-row class="rank-more">
			<van-col v-if="moreShow && gameListTop.length > 0" span="24" @click="getMore()"
				>点击加载更多<van-icon class="icon-more"></van-icon
			></van-col>
			<van-col v-else span="24">暂无更多数据</van-col>
		</van-row>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import PlanList from "./planList";
import plan from "../../assets/js/plan";
export default {
	name: "PlanRank",
	components: { PlanList },
	props: {
		gameList: {
			type: [Array],
			default() {
				return {};
			}
		},
		searchParams: {
			type: [Object],
			default() {
				return {};
			}
		},
		apiUrl: {
			type: [String],
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			moreShow: true,
			rank_select: [
				{ id: 1, title: "中奖率" },
				{ id: 0, title: "连中" }
			],
			rank_se: 1,
			gameListTop: [],
			playList: [],
			page: 1,
			clickMore: true
		};
	},
	computed: {
		...mapGetters(["operableLotteries"])
	},
	watch: {
		"searchParams.gameId": {
			handler() {
				this.updates();
			},
			deep: true
		},
		"searchParams.playId": {
			handler() {
				this.updates();
			},
			deep: true
		}
	},
	created() {
		this.getPlayListIndex();
	},
	methods: {
		rankSelect(item) {
			this.rank_se = item.id;
			this.page = 1;
			this.gameListTop = [];
			this.getPlanTop(item.id);
		},
		getMore() {
			this.page++;
			this.getPlanTop();
			this.clickMore = false;
		},
		updates() {
			this.page = 1;
			this.gameListTop = [];
			this.getPlanTop();
		},
		getPlayListIndex() {
			let that = this;
			this.$api.request("GET_PALY_LIST").then(
				success => {
					let data = success.Data.playListData;
					Object.keys(data).forEach(function(key) {
						if (data[key] && data[key][0].GameName === "KaiSan") {
							data[key].forEach(i => {
								i.GameName = "K3";
							});
						}
						that.playList.push(data[key]);
					});
					this.getPlanTop();
				},
				error => {
					this.$root.$emit("handleError", error);
				}
			);
		},
		getPlanTop() {
			this.searchParams.orderBy = this.rank_se;
			this.searchParams.page = this.page;
			// 计划排行
			if (!this.clickMore) return;
			this.$api.request(this.apiUrl, this.searchParams).then(
				success => {
					if (!success.Data || success.Data.length < 20) {
						this.moreShow = false;
					}
					let listTop = plan.getLottery(success.Data, this);
					listTop.forEach(i => {
						let id = Number(i.playid);
						if (this.operableLotteries.length === 0) {
							i = plan.getLogo(i, i.class);
						} else {
							let lottery = this.$helps.find(
								this.operableLotteries,
								k => k.fc_id === i.fc_id
							);
							if (lottery) i.logo = lottery.fc_logo;
							else i = plan.getLogo(i, i.class);
						}
						this.playList.forEach(j => {
							let paly_name = this.$helps.find(
								j,
								k => k.PlayId === id && k.GameName.toLowerCase() === i.class
							);
							if (paly_name) {
								i.play_name = paly_name.PlayName;
							}
						});
						if (i.fc_id) this.gameListTop.push(i);
					});
					this.$stores.set("gameListTop", this.gameListTop);
					this.clickMore = true;
				},
				error => {
					this.clickMore = true;
					this.$root.$emit("handleError", error);
				}
			);
		}
	}
};
</script>
<style scoped lang="scss">
@import "../../assets/css/mixins/mixin";
.rank {
	@at-root #{&}-head {
		margin-top: 10px;
		height: 40px;
		line-height: 40px;
		text-align: left;
		padding: 0 10px;
		background-color: #ffffff;
		border-bottom: 1px solid #dddddd;
		font-weight: 600;
		color: #1f1f21;
		font-size: 3.73333vw;
	}
	@at-root #{&}-sele {
		p {
			display: inline-block;
			float: right;
			height: 19px;
			margin-top: 9px;
			line-height: 19px;
			border-radius: 4px;
			border: 1px solid #ef384a;
			span {
				color: #ff5a4a;
				display: inline-block;
				width: 60px;
				text-align: center;
			}
		}
		@at-root #{&}_pitch {
			@include bgColor();
			color: #ffffff !important;
		}
	}
	@at-root #{&}-list {
		background-color: #ffffff;
	}
	@at-root #{&}-more {
		text-align: center;
		line-height: 54px;
		background-color: #ffffff;
		color: #666666;
		font-size: 12px;
	}
}
</style>

<template>
	<div>
		<div v-for="(item, index) in videoList" :key="index">
			<div v-if="item.vd_state === 1" class="liveIndex" @click="InGameMoney(item)">
				<img :src="item.img" alt="" />
				<div class="liveIndex-tour">
					<img class="liveIndex-tour_icon" :src="item.icon" alt="" />
					<span class="EG" :class="item.state ? 'colorFont' : ''">{{ item.name }}</span>
					<em>|</em>
					<span class="text">{{ item.text }}</span>
					<img
						class="liveIndex-tour_mine"
						src="../../assets/images/liveBroadcast/lotteryHall/zb_an.png"
						alt=""
					/>
				</div>
			</div>
		</div>
		<Dialog :dialog="dialog" :moneys="moneys" @change-model="changeModel"></Dialog>
	</div>
</template>

<script>
import { mapState } from "vuex";
import Dialog from "../betting/gameList/dialog";
export default {
	name: "LiveIndex",
	components: { Dialog },
	data() {
		return {
			videoList: [
				// {
				// 	name: "IG视讯",
				// 	text: "视讯彩球隆重上线",
				// 	img: require("../../assets/images/liveBroadcast/lotteryHall/banner.png"),
				// 	icon: require("../../assets/images/liveBroadcast/lotteryHall/sxzb_ig.png"),
				// 	state: true,
				// 	type: "ig"
				// },
				{
					name: "视讯",
					text: "美女主播陪你嗨",
					img: require("../../assets/images/liveBroadcast/lotteryHall/banner2.png"),
					icon: require("../../assets/images/liveBroadcast/lotteryHall/sxzb_bg.png"),
					type: "bg",
					vd_name: "BG视讯",
					vd_state: ""
				},
				{
					name: "视讯",
					text: "全新升级 美女带玩",
					img: require("../../assets/images/liveBroadcast/lotteryHall/banner3.png"),
					icon: require("../../assets/images/liveBroadcast/lotteryHall/sxzb_ag.png"),
					type: "ag",
					vd_name: "AG视讯",
					vd_state: ""
				}
			],
			moneys: {
				money: 0,
				vd_money: 0,
				vd_name: "",
				vd_type: ""
			},
			dialog: false
		};
	},
	computed: {
		...mapState({
			userMessage: state => state.user.userMessage,
			liveLottery: state => state.lottery.liveLottery
		})
	},
	created() {
		this.getGameModelList();
	},
	methods: {
		changeModel(isShow) {
			this.dialog = isShow;
		},
		getGameModelList() {
			this.$api.request("API_GET_GAME_MODULE", { vd_type: "sx" }).then(
				success => {
					this.gameList = success.Data ? success.Data : [];
					this.gameList.forEach(i => {
						this.videoList.find(v => {
							if (v.vd_type === i.type) v.vd_state = i.vd_state;
						});
					});
				},
				error => this.$root.$emit("handleError", error)
			);
		},
		InGameMoney(item) {
			if (item.type === "ig") return this.getGoRouter();
			this.moneys.vd_name = item.vd_name;
			new Promise(resolve => {
				this.$api.request("API_GET_VD_MONEY_DATA").then(
					success => {
						resolve();
						const data = success.Data;
						this.moneys.money = data.user_money.toFixed(3);
					},
					error => this.$root.$emit("handleError", error)
				);
			}).then(() => {
				this.dialog = true;
			});
		},
		getGoRouter() {
			if (this.liveLottery.tra_state !== 1) {
				return this.$root.$emit("handleError", "彩种已停用");
			}
			if (this.liveLottery.tra_maint !== 1) {
				return this.$root.$emit("handleError", "彩种已维护");
			}
			this.$router.push({ name: "liveIndex", params: { id: this.liveLottery.fc_id } });
		}
	}
};
</script>

<style scoped lang="scss">
.liveIndex {
	position: relative;
	margin: 10px;
	@at-root #{&}-tour {
		position: absolute;
		bottom: 3px;
		height: 35px;
		line-height: 35px;
		width: 100%;
		background-color: rgba(245, 245, 245, 0.8);
		.EG {
			font-size: 14px;
			margin-left: 40px;
			color: #333333;
		}
		em {
			margin: 0 8px;
			color: #908d8e;
		}
		.text {
			font-size: 12px;
			color: #666666;
		}
		.colorFont {
			color: #6897ff;
		}
		@at-root #{&}_mine {
			position: absolute;
			right: 10px;
			width: 80px;
			bottom: 6px;
		}
		@at-root #{&}_icon {
			position: absolute;
			left: 10px;
			width: 25px;
			bottom: 6px;
		}
	}
}
</style>

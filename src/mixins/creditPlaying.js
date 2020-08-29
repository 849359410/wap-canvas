import { mapState, mapActions } from "vuex";
import { PlayingCredit } from "@server/singularity";
import lhc from "../assets/js/lhc";
export default {
	data() {
		return {
			playingDialog: false,
			creditPlayingList: [],
			subName: "",
			playingTypeList: [],
			activePlayingType: 0,
			activePlayingGroup: [],
			activePlayingGroupSubset: [],
			activeTab: 0,
			subset: "",
			subsetName: ""
		};
	},
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery
		})
	},
	methods: {
		...mapActions(["setCurrentPlaying"]),
		// 加载玩法类型
		loadPlayingCreditType(type, id) {
			let self = this;
			//  为了聊天室增加快三玩法而做的判断
			let fast = self.$lotteryPub.isFastThree(
					self.currentLottery.id || Number(self.$route.params.id)
				),
				url = "API_GET_FC_COMMON_INDEX",
				num = "";
			if (fast) {
				url = "API_GET_TRA_COMMON_INDEX_K3";
				num = 1;
			}
			let fc_id = id || self.currentLottery.id || Number(self.$route.params.id),
				typeCap = type || 1;
			let dataB = [];
			self.$api
				.request(url, {
					fc_id: fc_id,
					handicap: typeCap
				})
				.then(
					success => {
						const Data = success.Data,
							type = PlayingCredit.generatePlayingMessage(
								id || self.currentLottery.id,
								Data.cdata,
								num
							);
						if (self.$lotteryPub.isMarkSixLottery(fc_id)) {
							if (typeCap === 2) {
								dataB = lhc.returnLhc(type, typeCap, self);
								self.setCreditPlay(dataB[0]);
							} else {
								self.playingTypeList = lhc.returnLhc(type, typeCap, self);
								self.setCreditPlay(type[0]);
							}
						} else {
							self.playingTypeList = type;
							self.setCreditPlay(type[0]);
						}
					},
					error => console.warn(error)
				);
		},
		setCreditPlay(item) {
			let self = this;
			self.subset = item.subset;
			if (self.subset) {
				self.subsetName = self.subset[0].name;
			}
			self.creditPlayingList = [];
			self.activePlayingGroup = item;
			self.activePlayingType = item.name;
			self.$emit("creditName", item);
			if (item.subset) {
				self.selectPlaying(item.subset[0], 0);
			} else {
				self.creditPlayingList = item.group;
			}
			self.$emit("playTypeName", item.name);
		},
		// 选择玩法
		selectPlaying(item, index) {
			let self = this;
			self.activeTab = index;
			self.subName = item.name;
			this.$stores.set("subName", item.name);
			if (Object.prototype.hasOwnProperty.call(item, "group")) {
				self.creditPlayingList = [...item.group];
			} else {
				self.creditPlayingList.push(item);
			}
		}
	}
};

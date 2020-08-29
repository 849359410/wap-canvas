import { mapState, mapActions } from "vuex";
import { PlayingOfficial } from "@server/singularity";

export default {
	data() {
		return {
			playingTypeList: [],
			playingGroupList: [],
			activePlayingType: 0,
			activePlayingGroup: [],
			bettingPattern: []
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
		async loadPlayingType() {
			let self = this;
			await this.$api
				.request("API_GET_FC_GAME_TRA", {
					fid: self.id
				})
				.then(
					success => {
						const { Data } = success,
							{
								playingType,
								bettingPattern,
								playingGroup
							} = PlayingOfficial.handleOfficialPlayingType(Data);
						let dataType = [];
						if (Number(self.id) === 6) {
							dataType = playingType.filter(
								i => i.name !== "四星" && i.name !== "五星"
							);
						} else dataType = playingType;
						self.playingTypeList = dataType;
						self.bettingPattern = bettingPattern;
						self.playingGroupList = playingGroup;
						self.setActivePlayingType(Number(self.playingTypeList[0].id));
					},
					error => this.$root.$emit("handleError", error)
				);
			this.$helps.hideLoading();
		},
		// 设置玩法类型
		setActivePlayingType(key) {
			let self = this;
			self.activePlayingType = key;
			this.activePlayingGroup = this.playingGroupList.filter(i => i.pid === key);
			this.setActivePlaying(this.activePlayingGroup[0].child[0]);
		},
		// 设置玩法
		setActivePlaying(playing) {
			const newPlaying = PlayingOfficial.generateNewPlaying(playing);
			newPlaying.bettingPattern = this.bettingPattern;
			newPlaying.type_id = this.activePlayingType;
			this.setCurrentPlaying(newPlaying);
		}
	}
};

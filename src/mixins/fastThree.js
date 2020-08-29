import { PlayingCredit } from "@server/singularity";
export default {
	data() {
		return {
			activeTypeVal: [],
			creditPlaying: [],
			playingTypeList: {}
		};
	},
	methods: {
		async loadPlayingOdds() {
			await this.$api
				.request("API_GET_TRA_COMMON_INDEX_K3", {
					fc_id: this.currentLottery.id,
					handicap: 1
				})
				.then(success => {
					const Data = success.Data,
						type = PlayingCredit.generatePlayingMessage(
							this.currentLottery.id,
							Data.cdata,
							1
						);
					let max = 0,
						min = 1000000;
					Data.cdata.forEach(j => {
						if (Number(j.odds) > max) {
							max = j.odds;
						}
						if (min > Number(j.odds)) {
							min = j.odds;
						}
					});
					type.forEach(i => {
						Data.cdata.forEach(j => {
							if (j.content_name === i.name) {
								i.odds = j.odds;
							}
						});
						if (i.name === "和值") {
							i.odds = `${min}-${max}`;
						}
					});
					this.playingTypeList = type;
					this.clickPlay(this.playingTypeList[0]);
				});
		},
		// 获取玩法注单号 渲染的号码数据
		clickPlay(val) {
			this.activeTypeVal = val;
			this.creditPlaying = val.group;
		}
	}
};

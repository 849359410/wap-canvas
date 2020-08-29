<template>
	<div class="liveVarious">
		<live-count-down
			:audio-mute="audioMute"
			:various-data="variousData"
			:bgm-effect="bgmEffect"
			@getStatistics="getStatistics"
			@timeOut="getTimeOut"
		></live-count-down>
		<live-account-balance></live-account-balance>
		<live-right-set-up></live-right-set-up>
		<live-out v-if="timeShow" :time-text="timeText"></live-out>
		<live-result v-if="resultShow && singleList" :single-list="singleList"></live-result>
		<live-ten v-if="secondShow" :time-text="secondText"></live-ten>
	</div>
</template>

<script>
import liveCountDown from "./various/liveCountDown";
import liveAccountBalance from "./various/liveAccountBalance";
import liveRightSetUp from "./various/liveRightSetUp";
import liveOut from "./dialog/liveOut";
import liveResult from "./dialog/liveResult";
import liveTen from "./dialog/liveTen";
import { mapState } from "vuex";
import { Bus } from "../../main";

export default {
	name: "LiveVarious",
	components: { liveCountDown, liveAccountBalance, liveRightSetUp, liveOut, liveResult, liveTen },
	props: {
		audioMute: {
			type: Boolean,
			default() {
				return false;
			}
		},
		variousData: {
			type: Object,
			default() {
				return {};
			}
		},
		bgmEffect: {
			type: Boolean,
			default() {
				return false;
			}
		},
		resultsData: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			timeText: "",
			timeShow: false,
			resultShow: false,
			paData: {
				stime: this.$helps.lately(1).stime,
				etime: this.$helps.lately(1).etime,
				fc_type: "fc_tra",
				page: 1,
				fc_id: "",
				state: ""
			},
			singleList: {},
			state: false,
			secondShow: false,
			secondText: "",
			stopAudio: new Audio(require("./audio/cnstopbet.mp3"))
		};
	},
	computed: {
		...mapState({
			liveLottery: state => state.lottery.liveLottery
		})
	},
	watch: {
		resultsData: {
			handler(n) {
				this.singleList = n[0];
				if (this.state) this.resultShow = true;
				setTimeout(() => {
					this.state = false;
					this.resultShow = false;
				}, 3000);
			},
			deep: true
		}
	},
	destroyed() {
		Bus.$off("getMutePlay");
	},
	mounted() {
		Bus.$on("getMutePlay", () => {
			this.stopAudio.muted = true;
			this.stopAudio.play();
		});
	},
	methods: {
		getStatistics() {
			this.$emit("getStatisticsSecond");
		},
		getTimeOut(n, active) {
			this.timeText = n;
			this.secondShow = true;
			this.secondText = n;
			if (n === 0) {
				this.secondShow = false;
				// this.timeShow = active;
				// this.timeText = "停止下注";
				this.$parent.stopShow = active;
				if (!this.bgmEffect) {
					this.stopAudio.muted = false;
					this.stopAudio.play();
				}
				this.stopAudio.addEventListener("ended", () => {
					this.$emit("stopBetting");
				});
				setTimeout(() => {
					this.$parent.stopShow = false;
				}, 2000);
				setTimeout(() => {
					this.state = true;
					// this.timeShow = false;
				}, 3000);
			}
		}
		// 这里准备写派彩逻辑
		// getDefaultData() {
		// 	this.paData.fc_id = this.liveLottery.fc_id;
		// 	this.$api.request("API_GET_FC_BET_RECORD_TRA", this.paData).then(success => {
		// 		console.log("success", success);
		// 	});
		// }
	}
};
</script>

<style scoped lang="scss">
.liveVarious {
	position: absolute;
	top: 0;
	left: 0;
	height: 33%;
	width: 100%;
}
</style>

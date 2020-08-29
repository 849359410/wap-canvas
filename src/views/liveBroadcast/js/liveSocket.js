import Socket from "@server/socket";
import { mapState } from "vuex";

export default {
	data() {
		return {
			ws: null,
			videoData: [],
			variousData: {},
			resultsData: [],
			playAudio: new Audio(require("../audio/cnyikaijuqingxiazhu.mp3"))
		};
	},
	computed: {
		...mapState({
			liveLottery: state => state.lottery.liveLottery
		})
	},
	watch: {
		ws: {
			handler() {
				let that = this;
				this.ws.onmessage(data => {
					let n = this.$helps.cloneDeep(data.data),
						result = [];
					switch (data.data_type) {
						case 9001:
							that.videoData = n;
							break;
						case 9002:
							result = this.$lotteryPub.handleLotteryResult(
								this.liveLottery,
								n.result
							);
							that.resultsData = result;
							break;
						case 9003:
							that.variousData = n;
							if (n.state === 2) {
								if (!this.bgmEffect) {
									that.playAudio.muted = false;
									that.playAudio.play();
								}
								that.playShow = true;
								setTimeout(() => {
									that.playShow = false;
								}, 2000);
							}
							break;
					}
				});
				this.ws.onclose(event => {
					console.warn("onclose", event);
				});
				this.ws.onerror(event => {
					console.warn("onerror", event);
				});
			},
			deep: true
		}
	},
	methods: {
		getSocket() {
			// 192.168.1.248:8093
			this.ws = new Socket("/v1/WsLivePush", {
				heartbeat: true
			});
			this.ws.conn();
		},
		closeWs() {
			if (this.ws !== null) {
				this.ws.close();
			}
			this.ws = null;
		}
	}
};

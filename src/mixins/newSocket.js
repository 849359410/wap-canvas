import { mapState } from "vuex";
import Socket from "@server/socket";

export default {
	data() {
		return {
			webSocket: null
		};
	},
	mounted() {
		window.onbeforeunload = () => {
			if (this.webSocket !== null) this.webSocket.close();
			this.webSocket = null;
		};
	},
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery,
			pageStatus: state => state.common.pageStatus
		})
	},
	watch: {
		pageStatus(n) {
			return n === "hidden" && this.webSocket
				? this.webSocket.close()
				: this.lotteryResultSocket();
		}
	},
	methods: {
		lotteryResultSocket() {
			this.webSocket = new Socket("/ws/join?fc_id=10", {
				heartbeat: true
			});
			this.webSocket.conn();
			this.initSocket();
		},
		initSocket() {
			let that = this;
			this.webSocket.onmessage(function(result) {
				if (typeof result === "string") {
					result = JSON.parse(result);
				}
				if (result.fc_id !== that.currentLottery.id) return;
				that.$store.dispatch("unShiftLotteryResult", {
					id: result.fc_id,
					lotteryResult: that.$lotteryPub.handleLotteryResult(
						that.currentLottery,
						result.result
					)[0]
				});
			});
			this.webSocket.onclose(function(event) {
				if (event.code !== 1000) {
					console.warn("onclose", event.reason);
				}
			});
			this.webSocket.onerror(function(event) {
				console.warn("onerror", event);
			});
		}
	}
};

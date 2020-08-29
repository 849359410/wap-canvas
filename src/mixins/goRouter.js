import { mapState } from "vuex";
export default {
	computed: {
		...mapState({
			isLogin: state => state.user.isLogin
		})
	},
	methods: {
		// 进入历史开奖
		goLotteryResult(id) {
			this.$router.push({ name: "LotteryResult", params: { id: id } });
		},
		// 进入走势图页面
		goTrend(i) {
			this.$stores.set("trendId", i.fc_id);
			this.$router.push({ name: "TrendMap", params: { id: i.fc_id } });
		},
		// 进入购彩详情页面
		goLottery(data) {
			if (this.isLogin) {
				if (this.typeIndex === 1 && (data.tra_maint !== 1 || data.tra_state !== 1)) {
					this.$root.$emit("handleError", "该彩种正在维护...");
					return;
				}
				if (this.typeIndex === 2 && (data.fc_maint !== 1 || data.fc_state !== 1)) {
					this.$root.$emit("handleError", "该彩种正在维护...");
					return;
				}
				if (this.$lotteryPub.isFastThree(data.id)) {
					this.$router.push({ name: "fastThree", params: { id: data.id } });
				} else if (data.is_second === 1) {
					this.$router.push({ name: "SecondsOpen", params: { id: data.id } });
				} else if (this.typeIndex === 1) {
					this.$router.push({ name: "Official", params: { id: data.id } });
				} else {
					this.$router.push({ name: "Credit", params: { id: data.id } });
				}
			} else {
				this.$router.replace({ name: "login" });
			}
		},
		// 进入玩法规则页面
		goRuleList(i) {
			if (this.typeIndex === 1) {
				this.$router.push({ name: "Rule", params: { pid: i.pid, typeIndex: 1 } });
			} else this.$router.push({ name: "Rule", params: { pid: i.pid, typeIndex: 2 } });
		}
	}
};

<script>
import { mapState, mapGetters } from "vuex";
export default {
	name: "LotteryList",
	props: {
		id: {
			type: Number,
			default: 0
		},
		isOfficial: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery
		}),
		...mapGetters(["operableLotteries"]),
		lottery() {
			let data = this.operableLotteries.filter(i => i.pid === this.currentLottery.pid),
				newData = [];
			data.forEach(i => {
				if (this.isOfficial) {
					if (i.tra_state === 1) newData.push(i);
				} else {
					if (i.fc_state === 1) newData.push(i);
				}
			});
			return newData;
		}
	},
	methods: {
		goLottery(data) {
			if (this.id === data.id) return;
			if (data.is_second === 1) {
				if (this.$lotteryPub.isFastThree(data.id)) {
					this.$router.push({ name: "FastThree", params: { id: data.id } });
				} else this.$router.push({ name: "SecondsOpen", params: { id: data.id } });
				this.$parent.touchPlay();
			} else if (this.$route.name === "FastThree" && data.tra_maint === 1) {
				this.$router.push({ name: "FastThree", params: { id: data.id } });
				this.$parent.touchPlay();
			} else if (this.$route.name === "Official" && data.tra_maint === 1) {
				this.$router.push({ name: "Official", params: { id: data.id } });
				this.$parent.touchPlay();
			} else if (this.$route.name === "Credit" && data.fc_maint === 1) {
				this.$router.push({ name: "Credit", params: { id: data.id } });
				this.$parent.touchPlay();
			} else if (this.$route.name === "SecondsOpen" && data.fc_maint === 1) {
				if (data.is_second !== 1)
					this.$router.push({ name: "Credit", params: { id: data.id } });
				this.$parent.touchPlay();
			} else {
				this.$root.$emit("handleError", "该彩种已维护...");
			}
		}
	},
	render() {
		return (
			<div class="playList">
				<van-row class="playList-row">
					{this.lottery.map(i => {
						return (
							<van-col
								class="playList-row--col"
								span="12"
								onClick={() => this.goLottery(i)}
							>
								{i.fc_name}
							</van-col>
						);
					})}
				</van-row>
			</div>
		);
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/head/lotteryList";
</style>

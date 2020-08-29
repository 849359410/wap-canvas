<script>
import { mapGetters, mapState } from "vuex";
import { fastThreeIds } from "../../config/dictionary";
export default {
	name: "Popular",
	data: () => ({
		More: require("../../assets/images/index/moreLottery.png")
	}),
	computed: {
		...mapGetters(["hotLotteries"]),
		...mapState({
			isLogin: state => state.user.isLogin,
			webCommonWap: state => state.common.webCommonWap
		}),
		currFcModule() {
			return this.webCommonWap.hasOwnProperty("FcModule") &&
				this.webCommonWap.FcModule instanceof Array
				? this.webCommonWap.FcModule[0]
				: "fc";
		}
	},
	methods: {
		// 跳转彩票大厅
		jumpLotteryHall(item, type) {
			if (this.isLogin) {
				if (fastThreeIds.indexOf(item.id) > -1) {
					this.$router.push({ name: "FastThree", params: { id: item.id } });
				} else if (item.is_second === 1) {
					this.$router.push({ name: "SecondsOpen", params: { id: item.id } });
				} else if (this.currFcModule === "fc_tra" && type === 1) {
					if (item.tra_maint !== 1) {
						this.$root.$emit("handleError", "该彩种官方玩法已维护");
					} else {
						this.$router.push({ name: "Official", params: { id: item.id } });
					}
				} else {
					if (item.fc_maint !== 1) {
						this.$root.$emit("handleError", "该彩种信用玩法已维护");
					} else {
						this.$router.push({ name: "Credit", params: { id: item.id } });
					}
				}
			} else {
				this.$root.$emit("handleError", "请先登录");
			}
		}
	},
	render() {
		return (
			<div>
				<div class="box-left">
					<div class="text--">
						<span>热门彩</span>
					</div>
				</div>
				<van-grid class="box--" column-num="4" square>
					{this.hotLotteries.map((item, key) => {
						if (key <= 14) {
							return (
								<van-grid-item
									class="box-frame"
									on-click={this.jumpLotteryHall.bind(this, item, item.tra_state)}
								>
									<van-image class="img" src={item.fc_logo} />
									<span>{item.fc_name}</span>
									<span class="text-color">{item.fc_text}</span>
								</van-grid-item>
							);
						}
					})}
					<van-grid-item class="box-frame" to={{ name: "BettingHall" }}>
						<van-image class="img" src={this.More} />
						<span>更多彩种</span>
						<em></em>
					</van-grid-item>
				</van-grid>
			</div>
		);
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/home/popular";
</style>
<style lang="scss">
.box-frame {
	.van-grid-item__content--center {
		padding: 0 !important;
	}
}
</style>

import { PlayingCredit } from "@server/singularity";
import { mapState } from "vuex";
import lotteryResult from "./lotteryResult";
const play_40 = ["第一球", "第二球", "第三球"];
export default {
	mixins: [lotteryResult],
	data() {
		return {
			betCode: [],
			subName: ""
		};
	},
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery
		})
	},
	watch: {
		betCode: {
			handler(n) {
				const cloneBetCode = this.$helps.cloneDeep(n);
				cloneBetCode.forEach(i => {
					if (i.play_id === 40) {
						i.sort = play_40.findIndex(v => v === i.place);
						i.place = this.subName || this.$stores.get("subName");
					}
				});
				if (cloneBetCode.length < 1) return;
				let liang = this.$stores.get("lhcLiangMian")
						? JSON.parse(this.$stores.get("lhcLiangMian"))
						: "",
					handicap = Number(this.$stores.get("lhcAB"));
				if (liang === 1) handicap = 1;
				this.$emit(
					"update-bet-code",
					PlayingCredit.handleBettingCodes(
						cloneBetCode,
						this.currentLottery.id,
						0,
						handicap
					)
				);
			},
			deep: true
		}
	},
	mounted() {
		this.$on("update-bet-code", betCode => {
			this.$emit("bett-order", betCode);
			this.order = betCode;
		});
	},
	methods: {
		// 生成注单号码按钮的样式类名
		generateBetCodeButtonClassName(playID, contentName, place) {
			return [
				this.checkIsActiveBetCode(playID, contentName, place) ? "selected" : "",
				{
					"button-long": this.$helps.czLength(contentName) > 2
				}
			];
		},
		// 选择注单号
		setRadioCode(place, balls) {
			this.$emit("child-radio-code");
			if (this.isLastSecondOpen(this.currentLottery.id)) {
				// 秒开的选号
				this.$emit("second-code");
			}
			if (this.checkIsActiveBetCode(balls.play_id, balls.content_name, place)) {
				this.removeBetCode(balls.id, balls.play_id, balls.content_name, place);
			} else {
				this.pushBetCode(place, balls);
				if (this.betCode.length < 2) return;
				const pickStatus = PlayingCredit.checkIsFullSelectionBall(
					this.betCode,
					place,
					balls.play_id,
					balls.content_name
				);
				if (pickStatus.hasOwnProperty("newBetCode") && pickStatus.newBetCode) {
					this.betCode = pickStatus.newBetCode;
				} else {
					if (pickStatus.isTip) {
						if (!pickStatus.isFull) {
							this.removeBetCode(balls.id, balls.play_id, balls.content_name, place);
						}
						this.$root.$emit("handleAlert", pickStatus.message);
					}
				}
			}
			this.order = this.betCode;
		},
		// 添加选号
		pushBetCode(place, ball) {
			this.betCode.push({
				play_id: ball.play_id,
				content_id: ball.id,
				play_details: ball.content_name,
				odds: ball.odds,
				place
			});
			this.$emit("bet-code", this.betCode);
			this.$emit("bett-mess", this.betCode);
		},
		// 校验是否需要激活注单号码
		checkIsActiveBetCode(playID, contentName, place) {
			if (this.betCode.length > 0) {
				return this.betCode.some(
					i =>
						i.play_id === playID &&
						String(i.play_details) === String(contentName) &&
						i.place === place
				);
			}
			return false;
		},
		// 删除选号
		removeBetCode(id, playID, content_name, place) {
			const cloneBetCode = this.$helps.cloneDeep(this.betCode);
			this.$helps.remove(
				cloneBetCode,
				i =>
					i.play_id === playID &&
					i.content_id === id &&
					i.play_details === content_name &&
					i.place === place
			);
			this.betCode = cloneBetCode;
			this.$emit("bett-mess", cloneBetCode);
			this.$emit("bet-code", cloneBetCode);
		}
	}
};

import { PlayingCredit } from "@server/singularity";
export default {
	data() {
		return {
			betCode: []
		};
	},
	methods: {
		// 添加判断选好样式
		getRunLong(length) {
			// 主要区别6,11,16,21(比较特殊，能被4、5都整除，所有还要处理)，等数字排列问题
			return [
				{
					"message--ul_li_code_right_five": length === 5,
					"message--ul_li_code_right_four": length === 4,
					"message--ul_li_code_right_three": length === 3
				}
			];
		},
		// 生成号码列的样式类名
		generateBetCodeItemClassName(key) {
			return [
				"message--ul_li_code_right_item",
				{
					"medium-width": this.$helps.czLength(key) === 4,
					"big-width": this.$helps.czLength(key) === 6,
					"auto-width": this.$helps.czLength(key) > 6,
					"message--ul_li_code_right_two": this.$helps.czLength(key) < 5
				}
			];
		},
		// 生成注单号码按钮的样式类名
		generateBetCodeButtonClassName(playID, contentName, place) {
			return [
				this.checkIsActiveBetCode(playID, contentName, place)
					? "selected"
					: "button--light",
				{
					"button-long": this.$helps.czLength(contentName) > 2
				}
			];
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
		// 选择注单号
		setRadioCode(place, balls) {
			if (this.checkIsActiveBetCode(balls.play_id, balls.content_name, place)) {
				this.removeBetCode(balls.id, balls.play_id, balls.content_name, place);
			} else {
				this.pushBetCode(place, balls);
				this.$parent.quickShowStyle = this.currentLottery.fc_id === 53;
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
		},
		// 添加选号
		pushBetCode(place, balls) {
			this.betCode.push({
				play_id: balls.play_id,
				content_id: balls.id,
				play_details: balls.content_name,
				odds: balls.odds,
				place
			});
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
			this.quickTime = 1;
			this.activeQuick = 1;
			this.betMoney = "";
		},
		//不同状态的类
		changeClass(state) {
			let classN = "";
			switch (state) {
				case 1:
					classN = "red";
					break;
				case 2:
					classN = "green";
					break;
				case 3:
					classN = "";
					break;
				case 6:
					classN = "";
					break;
				case 0:
					classN = "blue";
					break;
				case "大":
					classN = "bigClass";
					break;
				case "小":
					classN = "smallClass";
					break;
				case "单":
					classN = "singleClass";
					break;
				case "双":
					classN = "doubleClass";
					break;
			}
			return classN;
		}
	}
};

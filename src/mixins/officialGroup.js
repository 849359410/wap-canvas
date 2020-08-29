import { PlayingOfficial, AlgorithmBase } from "@server/singularity";
export default {
	data() {
		return {
			betCode: {},
			tipsLength: 1,
			hasPlayingPos: false,
			convenientOption: {}
		};
	},
	computed: {
		// 是否自适应宽度
		isAutoWidth() {
			return this.currentPlaying.playing === "PlayingSpecialCodeArea";
		}
	},
	methods: {
		// 初始化注单号码
		initBetCode() {
			const betCode = {},
				convenientOption = {};
			this.currentPlaying.selection.forEach(i => {
				betCode[i.key] = [];
				convenientOption[i.key] = "";
			});
			this.hasPlayingPos = Object.prototype.hasOwnProperty.call(
				this.currentPlaying,
				"optional"
			);
			if (this.hasPlayingPos) {
				betCode.optional = [...this.currentPlaying.optional.choose];
			}
			this.betCode = betCode;
			this.tipsLength = this.betCode.optional ? this.betCode.optional.length : 1;
			this.convenientOption = convenientOption;
		},
		// 校验是否需要激活便捷选项
		checkIsActiveBetOption(place, option) {
			return this.convenientOption[place] === option;
		},
		// 校验是否需要激活注单号码
		checkIsActiveBetCode(place, key) {
			const code = this.betCode[place];
			if (Array.isArray(code) && code.length > 0) {
				return code.indexOf(key) > -1;
			}
			return false;
		},
		// 选择注单号
		setRadioCode(place, code) {
			if (this.betCode[place].indexOf(code) < 0) {
				this.betCode[place].push(code);
			} else {
				if (this.betCode[place].length > this.tipsLength) {
					this.$helps.pull(this.betCode[place], code);
				} else {
					this.$root.$emit("handleError", `所选位数不能少于${this.tipsLength}`);
					return;
				}
			}
			if (this.betCode.optional && this.betCode.optional.length < this.tipsLength) {
				this.$root.$emit("handleError", `所选位数不能少于${this.tipsLength}`);
				return;
			}
			const pickStatus = PlayingOfficial.checkIsFullSelectionBall(
				this.betCode,
				place,
				this.currentPlaying.conf
			);
			if (pickStatus.isTip) {
				this.betCode = pickStatus.betCode;
				this.$root.$emit("handleError", pickStatus.message);
			}
			// 排序
			this.betCode[place] = this.betCode[place].sort();
			if (place === "optional") this.returnProgramme();
		},
		// 快速选择注单号码
		setMultipleChoiceCode(place, operatingType) {
			const selectedCodes = PlayingOfficial.handleMultipleChoice(
				this.currentPlaying,
				place,
				operatingType
			);
			if (selectedCodes.isTip) {
				this.$root.$emit("handleError", selectedCodes.message);
				return;
			}
			this.convenientOption[place] = operatingType;
			this.betCode[place] = selectedCodes.sort();
			setTimeout(() => {
				this.convenientOption[place] = "";
			}, 500);
		},
		returnProgramme() {
			this.programme = AlgorithmBase.combination(
				this.betCode.optional.length,
				this.currentPlaying.optional.rule
			);
		},
		// 生成号码列的样式类名
		generateClassName(key) {
			return [
				"message--ul_li_code_right_item",
				{
					"medium-width": !this.isAutoWidth && this.$helps.czLength(key) === 4,
					"big-width": !this.isAutoWidth && this.$helps.czLength(key) === 6,
					"auto-width": this.isAutoWidth || this.$helps.czLength(key) > 6
				}
			];
		}
	}
};

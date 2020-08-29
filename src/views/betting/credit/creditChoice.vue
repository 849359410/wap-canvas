<template>
	<van-grid class="credit_message--ul_li-codeNumber">
		<div
			v-for="(ball, index1) in item.list"
			id="dataNumber"
			:key="index1"
			class="credit_message--ul_li-codeNumber_right"
			:class="[
				generateBetCodeItemClassName(ball.content_name),
				getRunLong(item.list.length),
				{
					'': ball.content_name && $helps.czLength(ball.content_name) > 5
				}
			]"
		>
			<div
				class="credit_message--ul_li-codeNumber_right-button"
				:class="[
					ball.ball_color,
					generateBetCodeButtonClassName(ball.play_id, ball.content_name, item.name),
					checkIsActiveBetCode(ball.play_id, ball.content_name, item.name)
						? 'is-active'
						: ''
				]"
				@click="setRadioCode(item.name, ball)"
			>
				<span>{{ ball.content_name }}x</span>
				<span>{{ ball.odds }}</span>
			</div>
		</div>
	</van-grid>
</template>

<script>
import creditLucky from "../../../mixins/playing.lucky";
import playingCredits from "../../../mixins/playing.credit";
import { Bus } from "../../../main";

export default {
	name: "CreditChoice",
	mixins: [creditLucky, playingCredits],
	props: {
		creditPlayingIndex: {
			type: [Array, Object],
			default() {
				return [];
			}
		},
		item: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	mounted() {
		Bus.$on("initializeOrder", () => {
			this.initializeBetCode();
		});
	},
	methods: {
		// 初始化注单号码
		initializeBetCode() {
			this.betCode = [];
		},
		// 生成号码列的样式类名
		generateBetCodeItemClassName(key) {
			return [
				"credit_message--ul_li-codeNumber__right",
				{
					"medium-width": this.$helps.czLength(key) === 4,
					"big-width": this.$helps.czLength(key) === 6,
					"auto-width": this.$helps.czLength(key) > 6,
					"message--ul_li_code_right_two": this.$helps.czLength(key) < 5
				}
			];
		},
		// 主要区别6,11,16,21(比较特殊，能被4、5都整除，所有还要处理)，等数字排列问题
		getRunLong(length) {
			return [
				{
					"message--ul_li_code_right_five": length % 5 === 0,
					"message--ul_li_code_right_four": length === 4,
					"message--ul_li_code_right_three": length === 3,
					"message--ul_li_code_right_one": length === 1,
					"message--ul_li_code_right_twelve": length === 12
				}
			];
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/creditChoice";
</style>

<template>
	<div class="credit_message">
		<div
			v-for="(ball, index) in luckyPlayingList.list"
			:key="index"
			class="credit_list"
			:class="[
				generateBetCodeButtonClassName(
					ball.play_id,
					ball.content_name,
					luckyPlayingList.name
				),
				checkIsActiveBetCode(ball.play_id, ball.content_name, luckyPlayingList.name)
					? 'is-active'
					: ''
			]"
			@click="setRadioCode(luckyPlayingList.name, ball)"
		>
			<div class="credit_item">
				<span :class="ball.ball_color">{{ ball.content_name }}</span>
			</div>
			<div class="credit_bottom">
				<span>{{ ball.odds }}</span>
			</div>
		</div>
	</div>
</template>
<script>
import { mapState } from "vuex";
import { Bus } from "../../../main";
import playingCredit from "../../../mixins/playing.credit";
import creditLucky from "../../../mixins/playing.lucky";

export default {
	name: "CreditTotal",
	mixins: [playingCredit, creditLucky],
	props: {
		luckyPlayingList: {
			type: [Array, Object],
			default() {
				return [];
			}
		}
	},
	computed: {
		...mapState({
			currentPlaying: state => state.lottery.currentPlaying
		})
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
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/creditTotal";
</style>

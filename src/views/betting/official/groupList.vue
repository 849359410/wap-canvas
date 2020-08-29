<template>
	<div class="message">
		<van-row class="message--ul" :class="isHappyLottery ? 'isHappyLottery' : ''">
			<van-col v-if="hasPlayingPos" class="message--ul_li" span="24">
				<van-row class="message--ul_li_code">
					<van-col span="24" class="message--ul_li_code_fast">
						<p
							v-for="(pos, index) in currentPlaying.optional.ball"
							:key="index"
							:class="!checkIsActiveBetCode('optional', index) ? 'button--light' : ''"
							@click="setRadioCode('optional', index)"
						>
							<span>
								<i>✓</i>
							</span>
							{{ pos }}
						</p>
					</van-col>
				</van-row>
				<van-row class="message--ul_li_tips">
					<van-col>
						<b>提示：</b>
						您选择了
						<span>{{ betCode.optional.length }}</span>
						个位置,系统自动根据位置组合成
						<span>{{ programme || 1 }}</span>
						个方案
					</van-col>
				</van-row>
			</van-col>
			<van-col
				v-for="(i, index) in currentPlaying.selection"
				:key="index"
				class="message--ul_li"
				span="24"
			>
				<van-row class="message--ul_li_title">
					<van-col class="message--ul_li_title_place" span="24">
						<span>{{ i.place }}</span>
					</van-col>
					<van-col
						v-if="operationQuickOption.length > 0"
						class="message--ul_li_title_fast"
					>
						<van-button
							v-for="(option, index1) in operationQuickOption"
							:key="index1"
							class="button"
							:class="{
								'button--light': !checkIsActiveBetOption(i.key, option.type)
							}"
							@click="setMultipleChoiceCode(i.key, option.type)"
						>
							{{ option.name }}
						</van-button>
					</van-col>
				</van-row>
				<van-row class="message--ul_li_number">
					<van-col span="24">
						<div
							v-for="(ball, index1) in i.balls"
							:key="index1"
							:class="[generateClassName(ball)]"
						>
							<van-button
								class="button"
								:class="[
									generateClassName(ball, i.key, ball),
									checkIsActiveBetCode(i.key, ball) ? 'is-active' : 'is-outlined'
								]"
								@click="setRadioCode(i.key, ball)"
							>
								{{ ball }}
							</van-button>
						</div>
					</van-col>
				</van-row>
			</van-col>
		</van-row>
	</div>
</template>

<script>
import { mapState } from "vuex";
import officialGroup from "../../../mixins/officialGroup";
import lotteryResult from "../../../mixins/lotteryResult";

export default {
	name: "GroupList",
	mixins: [officialGroup, lotteryResult],
	data() {
		return {
			quickOperation: [
				{ name: "全", type: "a" },
				{ name: "大", type: "l" },
				{ name: "小", type: "s" },
				{ name: "单", type: "o" },
				{ name: "双", type: "e" },
				{ name: "清", type: "c" }
			]
		};
	},
	computed: {
		...mapState({
			currentPlaying: state => state.lottery.currentPlaying
		}),
		operationQuickOption() {
			const option = [],
				source = this.currentPlaying.play_fast || "";
			if (source.length > 0) {
				this.quickOperation.forEach(i => {
					if (source.indexOf(i.type) > -1) option.push(i);
				});
			}
			return option;
		}
	},
	watch: {
		currentPlaying: {
			handler(n) {
				if (Object.prototype.hasOwnProperty.call(n, "id")) this.initBetCode();
			},
			deep: true
		},
		betCode: {
			handler(n) {
				this.$parent.getBetCode(n);
			},
			deep: true
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/official/groupList";
</style>

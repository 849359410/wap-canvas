<template>
	<van-row class="message--ul">
		<van-col
			v-for="(item, index) in creditPlaying"
			:key="index"
			class="message--ul_li"
			span="24"
		>
			<van-row class="message--ul_li_code message--ul_li_credit">
				<van-col class="message--ul_li_credit_left" span="24">
					<span>{{ item.name }}</span>
				</van-col>
				<van-col class="message--ul_li_code_popup" span="24">
					<span v-html="loadPlayRule(item.name)"></span>
				</van-col>
				<van-col class="message--ul_li_code_right" span="24">
					<div
						v-for="(balls, index1) in item.list"
						:key="index1"
						style="position: relative"
						:class="[
							generateBetCodeItemClassName(balls.content_name),
							getRunLong(item.list.length),
							item.name === '二同号单选' ? 'right_688' : '',
							balls.content_name.length > 4 ? 'right_five' : '',
							getRunLong(balls.content_name),
							{
								oddsThree:
									balls.content_name && $helps.czLength(balls.content_name) > 5
							}
						]"
					>
						<div
							class="choose_button"
							:class="[
								generateBetCodeButtonClassName(
									balls.play_id,
									balls.content_name,
									item.name
								),
								checkIsActiveBetCode(balls.play_id, balls.content_name, item.name)
									? 'is-active'
									: 'is-outlined'
							]"
							@click="setRadioCode(item.name, balls)"
						>
							<span :class="changeClass(balls.content_name)">{{
								balls.content_name
							}}</span>
							<span>{{ balls.odds }}</span>
						</div>
					</div>
				</van-col>
			</van-row>
		</van-col>
	</van-row>
</template>

<script>
import ApiGetRule from "../../../mixins/apiGetRule";
import fastGroup from "../../../mixins/fastGroup";
import { mapState } from "vuex";
export default {
	name: "GroupList",
	mixins: [ApiGetRule, fastGroup],
	props: {
		playId: {
			type: Number,
			default() {
				return 0;
			}
		},
		creditPlaying: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery
		})
	},
	watch: {
		betCode: {
			handler(n) {
				this.$emit("upDataBetCode", n);
			},
			deep: true
		}
	},
	created() {
		this.getOfficialRule(this.playId);
	},
	methods: {
		// 获取玩法规则
		loadPlayRule(name) {
			name = name === "总和" ? "和值" : name;
			return this.handleRule(name, this.currentLottery);
		},
		// 初始化注单号码.
		initializeBetCode() {
			this.betCode = [];
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/fastThree/groupList";
</style>

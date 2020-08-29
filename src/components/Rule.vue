<template>
	<div class="rule">
		<div class="title">
			<van-tabs class="tabs" type="card" @click="clickRuleTitle">
				<van-tab
					v-for="(i, index) in ruleTitle"
					:key="index"
					:title="i.name"
					:name="i"
				></van-tab>
			</van-tabs>
		</div>
		<!-- 信用玩法规则 -->
		<div v-if="lotteryType === 1" class="details">
			<p class="det_title">
				<span>!</span>
				<span>{{ ruleTitleActive.name }}</span>
			</p>
			<p v-if="ruleTitleActive.id === 1" v-html="ruleData.left"></p>
			<div v-else class="ruleContent">
				<div v-for="j in ruleData.right" :key="j.id">
					<div
						v-for="i in j.plays"
						v-show="i.groupName === type || j.playGroup === type"
						:key="i.id"
						:data-group="i.groupName"
					>
						<p class="ruleTitle">{{ i.groupName }}</p>
						<p v-for="k in i.group" :key="k.id" class="rulePlay">
							<span class="rulePlayTitle">{{ k.play }}:</span>
							<span
								v-html="
									k.explain
										? k.explain
										: currentLottery.info_rule === 1
										? k.Pass_kill_rule
										: k.No_kill_rule
								"
							></span>
						</p>
					</div>
				</div>
			</div>
		</div>
		<!-- 官方玩法规则 -->
		<van-row v-if="lotteryType === 2" class="details">
			<van-col v-if="ruleTitleActive.id === 1" span="24">
				<p class="det_title">
					<span>!</span>
					<span>{{ ruleTitleActive.name }}</span>
				</p>
				<p v-html="ruleData.left"></p>
			</van-col>
			<van-col v-else span="24">
				<p class="det_title">
					<span>!</span>
					<span>{{ ruleTitleActive.name }}</span>
				</p>
				<p v-html="ruleData.right.info_text"></p>
				<p v-if="ruleData.right.info_case" class="det_title">
					<span>!</span>
					<span>范例</span>
				</p>
				<p v-html="ruleData.right.info_case"></p>
			</van-col>
		</van-row>
	</div>
</template>

<script>
import ApiGetRule from "../mixins/apiGetRule";
import { mapState } from "vuex";
export default {
	name: "Rule",
	mixins: [ApiGetRule],
	props: {
		playId: {
			type: Number,
			default() {
				return 0;
			}
		},
		type: {
			type: [Number, String],
			default() {
				return 0;
			}
		}
	},
	data() {
		return {
			ruleTitle: [
				{ id: 1, name: "彩种介绍" },
				{ id: 2, name: "玩法说明" }
			],
			ruleTitleActive: {},
			ruleData: {
				left: "",
				right: []
			},
			lotteryType: 1
		};
	},
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery,
			currentPlaying: state => state.lottery.currentPlaying
		})
	},
	watch: {
		currentPlaying: {
			handler(n) {
				this.ruleData.right = {};
				this.ruleData.right.info_text = n.info_text;
				this.ruleData.right.info_case = n.info_case;
			},
			deep: true
		}
	},
	created() {
		this.lotteryType = this.$route.meta.requireRule;
		this.getLotteryTime(this.playId);
		this.ruleTitleActive = this.ruleTitle[0];
		if (this.lotteryType === 1) this.getCreditRule(Number(this.playId));
		else {
			this.ruleData.right.info_text = this.currentPlaying.info_text;
			this.ruleData.right.info_case = this.currentPlaying.info_case;
		}
	},
	methods: {
		clickRuleTitle(item) {
			this.ruleTitleActive = item;
		}
	}
};
</script>

<style scoped lang="scss">
@import "../assets/css/views/components/rule";
</style>
<style lang="scss">
.rule {
	.title {
		.van-tabs__wrap {
			border-radius: 50px;
			margin: 0;
			.van-tab {
				padding: 0;
				border: none;
				color: white;
				font-size: 14px;
			}
		}
		.van-tabs__nav {
			border-radius: 50px;
			border-color: white;
			background: #3c4a5c;
			margin: 0;
		}
		.van-tab--active {
			background: white;
			border-radius: 50px;
			border-color: #3c4a5c;
			color: #3c4a5c !important;
		}
	}
}
</style>

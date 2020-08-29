<template>
	<div class="orderPopup">
		<p class="popup_title">注单设定</p>
		<div class="popup_main">
			<van-row class="popup_main--odds">
				<van-col span="12">赔率:{{ actualOdds }}</van-col>
				<van-col span="12">返利:0%</van-col>
			</van-row>
			<van-row class="popup_main--bets">
				<van-col class="popup_main--bets_patt" span="24">
					<span>单注金额：</span>
					<label>
						<input
							v-model="orderAloneMoney"
							type="tel"
							@input="inpAmount"
							@blur="MoneyRule"
						/>
					</label>
					<span
						v-for="i in patternOptions"
						:key="i.id"
						class="popup_main--bets_patt--money popup_main--bets_multiple--add"
						:class="{ active: order.bet_model === i.id }"
						@click="getChangeBetPattern(i.id)"
					>
						{{ i.name }}
					</span>
				</van-col>
				<van-col class="popup_main--bets_tab" span="24">
					<span
						v-for="i in [10, 50, 100, 200, 500]"
						:key="i.id"
						:class="{ active: orderAloneMoney === i }"
						@click="orderAloneMoney = i"
					>
						{{ i }}
					</span>
				</van-col>
				<van-col class="popup_main--bets_multiple" span="24">
					<span>下注倍数：</span>
					<label>
						<input
							v-model="order.bet_num"
							@blur="getEnterMultipleBlur($event.target.value)"
							@input="getEnterMultiple"
						/>
					</label>
					<span>倍</span>
					<span
						class="popup_main--bets_multiple--add"
						style="line-height: 18px;"
						@click="getBuildNum(1)"
						>-</span
					>
					<span class="popup_main--bets_multiple--add" @click="getBuildNum(2)">+</span>
				</van-col>
				<van-col span="24"> 下注注数：{{ order.note_num }}注 </van-col>
				<van-col span="24">
					下注金额：{{
						(
							(orderAloneMoney * order.bet_num * order.note_num) /
							order.bet_model
						).toFixed(3)
					}}元
				</van-col>
				<van-col class="popup_main--bets_winning" span="24">
					单注最高可中：
					<span>
						{{
							(
								(actualOdds * orderAloneMoney * order.bet_num) /
								order.bet_model
							).toFixed(3)
						}} </span
					>元
				</van-col>
				<van-col class="popup_main--bets_bottom" span="24">
					<van-button @click="getClose()">取消</van-button>
					<van-button @click="getBetsOrderOff()">确定</van-button>
				</van-col>
			</van-row>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
export default {
	name: "BetPopup",
	props: {
		actualOdds: {
			type: [Number, String],
			default() {
				return 0;
			}
		},
		order: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			orderAloneMoney: 1
		};
	},
	computed: {
		...mapState({
			currentPlaying: state => state.lottery.currentPlaying
		}),
		patternOptions() {
			const options = [],
				patternOption = this.$helps.getDictionary("PATTERN_OPTION");
			if (Object.prototype.hasOwnProperty.call(this.currentPlaying, "bettingPattern")) {
				patternOption.forEach(i => {
					if (this.currentPlaying.bettingPattern.indexOf(i.id) > -1) options.push(i);
				});
			}
			return options;
		}
	},
	methods: {
		inpAmount() {
			let reg = /(^\d$)|(^\d+[0-9]{1,2}$)/;
			this.orderAloneMoney = this.orderAloneMoney.replace(/[^\d\\.]/g, "");
			if (!reg.test(this.orderAloneMoney)) {
				this.orderAloneMoney = "";
			} else if (Number(this.orderAloneMoney) === 0) {
				this.orderAloneMoney = 1;
			} else if (Number(this.orderAloneMoney) > 100000) {
				this.orderAloneMoney = 100000;
			}
		},
		MoneyRule() {
			if (this.orderAloneMoney) {
				this.orderAloneMoney = parseFloat(this.orderAloneMoney).toString();
			}
		},
		getChangeBetPattern(id) {
			this.$emit("changeBetPattern", id);
		},
		getEnterMultipleBlur(value) {
			if (isNaN(value) || !value) this.$emit("enterMultipleBlur");
		},
		getEnterMultiple() {
			this.$emit("enterMultiple");
		},
		getBuildNum(i) {
			this.$emit("buildNum", i);
		},
		getClose() {
			this.$emit("getClose");
		},
		getBetsOrderOff() {
			this.$emit("betsOrderOff", this.orderAloneMoney);
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/official/betPopup";
</style>

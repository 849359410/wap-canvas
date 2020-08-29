<template>
	<div class="allPopup">
		<div class="popup_head">
			<p>注单信息</p>
			<van-icon class="popup_head--icon" name="cross" @click="getCross"></van-icon>
		</div>
		<div class="popup_main">
			<van-row class="popup_main_head">
				<van-col span="8">类型</van-col>
				<van-col span="8">内容</van-col>
				<van-col span="8">金额</van-col>
			</van-row>
			<div class="popup_main-body">
				<van-row v-for="(ball1, index) in betOrder" :key="index" class="popup_main_body">
					<van-col>{{ findPlaceByBetCode(ball1.play_id) }}</van-col>
					<van-col style="text-align: inherit">
						<p>{{ ball1.play_details }}</p>
					</van-col>
					<van-col>{{ bMoney }}</van-col>
				</van-row>
			</div>
			<div v-if="betMoneyShow" class="popup_main_head popup_main_input">
				<div>单注金额</div>
				<div></div>
				<div>
					<input v-model="bMoney" type="tel" maxlength="7" @input="inBetMoney" />
				</div>
			</div>
		</div>
		<van-row class="popup_foot">
			<van-col v-if="isLastSecondOpen(currentLottery.fc_id)" span="24">
				共{{ betOrder.length }}注，共{{
					(Number(bMoney) * betOrder.length * quickTime) | formatPenny
				}}元,连续开奖{{ quickTime || 0 }}次
			</van-col>
			<van-col v-else span="24">
				共{{ betOrder.length }}注，共{{ (bMoney * betOrder.length) | formatPenny }}元
			</van-col>
		</van-row>
		<div class="popup_button">
			<van-button type="danger" class="popup_button_go" @click="betsOrderOffK"
				>确认投注</van-button
			>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import LotteryResult from "../../../mixins/lotteryResult";
import input from "../../../assets/js/input";
export default {
	name: "BetPopup",
	mixins: [LotteryResult],
	props: {
		betOrder: {
			type: Array,
			default() {
				return [];
			}
		},
		betTmpCode: {
			type: Array,
			default() {
				return [];
			}
		},
		betMoneyShow: {
			type: Boolean,
			default() {
				return false;
			}
		},
		bMoney: {
			type: [Number, String],
			default() {
				return 0;
			}
		},
		quickTime: {
			type: [Number, String],
			default() {
				return "";
			}
		}
	},
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery
		})
	},
	methods: {
		findPlaceByBetCode(playId) {
			let place = "";
			if (playId === 40) return this.$stores.get("subName");
			for (let i = 0; i < this.betTmpCode.length; i++) {
				if (Number(this.betTmpCode[i].play_id) === Number(playId)) {
					place = this.betTmpCode[i].place;
					break;
				}
			}
			return place;
		},
		betsOrderOffK() {
			this.$emit("bets-order-off", this.bMoney);
		},
		getCross() {
			this.$emit("getCross");
		},
		inBetMoney() {
			let reg = /(^\d$)|(^\d+[0-9]{1,2}$)/;
			this.bMoney = this.bMoney.replace(/[^\d\\.]/g, "");
			this.bMoney = input.defocusInput(this.bMoney);
			if (!reg.test(this.bMoney)) {
				this.bMoney = "";
			} else if (Number(this.bMoney) === 0) {
				this.bMoney = 1;
			} else if (Number(this.bMoney) > 1000000) {
				this.bMoney = 1000000;
			}
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/betPopup";
</style>

<template>
	<div class="dew">
		<div class="dew_tab">
			<div class="dew_tab--left">
				<p class="dew_tab--left--title">露珠图</p>
			</div>
			<van-tabs
				line-height="2"
				title-active-color="#EF384A"
				class="dew_tab--right"
				@click="lotTab"
			>
				<van-tab
					v-for="(i, index) in tabList"
					:key="index"
					:title="i.name"
					:name="index"
				></van-tab>
			</van-tabs>
		</div>
		<div class="dew_main">
			<div class="dew_main--left">
				<p
					v-for="i in dewLeft"
					:key="i.id"
					:class="{ active: dewLeftIndex === i.id }"
					@click="switchTab(i)"
				>
					<span v-for="j in i.text" :key="j.id">
						<em :class="j.color">{{ j.name }}</em>
						<em>{{ j.num }}</em>
					</span>
				</p>
			</div>
			<dew-main
				id="rightDew"
				ref="rightDew"
				class="dew_main--right"
				:arr-dew="arrDew"
			></dew-main>
		</div>
	</div>
</template>
<script>
import { mapGetters } from "vuex";
import { ChartDew } from "@server/singularity";
import LotteryResult from "../../../mixins/lotteryResult";
import dewMain from "./dewMain";
import model from "../../../mixins/model";

export default {
	name: "DewdropChart",
	components: { dewMain },
	mixins: [LotteryResult, ChartDew, model],
	props: {
		playId: {
			type: [Number, String],
			request: true,
			default: null
		}
	},
	data() {
		return {
			tabList: [],
			newLottery: "",
			guanyaLottery: "",
			arrDew: "",
			dewLeft: [
				{
					id: 0,
					text: [
						{ name: "大", num: 0, color: "red" },
						{ name: "小", num: 0 }
					]
				},
				{
					id: 1,
					text: [
						{ name: "单", num: 0, color: "red" },
						{ name: "双", num: 0 }
					]
				}
			],
			dewLeftIndex: 0,
			tabIndex: 0,
			add: 0,
			maxNum: 9
		};
	},
	computed: {
		...mapGetters(["singleLotteryResult"]),
		// 单个彩种开奖结果
		lotteryResult() {
			return this.singleLotteryResult(this.currentLottery.id) || [];
		}
	},
	watch: {
		currentLottery: {
			handler() {
				this.getLotteryResule();
				this.tabList = ChartDew.ballSort(this.currentLottery);
			},
			deep: true
		},
		lotteryResult: {
			handler() {
				this.getLotteryResule();
			},
			deep: true
		}
	},
	created() {
		this.getLotteryResule();
		this.tabList = ChartDew.ballSort(this.currentLottery);
	},
	methods: {
		returnList(item, i) {
			if (!item) return;
			return `${item[i].period} - ${item[i].num}`;
		},
		getLotteryResule() {
			this.newLottery = ChartDew.chartLotteryResult(this.lotteryResult, this.currentLottery);
			if (this.newLottery.length === 0) return;
			// 默认大小 第一球
			if (this.tabIndex === 10) {
				this.guanyaLottery = ChartDew.guanYaHe(
					this.newLottery,
					this.currentLottery.info_rule
				);
				this.returnArr(Number(this.dewLeftIndex), 0, this.guanyaLottery);
			} else {
				this.returnArr(Number(this.dewLeftIndex), Number(this.tabIndex), this.newLottery);
			}
		},
		// 切换第几球
		lotTab(index) {
			this.add = 0;
			this.tabIndex = index;
			if (index === 10) {
				this.guanyaLottery = ChartDew.guanYaHe(
					this.newLottery,
					this.currentLottery.info_rule
				);
				this.returnArr(Number(this.dewLeftIndex), 0, this.guanyaLottery);
			} else {
				this.returnArr(Number(this.dewLeftIndex), Number(this.tabIndex), this.newLottery);
			}
		},
		// 切换大小 单双
		switchTab(item) {
			this.add = 0;
			this.dewLeftIndex = item.id;
			if (this.tabIndex === 10) {
				this.returnArr(Number(this.dewLeftIndex), 0, this.guanyaLottery);
			} else {
				this.returnArr(Number(this.dewLeftIndex), Number(this.tabIndex), this.newLottery);
			}
		},
		// 返回露珠图数据
		returnArr(type, index, lottery) {
			if (!this.newLottery) return;
			this.arrDew = ChartDew.arrLottery(lottery, this.dewLeft, type, index, this.maxNum);
			let div = document.getElementById("rightDew");
			if (div) {
				this.$nextTick(() => {
					if (this.add === 0) div.scrollLeft = div.scrollWidth;
				});
			}
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/dewChart";
</style>

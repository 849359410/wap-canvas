<template>
	<div>
		<van-sticky :offset-top="headHeight">
			<van-row class="lotteryTab">
				<van-col>
					<Switcher @get-lottery-list="lottery"></Switcher>
				</van-col>

				<van-col span="16">
					<van-tabs
						v-model="activeName"
						background="#f4f4f4"
						title-active-color="#000"
						@click="changeSlide"
					>
						<van-tab
							v-for="tab in topLevelLottery"
							:key="tab.id"
							:name="tab.id"
							:title="tab.name"
							title-style="flex-basis: auto; padding: 0 15px;font-size: 14px;"
						></van-tab>
					</van-tabs>
				</van-col>
			</van-row>
		</van-sticky>
		<lottery-list :lottery="displayLotteries" :result="result" :type-index="typeIndex">
		</lottery-list>
	</div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Switcher from "../../components/switcher";
import lotteryList from "./lotteryList";
export default {
	name: "TopTab",
	components: { Switcher, lotteryList },
	data() {
		return {
			activeName: 0,
			topLevelLottery: [],
			displayLotteries: [],
			typeIndex: null,
			result: {},
			lotteryId: [],
			headHeight: 0
		};
	},
	computed: {
		...mapState({
			lotteryList: state => state.lottery.lotteryList,
			currFcModule: state => state.common.webCommonWap.FcModule
		}),
		...mapGetters(["topLottery", "operableLotteries", "topOfficialLottery"])
	},
	created() {
		this.returnTopLottery(this.topOfficialLottery);
	},
	mounted() {
		let head = document.getElementsByClassName("head");
		let gameTab = document.getElementsByClassName("gameTab");
		this.headHeight = head[0].clientHeight + gameTab[0].clientHeight;
	},
	methods: {
		lottery(index) {
			this.typeIndex = index;
			this.returnTopLottery(index === 1 ? this.topOfficialLottery : this.topLottery);
			let position = this.topLevelLottery.length > 0 ? this.topLevelLottery[0].id : {};
			this.changeSlide(position);
			// this.activeName = 0;
		},
		// 切换导航栏
		changeSlide(pid) {
			this.activeName = pid;
			this.returnLottery(pid);
		},
		returnLottery(n) {
			this.lotteryId = [];
			if (this.typeIndex === 1) {
				this.displayLotteries = this.operableLotteries.filter(
					i => i.pid === parseInt(n, 10) && i.tra_state === 1
				);
			} else {
				this.displayLotteries = this.operableLotteries.filter(
					i => i.pid === parseInt(n, 10) && i.fc_state === 1
				);
			}
			this.displayLotteries.forEach(i => {
				this.lotteryId.push(i.fc_id);
			});
			this.getPidResult();
		},
		getPidResult() {
			let type = this.typeIndex,
				api = "API_GET_FC_PERIODS_TRA";
			if (type === 1) api = "API_GET_PERIODS_TRA";
			this.$api
				.request(api, {
					fc_ids: this.lotteryId.join(",")
				})
				.then(
					success => {
						this.result = success.Data;
					},
					error => this.$root.$emit("handleError", error)
				);
		},
		// 获取顶部导航栏
		returnTopLottery(data) {
			data.forEach(i => {
				let list = "";
				if (this.typeIndex === 1) {
					list = this.operableLotteries.filter(j => j.pid === i.pid && j.tra_state === 1);
				} else {
					list = this.operableLotteries.filter(j => j.pid === i.pid && j.fc_state === 1);
				}
				i.list = list;
			});
			const topLotteries = [];
			if (data.length > 0) {
				data.forEach(i => {
					if (this.typeIndex === 2) {
						if (i.pid !== 1 && i.pid !== 4 && i.list.length > 0) {
							topLotteries.push({ id: i.pid, name: i.name });
						}
					} else {
						if (i.pid !== 1 && i.list.length > 0) {
							topLotteries.push({ id: i.pid, name: i.name });
						}
					}
				});
			}
			this.topLevelLottery = topLotteries;
		}
	}
};
</script>

<style lang="scss">
.lotteryTab {
	display: flex;
	align-items: center;
	padding-left: 10px;
	background: #f4f4f4;
	.van-tabs__nav--line {
		padding-bottom: 8px !important;
	}
}
</style>

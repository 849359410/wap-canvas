<template>
	<van-row class="rebateOdds">
		<wan-row>
			<van-nav-bar left-arrow class="head" :fixed="true" @click-left="$router.go(-1)">
				<template #title>
					<div class="center">
						<p class="takeName" @click="lottery">
							<span>{{ typeIndex === 1 ? "官方" : "信用" }}</span>
							<span>玩法</span>
						</p>
						<p>赔率表</p>
					</div>
				</template>
				<template #right>
					<span class="right">{{ currentLottery.fc_name }}</span>
				</template>
			</van-nav-bar>
		</wan-row>
		<van-row>
			<div class="rebateOdds_tabs">
				<div class="rebateOdds_tabs--list">
					<div
						v-for="item in topLevelLottery"
						:key="item.id"
						class="rebateOdds_tabs--list_type"
						:class="{ active: item.id === lotteryType }"
					>
						<span @click="changeSlide(item.id)">{{ item.name }}</span>
					</div>
				</div>
			</div>
			<div v-show="lotteryListShow" class="rebateOdds_lotterList">
				<ul>
					<li
						v-for="item in displayLotteries"
						v-show="displayLotteries.length > 0"
						:key="item.id"
						:class="{ active: item.id === idType }"
						@click="changeCaiz(item.id)"
					>
						<span>{{ item.fc_name }}</span>
					</li>
				</ul>
			</div>
			<div
				v-show="lotteryListShow"
				class="blackBg"
				@click="lotteryListShow = !lotteryListShow"
			></div>
			<div class="rebateOdds_Des">
				<div class="rebateOdds_Des-content">
					<div v-show="oddsData.length > 0" class="rebateOdds_Des-content__first">
						<van-row class="rebateOdds_Des-content__first--title">
							<van-col span="24">
								<span v-for="(v, index) in nameTabs" :key="index">{{
									v.name
								}}</span>
							</van-col>
							<van-col v-for="(title, index) in rebateTitle" :key="index" span="24">
								{{ title }}
							</van-col>
						</van-row>
					</div>
					<div class="rebateOdds_Des-content--table">
						<van-row v-for="(i, index) in oddsData" :key="index">
							<van-col v-for="(item, k) in i" :key="k" span="24">
								<span v-show="k === 0">{{ item }}</span>
								<span v-show="k !== 0">赔率{{ item }}</span>
							</van-col>
						</van-row>
					</div>
				</div>
			</div>
		</van-row>
	</van-row>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
	data() {
		return {
			displayLotteries: [],
			lotteryType: 0,
			idType: 10,
			typeIndex: 1,
			topLevelLottery: "",
			lotteryListShow: false,
			cheackParams: {
				fc_type: "",
				fc_id: 10,
				handicap: 1
			},
			oddsData: [],
			rebateTitle: []
		};
	},
	computed: {
		...mapGetters(["notice", "topLottery", "operableLotteries", "topOfficialLottery"]),
		...mapState({
			currentLottery: state => state.lottery.currentLottery,
			lotteryName: state => state.lottery.currentLottery.fc_name,
			fcModule: state => state.common.webCommonWap.FcModule
		})
	},
	watch: {
		lotteryType(n) {
			this.returnLottery(n);
		},
		lotteryName(n) {
			this.fc_name = n;
		}
	},
	created() {
		this.$helps.showLoading();
		if (this.fcModule && this.fcModule[0] === "fc_tra") {
			this.typeIndex = 1;
		} else this.typeIndex = 2;
		this.gobackName = this.$route.meta.parent;
		this.returnLottery(this.topOfficialLottery ? this.topOfficialLottery[1].pid : "");
		this.returnTopLottery(this.typeIndex === 1 ? this.topOfficialLottery : this.topLottery);
		this.nameTabs = [
			{ id: 1, name: "玩法" },
			{ id: 2, name: "返点" }
		];
	},
	methods: {
		...mapActions(["setCurrentLottery"]),
		changeTwoDecimal(x) {
			let f_x = parseFloat(x);
			f_x = Math.round(f_x * 1000) / 1000;
			return f_x;
		},
		returnLottery(n) {
			if (this.typeIndex === 1) {
				this.displayLotteries = this.operableLotteries.filter(
					i => i.pid === parseInt(n, 10) && i.tra_state === 1
				);
			} else {
				this.displayLotteries = this.operableLotteries.filter(
					i => i.pid === parseInt(n, 10) && i.fc_state === 1
				);
			}
		},
		goBack() {
			this.$router.go(-1);
		},
		//切换官方信用
		lottery() {
			this.typeIndex = this.typeIndex === 1 ? 2 : 1;
			this.returnTopLottery(this.typeIndex === 1 ? this.topOfficialLottery : this.topLottery);
		},
		// 切换导航栏
		changeSlide(id) {
			this.lotteryType = id;
			this.lotteryListShow = true;
		},
		//切换彩种
		changeCaiz(id) {
			this.idType = id;
			this.cheackParams.fc_id = this.idType;
			this.getRebateOdds();
			this.lotteryListShow = false;
			this.setCurrentLottery(Number(this.cheackParams.fc_id));
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
			let fc_id = "";
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
				data.forEach(j => {
					if (topLotteries[0].id === j.pid) {
						fc_id = j.list[0].fc_id;
					}
				});
			}
			this.setCurrentLottery(Number(fc_id));
			this.idType = fc_id;
			this.cheackParams.fc_id = fc_id;
			this.getRebateOdds();
			this.lotteryType = topLotteries[0].id;
			this.topLevelLottery = topLotteries;
		},
		getRebateOdds() {
			this.rebateTitle = [];
			this.cheackParams.fc_type = this.typeIndex === 1 ? "fc_tra" : "fc";
			this.$api.request("API_GET_USER_FC_PLAY_REBATE", this.cheackParams).then(
				success => {
					const data = success.Data.RebateData,
						codeRebate = success.Data.CodeRebate;
					this.oddsData = [];
					let a = [],
						arr = [];
					if (data === null) {
						this.$root.$emit("handleError", "请选择其他彩种");
					}
					data.forEach(i => {
						this.rebateTitle.push(i.name);
					});
					for (let n = 0; n <= codeRebate * 10; n++) {
						data.forEach(i => {
							let arge = this.$helps.floatMultiplication([n, Number(i.td_odds)]);
							let num = this.$helps.floatSubtraction(Number(i.odds), arge);
							a.push(this.changeTwoDecimal(num));
						});
						let rebate = this.$helps.floatSubtraction(codeRebate, n * 0.1);
						if (rebate >= 0) {
							let num = this.$helps.floatMultiplication([n, 0.1]);
							arr.push(this.$helps.floatSubtraction(codeRebate, num));
						}
					}
					this.oddsData = this.$helps.chunk(a, data.length);
					this.oddsData.forEach((v, k) => {
						v.unshift(arr[k].toFixed(1));
					});
					this.$helps.hideLoading();
				},
				error => {
					this.$root.$emit("handleError", error);
					this.$helps.hideLoading();
				}
			);
		}
	}
};
</script>
<style scoped lang="scss">
@import "../../../assets/css/views/proxy/rebateOdds";
</style>
<style scoped lang="scss">
.swiper-container {
	width: 96%;
	font: 14px/35px hiragino sans gb, microsoft yahei, simsun;
	border-bottom: 1px solid #f8f8f8;
	overflow: hidden;
	.swiper-slide {
		display: block;
		width: 60px;
		line-height: 40px;
		padding: 0 5px;
		letter-spacing: 2px;
		text-align: center;
		font-size: 13px;
		span {
			-webkit-transition: all 0.3s ease;
			transition: all 0.3s ease;
			display: block;
			color: #666;
		}
	}
}
.right {
	width: auto;
	text-align: right;
	margin: 0 0 0 auto;
}
.page__content {
	top: 60px !important;
}
</style>

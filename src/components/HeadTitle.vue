<template>
	<van-row>
		<van-nav-bar
			class="head"
			:class="[
				singShow === 'SingIn' ? 'pHead' : singShow === 'TodayProfit' ? 'TodayHead' : '',
				{ yuBao: $route.name === 'YuBao' },
				{ yuBao: $route.name === 'YuBaoService' },
				{ killerHead: $route.name === 'killerPlanDetails' }
			]"
			:fixed="true"
			:border="false"
			:left-arrow="indexShow"
			@click-left="goBack"
		>
			<template #title>
				<van-row class="center">
					<p v-if="tabShow" class="tabTitle">
						<span
							v-for="i in tabTitle"
							:key="i.id"
							:class="tabHeadIndex === i.id ? 'active' : ''"
							@click="goToChild(i)"
						>
							{{ i.name }}
						</span>
					</p>
					<p v-else>{{ titleName }}</p>
				</van-row>
			</template>
			<template #right>
				<van-row>
					<van-col
						v-if="singShow === 'SingIn'"
						span="24"
						class="right"
						align="center"
						@click="$router.push({ name: 'SingRule' })"
					>
						<p class="singRight">签到规则</p>
					</van-col>
					<van-col
						v-if="singShow === 'YuBaoEnding'"
						span="24"
						class="right"
						align="center"
						@click="$router.push({ name: 'YuBao' })"
					>
						<p class="singRight">完成</p>
					</van-col>
					<van-overlay :show="dropDown" z-index="10" @click="dropDown = false" />
					<van-col v-if="$route.meta.rightShow" span="24" class="navRight">
						<!--<van-icon name="ellipsis" @click="dropDown = !dropDown" />-->
						<span
							v-if="singShow === 'killerPlanDetails'"
							class="planList"
							@click="clickPlan()"
							>计划列表</span
						>
						<span class="circle" @click="dropDown = !dropDown">
							<i></i>
							<i></i>
							<i></i>
						</span>
						<div v-show="dropDown">
							<van-row is-link class="right_menu">
								<van-cell
									v-for="(item, index) in rightMenu[indexMenu].menu"
									v-show="item.path !== $route.name"
									:key="index"
									size="15"
									:icon="item.icon"
									@click="goto(item)"
								>
									{{ item.name }}
								</van-cell>
							</van-row>
							<div
								class="popover__arrow popover--top__arrow"
								:style="singShow === 'killerPlanDetails' ? 'margin-left:68px;' : ''"
							></div>
						</div>
					</van-col>
					<van-icon
						v-if="singShow === 'LongQuery'"
						name="question-o"
						size="25px"
						@click="$router.push({ name: 'LongRule' })"
					></van-icon>
				</van-row>
			</template>
		</van-nav-bar>
	</van-row>
</template>

<script>
export default {
	name: "HeadTitle",
	data() {
		return {
			titleName: "",
			rightShow: false,
			gobackName: "",
			popoverDirection: "up",
			tabShow: false,
			dropDown: false,
			indexShow: false,
			tabHeadIndex: 0,
			tabTitle: [
				{ id: 0, name: "个人资料", path: "PersonalData" },
				{ id: 1, name: "等级头衔", path: "Grade" }
			],
			singShow: "",
			indexMenu: 0,
			rightMenu: [
				{
					menu: [
						{
							id: 0,
							name: "首页",
							path: "Index",
							icon: require("../assets/images/userCenter/home/public/home.png")
						},
						{
							id: 1,
							name: "会员中心",
							path: "MemberCenter",
							icon: require("../assets/images/userCenter/home/public/user.png")
						},
						{
							id: 3,
							name: "投注报表",
							path: "Report",
							icon: require("../assets/images/userCenter/home/public/statistics.png")
						},
						{
							id: 4,
							name: "充值提款",
							path: "Recharge",
							icon: require("../assets/images/userCenter/home/public/wallet.png")
						},
						{
							id: 2,
							name: "投注记录",
							path: "Mrecord",
							icon: require("../assets/images/userCenter/home/public/betting_record.png")
						}
					]
				},
				{
					menu: [
						{
							id: 0,
							name: "首页",
							path: "Index",
							icon: require("../assets/images/userCenter/home/public/home.png")
						},
						{
							id: 1,
							name: "规则",
							path: "YuBaoService",
							icon: require("../assets/images/yuBao/ruleInfo.png")
						},
						{
							id: 2,
							name: "收支明细",
							path: "BudgetDetails",
							icon: require("../assets/images/yuBao/details.png")
						}
					]
				}
			]
		};
	},
	watch: {
		$route: {
			handler() {
				this.titleName = this.$route.meta.name;
				let listIndex = ["MemberCenter", "pageLiveIndex", "BettingHall"];
				this.indexShow = listIndex.indexOf(this.$route.name) <= -1;
				this.rightShow = this.$route.meta.rightShow;
				this.gobackName = this.$route.meta.parent;
				this.singShow = this.$route.name;
				this.dropDown = false;
				this.returnIndex();
				this.getCase(this.singShow);
			}
		}
	},
	methods: {
		goto(item) {
			this.$router.push({ name: item.path });
		},
		getCase(name) {
			switch (name) {
				case "YuBao":
					this.indexMenu = 1;
					break;
				default:
					this.indexMenu = 0;
					break;
			}
		},
		goBack() {
			if (!this.indexShow) return;
			if (window.history.length <= 1) {
				this.$router.replace({ name: "Index" });
			} else this.$router.go(-1);
		},
		// 判断头部是否有切换
		returnIndex() {
			this.tabShow = false;
			// 判断等级嘉奖是否开启了
			if (this.$stores.get("levelShow") !== 1) return;
			let data = this.$route.name;
			this.tabTitle.forEach(i => {
				if (i.path === data) {
					this.tabHeadIndex = i.id;
					this.tabShow = true;
				}
			});
		},
		// 切换头部跳转导航
		goToChild(i) {
			this.tabHeadIndex = i.id;
			this.$router.replace({ name: i.path });
		},
		clickPlan() {
			let gameid = this.$stores.get("gameId");
			this.$router.replace({ name: "PlanLottery", query: { id: gameid } });
		}
	}
};
</script>

<style scoped lang="scss">
@import "../assets/css/views/headTitle";
.pHead {
	background: url("../assets/images/userCenter/singin/newEdition/head.png") no-repeat;
}
.yuBao {
	background: url("../assets/images/yuBao/headBj.png") no-repeat;
	background-size: 100% 100%;
}
.killerHead {
	background: linear-gradient(to right, #ff5a4a 50%, #ff2419);
}
.TodayHead {
	background: -webkit-linear-gradient(left, #ef384a, #f56b5b); /* Safari 5.1 - 6.0 */
	background: -o-linear-gradient(right, #ef384a, #f56b5b); /* Opera 11.1 - 12.0 */
	background: -moz-linear-gradient(right, #ef384a, #f56b5b); /* Firefox 3.6 - 15 */
	background: linear-gradient(to right, #ef384a, #f56b5b); /* 标准的语法（必须放在最后） */
}
</style>
<style lang="scss">
.page__background {
	background: #f4f4f4 !important;
}
.head--top_aide {
	.popover--top__content {
		width: 150px !important;
	}
}
</style>

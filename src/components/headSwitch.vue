<template>
	<van-nav-bar class="head" :fixed="true" left-arrow @click-left="$router.go(-1)">
		<template #title>
			<van-dropdown-menu v-if="$route.meta.downMenu" class="lottery--" :duration="miao">
				<van-dropdown-item ref="menu" :title="defLottery[lotteryIndex].name">
					<van-row class="lottery-box">
						<van-col
							v-for="(v, index) in defLottery"
							:key="index"
							span="7"
							class="lottery-box_text"
							:class="lotteryIndex === index ? 'status' : ''"
							@click="menuSelection(index, v)"
							>{{ v.name }}</van-col
						>
					</van-row>
				</van-dropdown-item>
			</van-dropdown-menu>
			<van-tabs
				v-else
				v-model="lotteryIndex"
				class="head_center"
				type="card"
				title-active-color="#ef384a"
				background="#ef384a"
				title-inactive-color="#fff"
				color="#fff"
				@click="PlayTypes"
			>
				<van-tab
					v-for="(v, i) in defLottery"
					:key="i"
					:title="v.name"
					:name="v.sort"
				></van-tab>
			</van-tabs>
		</template>
		<template #right>
			<van-row>
				<van-overlay :show="dropDown" z-index="10" @click="dropIck()" />
				<van-col span="24" class="navRight">
					<span class="circle" @click="dropIck()">
						<i></i>
						<i></i>
						<i></i>
					</span>
					<div v-show="dropDown">
						<van-row is-link class="right_menu">
							<van-cell
								v-for="(item, index) in rightMenu"
								v-show="item.path !== $route.name"
								:key="index"
								size="15"
								:to="item.path"
								:icon="item.icon"
							>
								{{ item.name }}
							</van-cell>
						</van-row>
						<div class="popover__arrow popover--top__arrow"></div>
					</div>
				</van-col>
			</van-row>
		</template>
	</van-nav-bar>
</template>

<script>
export default {
	name: "HeadSwitch",
	props: {
		defLottery: {
			type: [Array],
			default() {
				return [];
			}
		},
		lotteryIndex: {
			type: Number,
			default() {
				return "";
			}
		}
	},
	data() {
		return {
			rightMenu: [
				{
					id: 0,
					name: "首页",
					path: "/",
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
			],
			dropDown: false,
			miao: "0.2"
		};
	},
	methods: {
		PlayTypes(name) {
			this.$emit("changePlayTypes", name);
		},
		dropIck() {
			this.miao = "0";
			this.dropDown = !this.dropDown;
			if (!this.dropDown) this.miao = "0.2";
		},
		menuSelection(index, value) {
			this.$emit("changePlayTypes", index, value);
			// this.lotteryIndex = value.sort;
			this.$refs.menu.toggle();
		}
	}
};
</script>

<style scoped lang="scss">
.head {
	z-index: 2;
	.head_center {
		width: 210px;
	}
	.lottery-- {
		height: 44px;
		margin-right: 10px;
		.lottery-box {
			margin: 6px 0 16px 13px;
			.lottery-box_text {
				color: #333;
				font-size: 12px;
				border: 1px solid #a2a2a2;
				line-height: 28px;
				border-radius: 5px;
				margin: 10px 10px 0 3px;
			}
			.status {
				color: #fff;
				background: #f0374a;
				border: 1px solid #f0374a;
			}
		}
	}
}
.van-overlay {
	background-color: rgba(0, 0, 0, 0.3);
}
.navRight {
	height: 40px;
	.right_menu {
		width: 150px !important;
		z-index: 10;
		top: 53px;
		right: 10px;
		position: fixed;
		border-radius: 10px;
		div {
			height: 40px;
			font-size: 14px;
			color: #333333;
			.van-cell__left-icon {
				margin-right: 0;
				img {
					height: 16px;
					width: 16px;
					margin-right: 10px;
				}
			}
		}
		div:first-child {
			border-radius: 5px 5px 0 0;
		}
		div:last-child {
			border-radius: 0 0 5px 5px;
		}
		div:after {
			left: 10px;
			right: 10px;
			border-bottom: 1px solid #cfcfcf;
		}
	}
	.popover__arrow {
		position: absolute;
		top: 55px;
		right: 30px;
		border-radius: 0;
	}
	.circle {
		display: inline-flex;
		padding-right: 5px;
		float: initial;
		margin-top: -5px;
		i {
			width: 4px;
			display: block;
			height: 4px;
			border-radius: 50%;
			background: #fff;
			margin: 0 2px;
		}
	}
}
</style>
<style lang="scss">
.lottery-- {
	.van-dropdown-menu__bar {
		height: 44px;
		background: #ef384a;
		.van-dropdown-menu__title {
			color: #fff;
		}
	}
}
.van-dropdown-item__content {
	border-radius: 0 0 6px 6px;
}
</style>

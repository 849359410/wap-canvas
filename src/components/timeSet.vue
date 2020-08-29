<template>
	<van-row>
		<van-popup
			v-model="timeShow"
			position="right"
			:style="{ width: '60%', height: '100%' }"
			@click-overlay="onClickLeft"
		>
			<van-row>
				<van-icon class="left_btn" name="arrow-left" @click="clickLeft" />
				<van-nav-bar title="自定义" left-text=""></van-nav-bar>
				<van-cell
					title="开始时间"
					is-link
					:value="time.stime"
					@click="getShow(1)"
				></van-cell>
				<van-cell
					title="结束时间"
					is-link
					:value="time.etime"
					@click="getShow(2)"
				></van-cell>
				<van-cell
					v-if="colorPink"
					title="彩种类型"
					is-link
					:value="time.name"
					@click="getShow(3)"
				></van-cell>
			</van-row>
			<van-row v-if="typesOf" class="typeList">
				<p class="type_name">类型：</p>
				<van-row class="type_list">
					<van-col
						v-for="i in typeList"
						:key="i.id"
						span="12"
						:class="typeNum === i.id ? 'sel_type' : ''"
						@click="clickType(i)"
					>
						<p>
							{{ i.text }}
							<img
								v-if="typeNum === i.id"
								src="../assets/images/yuBao/right_sel.png"
							/>
						</p>
					</van-col>
				</van-row>
			</van-row>
			<van-button class="clickBut" :block="true" small @click="onClickRight">确定</van-button>
		</van-popup>
		<!--彩种选择器-->
		<van-popup v-model="lotteryShow" position="bottom">
			<van-picker
				title="彩种类型"
				show-toolbar
				:columns="columns[0]"
				:default-index="0"
				@confirm="onConfirm"
				@cancel="lotteryShow = false"
			></van-picker>
		</van-popup>
		<!--时间选择器-->
		<select-item
			:child-show="childShow"
			:time-data="timeData"
			:time-state="timeState"
			:time="time"
			@stateTime="stateTime"
			@berTime="berTime"
		></select-item>
	</van-row>
</template>

<script>
import { mapGetters } from "vuex";
import selectItem from "./tiem";
import { mapState } from "vuex";

export default {
	name: "TimeSet",
	components: { selectItem },
	props: {
		timeShow: {
			type: Boolean,
			default() {
				return false;
			}
		},
		// 1.官方,2.信用,3.全部
		lotteryIndex: {
			type: Number,
			default() {
				return 1;
			}
		},
		timeData: {
			type: Object,
			default() {
				return {
					minDate: new Date(1900, 0, 1),
					maxDate: new Date(2100, 10, 1)
				};
			}
		},
		// 是否显示彩种选择
		colorPink: {
			type: Boolean,
			default() {
				return false;
			}
		},
		// 彩种类型是否显示全部
		showAll: {
			type: Boolean,
			default() {
				return false;
			}
		},
		//是否显示类型
		typesOf: {
			type: Boolean,
			default() {
				return false;
			}
		},
		typeNum: {
			type: [String, Number],
			default() {
				return 1;
			}
		},
		paData: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			childShow: false,
			timeState: 1,
			time: {
				stime: "",
				etime: "",
				name: "全部",
				ctype: 1
			},
			columns: [],
			lotteryShow: false,
			typeList: [
				{ id: 1, text: "余额转入" },
				{ id: 2, text: "收益" },
				{ id: 3, text: "转出到平台" }
				// { id: 5, text: "转出冻结" }
				// { id: 6, text: "转入冻结" }
			],
			myData: new Date()
		};
	},
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery
		}),
		...mapGetters(["creditLotteries", "officialLotteries", "operableLotteries"]),
		lotteryList() {
			if (this.lotteryIndex === 1) return this.creditLotteries;
			else if (this.lotteryIndex === 2) return this.officialLotteries;
			else return this.operableLotteries;
		}
	},
	watch: {
		childShow: {
			handler() {
				if (this.$route.name === "LotteryResult") this.getData();
				else if (this.$route.name === "agentReport") this.zdyTime();
			}
		},
		paData: {
			handler(n) {
				this.time.stime = n.stime;
				this.time.etime = n.etime;
			},
			deep: true
		}
	},
	created() {
		if (!this.showAll) this.time.name = this.currentLottery.fc_name;
	},
	methods: {
		// 自定义时间左上角关闭按钮
		onClickLeft() {
			this.$emit("clickLeft");
		},
		// 自定义时间确定按钮
		onClickRight() {
			this.time.ctype = this.typeNum;
			this.$emit("filterTime", this.time);
		},
		stateTime(state) {
			this.childShow = state;
		},
		getData() {
			this.myData = new Date();
			let arr1 = "",
				data = this.myData.getDate(),
				targetday_milliseconds = "";
			arr1 = this.time.stime.split("-");
			if (this.timeState === 2) {
				targetday_milliseconds =
					this.myData.getTime() + 1000 * 60 * 60 * 24 * -(data - Number(arr1[2]));
			} else targetday_milliseconds = this.myData.getTime() + 1000 * 60 * 60 * 24 * -6;
			this.myData.setTime(targetday_milliseconds);
			this.timeData.minDate = this.myData;
		},
		// 底部时间弹框确定选择的开始时间和结束时间
		berTime(time) {
			if (this.timeState === 1) this.time.stime = time;
			else this.time.etime = time;
		},
		clickType(item) {
			this.time.ctype = item.id;
			if (this.typeNum === item.id) {
				this.typeNum = "";
			} else {
				this.typeNum = item.id;
			}
		},
		getShow(i) {
			if (i !== 3) {
				this.timeState = i;
				this.childShow = true;
			} else {
				let data = [],
					surData = [],
					listData = [];
				if (this.showAll) surData.push("全部");
				this.lotteryList.forEach(v => {
					surData.push(v.fc_name);
					if (v.fc_name.indexOf("秒开") === -1) {
						if (this.lotteryIndex === 3 && v.fc_maint === 1) {
							listData.push(v.fc_name);
						}
					}
				});
				data[0] = this.lotteryIndex === 3 ? listData : surData;
				this.columns = data;
				this.lotteryShow = true;
			}
		},
		onConfirm(value) {
			this.time.name = value;
			this.lotteryShow = false;
		},
		// 代理报表限定开始时间最小为60天
		zdyTime() {
			this.timeData.minDate = new Date(this.$helps.getEastDate(60, "yyyy-MM-dd"));
		},
		clickLeft() {
			this.$emit("clickLeft");
		}
	}
};
</script>

<style scoped lang="scss">
@import "../assets/css/mixins/mixin";
.left_btn {
	position: absolute;
	top: 16px;
	left: 12px;
	font-size: 17px;
	z-index: 5;
	color: #969799;
}
.typeList {
	margin-top: 30px;
	.type_name {
		font-size: 16px;
		font-weight: 600;
		line-height: 50px;
		padding-left: 10px;
	}
	.type_list {
		height: 30px;
		font-size: 12px;
		color: #999999;
		.sel_type {
			p {
				border-color: #ef384a;
				@include fontColor();
			}
		}
		p {
			line-height: 30px;
			text-align: center;
			margin: 8px;
			border: 1px solid #999999;
			position: relative;
			border-radius: 2px;
			img {
				display: inline-block;
				position: absolute;
				width: 14px;
				height: 14px;
				bottom: -1px;
				right: -1px;
			}
		}
	}
}
.clickBut {
	font-size: 14px;
	width: 90%;
	margin: 10px;
	color: #ffffff;
	border-radius: 4px;
	background: linear-gradient(90deg, #fda80b, #f14c3e);
}
</style>

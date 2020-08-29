<template>
	<div class="liveBar">
		<div class="liveBar-left">
			<div v-for="(item, index) in dataList" :key="index">
				<p>第{{ item.period }}期</p>
				<p>
					<em v-for="(i, val) in item.number" :key="val">{{ i }}</em>
				</p>
			</div>
		</div>
		<div class="liveBar-right">
			<img src="../../assets/images/liveBroadcast/other/zst.png" alt="" @click="getTrend" />
		</div>
	</div>
</template>

<script>
import lotteryResult from "./js/liveLotteryResult";
export default {
	name: "LiveBar",
	mixins: [lotteryResult],
	props: {
		resultsData: {
			type: [Array, Object],
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			dataList: []
		};
	},
	watch: {
		resultsData: {
			handler(n) {
				this.dataList = n.slice(0, 2);
			},
			deep: true
		}
	},
	created() {
		this.loadHistoryLotteryResult();
	},
	methods: {
		getTrend() {
			this.$router.push({ name: "liveTrend", params: { id: this.liveLottery.fc_id } });
		}
	}
};
</script>

<style scoped lang="scss">
.liveBar {
	height: 12%;
	width: 100%;
	display: flex;
	@at-root #{&}-left {
		width: 80%;
		height: 100%;
		display: flex;
		div {
			width: 50%;
			height: 100%;
			text-align: center;
			position: relative;
			p {
				font-size: 12px;
				color: white;
				em {
					font-style: normal;
					display: inline-block;
					width: 20px;
					height: 20px;
					margin: 0 5px;
					line-height: 21px;
					border-radius: 50%;
					color: #7c5c23;
					background-color: #f4c990;
				}
				&:first-child {
					margin-top: 12%;
					margin-bottom: 5%;
				}
			}
			&:after {
				position: absolute;
				content: "";
				height: 24px;
				border-right: 1px solid #464879;
				width: 1px;
				right: 0;
				top: 50%;
				margin-top: -12px;
			}
		}
	}
	@at-root #{&}-right {
		width: 20%;
		height: 100%;
		img {
			width: 70%;
			height: 50%;
			margin: 25% 15%;
		}
	}
}
</style>

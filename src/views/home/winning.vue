<template>
	<van-row>
		<van-row class="indexPage--tabs">
			<div
				class="indexPage--tabs_tabsList"
				:class="winningList.length > 0 ? 'topBorder' : ''"
			>
				<span> 中奖信息 </span>
			</div>
		</van-row>
		<van-row class="indexPage--winning">
			<van-row class="indexPage--winning_rows" :style="{ top: -winningHeight + 'px' }">
				<div
					v-for="item in winningList"
					v-show="winningList.length > 0 && item.result >= 1"
					:key="item.id"
				>
					<div class="indexPage--winning_rows_clearfix">
						<div class="indexPage--winning_rows_clearfix_left">
							<img
								:src="
									`https://static.cloudywoo.com/img/userIcon/${item.pic_id}.jpg`
								"
								alt=""
							/>
							<p class="lottery_name">
								<span>恭喜：{{ item.username }}</span>
							</p>
						</div>
						<p class="rightMoney">
							喜中
							<a v-if="siteCode === 'bbj-a'"
								>&yen;{{ item.result.toFixed(0) * 10 }}</a
							>
							<a v-else>&yen;{{ item.result.toFixed(0) }}</a>
							元!
						</p>
					</div>
				</div>
				<van-row v-show="winningList.length === 0" class="noneData"
					><p>暂无数据</p></van-row
				>
			</van-row>
		</van-row>
		<van-row style="margin-bottom: 20px">
			<van-divider :style="{ color: '#999', borderColor: '#cfcfcf', padding: '0 60px' }"
				>我是有底线的</van-divider
			>
		</van-row>
	</van-row>
</template>
<script>
export default {
	name: "Winning",
	data: () => ({
		winningList: [],
		winningHeight: 0,
		timerID: null
	}),
	created() {
		this.handleLoadRequiredData();
		this.timerID = setInterval(() => {
			let element = document.getElementsByClassName("indexPage--winning_rows");
			if (element.length > 0) element[0].appendChild(element[0].firstChild);
		}, 3000);
	},
	destroyed() {
		if (this.timerID) {
			clearInterval(this.timerID);
		}
	},
	methods: {
		// 中奖排行榜
		handleLoadRequiredData() {
			this.$api.request("API_GET_GAIN_RANK_COM").then(
				success => {
					let sdata = success.Data.wdata;
					if (sdata !== null && sdata !== "") {
						this.winningList = sdata;
					}
				},
				error => this.$root.$emit("handleError", error)
			);
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/home/winning";
</style>

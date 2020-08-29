<template>
	<van-list
		v-model="loading"
		finished-text="暂无更多数据"
		:finished="finished"
		class="result_main"
		@load="onLoad"
	>
		<van-cell v-for="(i, index) in resultData" :key="index">
			<div class="result_main_left">
				<van-image :src="currentLottery.fc_logo" />
			</div>
			<van-row class="result_main_right">
				<van-col class="result_main--title" span="24">
					<p>{{ currentLottery.fc_name }}</p>
					<p>
						<span class="result_main--title_period"
							>{{ i.period | capitalizeSub }}期</span
						>
						<span class="result_main--title_time">{{ i.openTime }}</span>
					</p>
				</van-col>
				<list :list="i"></list>
			</van-row>
		</van-cell>
	</van-list>
</template>

<script>
import { mapState, mapActions } from "vuex";
import lotteryResult from "../../mixins/lotteryResult";
import list from "./list";
export default {
	name: "ResultList",
	filters: {
		capitalizeSub(value) {
			if (!value) return "";
			return value.substring(value.length - 6);
		}
	},
	components: { list },
	mixins: [lotteryResult],
	props: {
		playId: {
			type: Number,
			default() {
				return 0;
			}
		}
	},
	data() {
		return {
			loading: true,
			finished: false,
			searchParams: {
				fc_id: "",
				limit: 20,
				page: 0,
				stime: "",
				etime: ""
			},
			resultData: []
		};
	},
	computed: {
		...mapState({
			currentLottery: state => state.lottery.currentLottery
		})
	},
	created() {
		this.searchParams.fc_id = this.playId;
		this.$helps.showLoading();
	},
	methods: {
		...mapActions(["setCurrentLottery"]),
		onLoad() {
			setTimeout(() => {
				this.searchParams.page++;
				this.getResult();
			}, 100);
		},
		init(time, id) {
			this.$helps.showLoading();
			this.searchParams.etime = time.etime;
			this.searchParams.stime = time.stime;
			if (id) this.searchParams.fc_id = id;
			this.searchParams.page = 1;
			this.resultData = [];
			this.loading = true;
			this.finished = false;
			this.getResult();
		},
		getResult() {
			this.setCurrentLottery(this.searchParams.fc_id);
			this.$api.request("API_GET_FC_AUTO_TO_NUM", this.searchParams).then(
				success => {
					const { Data } = success.Data;
					this.resultData.push(
						...this.$lotteryPub.handleLotteryResult(this.currentLottery, Data)
					);
					this.loading = false;
					if (Data.length < 20) {
						this.loading = true;
						this.finished = true;
					}
					this.$helps.hideLoading();
				},
				error => this.$root.$emit("handleError", error)
			);
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/result/resultList";
</style>

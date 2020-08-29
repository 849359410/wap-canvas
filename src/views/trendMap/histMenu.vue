<template>
	<div class="lottery">
		<van-row v-for="i in lotteryList" :key="i.pid" class="lottery_pid">
			<van-col span="24" class="lottery_pid-name">{{ i.name }}</van-col>
			<van-col span="24" class="lottery_pid_list">
				<van-col
					v-for="j in i.list"
					v-show="!isLastSecondOpen(j.fc_id) && j.fc_maint === 1"
					:key="j.fc_id"
					class="lottery_pid_list-name"
					@click="goTrendList(j)"
				>
					<p :class="j.fc_id === Number(id) ? 'active' : ''">
						{{ j.fc_name }}
					</p>
				</van-col>
			</van-col>
		</van-row>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import { LOTTERY_TYPE_MAP } from "@server/singularity";
import LotteryResult from "../../mixins/lotteryResult";
export default {
	name: "HistMenu",
	mixins: [LotteryResult],
	props: {
		id: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			lotteryList: {}
		};
	},
	computed: {
		...mapGetters(["operableLotteries"])
	},
	created() {
		this.returnList();
	},
	methods: {
		returnList() {
			let pid = LOTTERY_TYPE_MAP;
			pid.forEach(i => {
				i.list = [];
			});
			this.operableLotteries.forEach(i => {
				pid.forEach(j => {
					if (j.pid === 1) {
						if (i.fc_ico !== "") {
							j.list.push(i);
						}
					}
					if (i.pid === j.pid) {
						j.list.push(i);
					}
				});
			});
			this.lotteryList = pid;
		},
		goTrendList(j) {
			this.$stores.set("trendId", j.fc_id);
			this.$router.push({ name: "TrendMap", params: { id: j.fc_id } });
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/trendMap/histMenu";
</style>

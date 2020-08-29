<template>
	<div class="historical">
		<tabs
			:list="headTab"
			:tab-height="2"
			:rendered="true"
			@getReturnTabs="getReturnTabs"
		></tabs>
		<time-set
			:time-show="timeShow"
			:time-data="timeData"
			:pa-data="paData"
			:color-pink="true"
			:lottery-index="3"
			:show-all="false"
			@clickLeft="clickLeft"
			@filterTime="filterTime"
		></time-set>
		<ResultList ref="list" :play-id="Number(id)"></ResultList>
	</div>
</template>

<script>
import tabs from "../../components/Tabs";
import timeSet from "../../components/timeSet";
import ResultList from "./resultList";
import { mapGetters, mapActions } from "vuex";
export default {
	name: "Index",
	components: { tabs, timeSet, ResultList },
	props: {
		id: {
			type: [Number, String],
			default: ""
		}
	},
	data() {
		return {
			timeData: {
				minDate: null,
				maxDate: new Date()
			},
			paData: {
				etime: "",
				stime: ""
			},
			timeShow: false,
			headTab: [
				{ id: 0, name: "最新", key: 0 },
				{ id: 1, name: "今日", key: 0 },
				{ id: 2, name: "昨日", key: 1 },
				{ id: 3, name: "自定义" }
			]
		};
	},
	computed: {
		...mapGetters(["operableLotteries"])
	},
	watch: {
		id(n) {
			this.setCurrentLottery(Number(n));
		}
	},
	created() {
		this.setCurrentLottery(Number(this.id));
		this.getDay(-6);
	},
	methods: {
		...mapActions(["setCurrentLottery"]),
		getDay(day) {
			let today = new Date();
			let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
			today.setTime(targetday_milliseconds);
			this.timeData.minDate = today;
		},
		getReturnTabs(item) {
			this.timeShow = item.id === 3;
			if (item.id !== 3) {
				this.paData.etime = this.$helps.getDate(item.key, "yyyy-MM-dd");
				this.paData.stime = this.$helps.getDate(item.key, "yyyy-MM-dd");
				this.$refs.list.init(this.paData);
			}
		},
		clickLeft() {
			this.timeShow = false;
		},
		filterTime(time) {
			let id = this.operableLotteries.filter(i => time.name === i.fc_name)[0].id;
			this.timeShow = false;
			this.$refs.list.init(time, id);
		}
	}
};
</script>

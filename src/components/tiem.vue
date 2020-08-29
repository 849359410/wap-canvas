<template>
	<van-row>
		<van-popup v-model="childShow" position="bottom" @click-overlay="cancel">
			<van-datetime-picker
				v-model="currentDate"
				type="date"
				:min-date="timeData.minDate"
				:max-date="timeData.maxDate"
				@confirm="stateTime"
				@cancel="cancel"
				@change="endTimeChange"
			></van-datetime-picker>
		</van-popup>
	</van-row>
</template>

<script>
export default {
	name: "Tiem",
	props: {
		childShow: {
			type: Boolean,
			default() {
				return false;
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
		timeState: {
			type: Number,
			default() {
				return 1;
			}
		},
		time: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data: () => ({
		currentDate: new Date(),
		dataTime: "",
		onData: "",
		state: false
	}),
	watch: {
		timeState: {
			handler() {
				this.dataTime = "";
			}
		},
		currentDate: {
			handler() {
				if (this.currentDate.getDate() !== Number(this.onData[2]) && this.state) {
					this.currentDate = new Date(this.onData[0], this.onData[1] - 1, this.onData[2]);
				}
			}
		},
		childShow: {
			handler() {
				this.getOnData(this.timeState);
				this.state = true;
				setTimeout(() => {
					this.state = false;
				}, 1000);
			}
		}
	},
	created() {
		this.getOnData(this.timeState);
	},
	methods: {
		getOnData(n) {
			if (n === 1) {
				this.onData = this.time.stime.split("-");
				this.currentDate = new Date(this.onData[0], this.onData[1] - 1, this.onData[2]);
			} else {
				this.onData = this.time.etime.split("-");
				this.currentDate = new Date(this.onData[0], this.onData[1] - 1, this.onData[2]);
			}
		},
		endTimeChange() {
			this.state = false;
			this.dataTime = this.timeFormat(this.currentDate);
		},
		timeFormat(time) {
			// 时间格式化 2019-09-08
			let year = time.getFullYear();
			let month = time.getMonth() + 1;
			if (month < 10) month = `0${month}`;
			let day = time.getDate();
			if (day < 10) day = `0${day}`;
			return year + "-" + month + "-" + day;
		},
		stateTime() {
			this.state = false;
			if (this.dataTime) {
				this.$emit("berTime", this.dataTime);
			}
			this.$emit("stateTime", false);
		},
		cancel() {
			this.state = false;
			this.$emit("stateTime", false);
		}
	}
};
</script>

<style scoped></style>

<template>
	<van-popup v-model="timePopupLayer" position="bottom" :close-on-click-overlay="false">
		<van-datetime-picker
			ref="picker"
			type="date"
			:min-date="minDate"
			:max-date="maxDate"
			:formatter="formatter"
			@cancel="Close_button"
			@confirm="Finish_button"
		/>
	</van-popup>
</template>

<script>
export default {
	name: "DatetimePicker",
	props: {
		timePopupLayer: {
			type: Boolean,
			default() {
				return false;
			}
		}
	},
	data() {
		return {
			minDate: new Date(1900, 0, 1),
			maxDate: new Date(2025, 10, 1),
			currentDate: new Date(),
			newTime: null
		};
	},
	methods: {
		formatter(type, val) {
			if (type === "year") {
				return `${val}年`;
			} else if (type === "month") {
				return `${val}月`;
			} else {
				return `${val}日`;
			}
		},
		//确认
		Finish_button(value) {
			let year = value.getFullYear();
			let month = value.getMonth() + 1;
			let dates = value.getDate();
			this.newTime = year + "-" + month + "-" + dates;
			this.timePopupLayer = false;
			this.$emit("closeBirthday", this.timePopupLayer, this.newTime);
		},
		//取消
		Close_button() {
			let value = "";
			this.timePopupLayer = false;
			if (this.newTime) {
				value = this.newTime;
			}
			this.$emit("closeBirthday", this.timePopupLayer, value);
		}
	}
};
</script>

<style scoped></style>

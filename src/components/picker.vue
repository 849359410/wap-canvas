<template>
	<van-popup v-model="showPicker" position="bottom" :close-on-click-overlay="false">
		<van-picker
			show-toolbar
			title="请选择银行"
			:columns="columns"
			:value-key="name"
			@confirm="onConfirm"
			@cancel="Close_button"
		/>
	</van-popup>
</template>

<script>
import { BANK_LISTS } from "@server/singularity";
export default {
	name: "Picker",
	props: {
		showPicker: {
			type: Boolean,
			default() {
				return false;
			}
		}
	},
	data() {
		return {
			value: "",
			columns: []
		};
	},
	watch: {
		showPicker: {
			handler() {
				BANK_LISTS.forEach(v => {
					this.columns.push(v.name);
				});
			}
		}
	},
	methods: {
		onConfirm(value) {
			this.value = value;
			let card_id = "";
			this.showPicker = false;
			card_id = BANK_LISTS.find(i => i.name === value);
			this.$emit("getback", this.showPicker, this.value, card_id.id);
		},
		Close_button() {
			this.showPicker = false;
			this.$emit("closeback", this.showPicker);
		}
	}
};
</script>

<style scoped></style>

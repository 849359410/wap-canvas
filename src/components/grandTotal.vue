<template>
	<div class="grandTotal">
		<div class="grandTotal_head">
			<p>温馨提示</p>
		</div>
		<div class="grandTotal_main">
			<p v-html="second.text1"></p>
			<p v-html="second.text2"></p>
		</div>
		<div v-if="second.whetherShow" class="grandTotal_foot one">
			<p @click="notCheck">否</p>
			<p class="yes" @click="checkYes">是</p>
		</div>
		<div v-if="second.confirmShow" class="grandTotal_foot two">
			<p class="yes1" @click="checkOff">
				确定
			</p>
		</div>
	</div>
</template>

<script>
export default {
	name: "GrandTotal",
	props: {
		second: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	methods: {
		checkYes() {
			this.second.whetherShow = false;
			this.$emit("getFun", 1);
		},
		checkOff() {
			this.second.confirmShow = false;
			this.$emit("getFun", 2);
		},
		notCheck() {
			this.second.whetherShow = false;
		}
	}
};
</script>
<style lang="scss" scoped>
@import "../assets/css/views/components/grandTotal";
</style>

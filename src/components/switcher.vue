<template>
	<div class="switcher" @click="switcherClick()">
		<div :style="{ transform: !isTra ? `translate(55%, 0)` : `translate(2px, 0)` }">
			{{ isTra ? "官方" : "信用" }}
		</div>
		<span :style="{ transform: isTra ? `translate(-3px, 0)` : `translate(-190%, 0)` }">{{
			isTra ? "信" : "官"
		}}</span>
	</div>
</template>
<script>
import { mapState } from "vuex";
export default {
	data() {
		return {
			isTra: true
		};
	},
	computed: {
		...mapState({
			currFcModule: state => state.common.webCommonWap.FcModule
		})
	},
	created() {
		this.isTra = this.currFcModule[0] !== "fc";
		this.$emit("get-lottery-list", this.isTra ? 1 : 2);
	},
	methods: {
		switcherClick() {
			this.isTra = !this.isTra;
			this.$emit("get-lottery-list", this.isTra ? 1 : 2);
		}
	}
};
</script>
<style scoped lang="scss">
.switcher {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 90px;
	height: 30px;
	border-radius: 15px;
	background: #ef384a;
	color: #fff;
	/*padding: 2px;*/
	font-size: 12px;
	margin: 10px 10px 10px 0;
	span {
		width: 30px;
		text-align: center;
		transition-duration: 0.5s;
		-moz-transition-duration: 0.5s; /* Firefox 4 */
		-webkit-transition-duration: 0.5s; /* Safari 和 Chrome */
		-o-transition-duration: 0.5s; /* Opera */
	}
	div {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 57px;
		/*height: 100%;*/
		height: 26px;
		border-radius: 15px;
		background: #fff;
		color: #ef384a;
		text-align: center;
		font-weight: 600;
		transition-duration: 0.5s;
		-moz-transition-duration: 0.5s; /* Firefox 4 */
		-webkit-transition-duration: 0.5s; /* Safari 和 Chrome */
		-o-transition-duration: 0.5s; /* Opera */
	}
}
</style>

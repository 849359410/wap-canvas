<template>
	<div class="liveMaintain">
		<div class="liveMaintain-top">
			提示
			<span @click="getGoRouter">×</span>
		</div>
		<div class="liveMaintain-box">
			<span>{{ `${liveLottery.fc_name}${maintainObj.text}` }}</span>
			<div class="liveMaintain-box_button">
				<img
					src="../../../assets/images/liveBroadcast/dialog/ann.png"
					alt=""
					@click="getGoRouter"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
export default {
	name: "LiveMaintain",
	props: {
		maintainObj: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			text: ""
		};
	},
	computed: {
		...mapState({
			liveLottery: state => state.lottery.liveLottery
		})
	},
	methods: {
		getGoRouter() {
			this.$router.push({ name: "pageLiveIndex" });
			this.$root.$emit("getLiveEg");
		}
	}
};
</script>

<style scoped lang="scss">
.liveMaintain {
	position: fixed;
	margin: auto;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	width: 250px;
	height: 150px;
	background-color: rgba(21, 25, 80, 0.9);
	color: #fff;
	border-radius: 5px;
	border: 1px solid rgb(62, 70, 169);
	padding: 0 10px;
	@at-root #{&}-top {
		text-align: center;
		height: 40px;
		line-height: 40px;
		font-size: 14px;
		position: relative;
		border-bottom: 1px solid rgb(62, 70, 169);
		span {
			position: absolute;
			font-size: 25px;
			right: 0;
			top: 0;
		}
	}
	@at-root #{&}-box {
		margin-top: 20px;
		font-size: 14px;
		text-align: center;
		@at-root #{&}_button {
			margin-top: 16px;
			img {
				width: 82px;
				height: 31px;
			}
		}
	}
}
</style>

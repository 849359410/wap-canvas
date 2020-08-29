<template>
	<div class="liveLine">
		<div class="liveLine-top">
			<span @click="getSetClose">×</span>
			<p>选择线路</p>
		</div>
		<div class="liveLine-box">
			<div v-for="(item, index) in liveLine" :key="index" class="liveLine-box-glory">
				<span>{{ item.text }}</span>
				<img
					v-show="item.state"
					class="liveLine-box-glory_switch"
					:src="iconSwitch === item.state ? item.icon : item.icon2"
					alt=""
					@click="getSetLine(item)"
				/>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "LiveLine",
	data() {
		return {
			liveLine: [
				{
					icon: require("../../../assets/images/liveBroadcast/line/lineOne.png"),
					icon2: require("../../../assets/images/liveBroadcast/line/noLineOne.png"),
					text: "标清",
					state: 1
				},
				{
					icon: require("../../../assets/images/liveBroadcast/line/lineTow.png"),
					icon2: require("../../../assets/images/liveBroadcast/line/noLineTow.png"),
					text: "高清",
					state: 2
				}
			],
			iconSwitch: 1
		};
	},
	methods: {
		getSetLine(item) {
			this.iconSwitch = item.state;
			this.$emit("getSetLine", this.iconSwitch);
		},
		getSetClose() {
			this.$parent.lineShow = false;
		}
	}
};
</script>

<style scoped lang="scss">
.liveLine {
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
	@at-root #{&}-top {
		span {
			position: absolute;
			font-size: 25px;
			right: 0;
			margin: 5px;
		}
		p {
			text-align: center;
			height: 40px;
			line-height: 40px;
			border-bottom: 1px solid rgb(62, 70, 169);
		}
	}
	@at-root #{&}-box {
		@at-root #{&}-glory {
			margin: 15px 50px;
			display: flex;
			span {
				margin: 0 15px 0 15px;
				font-size: 14px;
				height: 25px;
				display: inline-block;
				line-height: 27px;
			}
			@at-root #{&}_switch {
				width: 60px;
				height: 25px;
			}
		}
	}
}
</style>

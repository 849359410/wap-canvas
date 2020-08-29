<template>
	<div class="liveSet">
		<div class="liveSet-top">
			<span @click="getSetClose">×</span>
			<p>系统设置</p>
		</div>
		<div class="liveSet-box">
			<div v-for="(item, index) in listSet" :key="index" class="liveSet-box-glory">
				<img v-show="!item.input" class="liveSet-box-glory_icon" :src="item.icon" alt="" />
				<span v-show="!item.input">{{ item.text }}</span>
				<!--				<div v-show="item.input" class="liveSet-box-glory_select">-->
				<!--					<select id="group" value="1">-->
				<!--						<option value="1">Dimond</option>-->
				<!--						<option value="2">vertical</option>-->
				<!--					</select>-->
				<!--					<em>|</em>-->
				<!--					<i class="iconfont icon-xiajiantou"></i>-->
				<!--				</div>-->
				<img
					v-show="!item.input"
					class="liveSet-box-glory_switch"
					:src="item.state ? OFF : NO"
					alt=""
					@click="getSetMusic(item)"
				/>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "LiveSetUp",
	props: {
		audioMute: {
			type: Boolean,
			default() {
				return false;
			}
		}
	},
	data() {
		return {
			listSet: [
				{
					icon: require("../../../assets/images/liveBroadcast/systemSettings/yf.png"),
					text: "音符下载",
					name: "note",
					input: true
				},
				{
					icon: require("../../../assets/images/liveBroadcast/systemSettings/bjyy.png"),
					text: "背景音乐",
					name: "music",
					input: false,
					state: true
				},
				{
					icon: require("../../../assets/images/liveBroadcast/systemSettings/bjyx.png"),
					text: "背景音效",
					name: "effects",
					input: false,
					state: true
				},
				{
					icon: require("../../../assets/images/liveBroadcast/systemSettings/yxyx.png"),
					text: "游戏音效",
					name: "game",
					input: false,
					state: true
				}
			],
			NO: require("../../../assets/images/liveBroadcast/systemSettings/guan.png"),
			OFF: require("../../../assets/images/liveBroadcast/systemSettings/kai.png")
		};
	},
	created() {
		let bgmMusic = sessionStorage.getItem("bgmMusic");
		if (bgmMusic) this.listSet[1].state = !JSON.parse(bgmMusic);
		let bgmEffect = sessionStorage.getItem("bgmEffect");
		if (bgmEffect) this.listSet[2].state = !JSON.parse(bgmEffect);
		let gameEffect = sessionStorage.getItem("gameEffect");
		if (gameEffect) this.listSet[3].state = !JSON.parse(gameEffect);
	},
	methods: {
		getSetMusic(item) {
			item.state = !item.state;
			this.$emit("getSetMusic", item.name, !item.state);
		},
		getSetClose() {
			this.$parent.musicShow = false;
		},
		getSetOff(state) {
			this.listSet.forEach(i => {
				if (!i.input) i.state = !state;
			});
		}
	}
};
</script>

<style scoped lang="scss">
.liveSet {
	position: fixed;
	margin: auto;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	width: 250px;
	height: 200px;
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
			margin: 15px 30px;
			display: flex;
			padding-left: 10%;
			img {
				width: 15px;
				height: 15px;
			}
			span {
				margin: 0 15px 0 15px;
				font-size: 12px;
				display: inline-block;
				line-height: 20px;
			}
			@at-root #{&}_select {
				background-color: rgb(11, 14, 87);
				color: #4150b9;
				select {
					border: none; //清除select聚焦时候的边框颜色
					outline: none; //将select的宽高等于div的宽高
					width: 60px;
					height: 20px;
					color: #4150b9;
					background-color: rgb(11, 14, 87);
					font-size: 12px;
					-webkit-appearance: none;
					padding-left: 10px;
					option {
						width: 100px !important;
					}
				}
				i {
					margin: 4px;
				}
			}
			@at-root #{&}_switch {
				width: 40px !important;
				height: 20px !important;
			}
		}
	}
}
</style>

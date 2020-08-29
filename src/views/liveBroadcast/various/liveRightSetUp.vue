<template>
	<div class="rightSetUp">
		<div v-for="(item, index) in setList" :key="index" class="rightSetUp-box">
			<img :src="item.state ? item.icon : item.icon2" alt="" @click="getSet(item, index)" />
		</div>
	</div>
</template>

<script>
import { Bus } from "../../../main";

export default {
	name: "RightSetUp",
	data() {
		return {
			setList: [
				{
					icon: require("../../../assets/images/liveBroadcast/other/sy_sx.png"),
					icon2: require("../../../assets/images/liveBroadcast/other/sy_zt.png"),
					state: true,
					name: "sound"
				},
				{
					icon: require("../../../assets/images/liveBroadcast/other/xl_sx.png"),
					state: true,
					name: "line"
				},
				{
					icon: require("../../../assets/images/liveBroadcast/other/zb_sx.png"),
					icon2: require("../../../assets/images/liveBroadcast/other/zb_zt.png"),
					state: true,
					name: "video"
				},
				{
					icon: require("../../../assets/images/liveBroadcast/other/sz_sx.png"),
					state: true,
					name: "setUp"
				}
			]
		};
	},
	destroyed() {
		Bus.$off("getSetAudioBgm");
		Bus.$off("getSetLineVideo");
	},
	created() {
		this.$nextTick(() => {
			if (sessionStorage.getItem("audioMute")) {
				this.setList[0].state = !JSON.parse(sessionStorage.getItem("audioMute"));
			}
		});
		Bus.$on("getSetAudioBgm", () => {
			this.setList[0].state = true;
		});
		Bus.$on("getSetLineVideo", () => {
			this.setList[2].state = true;
		});
	},
	methods: {
		getSet(item, index) {
			switch (index) {
				case 0:
					item.state = !item.state;
					Bus.$emit("getSetAudio", !item.state);
					break;
				case 1:
					Bus.$emit("getSetLine");
					break;
				case 2:
					item.state = !item.state;
					Bus.$emit("getSetVideo", item.state);
					break;
				case 3:
					Bus.$emit("getSetBgmMusic");
					break;
			}
		}
	}
};
</script>

<style scoped lang="scss">
.rightSetUp {
	position: absolute;
	right: 10px;
	top: 50px;
	@at-root #{&}-box {
		img {
			width: 25px;
		}
	}
}
</style>

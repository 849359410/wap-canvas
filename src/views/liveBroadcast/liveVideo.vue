<template>
	<div :class="['liveVideo', { videoImg: videoImg }]">
		<VueNodePlayer id="video_view" :scale-mode="0" :buffer-time="0" />
	</div>
</template>

<script>
import VueNodePlayer from "vue-nodeplayer";
import { Bus } from "../../main";
import md5 from "js-md5";

export default {
	name: "LiveVideo",
	components: { VueNodePlayer },
	props: {
		videoData: {
			type: Array,
			default() {
				return [];
			}
		},
		lineSwitch: {
			type: Number,
			default() {
				return 1;
			}
		}
	},
	data() {
		return {
			url: "",
			videoImg: true,
			player: null,
			timestamp: 0,
			startUrl: "",
			timeOut: null
		};
	},
	watch: {
		videoData: {
			handler() {
				this.getSetLine(this.lineSwitch);
			},
			deep: true
		},
		lineSwitch(n) {
			this.player.stop();
			this.getSetLine(n);
		}
	},
	destroyed() {
		clearInterval(this.timeOut);
		this.timeOut = null;
		if (this.player !== null) this.player.stop();
	},
	created() {
		this.timestamp = Math.round((new Date().getTime() + 60 * 60 * 1000) / 1000);
		this.timeOut = setInterval(() => {
			// 一小时后重新生成时间戳
			this.player.stop();
			this.timestamp = Math.round((new Date().getTime() + 60 * 60 * 1000) / 1000);
			this.getSetLine(this.lineSwitch);
		}, 3600000);
		Bus.$on("getSetVideo", state => {
			if (state) {
				this.videoImg = false;
				this.player.start(this.startUrl);
				setTimeout(() => {
					document.getElementById("video_view").style.display = "block";
				}, 100);
			} else {
				this.videoImg = true;
				this.player.stop();
				document.getElementById("video_view").style.display = "none";
			}
		});
	},
	methods: {
		setNodePlay() {
			document.getElementById("video_view").style.display = "none";
			window.NodePlayer.load(() => {
				this.player = new window.NodePlayer();
				this.player.setView("video_view");
				this.player.start(this.startUrl);
				this.player.on("start", () => {
					this.videoImg = false;
					document.getElementById("video_view").style.display = "block";
				});
			});
		},
		getSetLine(line) {
			this.videoData.forEach(val => {
				if (val.device_type === 4 && line === val.definition) {
					this.url = val.url;
					this.getInterceptMedia(val.url);
				}
			});
		},
		// 截取流媒体号
		getInterceptMedia(url) {
			let media = url
				.split("/")
				.slice(-1)[0]
				.split(".")[0];
			let urlMedia = md5(
				`1D9C0E182091B6D10EF1F5C412265FDE${media}${this.timestamp}`
			).toUpperCase();
			this.startUrl = `${this.url}?wsSecret=${urlMedia}&wsABSTime=${this.timestamp}`;
			this.setNodePlay();
		}
	}
};
</script>

<style scoped lang="scss">
.liveVideo {
	width: 100%;
	height: 33%;
	#video_view {
		width: 100%;
		height: 100%;
	}
}
.videoImg {
	background: url("../../assets/images/liveBroadcast/other/banner1.png");
	background-size: 100% 100%;
}
</style>

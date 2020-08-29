<template>
	<div>
		<div
			v-if="isRedPacket"
			id="redPacket-box-id"
			class="red_packet"
			@mousedown="down"
			@touchstart="down"
			@mousemove.prevent="move"
			@touchmove.prevent="move"
			@mouseup="end"
			@touchend="end"
		>
			<div class="redPacket-box">
				<div class="redPacket-img" @click="openRed"></div>
				<img
					src="../../assets/images/index/close.png"
					@click="isRedPacket = !isRedPacket"
				/>
			</div>
		</div>
		<red-packet v-if="isRedPacket" ref="redPacket" :red-pack-data="RedPackDataNum"></red-packet>
	</div>
</template>

<script>
import { mapState } from "vuex";
import RedPacket from "../../components/redpacket";
export default {
	name: "RedPacketBox",
	components: {
		redPacket: RedPacket
	},
	data() {
		return {
			isRedPacket: false,
			flags: false,
			position: { x: 0, y: 0 },
			nx: "",
			ny: "",
			dx: "",
			dy: "",
			xPum: "",
			yPum: "",
			RedPackDataNum: ""
		};
	},
	computed: {
		...mapState({
			webCommonWap: state => state.common.webCommonWap
		})
	},
	created() {
		this.isShowRp();
	},
	methods: {
		openRed() {
			this.$refs.redPacket.openRP();
		},
		// 实现移动端拖拽
		down() {
			const moveDiv = document.getElementById("redPacket-box-id");
			this.flags = true;
			let touch;
			if (event.touches) {
				touch = event.touches[0];
			} else {
				touch = event;
			}
			this.position.x = touch.clientX;
			this.position.y = touch.clientY;
			this.dx = moveDiv.offsetLeft;
			this.dy = moveDiv.offsetTop;
		},
		move() {
			if (this.flags) {
				const moveDiv = document.getElementById("redPacket-box-id");
				const head = document.getElementsByClassName("headHome");
				const headHeight = head[0].offsetHeight;
				const bottom = document.getElementsByClassName("tabbars");
				const clientHeight = document.documentElement.clientHeight;
				const bottomHeight = clientHeight - bottom[0].offsetHeight - moveDiv.offsetHeight;
				let touch;
				if (event.touches) {
					touch = event.touches[0];
				} else {
					touch = event;
				}
				this.nx = touch.clientX - this.position.x;
				this.ny = touch.clientY - this.position.y;
				this.xPum = this.dx + this.nx;
				this.yPum = this.dy + this.ny;
				if (this.xPum < 0) {
					this.xPum = 0;
				} else if (this.xPum > document.documentElement.clientWidth - moveDiv.offsetWidth) {
					this.xPum = document.documentElement.clientWidth - moveDiv.offsetWidth;
				}
				if (this.yPum < headHeight) {
					this.yPum = headHeight;
				} else if (this.yPum > bottomHeight) {
					this.yPum = bottomHeight;
				} else if (
					this.yPum >
					document.documentElement.clientHeight - moveDiv.offsetHeight
				) {
					this.yPum = document.documentElement.clientHeight - moveDiv.offsetHeight;
				}
				moveDiv.style.left = this.xPum + "px";
				moveDiv.style.top = this.yPum + "px";
				document.addEventListener("touchmove", () => {}, { passive: false });
			}
		},
		// 鼠标释放时候的函数
		end() {
			this.flags = false;
		},
		isShowRp() {
			let arr = this.webCommonWap.red_bag.split("&");
			if (arr !== "null" && arr !== "undefined" && arr !== "") {
				this.isRedPacket = true;
				this.RedPackDataNum = arr[0];
			}
			if (arr[0] === "") this.isRedPacket = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.red_packet {
	position: fixed;
	width: 67.5px;
	height: 90px;
	top: 140px;
	left: 4px;
	z-index: 1;
	.redPacket-box {
		.redPacket-img {
			width: 67.5px;
			height: 90px;
			background: url("https://mpm.cdn-6688.com/img/redPacket.png") top center no-repeat;
			background-size: 100%;
		}
		img {
			position: absolute;
			top: -21px;
			right: -26px;
			width: 28px;
			height: 28px;
		}
	}
}
</style>

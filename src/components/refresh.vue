<template>
	<van-image
		:src="img || refresh"
		:class="refreshMoney ? 'refreshMoneyStyle' : ''"
		:width="size.width"
		:height="size.height"
		@click="refreshMoneyClick()"
	/>
</template>

<script>
export default {
	name: "Refresh",
	props: {
		img: {
			type: String,
			default() {
				return "";
			}
		},
		size: {
			type: Object,
			default() {
				return {
					width: "12px",
					height: "12px"
				};
			}
		},
		refreshSystem: {
			type: Boolean,
			default() {
				return false;
			}
		}
	},
	data() {
		return {
			refreshMoney: false,
			refresh: require("../assets/images/userCenter/home/shua.png")
		};
	},
	methods: {
		refreshMoneyClick() {
			if (this.refreshMoney) return;
			this.refreshMoney = true;
			setTimeout(() => {
				if (this.refreshSystem) {
					this.$emit("getRefresh");
				} else this.$root.$emit("getUserMessage"); // 刷新余额
				this.refreshMoney = false;
			}, 1000);
		}
	}
};
</script>

<style scoped lang="scss">
.van-image {
	vertical-align: middle !important;
	margin-left: 5px;
}
img {
	float: right;
	width: 12px;
}
.refreshMoneyStyle {
	-webkit-animation: rotating 1s infinite; /* Safari 4.0 - 8.0 */
	animation: rotating 1s linear infinite;
}
@-webkit-keyframes rotating {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}
@keyframes rotating {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>

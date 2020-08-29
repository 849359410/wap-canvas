<template>
	<van-row>
		<van-row v-for="i in 6" :key="i" class="follow" @click="goDetails()">
			<van-col width="50px" class="follow_left">
				<img :src="returnIcon(1)" />
			</van-col>
			<van-col class="follow_center">
				<p>世界第一</p>
				<p>08-24 12:00</p>
			</van-col>
			<van-col width="80px" class="follow_right">
				<p>取消关注</p>
			</van-col>
		</van-row>
	</van-row>
</template>

<script>
import { APP_IMG_HOST } from "../../../config/deploy.config";
export default {
	name: "MyFollow",
	data() {
		return {};
	},
	methods: {
		returnIcon(id) {
			return `${APP_IMG_HOST}/img/userIcon/${id}.jpg`;
		}
	}
};
</script>

<style scoped lang="scss">
.follow {
	height: 60px;
	padding: 10px;
	border-bottom: 1px solid #dddddd;
	@at-root #{&}_left {
		height: 40px;
		img {
			border-radius: 50%;
			width: 40px;
		}
	}
	@at-root #{&}_center {
		p {
			line-height: 20px;
			height: 20px;
			font-size: 12px;
			color: #999999;
			&:first-child {
				color: #333333;
				font-weight: 600;
			}
		}
	}
	@at-root #{&}_right {
		p {
			font-size: 12px;
			line-height: 20px;
			margin-top: 10px;
			border-radius: 12px;
			text-align: center;
			border: 1px solid #c3c3c3;
			color: #999999;
		}
	}
}
</style>

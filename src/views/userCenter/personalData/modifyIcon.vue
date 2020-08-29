<template>
	<van-row>
		<van-row class="main">
			<van-row class="main--head">
				<van-row>
					<img :src="userImg" />
					<p></p>
					<span>头像预览</span>
				</van-row>
			</van-row>
			<van-row class="main--sub">
				<p @click="subId()">保存头像</p>
			</van-row>
			<van-row class="main--list">
				<p class="title">选择头像</p>
				<van-row class="main--list_swiper">
					<swiper :options="swiperOption">
						<swiper-slide v-for="i in 100" :key="i" class="main--list_swiper-img">
							<img :src="getImg(i)" @click="setId(i)" />
						</swiper-slide>
						<div slot="pagination" class="main--list_swiper-pagination"></div>
					</swiper>
				</van-row>
			</van-row>
		</van-row>
	</van-row>
</template>

<script>
import { mapState } from "vuex";
import { APP_IMG_HOST } from "../../../config/deploy.config";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "../../../assets/css/swiper.min.css";
import { Bus } from "../../../main";
export default {
	name: "ModifyIcon",
	components: {
		swiper,
		swiperSlide
	},
	data() {
		return {
			userImg: "",
			imgId: 1,
			swiperOption: {
				slidesPerView: 5,
				slidesPerColumn: 2,
				slidesPerGroup: 5,
				spaceBetween: 5,
				pagination: ".main--list_swiper-pagination",
				paginationClickable: true,
				navigation: {
					nextEl: ".main--list_swiper-prev",
					prevEl: ".main--list_swiper-next"
				}
			}
		};
	},
	computed: {
		...mapState({
			userMessage: state => state.user.userMessage
		})
	},
	watch: {
		imgId: {
			handler() {},
			deep: true
		}
	},
	created() {
		this.imgId = this.userMessage.pic_id;
		this.userImg = `${APP_IMG_HOST}/img/userIcon/${this.userMessage.pic_id}.jpg`;
	},
	methods: {
		// 返回头像链接
		getImg(i) {
			return `${APP_IMG_HOST}/img/userIcon/${i}.jpg`;
		},
		// 获取头像Id
		setId(i) {
			this.imgId = i;
			this.userImg = `${APP_IMG_HOST}/img/userIcon/${i}.jpg`;
		},
		// 保存头像
		async subId() {
			this.$helps.showLoading();
			await this.$api
				.request("API_POST_UPDATE_USE_PICID", {
					pic_id: Number(this.imgId)
				})
				.then(
					success => {
						this.$root.$emit("getUserMessage"); // 刷新个人信息
						this.$root.$emit("handleSuccess", success.Msg);
						Bus.$emit("modify-logo", this.imgId.toString());
					},
					error => this.$root.$emit("handleError", error)
				);
			this.$helps.hideLoading();
		}
	}
};
</script>

<style scoped lang="scss">
.main {
	@at-root #{&}--head {
		padding: 15px;
		position: relative;
		> div {
			border-radius: 8px;
			overflow: hidden;
		}
		p {
			position: absolute;
			top: 15px;
			left: 15px;
			width: 0;
			height: 0;
			border: 50px solid transparent;
			border-top: 50px solid rgba(0, 0, 0, 0.3);
			border-left: 50px solid rgba(0, 0, 0, 0.3);
			border-top-left-radius: 8px;
		}
		span {
			position: absolute;
			top: 40px;
			left: 18px;
			color: #ffffff;
			transform: rotate(-45deg);
		}
	}
	@at-root #{&}--sub {
		width: 130px;
		margin: 5px auto;
		p {
			height: 40px;
			line-height: 40px;
			border-radius: 10px;
			border: 1px solid #cccccc;
			box-sizing: border-box;
			font-size: 14px;
			color: #666666;
			text-align: center;
		}
	}
	@at-root #{&}--list {
		padding: 25px 15px;
		.title {
			font-size: 12px;
			line-height: 12px;
			color: #333333;
			margin-bottom: 15px;
		}
		@at-root #{&}_swiper {
			height: 200px;
			position: relative;
			@at-root #{&}-img {
				img {
					border-radius: 10px;
				}
			}
			@at-root #{&}-pagination {
				margin: 20px auto;
				text-align: center;
				z-index: 1000000000;
			}
		}
	}
}
</style>

<template>
	<van-row class="index_page">
		<van-swipe autoplay="3000">
			<van-swipe-item v-for="(item, index) in carouselMap" :key="index" class="index-img">
				<img :src="item.img_url" @click="jump(item)" />
			</van-swipe-item>
		</van-swipe>
		<van-popup
			v-if="popAdData.length > 0"
			v-model="isShowPopAd"
			:class="popAdData[0].ad_type === 2 ? 'index_page_img' : 'index_page_popup'"
			z-index="100"
		>
			<van-swipe class="my-swipe" :autoplay="false" indicator-color="white" :loop="false">
				<van-swipe-item v-for="(item, index) of popAdData" :key="index">
					<img v-if="item.ad_type === 2" v-lazy="item.url" />
					<van-cell v-if="item.ad_type === 1" :title="item.title">
						<van-row v-html="item.content"></van-row>
					</van-cell>
				</van-swipe-item>
			</van-swipe>
		</van-popup>
		<van-popup
			v-for="(item, index) of dataList"
			:key="index"
			v-model="item.accumulate"
			class="index_page_box"
			:close-on-click-overlay="false"
			closeable
			z-index="150"
		>
			<p class="index_page_box_p">
				{{ item.content }}
			</p>
		</van-popup>
	</van-row>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import indexBody from "../../mixins/indexBody";
export default {
	name: "IndexBody",
	mixins: [indexBody],
	props: {
		dataList: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			show: true,
			popAdData: [],
			isShowPopAd: false
		};
	},
	computed: {
		...mapGetters(["carouselMap"]),
		...mapState({
			webCommonWap: state => state.common.webCommonWap
		}),
		popAD() {
			return this.webCommonWap.hasOwnProperty("PopAd") ? this.webCommonWap.PopAd : {};
		}
	},
	created() {
		this.judgeShowAD();
	},
	methods: {
		// 轮播图跳转路由
		jump(item) {
			if (item.img_link) {
				let url = item.img_link;
				if (
					item.img_link.indexOf("discountActivity") > -1 ||
					item.img_link.indexOf("promotions") > -1
				) {
					url = `${window.location.origin}/discountActivity`;
				}
				if (item.is_blank === 1) {
					window.open(url, "_blank");
				} else {
					window.location.href = url;
				}
			}
		},
		judgeShowAD() {
			//获取首次还是每次
			let acitve = this.popAD ? this.popAD[0].pop_type : 0;
			if (this.popAD) {
				this.popAD.forEach(v => {
					this.popAdData.push(v);
				});
			}
			// 每次
			if (acitve === 1) this.isShowPopAd = true;
			// 首次
			if (acitve === 2 && !this.calculatingTime("FirstPopAd")) {
				this.isShowPopAd = true;
				this.setCookie("FirstPopAd", 1, this.getExpireTime());
			}
		}
	}
};
</script>

<style lang="scss">
@import "../../assets/css/views/home/indexbody";
</style>

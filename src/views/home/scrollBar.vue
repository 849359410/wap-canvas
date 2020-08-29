<template>
	<div class="scroll-container" @click="jumpNoticeDetail()">
		<div class="scroll-img">
			<img class="icon_img" :src="img" alt="" />
		</div>
		<div class="scroll-list">
			<marquee v-if="listEnt && listEnt.length > 0" dierction="left" scrollamount="3">
				<div v-for="(item, index) in listEnt" :key="index" class="scroll-list-item">
					{{ item.name }}
				</div>
			</marquee>
			<div v-else class="no_nitice">
				暂无公告
			</div>
		</div>
		<div v-if="$route.name !== 'ChatRoom'" class="scroll-right">
			<van-icon name="arrow" />
		</div>
	</div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
	name: "ScrollBar",
	data: () => ({
		img: require("../../assets/images/index/head/home_message.png"),
		listEnt: []
	}),
	computed: {
		...mapGetters(["notice"])
	},
	created() {
		this.notice.forEach(i => {
			if (i.ntype === 1) this.listEnt.push(i);
		});
	},
	methods: {
		jumpNoticeDetail() {
			if (this.notice.length > 0) this.$router.push({ name: "Mnotice" });
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/home/scrollBar";
</style>

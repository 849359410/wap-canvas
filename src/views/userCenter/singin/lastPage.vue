<template>
	<van-row class="inside--contentFour">
		<van-row class="inside--contentFour_box">
			<p>游戏社交</p>
			<van-row class="list">
				<van-col class="top" @click="toLottery">
					<p class="BTitle">购彩大厅</p>
					<p class="CTitle">LOTTERY GAME</p>
					<p class="CTitle">时时彩/PK拾/快三/六合彩</p>
				</van-col>
				<van-col class="left" @click="toChatRoom">
					<p class="BTitle">聊天室</p>
					<p class="CTitle">CHAT ROOM</p>
					<p class="CTitle">即时聊天,边聊边玩</p>
				</van-col>
				<van-col class="right" @click="toPlan">
					<p class="BTitle">高手计划</p>
					<p class="CTitle">MASTER PLAN</p>
					<p class="CTitle">计划跟投,投注跟单</p>
				</van-col>
			</van-row>
			<van-divider :style="{ color: '#999', borderColor: '#cfcfcf', padding: '0 60px' }"
				>我是有底线的</van-divider
			>
		</van-row>
	</van-row>
</template>

<script>
import { mapState } from "vuex";
export default {
	name: "LastPage",
	computed: {
		...mapState({
			webCommonWap: state => state.common.webCommonWap
		})
	},
	methods: {
		toLottery() {
			this.$router.push({ name: "BettingHall" });
		},
		toChatRoom() {
			if (this.webCommonWap.ChatRoom === 1) {
				window.location.href = `${
					document.location.origin
				}/chat_home/index/0?s=${this.$stores.get("s")}`;
			} else {
				this.$root.$emit("handleError", "暂不开放");
			}
		},
		toPlan() {
			this.$router.push({ name: "Plan" });
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/userCenter/singin/singin";
</style>

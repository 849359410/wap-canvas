<template>
	<van-row>
		<div class="mian">
			<div class="left">
				<p>{{ userMessage.username }}</p>
				<p>欢迎来到我的客服，服务让理财更简单</p>
			</div>
			<img class="right" src="../../assets/images/yuBao/indexBj.png" />
		</div>
		<div class="problem">
			<div class="problem_title">
				猜你想问
			</div>
			<div v-for="i in servicrList" :key="i.id" class="problem_list" @click="lookDetails(i)">
				{{ i.title }}
			</div>
		</div>
		<div class="service" @click="goService()">
			<p>在线客服</p>
		</div>
		<div v-show="showDetails" class="alerts">
			<div class="alert_bj" @click="showDetails = false"></div>
			<div class="alert_main">
				<div class="alert_main_title">
					{{ serviceDet.title }}
					<van-icon name="cross" @click="showDetails = false" />
				</div>
				<div class="alert_main_content">
					<p v-for="(i, index) in serviceDet.content" :key="index" v-html="i.text"></p>
				</div>
			</div>
		</div>
	</van-row>
</template>

<script>
import { yubaoRule } from "../../assets/js/yubaoRule";
import { mapState, mapGetters } from "vuex";
export default {
	name: "YuBaoService",
	data() {
		return {
			servicrList: yubaoRule,
			titleName: "",
			showDetails: false,
			serviceDet: ""
		};
	},
	computed: {
		...mapState({
			userMessage: state => state.user.userMessage
		}),
		...mapGetters(["webData"])
	},
	created() {
		this.titleName = this.$route.meta.name;
	},
	methods: {
		goBack() {
			this.$router.go(-1);
		},
		lookDetails(item) {
			this.serviceDet = item;
			this.showDetails = true;
		},
		goService() {
			const ws = this.webData.web_cs;
			if (ws === "" || null) {
				this.$root.$emit("handleError", "没有在线客服");
			} else {
				window.open(ws);
			}
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/yuBao/yuBaoService";
</style>
<style lang="scss">
.alert_main_content {
	.red_color {
		color: #ff0000;
	}
	.wenxin {
		color: #000000;
		font-weight: 600;
	}
}
</style>

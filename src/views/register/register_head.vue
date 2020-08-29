<template>
	<div class="registerhead">
		<van-nav-bar class="registerhead_top" fixed>
			<template #left>
				<van-icon class="left" name="arrow-left" @click="goBack" />
			</template>
			<template #title>
				<p v-if="$route.name === 'AllianceAgreement'">联盟协议</p>
				<p v-else-if="agentState">会员注册</p>
				<van-tabs
					v-else
					v-model="active"
					type="card"
					class="registerhead_central_area"
					@click="tabTitle"
				>
					<van-tab
						v-for="item of titleTab"
						:key="item.val"
						:name="item.path"
						:title="item.title"
					/>
				</van-tabs>
			</template>
			<template #right>
				<van-icon
					class="right"
					name="wap-home-o"
					@click="$router.push({ name: 'Index' })"
				/>
			</template>
		</van-nav-bar>
	</div>
</template>
<script>
import { mapState } from "vuex";
export default {
	name: "RegisterHead",
	props: {
		active: {
			type: String,
			default() {
				return "";
			}
		}
	},
	data() {
		return {
			titleTab: [
				{ title: "会员注册", val: 1, path: "Register" },
				{ title: "代理注册", val: 2, path: "AgentRegister" }
			],
			agentState: false
		};
	},
	computed: {
		...mapState({
			agentInfor: state => state.common.webCommonWap.agent_state
		})
	},
	created() {
		this.agentState = this.agentInfor === 2;
	},
	methods: {
		goBack() {
			if (this.$route.name === "AllianceAgreement") {
				this.$router.go(-1);
			} else {
				this.$router.push({ name: "Index" });
			}
		},
		tabTitle(path) {
			this.$router.push({ name: path });
		}
	}
};
</script>

<style lang="scss">
@import "../../assets/css/mixins/mixin";
@import "../../assets/css/views/register/registerHead";
.registerhead {
	background: url(../../assets/images/register/register_bg.png) no-repeat;
	background-size: contain;
}
</style>

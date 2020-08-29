<template>
	<div class="chimera">
		<van-nav-bar
			:title="$route.meta.name"
			left-arrow
			:fixed="true"
			class="head"
			@click-left="onClickLeft"
		>
			<template #right>
				<router-link :to="{ name: 'LongRule' }">
					<van-image
						:src="imgRight"
						style="width: 24px;vertical-align: middle;"
					></van-image>
				</router-link>
			</template>
		</van-nav-bar>
		<tabs :list="data" :tab-height="2" :display-id="true" @getReturnTabs="getReturnTabs"></tabs>
		<long-son v-if="lotteryIndex === 1"></long-son>
		<long-record v-else></long-record>
	</div>
</template>

<script>
import tabs from "../../components/Tabs";
import longSon from "./longSon";
import longRecord from "./longRecord";

export default {
	name: "Index",
	components: { tabs, longSon, longRecord },
	data() {
		return {
			imgRight: require("../../assets/images/chimera/description.png"),
			data: [
				{ id: 1, name: "最新长龙" },
				{ id: 2, name: "我的投注" }
			],
			lotteryIndex: 1
		};
	},
	created() {
		this.$helps.showLoading();
	},
	methods: {
		onClickLeft() {
			this.$router.go(-1);
		},
		getReturnTabs(id) {
			this.lotteryIndex = id;
			// this.$helps.showLoading();
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/chimera/Index";
</style>

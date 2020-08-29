<template>
	<div class="main">
		<plan-trans :list="gameList" />
	</div>
</template>

<script>
import PlanTrans from "./planTrans";
export default {
	name: "KillerPlanIndex",
	components: { PlanTrans },
	data() {
		return {
			gameList: []
		};
	},
	created() {
		this.gameList = JSON.parse(this.$route.query.gameList);
	}
};
</script>

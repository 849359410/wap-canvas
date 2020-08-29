<template>
	<van-row class="explanation">
		<van-image :src="img" />
		<van-list class="explanation_list">
			<van-row v-for="(item, index) of list" :key="index" class="explanation_content">
				<van-cell v-for="(i, k) of item.content" :key="k" :title="i.title" :icon="i.icon">
					{{ i.content }}
				</van-cell>
			</van-row>
		</van-list>
	</van-row>
</template>

<script>
import list from "../../mixins/agent_description";
export default {
	name: "AgentDescription",
	mixins: [list]
};
</script>

<style lang="scss">
@import "../../assets/css/views/userCenter/agent_description/agent_description";
</style>

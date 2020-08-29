<template>
	<div class="actionSheet">
		<van-action-sheet v-model="list.show" cancel-text="取消">
			<van-row>
				<van-col
					v-for="(i, index) in list.actions"
					:key="index"
					:class="{ active: turnObj.name === i.name }"
					span="24"
					@click="getChoice(i)"
				>
					{{ i.name }}
				</van-col>
			</van-row>
		</van-action-sheet>
	</div>
</template>

<script>
export default {
	name: "ActionSheet",
	props: {
		list: {
			type: Object,
			default() {
				return {};
			}
		},
		turnObj: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	methods: {
		getChoice(item) {
			this.$parent.$emit("getName", item, this.turnObj);
		}
	}
};
</script>

<style scoped lang="scss">
@import "../assets/css/views/components/actionSheet";
</style>

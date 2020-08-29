<template>
	<van-tabs
		v-model="tabActive"
		title-active-color="#ef384a"
		:line-height="tabHeight"
		@click="changeTab"
		@rendered="renderTab"
	>
		<van-tab v-for="(i, index) in list" :key="index" :name="displayId ? i.id : i">
			<template #title>
				<van-image v-if="i.icon" :src="i.icon" class="icon" />
				{{ i.name || i.title }}
			</template>
		</van-tab>
	</van-tabs>
</template>

<script>
export default {
	name: "Tabs",
	props: {
		list: {
			type: [Array],
			default() {
				return [];
			}
		},
		// 底部条高度
		tabHeight: {
			type: Number,
			default() {
				return 0;
			}
		},
		// 绑定当前选中标签的标识符
		tabActive: {
			type: Number,
			default() {
				return 0;
			}
		},
		displayId: {
			type: Boolean,
			default() {
				return false;
			}
		},
		// 标签内容首次渲染时触发
		rendered: {
			type: Boolean,
			default() {
				return false;
			}
		}
	},
	data() {
		return {
			renderedBol: false
		};
	},
	created() {
		this.renderedBol = this.rendered;
	},
	methods: {
		changeTab(name) {
			this.$emit("getReturnTabs", name, true);
		},
		renderTab(name) {
			if (this.renderedBol) {
				this.renderedBol = false;
				this.$emit("getReturnTabs", name, false);
			}
		},
		//重置tab栏
		getReset() {
			this.tabActive = 0;
		}
	}
};
</script>
<style scoped lang="scss">
.icon {
	width: 25px;
	position: relative;
	top: 5px;
}
</style>

<template>
	<van-row class="gameTab" type="flex" justify="space-between">
		<van-tabbar
			v-model="typeIndex"
			:border="false"
			active-color="#ef384a"
			inactive-color="#000"
			:fixed="false"
			@change="getTab"
		>
			<van-tabbar-item
				v-for="(item, index) in gameList"
				:key="index"
				:name="item.label"
				:icon="
					typeIndex === item.label
						? `https://static.cloudywoo.com/img/game/game_${item.label}_xz.png`
						: `https://static.cloudywoo.com/img/game/game_${item.label}.png`
				"
				style="font-size: 14px"
			>
				{{ item.name }}</van-tabbar-item
			>
		</van-tabbar>
	</van-row>
</template>

<script>
export default {
	name: "TopTab",
	data() {
		return {
			gameList: [
				{ name: "彩票", label: "cp" },
				{ name: "视讯", label: "sx" },
				{ name: "电子", label: "dz" },
				{ name: "捕鱼", label: "by" },
				{ name: "棋牌", label: "qp" }
			],
			typeIndex: "cp"
		};
	},
	created() {
		//
	},
	methods: {
		getTab(label) {
			this.$emit("change-game-type", label);
		}
	}
};
</script>

<template>
	<div class="longSub">
		<div><van-image :src="item.img" /></div>
		<div class="center_content">
			<div>{{ item.fc_name }}</div>
			<div class="long_period">
				{{ item.period }}期
				<em class="emColor">
					<em v-if="!prize" class="countdown">
						<van-count-down :time="item.codown * 1000" @finish="finish" />
					</em>
					<em v-else class="countdown">
						{{ prize }}
					</em>
				</em>
			</div>
			<div>
				<p class="spanColor">{{ item.play_name }}</p>
				<p class="spanColor">
					{{ item.long_queue }}
				</p>
				<p class="spanColor">{{ item.length }}期</p>
			</div>
		</div>
		<div
			v-if="!$lotteryPub.isFastThree(item.fc_id)"
			class="right_Betting"
			:class="prize === '开奖中' ? 'disable' : ''"
		>
			<div
				v-for="vv in item.Odds"
				:key="vv.id"
				:class="vv.active ? 'active' : ''"
				@click="betClick(vv)"
			>
				<span>{{ vv.content_name }}</span>
				<span>{{ vv.odds }}</span>
			</div>
		</div>
		<div v-else class="right_Three">
			<router-link :to="{ name: 'FastThree', params: { id: item.fc_id } }">
				去购彩
			</router-link>
		</div>
	</div>
</template>

<script>
export default {
	name: "LongSub",
	props: {
		item: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			prize: ""
		};
	},
	watch: {
		item() {
			this.prize = "";
		}
	},
	methods: {
		finish() {
			this.prize = "开奖中";
		},
		betClick(v) {
			if (this.prize === "开奖中") return;
			this.$emit("SelectCode", this.$helps.cloneDeep(v), this.item.play_name);
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/chimera/longSub";
</style>

<template>
	<div class="offTake">
		<tabs
			ref="tabs"
			style="position: sticky;z-index: 30"
			:tab-height="2"
			:list="playingTypeList"
			:rendered="true"
			@getReturnTabs="getCreditName"
		></tabs>
		<div v-if="groupShow" class="play_group">
			<div class="lineDebug">
				<div v-for="i in activePlayingGroup" :key="i.id" class="list-item">
					<div class="left list-item__left">
						{{ i.name }}
					</div>
					<div class="center list-item__center">
						<button
							v-for="(j, index) in i.child"
							:key="index"
							:class="currentPlaying.id === j.id ? 'active' : ''"
							@click="selectGroup(j, activePlayingType)"
						>
							{{ j.name }}
						</button>
					</div>
				</div>
			</div>
		</div>
		<div v-if="groupShow" class="play_bottom" @click="groupShow = false"></div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import tabs from "../../../components/Tabs";
import officialPlaying from "../../../mixins/officialPlaying";
export default {
	name: "OfficialTank",
	components: { tabs },
	mixins: [officialPlaying],
	props: {
		id: {
			type: [Number, String],
			default() {
				return 0;
			}
		}
	},
	data() {
		return {
			groupShow: false
		};
	},
	computed: {
		...mapState({
			currentPlaying: state => state.lottery.currentPlaying
		})
	},
	watch: {
		id() {
			this.loadPlayingType();
			this.groupShow = false;
		}
	},
	created() {
		this.loadPlayingType();
	},
	methods: {
		getCreditName(item, bool) {
			this.groupShow = bool;
			if (this.activePlayingType !== item.id) {
				this.activePlayingType = item.id;
				this.setActivePlayingType(item.id);
			}
		},
		// 选择玩法
		selectGroup(item) {
			this.groupShow = false;
			this.setActivePlaying(item);
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/official/officialTank";
</style>

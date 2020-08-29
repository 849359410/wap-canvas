export default {
	name: "Game_List",
	props: {
		list: {
			type: [Array],
			default() {
				return {};
			}
		},
		gameName: {
			type: [String],
			default() {
				return {};
			}
		}
	},
	data() {
		return {};
	},
	created() {},
	methods: {
		goRouter(item) {
			this.$emit("gameActive", item);
		},
		returnClass(i) {
			return [
				{
					active: i.PlayName === this.gameName
				}
			];
		}
	},
	render(h) {
		return h(
			"van-row",
			{
				class: "game"
			},
			this.list.map(i =>
				h(
					"van-col",
					{
						class: "game_list",
						attrs: {
							span: 6
						},
						on: {
							click: () => this.goRouter(i)
						}
					},
					[h("span", { class: this.returnClass(i) }, i.PlayName)]
				)
			)
		);
	}
};

export default {
	name: "Plan_Trans",
	props: {
		list: {
			type: Object,
			default() {
				return {};
			}
		},
		gameList: {
			type: [Array],
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
			if (item.GameId !== undefined) {
				this.$router.push({ name: "PlanLottery", query: { id: item.GameId } });
				this.$emit("gameCol");
			} else {
				let fc_id = this.gameList[0].SourceId || 1;
				if (item.id === 1) {
					this.$router.push({
						name: item.router,
						query: { gameList: JSON.stringify(this.gameList) }
					});
				} else {
					this.$router.push({ name: item.router, params: { id: fc_id } });
				}
			}
		}
	},
	render(h) {
		return h(
			"van-row",
			{
				class: "main-head"
			},
			this.list.map(i =>
				h(
					"van-col",
					{
						class: "main-head_list",
						attrs: {
							span: 6
						},
						on: {
							click: () => this.goRouter(i)
						}
					},
					[
						h("img", {
							class: "main-head_list_img",
							attrs: {
								src: i.logo
							}
						}),
						h("p", i.GameName)
					],
					i.name
				)
			)
		);
	}
};

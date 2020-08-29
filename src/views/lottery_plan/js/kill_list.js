export default {
	name: "Plan_Trans",
	props: {
		list: {
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
			}
		}
	},
	render(h) {
		return h(
			"div",
			this.list.map(i =>
				h("van-row", [
					h(
						"van-col",
						{
							attrs: {
								span: 4
							}
						},
						this.$filters.formatString(i.period, -5)
					),
					h(
						"van-col",
						{
							attrs: {
								span: 8
							}
						},
						i.expect.map((j, indexj) => {
							if (indexj === 0) {
								return h("span", [
									h(
										"em",
										{
											class: {
												active: j.class === 1
											}
										},
										j.text_tra || j.text
									)
								]);
							} else {
								return h("span", [
									h("em", ","),
									h(
										"em",
										{
											class: {
												active: j.class === 1
											}
										},
										j.text_tra || j.text
									)
								]);
							}
						})
					),
					h(
						"van-col",
						{
							attrs: {
								span: 8
							}
						},
						i.actual.map((k, indexk) => {
							if (indexk === 0) {
								return h("span", [
									h(
										"em",
										{
											class: {
												active: k.class === 1
											}
										},
										k.text
									)
								]);
							} else {
								return h("span", [
									h("em", ","),
									h(
										"em",
										{
											class: {
												active: k.class === 1
											}
										},
										k.text
									)
								]);
							}
						})
					),
					h(
						"van-col",
						{
							class: {
								killRight: true,
								error: i.correct === 0
							},
							attrs: {
								span: 4
							}
						},
						[h("span", i.corrText)]
					)
				])
			)
		);
	}
};

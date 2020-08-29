<script>
export default {
	name: "PlanList",
	props: {
		gameListTop: {
			type: [Object, Array],
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
		returnClass(key) {
			return ["lottery_right", `lottery_${key + 1}`];
		},
		goRouter(item) {
			this.$router.push({ name: "killerPlanDetails", query: { id: item.id } });
		}
	},
	render(h) {
		return h(
			"div",
			this.gameListTop.map((i, key) =>
				h(
					"van-row",
					{
						class: "rank-list_row",
						on: {
							click: () => this.goRouter(i)
						}
					},
					[
						h(
							"van-col",
							{
								attrs: {
									span: 4
								}
							},
							[
								h("van-image", {
									class: "lottery_logo",
									attrs: {
										src: i.logo
									}
								})
							]
						),
						h(
							"van-col",
							{
								attrs: {
									span: 13
								}
							},
							[
								h("van-row", { class: "lottery_name" }, [
									h("van-col", { attrs: { span: 12 } }, i.game_name),
									h("van-col", { attrs: { span: 12 } }, `[${i.play_name}]`)
								]),
								h("van-row", { class: "lottery_info" }, [
									h(
										"van-col",
										{
											attrs: {
												span: 12
											}
										},
										[
											h("img", {
												attrs: {
													src:
														"https://static.cloudywoo.com/img/userIcon/80.jpg"
												}
											}),
											h(
												"span",
												{
													class: "van-ellipsis"
												},
												i.username
											)
										]
									),
									h(
										"van-col",
										{
											attrs: {
												span: 12
											}
										},
										[
											h("i", {
												class: "icon-fans"
											}),
											h(
												"span",
												{
													class: "van-ellipsis"
												},
												i.fan
											)
										]
									)
								])
							]
						),
						h(
							"van-col",
							{
								class: this.returnClass(key),
								attrs: {
									span: 7
								}
							},
							[
								h("van-row", [
									h(
										"van-col",
										{
											attrs: {
												span: 12
											}
										},
										[
											h("i", {
												class: "icon-winRate"
											}),
											h("span", `${i.rate}%`)
										]
									),
									h(
										"van-col",
										{
											attrs: {
												span: 12
											}
										},
										[
											h("i", {
												class: "icon-lianZ"
											}),
											h("span", { class: "last_lianz" }, i.combo)
										]
									)
								])
							]
						)
					]
				)
			)
		);
	}
};
</script>
<style scoped lang="scss">
@import "../../assets/css/views/plan/head";
</style>

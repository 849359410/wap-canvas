<template>
	<div>
		<div v-for="(i, index) in arrDew.count" :key="index" class="dew_main--list">
			<p>
				<cite v-if="i.fre > i.maxNums">
					<span
						v-for="(j, ind) in i.maxNums"
						:key="ind"
						class="11"
						:class="returnClass(i.text)"
					>
						<em>{{ i.text }}</em>
					</span>
					<cite>
						<span
							v-for="(j, ind) in i.fre - i.maxNums"
							:key="ind"
							:class="returnClass(i.text)"
						>
							<em>{{ i.text }}</em>
						</span>
					</cite>
				</cite>
				<cite v-else>
					<span
						v-for="(j, ind) in i.fre"
						:key="ind"
						:class="returnClass(i.text)"
						:title="returnList(i.list, ind)"
					>
						<em>{{ i.text }}</em>
					</span>
					<span
						v-for="k in Math.abs(10 - i.fre)"
						v-show="Number(i.fre) < 10"
						:key="k.id"
					></span>
				</cite>
			</p>
		</div>
	</div>
</template>

<script>
export default {
	name: "DewMain",
	props: {
		arrDew: {
			type: [Object, Array],
			default() {
				return {};
			}
		}
	},
	methods: {
		returnList(item, i) {
			if (!item) return;
			return `${item[i].period} - ${item[i].num}`;
		},
		returnClass(name) {
			switch (name) {
				case "单":
				case "大":
					return "red";
				case "和":
					return "and";
			}
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/dewChart";
</style>

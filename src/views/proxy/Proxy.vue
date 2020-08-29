<template>
	<van-row class="proxy--box">
		<van-cell-group class="proxy--space">
			<van-cell
				v-for="(item, index) in mainTab"
				:key="index"
				:title="item.label"
				:to="item.action"
				:class="{ Separate: item.Separate }"
				is-link
			>
			</van-cell>
		</van-cell-group>
	</van-row>
</template>

<script>
export default {
	name: "Proxy",
	data() {
		return {
			mainTab: [
				{ label: "会员列表", action: "MbList" },
				{ label: "返点设置", action: "RebateSetting" },
				{ label: "佣金记录", action: "SubAgentReports" },
				{ label: "代理报表", action: "agentReport", Separate: true },
				{ label: "下级报表", action: "subordinateReport" },
				{ label: "投注明细", action: "Detailed" },
				{ label: "资金明细", action: "MoneyDetailed" },
				{ label: "推广链接", action: "RebateSetting", Separate: true },
				{ label: "代理说明", action: "agentDescription" }
			]
		};
	}
};
</script>

<style scoped lang="scss">
.proxy--box {
	width: 94%;
	margin: 10px auto;
	border-radius: 5px;
	.proxy--space {
		background: none;
		.Separate {
			margin-top: 12px;
		}
	}
}
</style>

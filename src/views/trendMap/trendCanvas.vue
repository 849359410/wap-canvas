<template>
	<div class="trend">
		<div
			class="trend--chart"
			:style="{ height: `${height}px` }"
			:class="
				isLuckyLottery || isHappyLottery || isMarkSixLottery
					? 'trend--special'
					: 'trend--com'
			"
		>
			<div class="trend--chart_right" :class="{ 'trend--lucky_right': isLuckyLottery }">
				<table
					v-show="tableData.length > 0"
					id="lottery-result-canvas-table"
					border="0"
					cellspacing="1"
					cellpadding="0"
				>
					<tr
						v-for="(row, index) in tableData"
						:key="index"
						:class="[
							isMarkSixLottery ? 'sixLottery' : '',
							isFastThree ? 'trend--chart_top_tab' : ''
						]"
					>
						<td
							v-for="(data, index1) in row"
							:key="index1"
							:colspan="data.colSpan"
							:rowspan="data.rowSpan"
						>
							<div v-if="index > 0 && index1 > 0">
								<div v-if="isMarkSixLottery" class="trend--chart_right_mark-six">
									<span
										v-if="$helps.isObject(data.text)"
										:class="data.text.waveColor"
									>
										{{ data.text.id }}
									</span>
									<span v-if="$helps.isObject(data.text)">
										{{ data.text.zodiac }}
									</span>
									<span v-if="!$helps.isObject(data.text)" class="zodiacs">
										{{ data.text }}
									</span>
								</div>
								<div
									v-for="(happy, index2) in data.text"
									v-else-if="isHappyLottery && index1 === 1"
									:key="index2"
									class="trend--chart_right_happy"
								>
									<span v-for="happyCode in happy" :key="happyCode.id">
										{{ happyCode }}
									</span>
								</div>
								<div
									v-else-if="isLuckyLottery && index1 === 3"
									class="trend--chart_right_lucky"
								>
									<span>
										{{ data.text.waveZh }}
									</span>
								</div>
								<div v-else-if="isFastThree && index1 === 1">
									<span>{{ data.text }}</span>
								</div>
								<div v-else :class="{ 'trend--chart_right_active': data.isActive }">
									{{ data.text }}
								</div>
							</div>
							<div v-else :class="[{ 'trend--chart_right_tab': isMarkSixLottery }]">
								{{ data.text }}
							</div>
						</td>
					</tr>
				</table>

				<canvas
					id="lottery-result-canvas-line"
					width="100%"
					height="100%"
					class="trend--chart_right_canvas"
				></canvas>
			</div>
		</div>
	</div>
</template>

<script>
import lotteryResult from "../../mixins/lotteryResult";
export default {
	name: "TrendCanvas",
	mixins: [lotteryResult],
	props: {
		tableData: {
			type: Array,
			default() {
				return [];
			}
		},
		height: {
			type: Number,
			default() {
				return 0;
			}
		}
	},
	updated() {
		this.drawLine();
	},
	methods: {
		// 画走势图直线
		drawLine() {
			const canvas = document.getElementById("lottery-result-canvas-line"),
				tableNode = document.getElementById("lottery-result-canvas-table");
			if (!tableNode || !canvas) return;

			canvas.width = tableNode.clientWidth;
			canvas.height = tableNode.clientHeight;
			const canvasContext = canvas.getContext("2d"),
				drawNodes = tableNode.getElementsByClassName("trend--chart_right_active");

			// 设置样式
			canvasContext.lineWidth = 2;
			canvasContext.strokeStyle = "#de3e4b";

			const topElementName = "TABLE";

			function calElementPosition(element, property) {
				let propertyValue = element[property];
				let current = element.offsetParent;
				// eslint-disable-next-line no-constant-condition
				while (true) {
					propertyValue += current[property];
					if (current.nodeName === topElementName) {
						break;
					}
					current = current.offsetParent;
				}
				return propertyValue;
			}

			if (drawNodes.length === 0) {
				return;
			}
			// 描线
			let previousPosition;
			for (let index = 0; index < drawNodes.length; index++) {
				const node = drawNodes[index],
					radiusLength = node.clientWidth / 2,
					[x, y] = [
						calElementPosition(node, "offsetLeft") + radiusLength,
						calElementPosition(node, "offsetTop") + radiusLength
					];

				if (index === 0) {
					previousPosition = { x, y };
					continue;
				}

				// 计算偏移量
				const distanceX = Math.abs(x - previousPosition.x),
					distanceY = Math.abs(y - previousPosition.y),
					distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY),
					offsetY = (radiusLength * distanceY) / distance;
				let offsetX = (distanceX * radiusLength) / distance;
				if (x < previousPosition.x) {
					offsetX = -offsetX;
				}
				canvasContext.moveTo(previousPosition.x + offsetX, previousPosition.y + offsetY);
				canvasContext.lineTo(x - offsetX, y - offsetY);
				previousPosition = { x, y };
			}
			// 绘制
			canvasContext.stroke();
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/trendMap/trendCanvas";
</style>
<style lang="scss">
#lottery-result-canvas-table {
	tr {
		td {
			padding: 0 5px 0 5px;
		}
	}
}
</style>

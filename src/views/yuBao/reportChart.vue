<template>
	<div class="highcharts-container"></div>
</template>

<script>
import Highcharts from "highcharts/highstock";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsDrilldown from "highcharts/modules/drilldown";
import Highcharts3D from "highcharts/highcharts-3d";
import HighchartsExport from "highcharts/modules/exporting";
HighchartsMore(Highcharts);
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);
HighchartsExport(Highcharts);

export default {
	name: "ReportChart",
	props: {
		options: {
			type: Object,
			default: () => {}
		},
		styles: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			chart: null,
			optionsList: ""
		};
	},
	watch: {
		styles: {
			handler(n) {
				this.$el.style.width = `${n.width}px`;
			},
			deep: true
		},
		optionsList: {
			handler(n) {
				this.chart.series[0].update({
					data: n.series[0].data
				});
				this.chart.xAxis[0].setCategories(n.xAxis.categories);
			},
			deep: true
		}
	},
	mounted() {
		this.optionsList = this.options;
		this.initChart();
	},
	methods: {
		initChart() {
			Highcharts.setOptions({
				lang: {
					contextButtonTitle: "图表导出菜单",
					downloadJPEG: "下载 JPEG 图片",
					downloadPDF: "下载 PDF 文件",
					downloadPNG: "下载 PNG 图片",
					downloadSVG: "下载 SVG 图片",
					printChart: "打印图表"
				}
			});
			this.$el.style.width = "100%";
			this.$el.style.height = (this.styles.height || 400) + "px";
			this.chart = new Highcharts.Chart(this.$el, this.options);
		}
	}
};
</script>

<style lang="scss">
.highcharts-container {
	width: ceil(100% - 170);
	height: 400px;
}
.x_color {
	text {
		&:nth-child(2) {
			display: none;
		}
		&:nth-child(3n) {
			display: none;
		}
		&:nth-child(5) {
			display: none;
		}
	}
}
</style>

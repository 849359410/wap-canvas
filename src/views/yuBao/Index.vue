<template>
	<div class="yuBao">
		<van-row class="yuBao-top">
			<van-col span="24">
				<span>总金额(元)</span>
				<van-icon :name="closeMoneyShow ? 'eye-o' : 'closed-eye'" @click="closeEye()" />
			</van-col>
			<van-col span="24">
				<p>{{ getEye(content.UserInOut) }}</p>
			</van-col>
			<van-col class="yuBao-top__profit" span="24">
				<p v-if="typeof content.YesterdayProfit === 'string'">
					{{ getEye(content.YesterdayProfit) }}
				</p>
				<p v-else>
					昨日收益：<span>{{ getEye(content.YesterdayProfit) }}</span
					>元
				</p>
			</van-col>
		</van-row>
		<van-row class="yuBao-center">
			<van-col span="12">
				<p>本月收益(元)</p>
				<p class="money">{{ getEye(content.TotalProfits) }}</p>
			</van-col>
			<van-col span="12">
				<p>日化率(‱)</p>
				<p class="money">{{ content.Rate }}</p>
			</van-col>
		</van-row>
		<van-col class="yuBao-col" span="24"></van-col>
		<van-row class="yuBao-money">
			<van-col span="24" class="title_money">七日基准收益(元)</van-col>
			<van-col span="24">
				<report-chart ref="simpleChart" :options="options" :styles="styles"></report-chart>
			</van-col>
		</van-row>
		<van-tabbar class="yuBao-footer">
			<van-row>
				<van-col
					v-for="i in toolbar"
					:key="i.id"
					:class="i.class"
					span="12"
					@click="goToolBar(i)"
				>
					{{ i.text }}
				</van-col>
			</van-row>
		</van-tabbar>
		<qk-alert v-if="isShowObj.isShow" :msg-show="isShowObj"></qk-alert>
	</div>
</template>

<script>
import reportChart from "./reportChart";
import qkAlert from "../../components/qkAlert";
export default {
	name: "Index",
	components: { reportChart, qkAlert },
	data() {
		return {
			toolbar: [
				{ id: 0, text: "转出" },
				{ id: 1, text: "转入", class: "active" }
			],
			isShowObj: {
				isShow: false,
				text: "",
				path: ""
			},
			content: {},
			closeMoneyShow: true,
			styles: { width: 400, height: 200 },
			options: {
				chart: {
					type: "spline"
				},
				title: {
					text: ""
				},
				//清除底部来源域名
				credits: {
					enabled: false
				},
				exporting: {
					enabled: false
				},
				xAxis: {
					className: "x_color",
					categories: []
				},
				yAxis: [
					{
						title: {
							text: ""
						}
					}
				],
				tooltip: {
					shared: true,
					valueSuffix: "元",
					headerFormat: `<b>{point.x}</b><br/>`,
					pointFormat: `{series.name}: <b>{point.y}</b><br/>`
				},
				legend: {
					layout: "vertical",
					align: "left",
					x: 80,
					verticalAlign: "top",
					y: 0,
					floating: true,
					enabled: false,
					backgroundColor: "#FFFFFF"
				},
				series: [
					{
						name: "收益金额",
						data: [],
						color: "#ff6263",
						lineWidth: 0.5
					}
				]
			}
		};
	},
	created() {
		this.getIndex();
	},
	methods: {
		async getIndex() {
			await this.$api.request("API_GET_YINDEX_INDEX_DATA").then(
				success => {
					this.content = success.Data;
					if (this.content.State === 2) {
						this.$root.$emit("handleError", "余额宝已关闭，请联系客服开启!");
					}
					let item = success.Data.HebdomadProfits;
					let date = [],
						money = [];
					item.forEach(i => {
						let dataIn = showIn(i.day, 2, "-");
						date.push(dataIn);
						money.push(i.money);
					});
					function showIn(str, index, newStr) {
						return str.slice(0, index) + newStr + str.slice(index);
					}
					this.closeMoneyShow = this.content.IsConceal === 1;
					this.$refs.simpleChart.options.xAxis.categories = date;
					this.$refs.simpleChart.options.series[0].data = money;
				},
				error => {
					this.$root.$emit("handleError", error);
				}
			);
		},
		goToolBar(item) {
			if (item.id === 0) {
				if (this.content.State === 2 && this.content.OutState === 2) {
					return this.$root.$emit("handleError", "余额宝已关闭，请联系客服开启!");
				}
				if (this.content.OutState === 2) {
					this.$root.$emit("handleError", "暂不支持转出到账户余额，详情请咨询客服！");
					return;
				}
				this.$router.push({ name: "TurnOut" });
			} else {
				if (this.content.State === 2) {
					return this.$root.$emit("handleError", "余额宝已关闭，请联系客服开启!");
				}
				if (this.content.InState === 2) {
					return this.$root.$emit("handleError", "暂不支持转入余额宝，详情请咨询客服！");
				}
				if (this.content.IsQkPwd === 2) {
					this.isShowObj.isShow = true;
					this.isShowObj.path = "UpdatePwd";
					this.isShowObj.text = "您还未设置安全密码，无法转入，是否先去设置安全密码";
					return;
				}
				this.$router.push({ name: "TurnInto" });
			}
		},
		closeEye() {
			this.closeMoneyShow = !this.closeMoneyShow;
			this.$api
				.request("API_UP_SUM_HIDE_REDIS", {
					stype: this.closeMoneyShow ? 1 : 2
				})
				.then(
					() => {},
					error => {
						this.$root.$emit("handleError", error);
					}
				);
		},
		getEye(money) {
			return this.closeMoneyShow ? money : "*****";
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/yuBao/index";
.yuBao {
	@at-root #{&}-top {
		background: url("../../assets/images/yuBao/indexBj2.png") no-repeat;
		background-size: 100% 100%;
	}
}
</style>

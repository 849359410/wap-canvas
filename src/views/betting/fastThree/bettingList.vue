<template>
	<div class="message--ul_li_betting">
		<p class="mybet">
			<span>我的投注</span>
			<img
				:class="refreshMoneys ? 'refreshMoneyStyle' : ''"
				src="../../../assets/images/betting/shuax.svg"
				@click="refreshMoneyClick"
			/>
		</p>
		<table border="0" cellpadding="0" cellspacing="0">
			<thead>
				<tr>
					<th>期号</th>
					<th>投注金额</th>
					<th>奖金</th>
					<th>操作</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(i, index) in infoDataList" v-show="index < 3" :key="i.id">
					<td>{{ i.period }}</td>
					<td>{{ i.bet }}</td>
					<td class="money">{{ i.result | formatPenny }}</td>
					<td>
						<a
							v-if="filterShow(i.fc_id) && i.state === 0"
							class="result-money"
							@click="cancelOrder(i.order_num, i.fc_id, i.add_time)"
							>撤&nbsp;单</a
						>
						<a v-else class="result" :class="changeClass(i.state)">
							{{ filterState(i.state) }}</a
						>
					</td>
				</tr>
			</tbody>
		</table>
		<span @click="$router.push({ name: 'Mrecord', params: { type: 'fc_tra' } })">更多>></span>
	</div>
</template>

<script>
import fastGroup from "../../../mixins/fastGroup";
export default {
	name: "BettingList",
	mixins: [fastGroup],
	props: {
		playId: {
			type: Number,
			default() {
				return 0;
			}
		}
	},
	data() {
		return {
			refreshMoneys: false,
			infoDataList: [],
			showOrder: null
		};
	},
	watch: {
		playId() {
			this.getBetInfo();
		}
	},
	created() {
		this.loading();
		this.getBetInfo();
	},
	methods: {
		filterState(state) {
			return this.$helps.getDictionary("BILLING_STATUS").filter(i => i.id === state)[0].name;
		},
		refreshMoneyClick() {
			this.refreshMoneys = true;
			setTimeout(() => {
				this.getBetInfo();
				this.refreshMoneys = false;
			}, 1000);
		},
		// 获取投注数据
		getBetInfo() {
			let params = {
				page: 1,
				fc_id: this.playId
			};
			this.$api.request("API_GET_FC_BET_CORD_TRA", params).then(
				success => {
					this.infoDataList = success.Data.Data;
				},
				error => {
					this.$root.$emit("handleError", error);
				}
			);
		},
		// 撤单判断
		filterShow(id) {
			if (
				this.showOrder !== null &&
				Object.prototype.hasOwnProperty.call(this.showOrder, id)
			) {
				if (this.showOrder[id] === "1") {
					return true;
				}
			}
			return false;
		},
		// 加载撤单
		loading() {
			// 获取当前彩种是否支持撤单
			this.$api
				.request("API_GET_IS_CONFIG", {
					fc_id: this.playId
				})
				.then(success => {
					this.showOrder = success.Data;
					if (this.showOrder.length) {
						this.showOrder.forEach(v => {
							v.classN = this.changeClass(v.state);
						});
					}
				});
		},
		// 撤单
		cancelOrder(orderNum, id, time) {
			let url = "API_GET_CANCEL_FC_TRA_BY_NONE";
			this.$api
				.request(url, {
					order_num: orderNum,
					fc_id: this.playId,
					add_time: time
				})
				.then(
					success => {
						this.$root.$emit("handleSuccess", "撤单成功", success);
						this.getBetInfo();
					},
					error => {
						this.$root.$emit("handleError", error);
					}
				);
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/fastThree/bettingList";
</style>

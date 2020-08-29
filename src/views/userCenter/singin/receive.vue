<template>
	<van-row class="inside--contentThree">
		<van-row class="inside--contentThree_box">
			<p>待领取福利</p>
			<div class="list">
				<div
					v-for="(i, index) in singConfigFil"
					v-show="index < maxNum"
					:key="index"
					class="list_Box"
					:class="[
						i.is_state === 1
							? 'Claimable'
							: i.is_state === 3
							? 'NotAvailable'
							: 'Claimable',
						singConfigFil.length === 1 ? 'oneContent' : ''
					]"
				>
					<div
						:style="i.is_state === 2 ? 'background-color: rgba(0,0,0,0.5)' : ''"
						class="leftContent"
					>
						<p
							:class="i.is_state !== 3 ? 'moneySty' : ''"
							:style="i.min_money <= 0 ? 'margin-top:12px' : ''"
						>
							￥<span style="font-size: 16px">{{ i.money }}</span
							>彩金
						</p>
						<p>
							连续签到{{ i.is_con }}天<span
								v-if="i.min_money > 0"
								style="font-size: inherit"
								>,累计充值{{ i.min_money }}元</span
							>
						</p>
					</div>
					<div
						:style="i.is_state === 2 ? 'background-color: rgba(0,0,0,0.5)' : ''"
						class="rightContent"
						@click="i.is_state === 1 ? $emit('getSingJack') : ''"
					>
						<span :style="i.is_state === 2 ? 'color: #868484' : ''">领<br />取</span>
					</div>
					<img
						v-if="i.is_state === 2"
						class="ClaimedImg"
						src="../../../assets/images/userCenter/singin/newEdition/claimed.png"
					/>
				</div>
			</div>
			<div v-show="moreShow && singConfigFil.length > maxNum" class="inside--rece_more">
				<p @click="showList()">
					<span>查看更多</span>
					<img src="../../../assets/images/userCenter/singin/insideMore.png" />
				</p>
			</div>
		</van-row>
	</van-row>
</template>

<script>
export default {
	name: "Receive",
	props: {
		singConfigFil: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data: () => ({
		maxNum: 6,
		moreShow: true
	}),
	methods: {
		// 查看更多
		showList() {
			this.maxNum = this.singConfigFil.length;
			this.moreShow = false;
		}
	}
};
</script>
<style scoped lang="scss">
@import "../../../assets/css/views/userCenter/singin/singin";
</style>

<template>
	<div>
		<van-popup v-model="receiveShow" cancelable class="grade_dig">
			<div class="reve_main">
				<img src="../../../assets/images/userCenter/grade/receive1.png" />
				<div class="rewardMain">
					<p class="rewardMoney">{{ receiveReward }}<span>元</span></p>
					<p>已存入余额，可直接使用</p>
				</div>
				<img
					class="money"
					src="../../../assets/images/userCenter/grade/moneyList.png"
					@click="$router.push({ name: 'MoneyRecord' })"
				/>
			</div>
		</van-popup>
	</div>
</template>

<script>
export default {
	name: "Dialog",
	props: {
		receiveShow: {
			type: Boolean,
			default() {
				return false;
			}
		},
		receiveReward: {
			type: String,
			default() {
				return "";
			}
		}
	}
};
</script>
<style scoped lang="scss">
@import "../../../assets/css/views/userCenter/grade/grade";
</style>

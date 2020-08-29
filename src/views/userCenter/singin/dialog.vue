<template>
	<van-row>
		<van-popup v-model="popupShow" class="singSurePopup">
			<van-row class="top">
				<van-row class="top_content">
					<van-row class="title">
						<p v-if="singDay.rema_day === 0" class="title_one title_max">
							已连续签到
							<span>{{ singDay.is_con_day }}天</span>
							，立即领取
						</p>
						<p v-else class="title_one">
							已连续签到
							<span>{{ singDay.is_con_day }}天</span>
							,再连续签到
							<span>{{ singDay.rema_day }}天</span>
							,即可领取
						</p>
						<p class="title_three">{{ singDay.money }}元彩金</p>
					</van-row>
					<div class="successSign" @click="popupShow = false">
						签到成功
					</div>
					<p class="top_maxDay">
						<img src="../../../assets/images/userCenter/singin/newEdition/tips.png" />
						连续签满{{ maxDays }}天后，签到将重新计算
					</p>
				</van-row>
			</van-row>
		</van-popup>
	</van-row>
</template>

<script>
export default {
	name: "Dialog",
	props: {
		singDay: {
			type: Object,
			default() {
				return {};
			}
		},
		popupShow: {
			type: Boolean,
			default() {
				return false;
			}
		},
		maxDays: {
			type: String,
			default() {
				return "";
			}
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/userCenter/singin/singin";
</style>

<template>
	<van-row class="inside--contentTwo">
		<van-row class="inside--contentTwo_box">
			<div
				v-for="(i, index) in singConfig"
				v-show="index < maxSign"
				:key="i.id"
				:class="i.is_con <= singDayList ? 'OuterLayRed' : ''"
				class="OuterLay"
			>
				<div
					:class="
						i.is_con <= singDayList
							? 'circleClaimed'
							: norSing !== 1 && i.is_con === singDayList + 1
							? 'TodayCan'
							: ''
					"
					class="circle"
				>
					<img
						v-if="i.is_con <= singDayList"
						src="../../../assets/images/userCenter/singin/lingqu.png"
					/>
					<span v-else>{{ i.money }}</span>
				</div>
				<span v-if="norSing !== 1 && i.is_con === singDayList + 1">今天</span>
				<span v-else>第{{ i.is_con }}天</span>
			</div>
		</van-row>
		<div v-show="moreSign && singConfig.length > maxSign">
			<p class="moreShow" @click="showMoreSign">
				<span>查看更多</span>
				<img src="../../../assets/images/userCenter/singin/insideMore.png" />
			</p>
		</div>
		<div
			:style="norSing === 1 ? 'background:#c5c3c3' : ''"
			class="SignNow"
			@click="norSing !== 1 ? $emit('conDay') : ''"
		>
			<img src="../../../assets/images/userCenter/singin/newEdition/signNow.png" />
			<span v-if="norSing !== 1">立即签到</span>
			<span v-else>已签到</span>
		</div>
	</van-row>
</template>

<script>
export default {
	name: "Sign",
	props: {
		singConfig: {
			type: [Array],
			default() {
				return [];
			}
		},
		singDayList: {
			type: Number,
			default() {
				return 0;
			}
		},
		norSing: {
			type: Number,
			default() {
				return "";
			}
		}
	},
	data: () => ({
		lingqu: require("../../../assets/images/userCenter/singin/lingqu.png"),
		money: require("../../../assets/images/userCenter/singin/money.png"),
		maxSign: 21,
		moreSign: true
	}),
	methods: {
		showMoreSign() {
			this.maxSign = this.singConfig.length;
			this.moreSign = false;
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/userCenter/singin/singin";
</style>

<template>
	<div class="liveResult">
		<div class="liveResult-box">
			<p>第{{ singleList.period }}期</p>
			<div class="liveResult-box_num">
				<div
					v-for="(i, index) in singleList.number"
					:key="index"
					class="liveResult-box_num_ber"
				>
					<span :class="['Dice', returnClass(i)]"></span>
				</div>
				<em class="liveResult-box_num_cut">|</em>
				<div class="liveResult-box_num_size">
					<span>{{ singleList.sum }}</span>
					<span>{{ singleList.single }}</span>
					<span>{{ singleList.size }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "LiveResult",
	props: {
		singleList: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	methods: {
		returnClass(v) {
			return [
				"Dice",
				{
					Dice2: v === 2,
					Dice3: v === 3,
					Dice4: v === 4,
					Dice5: v === 5,
					Dice6: v === 6
				}
			];
		}
	}
};
</script>

<style scoped lang="scss">
.liveResult {
	position: fixed;
	margin: auto;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	width: 250px;
	height: 100px;
	background-color: rgba(21, 25, 80, 0.9);
	color: #fff;
	border-radius: 5px;
	border: 1px solid rgb(62, 70, 169);
	@at-root #{&}-box {
		p {
			height: 60px;
			text-align: center;
			line-height: 50px;
		}
		@at-root #{&}_num {
			display: flex;
			justify-content: center;
			@at-root #{&}_ber {
				span {
					margin-left: 10px;
				}
			}
			@at-root #{&}_cut {
				color: #4f5483;
				margin: 0 5px 0 5px;
			}
			@at-root #{&}_size {
				line-height: 22px;
				span {
					margin: 0 5px 0 5px;
				}
			}
		}
	}
}
</style>
<style lang="scss">
.Dice {
	background: url(../../../assets/images/betting/dice.png);
	display: inline-block;
	background-size: 200% 600%;
	vertical-align: middle;
	height: 23px;
	width: 23px;
}
.Dice2 {
	background-position: 0 -100%;
}
.Dice3 {
	background-position: 0 -200%;
}
.Dice4 {
	background-position: 0 -300%;
}
.Dice5 {
	background-position: 0 -400%;
}
.Dice6 {
	background-position: 0 -500%;
}
</style>

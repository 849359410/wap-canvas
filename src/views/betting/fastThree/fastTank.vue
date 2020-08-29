<template>
	<van-row class="fastThreeTake">
		<van-col class="palyData" span="24">
			<div class="data-play c-play">
				<div
					v-for="(v, index) in playingFastThree"
					v-show="v.group.length !== 0"
					:key="index"
					:class="activePlayingType === v.index ? 'active' : ''"
					@click="setCreditPlay(v)"
				>
					<p>{{ v.name }}</p>
					<p class="p_odds">{{ v.odds }}</p>
					<p class="p2" :class="v.name === '和值' || v.name === '总和/两连' ? 'p5' : ''">
						<span v-for="i in v.class" :key="i.id" class="Dice" :class="i.class"></span>
					</p>
				</div>
			</div>
		</van-col>
	</van-row>
</template>

<script>
export default {
	name: "FastTank",
	props: {
		playingFastThree: {
			type: [Object, Array],
			default() {
				return {};
			}
		},
		fastPlayOnclick: {
			type: [Object, Array],
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			groupShow: false,
			activePlayingType: 0
		};
	},
	watch: {
		playingFastThree: {
			handler() {
				this.activePlayingType = 0;
				this.loadPlayingFastThree();
			},
			deep: true
		}
	},
	created() {
		this.loadPlayingFastThree();
	},
	methods: {
		setCreditPlay(v) {
			this.activePlayingType = v.index;
			this.$emit("childPlayingType", v);
		},
		// 显示玩法类型
		loadPlayingFastThree() {
			this.activePlayingType = this.playingFastThree[0].index;
			if (typeof this.playingFastThree === "object") {
				this.playingFastThree.forEach(i => {
					const Dice1 = { class: "Dice1" },
						Dice2 = { class: "Dice2" },
						Dice3 = { class: "Dice3" },
						Dice4 = { class: "Dice4" },
						Dice5 = { class: "Dice5" };
					i.class = [];
					if (i.index === 5) {
						i.class.push(Dice1);
						i.class.push(Dice2);
						i.class.push(Dice3);
					}
					if (i.index === 33 || i.index === 34) {
						i.class.push(Dice1);
						i.class.push(Dice1);
						i.class.push(Dice1);
					}
					if (i.index === 35) {
						i.class.push(Dice1);
						i.class.push(Dice3);
						i.class.push(Dice5);
					}
					if (i.index === 36) {
						i.class.push(Dice1);
						i.class.push(Dice2);
						i.class.push(Dice3);
					}
					if (i.index === 37 || i.index === 38) {
						i.class.push(Dice1);
						i.class.push(Dice1);
						i.class.push(Dice3);
					}
					if (i.index === 39) {
						i.class.push(Dice1);
						i.class.push(Dice4);
						i.class.push(Dice4);
					}
					if (i.index === 40) {
						i.class.push(Dice1);
						i.class.push(Dice2);
					}
				});
			}
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/betting/fastThree/fastTank";
</style>
<style>
.Dice {
	margin: 0 3px;
	background: url(../../../assets/images/betting/dice.png);
	display: inline-block;
	background-size: 200% 600%;
	vertical-align: middle;
	height: 20px;
	width: 20px;
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
.bigColor {
	color: #e5283b !important;
}
.smallColor {
	color: #272d94 !important;
}
.singleColor {
	color: #1bbe2c !important;
}
.doubleColor {
	color: #ff6a00 !important;
}
</style>

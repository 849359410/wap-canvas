<template>
	<van-row class="returnWater">
		<van-row class="returnWater-top">
			<van-row class="returnWater-top-context">
				<van-col span="12" class="mosaic"
					>有效打码
					<van-col>{{ list.all_valid_bet }}</van-col>
				</van-col>
				<van-col span="12" class="amount"
					>返水金额
					<van-col>{{ list.all_valid_fd }}</van-col>
				</van-col>
				<van-row class="split-line"></van-row>
				<van-col
					class="backwater-button"
					:class="receiveRebate ? 'canClick' : 'notClickable'"
					@click="receiveRebate ? pullDown() : ''"
					>领取返水</van-col
				>
			</van-row>
		</van-row>
		<van-row class="returnWater-central">
			<van-row class="returnWater-central-title">自助返水记录</van-row>
			<van-row class="returnWater-central-content">
				<van-col span="12" class="nowadays"
					>当日已返水
					<van-col><span>¥</span>{{ list.tday_fd }}</van-col>
				</van-col>
				<van-col span="12" class="thisWeek"
					>本周返水额
					<van-col><span>¥</span>{{ list.tweek_fd }}</van-col>
				</van-col>
			</van-row>
		</van-row>
		<van-row class="returnWater-bottom">
			<van-row class="title">
				<van-col span="8">游戏名称</van-col>
				<van-col span="8">有效投注</van-col>
				<van-col span="8">返水</van-col>
			</van-row>
			<van-row v-if="list.data" class="context">
				<van-col v-for="(v, index) in list.data" :key="index" span="24" class="context-van">
					<van-col span="8">{{ v.game_name }}</van-col>
					<van-col span="8">{{ v.valid_bet }}</van-col>
					<van-col span="8">{{ v.valid_fd }}</van-col>
				</van-col>
			</van-row>
			<van-row v-else class="bottom-area">
				<van-image :src="img" />
				<van-col class="text">您还未获得返水哦~</van-col>
				<router-link :to="{ name: 'BettingHall' }" class="btn">
					<van-button size="large">去投注，获得返水！</van-button>
				</router-link>
			</van-row>
		</van-row>
	</van-row>
</template>

<script>
export default {
	name: "Voluntary",
	data() {
		return {
			list: {},
			receiveRebate: false,
			img: require("../../../assets/images/userCenter/recording/zzfsWsj.png")
		};
	},
	created() {
		this.getReportSelf();
	},
	methods: {
		//初始化返水数据
		getReportSelf() {
			this.$api.request("API_GET_DISCOUNT_REPORT_SELF").then(
				res => {
					if (res.Data) {
						this.list = res.Data;
						if (this.list.data) {
							this.receiveRebate = true;
						} else {
							this.receiveRebate = false;
						}
					}
				},
				error => this.$root.$emit("handleError", error)
			);
		},
		//领取返水
		pullDown() {
			this.$api.request("API_POST_REPORT_SELF").then(
				res => {
					this.receiveRebate = false;
					this.list.all_valid_bet = 0;
					this.list.all_valid_fd = 0;
					this.getReportSelf();
					this.$root.$emit("handleSuccess", res.Msg);
				},
				error => {
					this.$root.$emit("handleError", error);
					this.receiveRebate = true;
				}
			);
		}
	}
};
</script>

<style lang="scss" scoped>
.returnWater {
	@at-root #{&}-top {
		width: 355px;
		height: 120px;
		border-radius: 5px;
		margin: 10px auto 10px auto;
		background-image: linear-gradient(#f8cf83, #e0b161);
		@at-root #{&}-context {
			height: 50%;
			.mosaic,
			.amount {
				height: 100%;
				color: #ffffff;
				text-align: center;
				font-size: 14px;
				margin-top: 20px;
				div {
					width: 100%;
					height: 20px;
					font-size: 20px;
					margin-top: 4px;
				}
			}
			.split-line {
				position: absolute;
				background: #ffffff;
				width: 1px;
				height: 15px;
				top: 47px;
				right: 50%;
			}
			.backwater-button {
				width: 130px;
				height: 30px;
				transform: translateX(-50%);
				margin-left: 50%;
				text-align: center;
				font-size: 14px;
				line-height: 33px;
				border-radius: 20px;
			}
			.canClick {
				color: #dc9825;
				background: #ffffff;
			}
			.notClickable {
				color: #727272;
				background-image: linear-gradient(#eeeeee, #d8d8d8);
			}
		}
	}
	@at-root #{&}-central {
		margin-top: 20px;
		@at-root #{&}-title {
			font-size: 14px;
			color: #1c1c1e;
			margin: 0 0 10px 10px;
		}
		@at-root #{&}-content {
			width: 100%;
			height: 74px;
			background: #ffffff;
			.nowadays,
			.thisWeek {
				height: 100%;
				padding-top: 16px;
				font-size: 12px;
				text-align: center;
				div {
					margin-top: 8px;
					font-size: 18px;
					width: 100%;
				}
			}
			.nowadays {
				div {
					span {
						font-size: 12px;
					}
					color: #bb8834;
				}
			}
			.thisWeek {
				div {
					span {
						font-size: 12px;
					}
					color: #fe5600;
				}
			}
		}
	}
	@at-root #{&}-bottom {
		margin-top: 10px;
		.title {
			font-size: 12px;
			text-align: center;
			margin-bottom: 10px;
		}
		.context {
			background: #ffffff;
			text-align: center;
			font-size: 12px;
			border-bottom: 1px solid #f0f0f0;
			.context-van {
				position: relative;
				margin: 10px 0;
			}
			.context-van:after {
				content: "";
				position: absolute;
				left: 14px;
				bottom: -10px;
				height: 1px;
				width: 345px;
				background-color: #eeeeee;
			}
		}
		.bottom-area {
			position: relative;
			.text {
				position: absolute;
				top: 200px;
				font-size: 14px;
				color: #666666;
				left: 50%;
				transform: translateX(-50%);
			}
			.btn {
				position: absolute;
				width: 335px;
				height: 44px;
				bottom: 30px;
				left: 50%;
				transform: translateX(-50%);
				button {
					height: 44px;
					font-size: 16px;
					color: #ffffff;
					background: #d7b074;
					border-radius: 5px;
				}
			}
		}
	}
}
</style>

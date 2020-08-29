<template>
	<van-row class="redPacket">
		<van-popup v-model="isOpenRp" class="redPacket--notice">
			<div v-show="isOpenRp" class="open-redPacket">
				<div v-if="RedPacketimg" @click="openKai">
					<img :src="RedPacketimg" />
				</div>
			</div>
		</van-popup>
		<van-popup v-model="isOpenSuccess" class="redPacket--notice">
			<div v-show="isOpenSuccess" class="openSuccess">
				<div class="openSuccess--box">
					<img src="../assets/images/index/redPack.png" alt="" />
					<div class="openSuccess--box__content">
						<div>{{ money }} <span>元</span></div>
						<div>已存入余额，可直接使用</div>
					</div>
					<van-button
						size="small"
						class="openSuccess--box__btn"
						:to="{ name: 'MoneyRecord' }"
						>查看红包记录</van-button
					>
				</div>
			</div>
		</van-popup>
	</van-row>
</template>
<script>
import { mapState } from "vuex";
export default {
	name: "RedPacket",
	props: {
		redPackData: {
			type: [Number, String],
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			isOpenRp: false,
			RedPacketimg: "",
			isSelectpType: false,
			money: 0,
			red: "",
			passiveSupported: false,
			noticeIsShow: false,
			isOpenSuccess: false,
			fetching: false
		};
	},
	computed: {
		...mapState({
			isLogin: state => state.user.isLogin
		})
	},
	created() {
		this.RedPacketimg = `https://mpm.cdn-6688.com/img/rpOpen.png`;
	},
	methods: {
		openKai() {
			this.isOpenSuccess = true;
			this.isOpenRp = false;
		},
		openRP() {
			if (!this.isLogin) return this.$root.$emit("handleError", "请先登录！");
			if (this.fetching) return;
			this.fetching = true;
			const reg_id = this.redPackData;
			this.$api.request("API_GET_RED_BAG_DO", { reg_id: reg_id }).then(
				success => {
					this.fetching = false;
					this.isOpenRp = true;
					this.money = success.Data;
				},
				error => {
					this.fetching = false;
					this.$root.$emit("handleError", error.Msg);
				}
			);
		}
	}
};
</script>

<style lang="scss">
.redPacket {
	width: 0;
	@at-root #{&}--notice {
		background-color: rgba(0, 0, 0, 0) !important;
		.open-redPacket {
			width: 130px;
			height: 170px;
		}
		.openSuccess {
			@at-root #{&}--box {
				text-align: center;
				position: relative;
				img {
					width: 260px;
					height: 257px;
				}
				@at-root #{&}__content {
					width: 100%;
					height: 85px;
					position: absolute;
					text-align: center;
					top: 27%;
					left: 3px;
					div {
						line-height: 27px;
						&:first-of-type {
							margin-top: 15px;
							color: #ff4c3a;
							font-size: 20px;
							span {
								font-size: 12px;
							}
						}
						&:nth-child(2) {
							color: #666666;
							font-size: 13px;
						}
					}
				}
				@at-root #{&}__btn {
					width: 157px;
					position: absolute;
					top: 72%;
					left: 50px;
					font-size: 18px;
					border-radius: 4px;
					background: #fff000;
					color: #c7423a;
					height: 39px;
				}
			}
		}
	}
}
</style>

<template>
	<van-dialog
		v-model="show"
		show-cancel-button
		close-on-click-overlay
		cancel-button-color="#007aff"
		cancel-button-text="直接游戏"
		confirm-button-text="转账进入"
		class="gameDialog"
		:before-close="cancel"
	>
		<van-dialog__header class="gameDialog_header">
			<div>额度转换</div>
			<van-tag class="div" round plain color="#ef384a" @click="$router.push('Recharge')"
				>去充值</van-tag
			>
		</van-dialog__header>
		<van-dialog__content class="gameDialog_content">
			<van-row class="gameDialog_content--item1">
				<van-col span="10">
					<div>系统余额</div>
					<span>{{ moneys.money }}元</span>
				</van-col>
				<van-col span="4">
					<van-image
						width="24px"
						:src="`https://static.cloudywoo.com/img/game/edzh___zr.png`"
					/>
				</van-col>
				<van-col span="10">
					<div>{{ moneys.vd_name }}</div>
					<span>{{ moneys.vd_money }}元</span>
				</van-col>
			</van-row>

			<van-row class="gameDialog_content--item2">
				<van-col>请输入转入金额</van-col>
			</van-row>

			<van-row class="gameDialog_content--item3">
				<van-col span="20">
					<input v-model="money" class="gameDialog_content--input" @input="putLimit" />
				</van-col>
				<van-col style="color: #c78d34" @click="money = Math.floor(moneys.money)"
					>全部</van-col
				>
			</van-row>
		</van-dialog__content>
	</van-dialog>
</template>
<script>
export default {
	props: {
		dialog: {
			type: Boolean,
			default: () => false
		},
		moneys: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			show: false,
			money: ""
		};
	},
	watch: {
		dialog(n) {
			this.show = n;
		},
		show(n) {
			this.$emit("change-model", n);
			if (!n) this.money = "";
		}
	},
	methods: {
		cancel(action, done) {
			const source_type = Number(this.$stores.get("de")) || 2;
			if (action === "cancel") {
				const params = { vd_type: this.moneys.vd_type, media: source_type };
				this.loginGame(params, done);
			} else if (action === "confirm") {
				if (Math.floor(this.moneys.money) === 0) {
					this.$root.$emit("handleError", "系统余额不足，请先充值");
					done(false);
					return;
				} else if (!this.money) {
					this.$root.$emit("handleError", "请输入转换金额");
					done(false);
					return;
				}
				const params = {
					money: this.money,
					vd_type: this.moneys.vd_type,
					media: source_type
				};
				this.loginGame(params, done);
			} else {
				done();
			}
		},
		putLimit() {
			let reg = /[0-9]*[1-9][0-9]*$/;
			if (!reg.test(this.money)) this.money = "";
			if (Number(this.money) > Math.floor(this.moneys.money))
				this.money = Math.floor(this.moneys.money);
		},
		loginGame(params, done) {
			let windowUrl = window.open("", "_self");
			this.$api.request("API_POST_LOGIN_FORWARD_GAME", params).then(
				success => {
					if (params.money) {
						this.$root.$emit("handleError", "转换成功。并跳转至对应的游戏平台");
					}
					windowUrl.location.href = success.Data.login_url;
				},
				error => {
					done(false);
					this.$root.$emit("handleError", error);
				}
			);
		}
	}
};
</script>
<style lang="scss">
.gameDialog {
	border-radius: 8px;
	width: 300px;
	.van-dialog__content {
		padding: 0 10px;
	}
	@at-root #{&}_header {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		div {
			font-size: 14px;
			font-weight: bold;
			color: #333;
			margin: 16px 0;
		}
		.div {
			position: absolute;
			right: 0;
			font-size: 12px;
			margin: 0;
		}
	}
	@at-root #{&}_content {
		@at-root #{&}--item1 {
			height: 60px;
			display: flex;
			align-items: center;
			border-radius: 4px;
			background: #f4f4f4;
			span {
				font-size: 12px;
				color: #ef384a;
				margin-top: 6px;
				display: block;
			}
		}
		@at-root #{&}--item2 div {
			margin: 10px 0 6px 10px;
			font-size: 12px;
			color: #666;
		}
		@at-root #{&}--item3 {
			display: flex;
			align-items: center;
			background: #f4f4f4;
			border-radius: 4px;
			margin-bottom: 20px;
			height: 33px;
			.van-cell {
				background: #f4f4f4;
				padding: 5px 10px;
			}
		}
		@at-root #{&}--input {
			height: 24px;
			border: none;
			width: 90%;
			background: #f4f4f4;
		}
	}
	.van-button--large {
		height: 40px;
	}
}
</style>

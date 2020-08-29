<template>
	<div v-if="game.length > 0">
		<van-grid :gutter="10" :column-num="2" class="game_list">
			<van-grid-item
				v-for="(v, key) in game"
				:key="key"
				class="imgItem"
				@click="InGameMoney(v)"
			>
				<van-image :src="`https://static.cloudywoo.com/img/game/${v.vd_type}.png`" />
				<van-image
					v-if="v.vd_state !== 1"
					class="shadow"
					src="https://static.cloudywoo.com/img/game/vd_cpdt.png"
				/>
			</van-grid-item>
		</van-grid>
		<Dialog :dialog="dialog" :moneys="moneys" @change-model="changeModel"></Dialog>
	</div>
</template>
<script>
import Dialog from "./dialog";
import { mapState } from "vuex";
export default {
	components: { Dialog },
	props: {
		game: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			dialog: false,
			moneys: {
				money: 0,
				vd_money: 0,
				vd_name: "",
				vd_type: ""
			}
		};
	},
	computed: {
		...mapState({
			liveLottery: state => state.lottery.liveLottery,
			isLogin: state => state.user.isLogin
		})
	},
	methods: {
		changeModel(isShow) {
			this.dialog = isShow;
		},
		InGameMoney(item) {
			if (!this.isLogin) return this.$router.push("/Login");
			if (item.vd_state !== 1) return;
			if (item.vd_type === "ig") return this.JumpIG();
			this.moneys.vd_name = item.vd_name;
			new Promise(resolve => {
				this.$api.request("API_GET_VD_MONEY_DATA").then(
					success => {
						resolve();
						const data = success.Data;
						this.moneys.money = data.user_money.toFixed(3);
						this.moneys.vd_type = item.vd_type;
						switch (item.vd_type) {
							case "bg_dz":
							case "bg":
							case "bg_by":
								this.moneys.vd_money = data.bg_money;
								// this.moneys.vd_type = "bg";
								break;
							case "ag_dz":
							case "ag":
							case "ag_by":
								this.moneys.vd_money = data.ag_money;
								// this.moneys.vd_type = "ag";
								break;
							case "ky":
								this.moneys.vd_money = data.ky_money;
								// this.moneys.vd_type = "ky";
								break;
						}
					},
					error => this.$root.$emit("handleError", error)
				);
			}).then(() => {
				this.dialog = true;
			});
		},
		JumpIG() {
			if (this.liveLottery.tra_state !== 1) {
				return this.$root.$emit("handleError", "彩种已停用");
			} else if (this.liveLottery.tra_maint !== 1) {
				return this.$root.$emit("handleError", "彩种已维护");
			}
			this.$router.push({ name: "liveIndex", params: { id: this.liveLottery.fc_id } });
		}
	}
};
</script>
<style lang="scss">
.game_list {
	padding-top: 10px;
	.van-grid-item__content {
		padding: 0;
	}
	.imgItem {
		position: relative;
		.shadow {
			position: absolute;
			top: 0;
			left: 0;
		}
	}
}
</style>

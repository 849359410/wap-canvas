<template>
	<van-dialog
		v-model="msgShow.isShow"
		title="温馨提示"
		class="allAlert"
		show-cancel-button="true"
		:confirm-button-text="msgShow.confirmButtonText"
		:confirm-button-color="msgShow.confirmButtonColor"
		:cancel-button-text="msgShow.cancelButtonText"
		:cancel-button-color="msgShow.cancelButtonColor"
		:close-on-click-overlay="msgShow.closeOnClickOverlay"
		width="270px"
		@confirm="getGo"
		@cancel="callOf"
	>
		{{ msgShow.text }}
	</van-dialog>
</template>

<script>
export default {
	name: "QkAlert",
	props: {
		msgShow: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	methods: {
		callOf() {
			if (this.msgShow.cancelButtonRouter) {
				return this.$router.push({ name: this.msgShow.cancelButtonRouter });
			}
			if (this.$route.name === "UpdatePwd") {
				return this.$router.push({ name: "MemberCenter" });
			}
			this.$emit("closeShow");
		},
		getGo() {
			if (this.msgShow.confirmButtonRouter === "newDevelopment") {
				this.$emit("newDevelopment");
			} else {
				if (this.$route.name === "AddBank") {
					this.$emit("closeShow", true);
					this.$router.push({ name: this.msgShow.path, params: { num: "1" } });
				} else {
					if (this.msgShow.path) {
						this.$router.push({
							name: this.msgShow.path,
							params: { num: "1", active: "b" }
						});
					}
				}
			}
		}
	}
};
</script>

<style lang="scss">
.van-dialog__content {
	color: #333;
	padding: 20px 12px;
	text-align: center;
	font-size: 14px;
}
</style>

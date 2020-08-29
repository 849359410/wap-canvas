<template>
	<van-dialog
		v-model="passWordShow"
		show-cancel-button
		class="turnDialog"
		cancel-button-color="#ef384a"
		@confirm="confirm"
		@cancel="cancel"
	>
		<van-row>
			<van-col class="turnDialog-title" span="24">请输入安全密码</van-col>
			<van-col class="turnDialog-money" span="24">
				¥<span>{{ turnMoney }}</span>
			</van-col>
			<van-col class="turnDialog-tips" span="24">
				<span>付款方式</span>
				<span class="right">{{ tips }}</span>
			</van-col>
			<van-col class="turnDialog-input" span="24">
				<!-- 密码输入框 -->
				<van-password-input
					:value="passWord"
					:focused="showKeyboard"
					info="请输入您的安全密码"
					length="4"
					@focus="getFocus()"
				/>
			</van-col>
		</van-row>
	</van-dialog>
</template>

<script>
export default {
	name: "TurnDialog",
	props: {
		passWordShow: {
			type: Boolean,
			default: () => false
		},
		turnMoney: {
			type: [String, Number],
			default: () => ""
		},
		tips: {
			type: String,
			default: () => ""
		},
		showKeyboard: {
			type: Boolean,
			default: () => false
		}
	},
	data() {
		return {
			passWord: ""
		};
	},
	methods: {
		getFocus() {
			this.$parent.showKeyboard = true;
		},
		getInput(key) {
			this.passWord = (this.passWord + key).slice(0, 4);
		},
		getDelete() {
			this.passWord = this.passWord.slice(0, this.passWord.length - 1);
		},
		confirm() {
			this.$emit("postPass", this.passWord);
		},
		cancel() {
			this.$parent.passWordShow = false;
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/yuBao/turnDialog";
</style>

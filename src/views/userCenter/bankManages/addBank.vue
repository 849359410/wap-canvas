<template>
	<van-row class="bankManages">
		<div class="bankBox--content_chose">
			<van-cell-group>
				<van-field
					v-for="(item, index) in addLink"
					:key="index"
					v-model="item.value"
					:is-link="item.isLink"
					:label="item.text"
					:placeholder="item.ber"
					:maxlength="item.max"
					input-align="left"
					:readonly="item.state"
					@input="dealWith(item)"
					@click="paymentBank(item)"
				></van-field>
			</van-cell-group>
		</div>
		<div class="bankBox--content_comfirmUpdate" @click="checkCard">确定添加</div>
		<!--银行选择 -->
		<qk-alert v-if="isShowObj.isShow" :msg-show="isShowObj" @closeShow="closeShow"></qk-alert>
		<picker :show-picker="showBank" @getback="getback" @closeback="closeback"></picker>
	</van-row>
</template>

<script>
import { BANK_LISTS } from "@server/singularity";
import QkAlert from "../../../components/qkAlert";
import withdrawals from "../../../mixins/withdrawals";
import picker from "../../../components/picker";
import { mapState } from "vuex";
export default {
	name: "BankList",
	components: {
		QkAlert,
		picker
	},
	mixins: [withdrawals],
	data() {
		return {
			nameMsg: "*输入内容需与真实姓名相同",
			addData: {
				card_true: "",
				card_num: "",
				card_address: "",
				card_subbranch: "",
				name: "",
				card_id: "",
				id: -1
			},
			showBank: false,
			back: "",
			dataBankName: BANK_LISTS,
			bankName: "",
			addLink: [
				{
					text: "出款银行:",
					ber: "*请选择银行",
					key: "card_id",
					value: "",
					isLink: true,
					state: true
				},
				{
					text: "支行名称:",
					ber: "*请填写支行名称",
					key: "card_subbranch",
					max: "30",
					value: ""
				},
				{
					text: "开户地址:",
					ber: "*请填写开户地址",
					key: "card_address",
					max: "30",
					value: ""
				},
				{
					text: "持卡人:",
					ber: "*输入内容需与真实姓名相同",
					key: "name",
					value: "",
					state: true
				},
				{
					text: "银行账号:",
					ber: "*请输入16-19位纯数字",
					key: "card_num",
					max: "26",
					value: ""
				},
				{
					text: "确认账号:",
					ber: "*确认账号，须与银行账号一致",
					key: "card_true",
					max: "26",
					value: ""
				}
			]
		};
	},
	computed: {
		...mapState({
			userMessage: state => state.user.userMessage
		})
	},
	created() {
		this.takeUser();
	},
	methods: {
		// 显示出款银行弹框
		paymentBank(item) {
			if (item.text === "出款银行:") this.showBank = true;
		},
		// 出款银行
		getback(show, value, id) {
			this.showBank = show;
			this.addLink.forEach(v => {
				if (v.text === "出款银行:") {
					v.value = value;
					this.addData.card_id = id;
				}
			});
		},
		// 关闭出款银行弹框
		closeback(show) {
			this.showBank = show;
		},
		// 接口参数
		dealWith(item) {
			switch (item.key) {
				case "card_subbranch":
					this.addData.card_subbranch = item.value;
					break;
				case "card_address":
					this.addData.card_address = item.value;
					break;
				case "card_num":
					this.addData.card_num = item.value;
					break;
				case "card_true":
					this.addData.card_true = item.value;
					break;
				case "name":
					this.addData.name = item.value;
					break;
			}
		},
		//判断有无真实姓名
		takeUser() {
			if (this.userMessage.name) {
				this.addData.name = this.userMessage.name;
				this.addLink[3].value = this.userMessage.name;
				this.addLink[3].state = true;
			} else {
				this.$api.request("API_GET_USER").then(success => {
					let data = success.Data;
					if (data && data.name) {
						this.addLink[3].value = data.name;
						this.addLink[3].key = data.name;
						this.addLink[3].state = true;
						this.$store.dispatch("setUserMessage", data);
					} else {
						this.addLink[3].state = false;
					}
				});
			}
		},
		// 确定添加
		addBankData() {
			this.$api.request("API_POST_INSERT_USER_BANK", this.addData).then(
				success => {
					setTimeout(() => {
						this.$helps.hideLoading();
					}, 500);
					this.$root.$emit("handleSuccess", success.Msg);
					this.$router.push({ name: "BankManages" });
				},
				error => {
					this.$helps.hideLoading();
					this.$root.$emit("handleError", error.Msg);
				}
			);
		},
		// 校验规则
		checkCard() {
			if (this.addData.card_id === "" || this.addData.card_id === 0) {
				this.$root.$emit("handleError", "出款银行不能为空");
				return;
			}
			if (!this.addData.card_subbranch) {
				this.$root.$emit("handleError", "支行名称不能为空");
				return;
			}
			if (!this.addData.card_address) {
				this.$root.$emit("handleError", "开户地址不能为空");
				return;
			}
			if (!this.addData.name) {
				this.$root.$emit("handleError", "持卡人不能为空");
				return;
			}
			if (!this.addData.card_num) {
				this.$root.$emit("handleError", "银行账号不能为空");
				return;
			}
			if (!this.addData.card_true) {
				this.$root.$emit("handleError", "确认账号不能为空");
				return;
			}
			if (/[·•●[\]]/im.test(this.addData.name)) {
				if (
					!/^[\u4E00-\u9FA5\uf900-\ufa2d]+[·•●][\u4E00-\u9FA5\uf900-\ufa2d]+$/.test(
						this.addData.name
					)
				) {
					return this.$root.$emit("handleError", "姓名格式错误");
				}
			} else {
				if (!/^[\u4E00-\u9FA5\uf900-\ufa2d]{2,10}$/.test(this.addData.name)) {
					return this.$root.$emit("handleError", "持卡人格式错误【2~10中文字符】");
				}
			}
			if (!/^([\d]{16,19})$/.test(this.addData.card_num)) {
				this.$root.$emit("handleError", "银行卡号位数不正确");
				return;
			}
			if (this.addData.card_true !== this.addData.card_num) {
				this.$root.$emit("handleError", "两次银行账号输入不一致");
				return;
			}
			if (!this.userMessage.name) {
				this.isShowObj.isShow = true;
				this.isShowObj.text =
					"您还没有绑定真实姓名，请确认持卡人和真实姓名保持一致，系统将自动绑定真实姓名，确认提交？";
				this.isShowObj.path = "BankManages";
			} else {
				this.$helps.showLoading();
				this.addBankData();
			}
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/views/userCenter/bank/bankManages";
</style>
<style lang="scss"></style>

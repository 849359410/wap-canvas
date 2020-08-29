<script>
import homeHead from "../../components/homeHead";
import indexBody from "./IndexBody";
import Bar from "./scrollBar";
import Navs from "./navs";
import Popular from "./popular";
import Winning from "./winning";
import RedPacketBox from "./redPacketBox";
export default {
	name: "Index",
	data() {
		return {
			dataList: []
		};
	},
	created() {
		this.popUp();
	},
	methods: {
		// 公告弹框
		popUp() {
			if (this.$route.params.active) {
				this.$api.request("API_GET_USERNAME_LOGIN_NOTICE").then(success => {
					let datas = success.Data;
					if (datas) {
						datas.forEach(v => {
							v["accumulate"] = true;
						});
						this.dataList = datas;
					}
				});
			}
		}
	},
	render() {
		return (
			<div>
				<homeHead></homeHead>
				<indexBody dataList={this.dataList}></indexBody>
				<Bar></Bar>
				<Navs></Navs>
				<Popular></Popular>
				<Winning></Winning>
				<RedPacketBox></RedPacketBox>
			</div>
		);
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/home/Index";
</style>

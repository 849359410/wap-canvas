<script>
import model from "../../mixins/model";
export default {
	name: "List",
	mixins: [model],
	props: {
		list: {
			type: [Object, Array],
			default() {
				return {};
			}
		}
	},
	render() {
		return (
			<van-col class="result_main--number" span="24">
				{this.resultModel(this.list)}
			</van-col>
		);
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/result/list";
</style>

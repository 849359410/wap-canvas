<script>
import Lottery from "../../mixins/lotteryResult";
import model from "../../mixins/model";
export default {
	name: "PlanDraw",
	mixins: [Lottery, model],
	render() {
		return <div class="luckyResultSecond">{this.lotteryModel()}</div>;
	}
};
</script>

<style scoped lang="scss">
@import "../../assets/css/mixins/mixin";
.luckyResultSecond {
	position: absolute;
	top: 22px;
	left: 10px;
	div {
		display: inline-block;
	}
	.first {
		float: left;
		line-height: 32px;
	}
	.thisBoll {
		margin-top: 6px;
		margin-left: 10px;
		overflow: hidden;
		.luckyCarList {
			em {
				border-radius: 4px !important;
			}
		}
		.resultList {
			width: 100%;
			display: inline-block;
			margin-bottom: 4px;
			em {
				display: inline-block;
				text-align: center;
				font-size: 12px;
				width: 20px;
				height: 20px;
				line-height: 20px;
				color: #ffffff;
				margin-right: 1px;
				@include bgColor(#ff8d91);
				border-radius: 50%;
				font-style: inherit;
			}
		}
		.timeTimeNum {
			float: left;
			display: block;
			width: auto;
		}
		.timeTimeCon {
			float: left;
			display: block;
			margin-top: 3px;
			i {
				font-style: normal;
				color: #1f1f21;
				margin-left: 15px;
			}
		}
		.timeTime {
			i {
				font-style: normal;
				color: #1f1f21;
				margin-left: 21px;
			}
		}
	}
	.results_more {
		line-height: 32px;
		float: right;
		font-size: 13px;
		@include fontColor(#63b7ff);
		@at-root #{&}--i {
			margin-left: 4px;
		}
	}
}
</style>

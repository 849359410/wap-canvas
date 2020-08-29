<template>
	<v-ons-page>
		<register-head></register-head>
		<div class="AllianceBox">
			<div>
				<p v-for="(v, k) in Alliance" :key="k">
					<span v-html="v.title"></span>
					<span v-html="v.content"></span>
				</p>
			</div>
		</div>
	</v-ons-page>
</template>

<script>
import { AllianceAgreement } from "../../config/allianceAgreement";
import RegisterHead from "./register_head";
export default {
	name: "AllianceAgreement",
	components: {
		RegisterHead
	},
	data() {
		return {
			Alliance: AllianceAgreement
		};
	}
};
</script>

<style scoped lang="scss">
.AllianceBox {
	position: absolute;
	height: 100%;
	overflow: scroll;
	top: 10%;
	margin-bottom: 30px;
	div {
		width: 90%;
		background-color: white;
		border-radius: 4px;
		-webkit-box-shadow: 0 2px 4px 0 rgba(184, 184, 184, 0.5);
		box-shadow: 0 2px 4px 0 rgba(184, 184, 184, 0.5);
		height: auto;
		padding: 7px;
		z-index: 3;
		margin: 0 auto 40.53333vw auto;
	}
	p {
		font-size: 12px;
		span {
			color: #ff1042;
			line-height: 20px;
		}
		span:last-child {
			display: inline-block;
			text-indent: 2em;
			color: #999999;
		}
	}
}
</style>
<style lang="scss">
.page__content {
	z-index: 10;
}
</style>

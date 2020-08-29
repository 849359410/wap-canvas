<template>
	<div class="longRule">
		<div class="long-info">
			<div class="content-long">
				<p>
					长龙助手是对快3、时时彩、PK10、六合彩特定玩法的“大小单双”开奖结果进行跟踪统计，并可进行快捷投注的助手工具；
				</p>
				<p>
					每期出现大、小、单、双的概率为50%，如果连续2期及以上的开奖结果相同，称之为“长龙”，通常会采用倍投的方式进行“砍龙”或“顺龙”。
				</p>
				<h3>什么是砍龙？</h3>
				<p class="noStyle">
					如连续开5期“单”，可以选择“双”进行投注，这种投注方案称之为“砍龙”；
				</p>
				<h3>什么是顺龙？</h3>
				<p class="noStyle">
					如连续开5期“单”，继续选择“单”进行投注，这种投注方案称之为“顺龙”；
				</p>
				<h3>什么是倍投？</h3>
				<p class="noStyle">
					倍投是一种翻倍投注方式，是为了保障能够在“砍龙”或“顺龙”的过程中持续盈利的一种投注方式。
				</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "LongRule"
};
</script>

<style scoped lang="scss">
@import "../../assets/css/views/chimera/longRule";
.longRule {
	.long-info {
		.content-long {
			h3:after {
				content: "";
				background-image: url(../../assets/images/chimera/long_rule.png);
				background-size: 100% 100%;
				position: absolute;
				left: 0;
				top: 3px;
				width: 23px;
				height: 21px;
			}
		}
	}
}
</style>

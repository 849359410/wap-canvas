<template>
	<div class="liveIndex">
		<div class="liveIndex-top">
			<live-various
				:audio-mute="audioMute"
				:bgm-effect="bgmEffect"
				:various-data="variousData"
				:results-data="resultsData"
				@getStatisticsSecond="getStatisticsSecond"
				@stopBetting="stopBetting"
			></live-various>
			<live-video :video-data="videoData" :line-switch="lineSwitch"></live-video>
			<live-area :page-index="pageIndex" @getPageIndex="getPageIndex"></live-area>
			<div v-show="pageIndex === 0">
				<live-tank :play-id="Number(id)" @getTank="getTank"></live-tank>
				<live-table
					ref="tab"
					:credit-playing="creditPlaying"
					:bet-money="betMoney"
					:audio-mute="audioMute"
					:bgm-effect="bgmEffect"
					:game-effect="gameEffect"
					:various-data="variousData"
					@getTotal="getTotal"
					@getDialog="getDialog"
				></live-table>
				<live-chip
					@getMoney="getMoney"
					@getWithdraw="getWithdraw"
					@getConfirm="getConfirm"
				></live-chip>
				<live-total :total="total"></live-total>
			</div>
			<div v-show="pageIndex === 1">
				<live-more></live-more>
			</div>
		</div>
		<live-play-bet v-if="playShow" class="liveIndex-gif"></live-play-bet>
		<live-stop-bet v-if="stopShow" class="liveIndex-gif"></live-stop-bet>
		<live-bar v-show="pageIndex === 0" :results-data="resultsData"></live-bar>
		<!-- 提示弹窗 -->
		<div class="liveIndex-dialog">
			<live-hint v-show="hintObj.show" :hint-obj="hintObj"></live-hint>
			<!-- 设置线路 -->
			<live-line v-show="lineShow" @getSetLine="getLine"></live-line>
			<!-- 设置音效 -->
			<live-set-up v-show="musicShow" ref="setUp" @getSetMusic="getSetMusic"></live-set-up>
			<live-dow-effects
				v-if="dowEffectsShow"
				@getCancelDow="getCancelDow"
				@getConfirmDow="getConfirmDow"
				@getClose="getClose"
			></live-dow-effects>
			<liveTopUp v-if="topUp" @getClose="getTopUpClose"></liveTopUp>
			<live-maintain v-if="maintainObj.show" :maintain-obj="maintainObj"></live-maintain>
		</div>
	</div>
</template>

<script>
import liveVideo from "./liveVideo";
import liveArea from "./liveArea";
import liveTank from "./liveTank";
import liveTable from "./liveTable";
import liveChip from "./liveChip";
import liveTotal from "./liveTotal";
import liveBar from "./liveBar";
import liveVarious from "./liveVarious";
import liveMore from "./liveMore";
import liveHint from "./dialog/liveHint";
import liveLine from "./dialog/liveLine";
import liveSetUp from "./dialog/liveSetUp";
import liveDowEffects from "./dialog/liveDowEffects";
import liveTopUp from "./dialog/liveTopUp";
import liveMaintain from "./dialog/liveMaintain";
import livePlayBet from "./livePlayBet";
import liveStopBet from "./liveStopBet";
import liveSocket from "./js/liveSocket";
import { Bus } from "../../main";
import { mapState } from "vuex";

export default {
	name: "Index",
	components: {
		liveVideo,
		liveArea,
		liveTank,
		liveTable,
		liveChip,
		liveTotal,
		liveBar,
		liveVarious,
		liveMore,
		liveHint,
		liveLine,
		liveSetUp,
		liveDowEffects,
		liveTopUp,
		liveMaintain,
		livePlayBet,
		liveStopBet
	},
	mixins: [liveSocket],
	props: {
		id: {
			type: [Number, String],
			default: ""
		}
	},
	data() {
		return {
			creditPlaying: [],
			betMoney: 10,
			total: {
				money: 0,
				numbers: 0
			},
			pageIndex: 0,
			audioMute: true, // 全体是否禁音（游戏音乐&bgm）
			bgmEffect: true, // bmg音效是否静音
			gameEffect: true, // 游戏音效是否静音
			bgmIndex: 1,
			hintObj: {},
			bgmAudio: null,
			lineShow: false,
			musicShow: false,
			lineSwitch: 1,
			dialogState: 1,
			dowEffectsShow: true,
			topUp: false,
			maintainObj: {
				show: false,
				text: ""
			},
			playShow: false,
			stopShow: false
		};
	},
	computed: {
		...mapState({
			liveLottery: state => state.lottery.liveLottery
		})
	},
	destroyed() {
		this.bgmAudio.muted = true;
		this.bgmAudio = null;
		this.storageState(true);
		Bus.$off("getSetAudio");
		Bus.$off("getSetLine");
		Bus.$off("getSetBgmMusic");
	},
	created() {
		let bgmMusic = sessionStorage.getItem("bgmMusic");
		this.getSocket();
		this.getMaintain();
		// 设置bgm
		this.$nextTick(() => {
			this.storageState(true, "getSetOff");
			this.bgmAudio = new Audio(require(`./audio/bgm${this.bgmIndex}.mp3`));
			if (!this.dowEffectsShow) this.bgmAudio.play();
			this.bgmAudio.muted = this.audioMute;
			if (bgmMusic) this.bgmAudio.muted = JSON.parse(bgmMusic);
			this.bgmAudio.addEventListener("ended", () => {
				if (this.bgmAudio !== null) {
					if (this.bgmIndex === 3) this.bgmIndex = 1;
					else this.bgmIndex++;
					this.bgmAudio.src = require(`./audio/bgm${this.bgmIndex}.mp3`);
					this.bgmAudio.play();
				}
			});
		});
		Bus.$on("getSetAudio", state => {
			this.audioMute = state;
			this.bgmAudio.muted = state;
			if (!state) this.bgmAudio.play();
			this.storageState(state, "getSetOff");
		});
		Bus.$on("getSetLine", () => {
			this.lineShow = !this.lineShow;
			this.musicShow = false;
		});
		Bus.$on("getSetBgmMusic", () => {
			this.musicShow = !this.musicShow;
			this.lineShow = false;
		});
	},
	methods: {
		getMaintain() {
			if (this.liveLottery.tra_state !== 1 || this.liveLottery.tra_maint !== 1) {
				this.$router.push({ name: "pageLiveIndex" });
			}
		},
		getTopUpClose() {
			this.topUp = false;
		},
		getTank(val) {
			this.creditPlaying = val;
		},
		getMoney(money) {
			this.betMoney = money;
		},
		// 撤回
		getWithdraw() {
			this.$refs.tab.getStructure(this.creditPlaying[0]);
		},
		getTotal(total) {
			this.total.money = total.money;
			this.total.numbers = total.numbers;
		},
		getConfirm() {
			this.$refs.tab.betsOrderFast();
		},
		getStatisticsSecond() {
			this.$refs.tab.getSecond();
		},
		getPageIndex(index) {
			this.pageIndex = index;
		},
		getDialog(obj) {
			this.hintObj = this.$helps.cloneDeep(obj);
			this.dialogState++;
			if (this.dialogState > 2) return;
			setTimeout(() => {
				this.dialogState = 1;
				this.hintObj.show = false;
				this.$refs.tab.hintObj.show = true;
			}, 3000);
		},
		getSetMusic(name, state) {
			switch (name) {
				case "music":
					this.bgmAudio.muted = state;
					if (!state) this.bgmAudio.play();
					sessionStorage.setItem("bgmMusic", state);
					break;
				case "effects":
					this.bgmEffect = state;
					sessionStorage.setItem("bgmEffect", state);
					break;
				case "game":
					this.gameEffect = state;
					sessionStorage.setItem("gameEffect", state);
					break;
			}
		},
		getLine(state) {
			this.lineSwitch = state;
			Bus.$emit("getSetLineVideo");
		},
		stopBetting() {
			let period = sessionStorage.getItem("period");
			if (Number(period) !== this.variousData.period) this.$refs.tab.getNoAudio();
		},
		getCancelDow() {
			this.dowEffectsShow = false;
			this.storageState(true, "getSetOff");
			// 静音播放音乐
			Bus.$emit("getMutePlay");
			this.playAudio.muted = true;
			this.playAudio.play();
		},
		getConfirmDow() {
			this.storageState(false, "getSetOff");
			this.dowEffectsShow = false;
			this.bgmAudio.muted = false;
			this.bgmAudio.play();
			Bus.$emit("getSetAudioBgm");
			Bus.$emit("getMutePlay");
			this.playAudio.muted = true;
			this.playAudio.play();
		},
		getClose() {
			this.dowEffectsShow = false;
		},
		storageState(state, getSetOff) {
			if (getSetOff) this.$refs.setUp.getSetOff(state);
			sessionStorage.setItem("audioMute", state);
			sessionStorage.setItem("bgmMusic", state);
			sessionStorage.setItem("bgmEffect", state);
			sessionStorage.setItem("gameEffect", state);
			this.bgmEffect = state;
			this.gameEffect = state;
		}
	}
};
</script>

<style scoped lang="scss">
.liveIndex {
	height: 100%;
	background-color: #010c2c;
	position: relative;
	@at-root #{&}-top {
		position: relative;
		height: 88%;
	}
	@at-root #{&}-gif {
		position: absolute;
		left: 0;
		top: 50%;
		margin-top: -50px !important;
		height: 60px !important;
	}
}
</style>

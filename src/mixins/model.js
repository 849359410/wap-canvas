import LotteryResult from "./lotteryResult";
export default {
	mixins: [LotteryResult],
	methods: {
		returnClass(v) {
			return [
				"Dice",
				{
					Dice2: v === 2,
					Dice3: v === 3,
					Dice4: v === 4,
					Dice5: v === 5,
					Dice6: v === 6
				}
			];
		},
		// 信用投注页面开奖结果
		lotteryModel() {
			if (!this.firstHistory.number) return;
			if (this.isHappyLottery) {
				// 快乐8
				return (
					<div class="thisBoll">
						{this.firstHistory.number.map(i => {
							return (
								<span class="resultList">
									{i.map(k => {
										return <em>{k}</em>;
									})}
								</span>
							);
						})}
					</div>
				);
			} else if (this.isMarkSixLottery || this.isLuckyLottery) {
				// 六合彩&&蛋蛋
				return (
					<div class="thisBoll">
						<span class="resultList">
							{this.firstHistory.number.map(i => {
								return <em class={i.waveColor}>{i.id}</em>;
							})}
						</span>
					</div>
				);
			} else if (this.isTimeTime) {
				// 时时彩
				return (
					<div class="thisBoll">
						<span class="resultList timeTimeNum">
							{this.firstHistory.number.map(i => {
								return <em>{i}</em>;
							})}
						</span>
						<span class="timeTimeCon">
							<i>{this.firstHistory.sum}</i>
							<i>{this.firstHistory.size}</i>
							<i>{this.firstHistory.single}</i>
						</span>
					</div>
				);
			} else if (this.isLuckyCar) {
				// 幸运赛车
				return (
					<div class="thisBoll">
						<span class="resultList luckyCarList">
							{this.firstHistory.luckyNumber.map(i => {
								return <em class={i.class}>{i.number1}</em>;
							})}
						</span>
					</div>
				);
			} else if (this.isFastThree) {
				return (
					<div class="thisBoll">
						{this.firstHistory.number.map(i => {
							return <span class={["Dice", this.returnClass(i)]}></span>;
						})}
					</div>
				);
			} else {
				return (
					<div class="thisBoll">
						<span class="resultList">
							{this.firstHistory.number.map(i => {
								return <em>{i}</em>;
							})}
						</span>
					</div>
				);
			}
		},
		openLotteryModel(i) {
			if (this.isHappyLottery) {
				return (
					<van-col span="19" class="resultsList_list_number">
						{i.number.map(j => {
							return (
								<span>
									{j.map(k => {
										return <em>{k}</em>;
									})}
								</span>
							);
						})}
					</van-col>
				);
			} else if (this.isTimeTime) {
				return (
					<van-row class="resultsList_list-lucky">
						<van-col span="10">
							{i.number.map(j => {
								return <em>{j}</em>;
							})}
						</van-col>
						<van-col span="3">
							<i>{i.sum}</i>
						</van-col>
						<van-col span="3">
							<i>{i.size}</i>
						</van-col>
						<van-col span="3">
							<i>{i.single}</i>
						</van-col>
					</van-row>
				);
			} else if (this.isLuckyLottery) {
				return (
					<van-col span="19" class="resultsList_list-lucky">
						<span>
							{i.number.map(j => {
								return <em class={j.waveColor}>{j.id}</em>;
							})}
						</span>
					</van-col>
				);
			} else if (this.isMarkSixLottery) {
				return (
					<van-col span="19" class="resultsList_list_number sixLottery">
						<p>
							<span>
								{i.number.map(j => {
									return <em class={j.waveColor}>{j.id}</em>;
								})}
							</span>
							<span class="zodiac">
								{i.number.map(j => {
									return <em>{j.zodiac}</em>;
								})}
							</span>
						</p>
					</van-col>
				);
			} else if (this.isLuckyCar) {
				return (
					<van-col span="19" class="luckCarList">
						{i.luckyNumber.map(j => {
							return <em class={j.class}>{j.number1}</em>;
						})}
					</van-col>
				);
			} else if (this.isFastThree) {
				return (
					<van-row class="resultsList_list-lucky">
						<van-col span="7">
							{i.number.map(j => {
								return <span class={["Dice", this.returnClass(j)]}></span>;
							})}
						</van-col>
						<van-col span="4">
							<i>{i.sum}</i>
						</van-col>
						<van-col span="4">
							<i class={[this.changeColor(i.size)]}>{i.size}</i>
						</van-col>
						<van-col span="4">
							<i class={[this.changeColor(i.single)]}>{i.single}</i>
						</van-col>
					</van-row>
				);
			} else {
				return (
					<van-col span="19">
						{i.number.map(j => {
							return <em>{j}</em>;
						})}
					</van-col>
				);
			}
		},
		changeColor(name) {
			let className = "";
			switch (name) {
				case "大":
					className = "bigColor";
					break;
				case "小":
					className = "smallColor";
					break;
				case "单":
					className = "singleColor";
					break;
				case "双":
					className = "doubleColor";
					break;
				case "豹子":
					className = "leopard";
					break;
				default:
					className = "numerical";
			}
			return className;
		},
		resultModel(i) {
			if (this.isHappyLottery) {
				return (
					<div>
						{i.number.map(j => {
							return (
								<p>
									{j.map(code => {
										return <span>{code}</span>;
									})}
								</p>
							);
						})}
					</div>
				);
			} else if (this.isTimeTime) {
				return (
					<div class="timeTime_content">
						<p class="left">
							{i.number.map(code => {
								return <span>{code}</span>;
							})}
						</p>
						<p class="right">
							<i>{i.sum}</i>
							<i>{i.size}</i>
							<i>{i.single}</i>
						</p>
					</div>
				);
			} else if (this.isLuckyLottery) {
				return (
					<div>
						<p>
							{i.number.map(code => {
								return <span class={code.waveColor}>{code.id}</span>;
							})}
						</p>
					</div>
				);
			} else if (this.isLuckyCar) {
				return (
					<div>
						<p>
							{i.luckyNumber.map(code => {
								return <span class={code.class}>{code.number1}</span>;
							})}
						</p>
						<p class="luckyList">
							<span>{i.sum}</span>
							<span>{i.size}</span>
							<span v-show={i.single}>{i.single}</span>
							{i.luckyZodiac.map(j => {
								return <span>{j}</span>;
							})}
						</p>
					</div>
				);
			} else if (this.isMarkSixLottery) {
				return (
					<div class="sixLottery">
						<p class="sixNumber">
							{i.number.map(code => {
								return <span class={code.waveColor}>{code.id}</span>;
							})}
						</p>
						<p class="zodiac">
							{i.number.map(code => {
								return <span>{code.zodiac}</span>;
							})}
						</p>
					</div>
				);
			} else if (this.isFastThree) {
				// 快三
				return (
					<div class="fast_three_history_div">
						<p class="fast_three_history_p1">
							{i.number.map(code => {
								return <span>{code}</span>;
							})}
						</p>
						<p class="fast_three_history_p2">
							<span class={this.changeColor(i.sum)}>{i.sum}</span>
							<span class={this.changeColor(i.size)}>{i.size}</span>
							<span class={this.changeColor(i.single)}>{i.single}</span>
						</p>
					</div>
				);
			} else {
				return (
					<div>
						<p>
							{i.number.map(code => {
								return <span>{code}</span>;
							})}
						</p>
					</div>
				);
			}
		}
	}
};

import k3 from "../images/plan/lottery/k3.png";
import pk10 from "../images/plan/lottery/pk10.png";
import ssc from "../images/plan/lottery/ssc.png";
import syxw from "../images/plan/lottery/syxw.png";
import lhc from "../images/plan/lottery/lhc.png";
import kl10 from "../images/plan/lottery/kl10.png";
import xy28 from "../images/plan/lottery/xy28.png";

let plan = {
	getLogo(data, key1) {
		switch (key1) {
			case "k3":
				data.logo = k3;
				break;
			case "pk10":
				data.logo = pk10;
				break;
			case "ssc":
				data.logo = ssc;
				break;
			case "syxw":
				data.logo = syxw;
				break;
			case "lhc":
				data.logo = lhc;
				break;
			case "kl10":
				data.logo = kl10;
				break;
			case "xy28":
				data.logo = xy28;
				break;
		}
		return data;
	},

	getLottery(plan, that) {
		let game = JSON.parse(that.$stores.get("gameList"));
		plan.forEach(i => {
			game.forEach(j => {
				if (Number(i.gameid) === j.GameId) {
					i.class = j.class;
					i.fc_id = j.SourceId;
					i.game_name = j.GameName;
				}
			});
		});
		return plan;
	},

	returnList(i, keyNow, that) {
		let userPlan = {
			id: "",
			period: "",
			add_time: "",
			expect: [], // 预测
			actual: [], // 当前结果
			actualTotal: 0,
			corrText: "错",
			correct: 0 // 0是不准 1是准
		};
		userPlan.id = i.id;
		userPlan.period = i.number || "下一";
		userPlan.add_time = i.addtime;
		let expect = {};
		for (let key in i) {
			if (key === keyNow) {
				expect = i[key].split(",");
			}
		}
		userPlan.expect = this.returnText(expect, userPlan.expect);
		let actual = i.result.split(",");
		actual.forEach(i => {
			userPlan.actualTotal = userPlan.actualTotal + Number(i);
		});
		userPlan.actual = this.returnText(actual, userPlan.actual);
		let data = this.returnShort(userPlan, that);
		return data;
	},

	returnNext(i, keyNow, that) {
		let userPlan = {
			id: "",
			period: "",
			add_time: "",
			expect: [], // 预测
			actual: [], // 当前结果
			actualTotal: 0,
			corrText: "错",
			correct: 0 // 0是不准 1是准
		};
		userPlan.id = i.id;
		userPlan.correct = 2;
		userPlan.corrText = "跟投";
		userPlan.period = "下一";
		userPlan.expect = this.returnText(i[keyNow].split(","), userPlan.expect);
		let short = JSON.parse(that.$stores.get("planLottery")),
			name = short.short_name,
			type = 0;
		switch (short.class) {
			case "pk10":
				type = 5;
				break;
			case "syxw":
				type = 5;
				break;
			case "ssc":
				type = 4;
				break;
			default:
				type = 10;
		}
		if (name.indexOf("dx") > -1) {
			userPlan.expect.forEach(i => {
				if (Number(i.text) <= type) {
					i.text = "小";
				} else {
					if (short.class === "syxw" && Number(i.text) === 11) {
						i.text = "和";
						userPlan.and = 1;
					} else {
						i.text = "大";
					}
				}
			});
		}
		if (name.indexOf("ds") > -1) {
			userPlan.expect.forEach(i => {
				if (Number(i.text) % 2 === 0) {
					i.text = "双";
				} else {
					if (short.class === "syxw" && Number(i.text) === 11) {
						i.text = "和";
						userPlan.and = 1;
					} else {
						i.text = "单";
					}
				}
			});
		}
		return userPlan;
	},

	returnShort(data, that) {
		let short = JSON.parse(that.$stores.get("planLottery")),
			name = short.short_name,
			list = {};
		switch (name) {
			case "eight":
				list = this.checkEight(data);
				break;
			case "dx":
				list = this.checkDX(data, 10);
				break;
			case "ds":
				list = this.checkDS(data);
				break;
			case "dudan":
				list = this.checkDudan(data);
				break;
			default:
				list = this.checkFiven(data, short);
		}
		return list;
	},

	checkEight(data) {
		data.expect.forEach((j, index1) => {
			if (Number(j.text) === data.actualTotal) {
				data.correct = 1;
				data.corrText = "准";
				data.expect[index1].class = 1;
			}
		});
		return data;
	},

	checkDX(data, type, sum, short) {
		let total = sum || data.actualTotal;
		if (total <= type) {
			data.expect.forEach((j, index) => {
				if (Number(j.text) <= type) {
					data = this.dataForEach(data, index);
					j.text_tra = "小";
				} else {
					j.text_tra = "大";
				}
			});
		} else {
			data.expect.forEach((j, index) => {
				if (Number(j.text) > type) {
					if (short && short.class === "syxw") {
						if (Number(j.text) === 11) {
							if (Number(total) === 11) data = this.dataForEach(data, index);
							j.text_tra = "和";
						} else {
							if (Number(total) !== 11) data = this.dataForEach(data, index);
							j.text_tra = "大";
						}
					} else {
						data = this.dataForEach(data, index);
						j.text_tra = "大";
					}
				} else {
					j.text_tra = "小";
				}
			});
		}
		return data;
	},

	checkDS(data, sum, short) {
		let total = sum || data.actualTotal;
		if (total % 2 === 0) {
			data.expect.forEach((j, index) => {
				if (Number(j.text) % 2 === 0) {
					data = this.dataForEach(data, index);
					j.text_tra = "双";
				} else {
					j.text_tra = "单";
				}
			});
		} else {
			data.expect.forEach((j, index) => {
				if (short && short.class === "syxw") {
					if (Number(j.text) === 11) {
						if (Number(total) === 11) data = this.dataForEach(data, index);
						j.text_tra = "和";
					} else {
						if (Number(j.text) % 2 !== 0) {
							if (Number(total) !== 11) data = this.dataForEach(data, index);
							j.text_tra = "单";
						} else {
							j.text_tra = "双";
						}
					}
				} else {
					if (Number(j.text) % 2 !== 0) {
						data = this.dataForEach(data, index);
						j.text_tra = "单";
					} else {
						j.text_tra = "双";
					}
				}
			});
		}
		return data;
	},

	checkDudan(data) {
		data.actual.forEach((i, index) => {
			data.expect.forEach((j, index1) => {
				if (j.text === i.text) {
					data = this.dataForEach(data, index1);
					data.actual[index].class = 1;
				}
			});
		});
		return data;
	},

	checkFiven(data, short) {
		let name = short.short_name,
			type = 0,
			ind = parseInt(name.substring(1)) - 1,
			result = "";
		switch (short.class) {
			case "pk10":
				type = 5;
				break;
			case "syxw":
				type = 5;
				break;
			case "ssc":
				type = 4;
				break;
			default:
				type = 10;
		}
		if (name.indexOf("wuma") > -1) {
			result = data.actual[ind];
			data.expect.forEach((j, index) => {
				if (j.text === result.text) {
					data = this.dataForEach(data, index);
				}
			});
		}
		if (name.indexOf("dx") > -1) {
			result = data.actual[ind];
			data = this.checkDX(data, type, result.text, short);
		}
		if (name.indexOf("ds") > -1) {
			result = data.actual[ind];
			data = this.checkDS(data, result.text, short);
		}
		if (data.correct === 1) data.actual[ind].class = 1;
		return data;
	},

	dataForEach(data, index) {
		data.correct = 1;
		data.corrText = "准";
		data.expect[index].class = 1;
		return data;
	},

	returnText(data, list) {
		data.forEach(j => {
			let tem = {};
			tem.text = j;
			tem.class = 0; // 0 是没中  1是中了
			list.push(tem);
		});
		return list;
	},

	totalList(data) {
		let total = {
			lianZ: 0,
			lianC: 0,
			quanZ: 0,
			nowLianZ: 0,
			nowLianC: 0,
			lianRate: 0,
			length: 0
		};
		let listOne = [],
			listTwo = [];
		for (let i = 0; i < data.length; i++) {
			if (data[i].correct === 1) {
				total.nowLianZ++;
			} else {
				break;
			}
		}
		for (let i = 0; i < data.length; i++) {
			if (data[i].correct === 0) {
				total.nowLianC++;
			} else {
				break;
			}
		}
		let a = 0,
			b = 0;
		data.forEach(i => {
			if (i.correct === 1) {
				listOne.push(b);
				b = 0;
				a++;
				total.quanZ++;
			} else {
				listTwo.push(a);
				a = 0;
				b++;
			}
		});
		listTwo.push(a);
		listOne.push(b);
		listOne.forEach(i => {
			if (i > total.lianC) {
				total.lianC = i;
			}
		});
		listTwo.forEach(i => {
			if (i > total.lianZ) {
				total.lianZ = i;
			}
		});
		total.length = data.length;
		total.lianRate = ((total.quanZ / total.length) * 100).toFixed(0);
		return total;
	},

	getOdds(lottery, group, bet) {
		let short = lottery.short_name,
			betList = {},
			index = parseInt(short.substring(1)) - 1;
		switch (lottery.class) {
			case "ssc":
				if (short.indexOf("wuma") > -1) {
					betList = this.returnOdds(group, "单球", index, bet);
				}
				if (short.indexOf("dx") > -1) {
					betList = this.returnOdds(group, "两面盘", index, bet, short, 4);
				}
				if (short.indexOf("ds") > -1) {
					betList = this.returnOdds(group, "两面盘", index, bet, short);
				}
				break;
			case "syxw":
				if (short.indexOf("wuma") > -1) {
					betList = this.returnOdds(group, "单球", index, bet);
				}
				if (short.indexOf("dx") > -1) {
					betList = this.returnOdds(group, "两面盘", index, bet, short, 5);
				}
				if (short.indexOf("ds") > -1) {
					betList = this.returnOdds(group, "两面盘", index, bet, short);
				}
				break;
			case "pk10":
				if (short.indexOf("wuma") > -1) {
					if (index < 6) {
						betList = this.returnOdds(group, "一至五", index, bet);
					} else {
						index = index - 5;
						betList = this.returnOdds(group, "六至十", index, bet);
					}
				}
				if (short.indexOf("dx") > -1) {
					betList = this.returnOdds(group, "两面盘", index, bet, short, 5);
				}
				if (short.indexOf("ds") > -1) {
					betList = this.returnOdds(group, "两面盘", index, bet, short);
				}
				break;
			default:
				switch (short) {
					case "eight":
						betList = this.returnOdds(group, "和值", 0, bet);
						break;
					case "dx":
						betList = this.returnOdds(group, "和值", 0, bet, short, 10);
						break;
					case "ds":
						betList = this.returnOdds(group, "和值", 0, bet, short);
						break;
				}
				break;
		}
		return betList;
	},

	returnOdds(group, name, index, bet) {
		group.forEach(i => {
			if (i.name === name) {
				let list = i.group[index].list;
				bet.forEach(k => {
					list.forEach(j => {
						if (j.content_name === k.play_details) {
							k.odds = j.odds;
							k.play_id = j.play_id;
							k.content_id = j.id;
						}
					});
				});
			}
		});
		return bet;
	}
};
export default plan;

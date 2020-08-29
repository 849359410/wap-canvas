let R = {
	//处理记录信息
	do_data(allData, currPage, r, num) {
		if (allData === "" && currPage === 1) {
			// 第一次获取没有数据的时候
			r.nodata = true;
			r.data = [];
			r.tipMsg = false;
			return;
		}
		if (!allData) {
			r.nodata = false;
			r.tipMsg = false;
			return;
		}
		if (currPage === 1) r.data = [];
		r.nodata = false;
		for (let i = 0, len = allData.length; i < len; i++) {
			allData[i].classN = this.changeClass(allData[i].state);
		}
		if (r.subIndex === 2 || r.menuType === "fc_tra") {
			allData = r.$helps.getBetPos(allData);
		}
		r.data = r.data.concat(allData);
		r.totalOthers = this.getCurrVbet(r.data);
		r.moneyCurr = this.getCurr(r.data);
		if (num) {
			r.tipMsg = allData.length >= 20 && num > currPage * 20;
		}
	},
	//不同状态的类
	changeClass(state) {
		let classN = "";
		switch (state) {
			case 1:
				classN = "red";
				break;
			case 2:
				classN = "green";
				break;
			case 3:
				classN = "";
				break;
			case 6:
				classN = "";
				break;
			case 0:
				classN = "blue";
				break;
		}
		return classN;
	},
	yjfMode(v) {
		let m = "";
		switch (v) {
			case 1:
				m = "元";
				break;
			case 10:
				m = "角";
				break;
			case 100:
				m = "分";
				break;
			case 1000:
				m = "厘";
				break;
			default:
				break;
		}
		return m;
	},
	// 获取当前小计和当前总盈亏  信用/官方
	getCurrVbet(currData) {
		let totalOther = {},
			totalVbet = 0,
			totalResult = 0,
			totalNum = 0;
		for (let i = 0, len = currData.length; i < len; i++) {
			totalVbet += Number(currData[i].valid_bet);
			totalResult += Number(currData[i].result);
			totalNum++;
		}
		totalOther.num = totalNum;
		totalOther.money = parseFloat(totalVbet.toFixed(3));
		totalOther.dis_money = parseFloat(totalResult.toFixed(3));
		return totalOther;
	},
	//资金记录
	getCurr(currData) {
		let curr = {},
			money = 0,
			dis_money = 0,
			num = 0;
		for (let i = 0, len = currData.length; i < len; i++) {
			money += Number(currData[i].money);
			dis_money += Number(currData[i].dis_money);
			num++;
		}
		curr.money = parseFloat(money.toFixed(3));
		curr.num = parseInt(num);
		curr.dis_money = parseFloat(dis_money.toFixed(3));
		return curr;
	}
};
export default R;

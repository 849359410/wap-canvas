let input = {
	// 失焦去掉多余的0
	defocusInput(text) {
		let money = "";
		if (text) money = parseFloat(text).toString();
		return money;
	}
};
export default input;

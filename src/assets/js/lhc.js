let lhc = {
	// 六合彩
	returnLhc(list, typeCap, that) {
		let zmt = {},
			zmt16 = {};
		list.forEach(i => {
			if (i.name === "特码") {
				i.subset = [
					{ name: "直选", list: [] },
					{ name: "两面", list: [] }
				];
				i.group.forEach(j => {
					j.list.forEach(k => {
						if (Number(k.content_name) < 50) {
							i.subset[0].list.push(k);
						} else {
							i.subset[1].list.push(k);
						}
					});
				});
				if (typeCap === 1) {
					that.$stores.set("lhcLottery", JSON.stringify(i.subset[1]));
				}
				delete i.group;
			} else if (i.name === "正码") {
				i.subset = [
					{ name: "任选", list: [] },
					{ name: "任选两面", list: [] }
				];
				i.group.forEach(j => {
					j.list.forEach(k => {
						if (Number(k.content_name) < 50) {
							i.subset[0].list.push(k);
						} else {
							i.subset[1].list.push(k);
						}
					});
				});
				delete i.group;
			} else if (i.name === "正码特") {
				zmt = i.subset;
			} else if (i.name === "正码1-6") {
				zmt16 = i.subset;
			}
		});
		list.forEach((i, index) => {
			if (i.name === "正码") {
				zmt.forEach((j, index) => {
					i.subset.push(j);
					i.subset.push(zmt16[index]);
				});
			} else if (i.name === "正码特") {
				list.splice(index, 1);
			}
		});
		list.forEach((i, index) => {
			if (i.name === "正码1-6") {
				list.splice(index, 1);
			}
		});
		return list;
	}
};
export default lhc;

export default {
	data() {
		return {
			officialApiRule: "",
			creditRule: {},
			lotteryTime: ""
		};
	},
	methods: {
		// 获取信用玩法规则
		async getCreditRule(id) {
			let data = await this.$stores.get(`creditRule_${id}`);
			if (data !== undefined) {
				this.creditRule = data;
				this.ruleData.right = this.creditRule.content;
				return;
			}
			await this.$api
				.request("GET_CREDIT_RULE", {
					lottery_id: id
				})
				.then(success => {
					this.creditRule = success.Data;
					this.ruleData.right = this.creditRule.content;
					this.$stores.set(`creditRule_${id}`, this.creditRule);
				});
		},
		// 获取彩种开奖时间
		async getLotteryTime(id) {
			let data = await this.$stores.get(`lotteryTime_${id}`);
			if (data !== undefined) {
				this.lotteryTime = data;
				this.ruleData.left = data;
				return;
			}
			await this.$api
				.request("GET_LOTTERY_TIME", {
					lottery_id: id
				})
				.then(success => {
					let data = success.Data;
					this.lotteryTime = data[id];
					this.ruleData.left = data[id];
					this.$stores.set(`lotteryTime_${id}`, this.lotteryTime);
				});
		},
		// 获取官方玩法规则
		async getOfficialRule(id) {
			let data = await this.$stores.get(`officialApiRule_${id}`);
			if (data !== undefined) {
				this.officialApiRule = data;
				return;
			}
			await this.$api
				.request("GET_OFFICIAL_RULE", {
					lottery_id: id
				})
				.then(success => {
					this.officialApiRule = success.Data;
					this.$stores.set(`officialApiRule_${id}`, this.officialApiRule);
				});
		},
		handleRule(name, currentLottery) {
			let rule = "";
			if (this.officialApiRule === "") return;
			this.officialApiRule.content.forEach(i => {
				if (name.indexOf(i.playGroup) > -1) {
					i.plays.forEach(j => {
						if (name.indexOf(j.groupName) > -1) {
							j.group.forEach(t => {
								if (name === t.play) {
									rule = t.explain
										? t.explain
										: currentLottery.info_rule === 1
										? t.Pass_kill_text
										: t.No_kill_text;
								}
							});
						}
					});
				}
			});
			return rule;
		}
	}
};

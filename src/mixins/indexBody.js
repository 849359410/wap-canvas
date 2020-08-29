export default {
	methods: {
		// 存储当前的时间
		setCookie(key, val, exp) {
			this.$stores.set(key, { val: val, exp: exp, time: new Date().getTime() });
		},
		// 比较是否超时
		calculatingTime(key) {
			var info = this.$stores.get(key);
			if (!info) {
				return null;
			}
			if (new Date().getTime() - info.time > info.exp) {
				return null;
			}
			return info.val;
		},
		// 距离今天结束还剩多少毫秒
		getExpireTime() {
			let date = new Date();
			let hour = 23 - date.getHours();
			let min = 59 - date.getMinutes();
			let ms = (3600 * hour + 60 * min) * 1000;
			return ms;
		}
	}
};

export default {
	methods: {
		setCookie2(cookiename, cookievalue, milsecond) {
			let date = new Date();
			date.setTime(date.getTime() + milsecond);
			document.cookie =
				cookiename + "=" + cookievalue + "; path=/;expires = " + date.toGMTString();
		},
		setCookie3(cookiename, cookievalue, milsecond) {
			let date = new Date();
			date.setTime(date.getTime() + milsecond);
			document.cookie =
				cookiename + "=" + cookievalue + "; path=/;expires = " + date.toGMTString();
		},
		getCookie(name) {
			let prefix = name + "=";
			let cookieStartIndex = document.cookie.indexOf(prefix);
			if (cookieStartIndex === -1) return "";
			let cookieEndIndex = document.cookie.indexOf(";", cookieStartIndex + prefix.length);
			if (cookieEndIndex === -1) cookieEndIndex = document.cookie.length;
			return document.cookie.substring(cookieStartIndex + prefix.length, cookieEndIndex);
		},
		//现在距离当天结束时间:毫秒
		getExpireTime() {
			let date = new Date();
			let hour = 23 - date.getHours();
			let min = 59 - date.getMinutes();
			let ms = (3600 * hour + 60 * min) * 1000;
			return ms;
		},
		setVPage() {
			let host = window.location.host;
			let page = document.location.href.replace(host, "").replace("http://", ""); //去掉域名

			let idx = page.indexOf("?");
			if (idx > 0) {
				page = page.substr(0, idx); //去掉参数
			}
			let ckpage = this.getCookie("FirstPopAd");
			if (!ckpage || ckpage.indexOf(page) === -1) {
				ckpage += page + "|";
				let ms = this.getExpireTime();
				this.setCookie2("FirstPopAd", ckpage, ms);
				//send request 把访问的页面发到服务器。。。
			}
		},
		setVPage2() {
			let host = window.location.host;
			let page = document.location.href.replace(host, "").replace("http://", ""); //去掉域名

			let idx = page.indexOf("?");
			if (idx > 0) {
				page = page.substr(0, idx); //去掉参数
			}
			let ckpage = this.getCookie("EveryPopAd");
			if (!ckpage || ckpage.indexOf(page) === -1) {
				ckpage += page + "|";
				this.setCookie3("EveryPopAd", ckpage);
				//send request 把访问的页面发到服务器。。。
			}
		}
	}
};

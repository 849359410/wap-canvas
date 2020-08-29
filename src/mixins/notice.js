export default {
	methods: {
		do_notice(data) {
			if (!data) {
				this.nodata = true;
				return;
			}
			this.nodata = false;
			this.notices = data;
		},
		see(e) {
			e = e || window.e;
			let h = e.currentTarget.children[1];
			if (h.className.indexOf("active") > -1) {
				h.classList.remove("active");
			} else {
				h.classList.add("active");
			}
		}
	}
};

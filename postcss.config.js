module.exports = {
	plugins: {
		autoprefixer: {},
		"postcss-px-to-viewport": {
			viewportWidth: 375,
			// 该项仅在使用 Circle 组件时需要
			// 原因参见 https://github.com/youzan/vant/issues/1948
			selectorBlackList: [
				"van-circle__layer",
				"van-picker-column__item",
				"van-picker__frame"
			],
			minPixelValue: 1,
			mediaQuery: false
		}
	}
};

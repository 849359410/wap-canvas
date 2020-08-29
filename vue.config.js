// 区分生产环境打包和预发布打包，使用不同的CDN
const JS_CDN = [],
	cdnUrl = "https://static.cloudywoo.com",
	IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
let CDN_URL = "";
switch (process.env.VUE_APP_TITLE) {
	case "production":
		CDN_URL = "https://static.cloudywoo.com/";
		break;
	case "review":
		CDN_URL = "http://cdn.eg3000.org/";
		break;
	case "test":
		CDN_URL = "http://cdn.eg99.org:8090/";
		break;
}
JS_CDN.push(
	"https://cdn.jsdelivr.net/npm/vue@2.6.11",
	"https://unpkg.com/vuex@3.1.3/dist/vuex.js",
	`${CDN_URL}package/singularity.js`,
	`${CDN_URL}package/socket.js`,
	`${CDN_URL}api/courier.js`
);
module.exports = {
	publicPath:
		IS_PROD && process.env.VUE_APP_TITLE === "production" ? `${cdnUrl}/dist/oop-a` : "/", // 默认'/'，部署应用包时的基本 URL
	outputDir: "oop-a",
	assetsDir: undefined,
	runtimeCompiler: true,
	productionSourceMap: false,
	filenameHashing: true,
	parallel: undefined,
	css: {
		loaderOptions: {
			less: {
				modifyVars: {
					red: "#ef384a",
					blue: "#0b78f8",
					orange: "#f9a93d"
				}
			}
		}
	},
	lintOnSave: undefined,
	configureWebpack: config => {
		if (IS_PROD) {
			config.externals = {
				"@server/singularity": "Singularity",
				"@server/socket": "Socket",
				"@server/courier": "Courier",
				vue: "Vue",
				vuex: "Vuex"
			};
		}
	},
	chainWebpack: config => {
		// 修复Lazy loading routes Error： Cyclic dependency  [https://github.com/vuejs/vue-cli/issues/1669]
		config.plugins.delete("prefetch");
		config.plugins.delete("preload");
		config.plugin("html").tap(args => {
			args[0].chunksSortMode = "dependency";
			return args;
		});
		if (IS_PROD) {
			config.plugin("html").tap(args => {
				args[0].cdn = {
					js: JS_CDN
				};
				return args;
			});
		}
	},
	devServer: {
		overlay: {
			warnings: false,
			errors: false
		},
		open: IS_PROD,
		host: "0.0.0.0",
		port: 7777,
		https: false,
		hotOnly: false,
		proxy: {
			"/api/": {
				target: "http://192.168.1.248:9007",
				changeOrigin: true
			},
			"/lottery_tra_api/": {
				target: "http://192.168.1.248:9007",
				changeOrigin: true
			},
			"/lottery_api/": {
				target: "http://192.168.1.248:9007",
				changeOrigin: true
			},
			"/member_api/": {
				target: "http://192.168.1.248:9007/",
				changeOrigin: true
			},
			"/lotteryPlan/": {
				target: "https://m.eg00000.com",
				changeOrigin: true
			},
			"/primordial/": {
				target: "http://eg_wap_y.eg7000.org:8088/",
				changeOrigin: true
			},
			"/vdgame_api/v1/": {
				target: "http://eg_wap_y.eg7000.org:8088/",
				changeOrigin: true
			},
			"/ws/": {
				// 本地跑专用
				target: "ws://oop-a.eg3000.org/",
				changeOrigin: true,
				ws: true,
				secure: false
			}
		}
	}
};

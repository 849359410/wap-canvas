import "@babel/polyfill";
import Vue from "vue";
import Stores from "store";
import VueClipboard from "vue-clipboard2";
import { Helps, SingularityApi, LotteryPub, Filters } from "@server/singularity";
import Courier from "@server/courier";
import ApiMaps from "./config/api.config";
import App from "./App.vue";
import ListenEvents from "./mixins/listenEvents";
import router from "./router";
import store from "./store";
import "./assets/css/views/plan/fontcss/style.css";
export let Bus = new Vue();
import "./assets/css/custom.css";
import "./assets/css/head.scss";
import VueRouter from "vue-router";
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
	return routerPush.call(this, location);
};
import {
	Row,
	Col,
	Image,
	Dialog,
	Overlay,
	Icon,
	Button,
	Toast,
	Uploader,
	Field,
	Lazyload,
	Tab,
	Tabs,
	Swipe,
	SwipeItem,
	NoticeBar,
	Divider,
	List,
	Cell,
	CellGroup,
	Collapse,
	CollapseItem,
	Stepper,
	Step,
	Picker,
	NumberKeyboard,
	Loading,
	PullRefresh,
	Sticky,
	SwipeCell,
	Switch,
	PasswordInput,
	Popup,
	CountDown,
	Grid,
	GridItem,
	TabbarItem,
	Tabbar,
	Sidebar,
	SidebarItem,
	DropdownMenu,
	DropdownItem,
	DatetimePicker,
	Checkbox,
	CheckboxGroup,
	Empty,
	NavBar,
	Form,
	RadioGroup,
	Radio,
	Tag,
	ActionSheet,
	ShareSheet
} from "vant";

Vue.use(Lazyload)
	.use(Icon)
	.use(Collapse)
	.use(CollapseItem)
	.use(Dialog)
	.use(Overlay)
	.use(Picker)
	.use(NumberKeyboard)
	.use(Loading)
	.use(PullRefresh)
	.use(Sticky)
	.use(SwipeCell)
	.use(Switch)
	.use(CountDown)
	.use(Grid)
	.use(GridItem)
	.use(PasswordInput)
	.use(scroll)
	.use(Tabbar)
	.use(DropdownMenu)
	.use(DropdownItem)
	.use(TabbarItem)
	.use(DatetimePicker)
	.use(Empty)
	.use(NavBar);
Vue.use(Row).use(Col);
Vue.use(Image).use(Button);
Vue.use(Icon).use(Toast);
Vue.use(Uploader).use(Field);
Vue.use(Tab).use(Tabs);
Vue.use(Swipe).use(SwipeItem);
Vue.use(List)
	.use(Cell)
	.use(Sidebar)
	.use(SidebarItem)
	.use(Checkbox)
	.use(CheckboxGroup)
	.use(CellGroup);
Vue.use(Lazyload).use(NoticeBar);
Vue.use(Divider).use(Stepper);
Vue.use(VueClipboard);
Vue.use(Popup);
Vue.use(VueClipboard);
Vue.use(Form);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Step);
Vue.use(Tag);
Vue.use(ActionSheet);
Vue.use(ShareSheet);
Vue.use({
	install: () => {
		Vue.prototype.$api = SingularityApi;
		Vue.prototype.$helps = Helps;
		Vue.prototype.$filters = Filters;
		Vue.prototype.$lotteryPub = LotteryPub;
		Vue.prototype.$stores = Stores;
		Vue.prototype.$api = {
			request(url, params, headers) {
				// const path = router.history.current.path;
				// const routeMap = store.getters.findRouteId(path);
				const api = new Courier(ApiMaps, 2);
				let headerConfig = {};
				if (headers !== undefined && Object.keys(headers).length > 0) {
					headerConfig = Object.assign(headerConfig, headers);
				}
				if (params === undefined) params = {};
				if (Stores.get("s")) {
					Reflect.set(headerConfig, "s", Stores.get("s"));
					params.s = Stores.get("s");
				}
				// if (routeMap) {
				// 	params = { column_id: routeMap.id, ...params };
				// }
				return api.request(url, Helps.cloneDeep(params), headerConfig);
			}
		};
	}
});
Vue.config.productionTip = false;
Vue.config.devtools = true;
Vue.config.silent = true;

// 注册过滤器
Object.keys(Filters).forEach(key => Vue.filter(key, Filters[key]));
new Vue({
	el: "#app",
	components: { App },
	mixins: [ListenEvents],
	store,
	router,
	template: "<App/>"
});

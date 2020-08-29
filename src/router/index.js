import Vue from "vue";
import Router from "vue-router";
import store from "../store";
import routes from "./router.config";
const router = new Router({
	mode: "history",
	base: __dirname,
	routes
});
router.beforeEach((to, from, next) => {
	const handleNext = () => {
		if (!store.state.user.isLogin && to.meta.requireAuth) {
			next({ path: "/login" });
		} else {
			next();
		}
	};
	if (store.state.common.isReady) {
		handleNext();
	} else {
		store.watch(state => state.common.isReady, handleNext);
	}
});
Vue.use(Router);
export default router;

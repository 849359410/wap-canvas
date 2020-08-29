import Vue from "vue";
import Vuex from "vuex";
import { wapStore } from "@server/singularity";

Vue.use(Vuex);
export default new Vuex.Store(wapStore);

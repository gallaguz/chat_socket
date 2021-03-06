import Vue from 'vue';
import Vuex from 'vuex';
import { connection, message, user } from './modules/index';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		connection,
		message,
		user,
	},
});

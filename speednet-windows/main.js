import App from './App'
import store from './store'
import i18n from './lang/i18n'

import 'my.css'
import axios from 'axios';
Vue.prototype.$axios = axios //全局注册，使用方法为:this.$axios

// #ifndef VUE3
import Vue, {
	onMounted
} from 'vue'


Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'

// Vue.use(VueEllipseProgress);
// Vue.component("vue-ellipse-progress",VueEllipseProgress)
const app = new Vue({
	i18n,
	store,
	...App,
	mounted: function() {

	}
})



app.$mount();



// #endif


// #ifdef VUE3
import {
	createSSRApp
} from 'vue'

export function createApp() {
	const app = createSSRApp(App)
	app.use(i18n)
	app.use(store)
	app.use(VueEllipseProgress);
	return {
		app
	}
}
// #endif

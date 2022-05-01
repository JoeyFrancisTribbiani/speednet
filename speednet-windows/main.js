import App from './App'
import store from './store'
import i18n from './lang/i18n'


// #ifndef VUE3
import Vue from 'vue'
// import ColorProgress from 'vue-color-progress'

// import VueEllipseProgress from 'vue-ellipse-progress'
// import VueEllipseProgress from './components/vue-ellipse-progress.vue'

Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'

// Vue.use(VueEllipseProgress);
// Vue.component("vue-ellipse-progress",VueEllipseProgress)
const app = new Vue({
	i18n,
	store,
	...App
})


app.$mount()
// #endif


// #ifdef VUE3
import {createSSRApp} from 'vue'

export function createApp() {
	const app = createSSRApp(App)
	app.use(i18n)
	app.use(store)
	app.use(VueEllipseProgress);
	return {app}
}
// #endif

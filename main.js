import Vue from 'vue'
import App from './App'
import uView from "uview-ui"
import store from './store'
import { pinyin } from 'pinyin-pro';
Vue.use(uView);

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$pinyin = pinyin

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

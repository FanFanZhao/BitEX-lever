// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from "axios"
import Util from './lib/utils'
import VueAxios from 'vue-axios'
import Qs from 'qs'
import "@/assets/style/common.scss"
import VueSocketio from 'vue-socket.io'
import {Slider} from 'element-ui'
Vue.use(Slider)
// import echarts from 'echarts'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import store from './store'
Vue.use(VueAwesomeSwiper)
// Vue.prototype.$echarts = echarts 
window.eventBus = new Vue()

Vue.use(VueSocketio, 'http://www.965kj.net:2130');
// Vue.use(VueSocketio, 'http://ice.adminchao.com:2120');

// Vue.use(VueSocketio, 'http://t.fuwuqian.cn:2120');

Vue.config.productionTip = false
// Axios.defaults.baseURL = 'http://www.bd.com/';
Axios.interceptors.request.use(function (config) {
	if (config.url.indexOf('?') === -1) {
		config.url = config.url + '?_timespan=' + (new Date()).getTime()
	} else {
		config.url = config.url + '&_timespan=' + (new Date()).getTime()
	}
	// 在发送请求之前做些什么
	return config
}, function (error) {
	// 对请求错误做些什么
	return Promise.reject(error)
})
Axios.interceptors.response.use(function(response){
	if(response.data.type == '999'){
		layer.msg('登录过时，请重新登录');
		
	}
	return response
})
//Axios.defaults.baseURL = ''
// Axios.defaults.headers = { 'Content-Type': 'application/json;charset=UTF-8' }application/x-www-form-urlencoded
// Axios.defaults.withCredentials = true;
Vue.config.productionTip = false;
Axios.defaults.transformRequest = [(data) => {
	return Qs.stringify(data)
}]
Vue.use(VueAxios, Axios);
Vue.use(Util);
Vue.filter('numFilter', function (value) {
	//截取当前数据到小数点后五位
	let transformVal = Number(value).toFixed(5)
	return Number(transformVal)
  })

let bus = new Vue()
Vue.prototype.bus = bus
// router.beforeEach((to,from,next) => {
// 	Axios({
// 		url:'/api/currency/get_usdt_price'
// 	}).then(res => {
// 		var p  = 6.9;
// 		if(res.data.type == 'ok'){
// 			p = res.data.message;
// 		}
// 		Vue.prototype.usprice = p;
// 		next()
		
// 	})
	
	
	
// })
//Vue.use(Ws, 'http://test.maxf.pub/users/chatRoom');
/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: { App },
	template: '<App/>'
})

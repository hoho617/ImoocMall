// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入Element-UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

//引入vue-lazyload插件 懒加载
import vueLazyLoad from 'vue-lazyload';
Vue.use(vueLazyLoad,{
  loading:'/static/loading-svg/loading-bubbles.svg'
});

//引入infinite-scroll插件
/*import infiniteScroll from 'vue-infinite-scroll';
Vue.use(infiniteScroll)*/

//引入infinite-loading插件
import InfiniteLoading from 'vue-infinite-loading'
Vue.use(InfiniteLoading)



//引入全局过滤器
import {currency} from "./util/currency";
Vue.filter("currency",currency);
Vue.config.productionTip = false

//使用axios
import axios from './http.js'
Vue.prototype.$axios = axios;


/**引入vuex***/
import store from './store/index'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App }, //  render:function(h){return h(APP)}
  template: '<App/>'
})

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/components/minpoint/mo-elementui.css'
import {get, post, patch, put, del} from '@/axios' // api: https://github.com/axios/axios

Vue.use(ElementUI);


Vue.config.productionTip = false

// 设置尺寸为最小
Vue.prototype.$ELEMENT = { size: 'small'};
// 全局挂载
Vue.prototype.$get = get // fetch请求方法
Vue.prototype.$post = post // post请求方法
Vue.prototype.$patch = patch // patch请求方法
Vue.prototype.$put = put // put请求方法
Vue.prototype.$del = del // del请求方法
// Vue.prototype.$dbSSH = dbSSH // 数据库

new Vue({
    router,
    store,
    render: function (h) {
        return h(App)
    }
}).$mount('#app')

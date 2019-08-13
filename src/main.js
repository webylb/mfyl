import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI  from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


//原型 https://6yw6v6.axshare.com/
//接口 https://prev-bea.guijitech.com/swagger-ui.html#/
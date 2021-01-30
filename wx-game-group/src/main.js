import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from '@/store/index.js'
import baseUrl from '@/config/config.js'
import loading from '@/components/loading'
import Toast from '@/components/Toast'

import VConsole from 'vconsole/dist/vconsole.min'

if (window.VUE_APP_BASE_API === 'http://www.jbfsoft.net' || window.VUE_APP_BASE_API === 'http://uat.jbfsoft.net' || window.VUE_APP_BASE_API === 'http://test2.jbfsoft.net') {
  const vConsole = new VConsole(); // eslint-disable-line
}

const dev = true // 开发

if (process.env.NODE_ENV === 'development' && dev) {
  console.info('开发调试模式')
  const params = {
    "wxUserInfo": {
      "activeId": "231",
      "openid": "oYKLK1Upufuv00-lScHnI-g7eCaM",
      "companyKey": "test01",
      "headerImg": "http://thirdwx.qlogo.cn/mmopen/dDDGcKGeQmbTbU9tq6joE7o3icJsOJB3sGW6qiaD5QLvN4JTnZTGKKdxNl7d5uxJ2y1zVjSba5CrrdPHggbZKnLBwGpEBRImE2/132",
      "memberCard": "13691928282",
      "phone": "13691928282",
      "page": null,
      "subscribe": "1",
      "localUrl": "http://localhost:8091/wx_game_group/#/",
      "isRegister": "1"
    },
    "ticket": null,
    "memberCard": "13691928282",
    "activeId": "231",
    "companyKey": "test01",
    "openid": "oYKLK1Upufuv00-lScHnI-g7eCaM",
    "subscribe": 1,
    "headerImg": "http://thirdwx.qlogo.cn/mmopen/dDDGcKGeQmbTbU9tq6joE7o3icJsOJB3sGW6qiaD5QLvN4JTnZTGKKdxNl7d5uxJ2y1zVjSba5CrrdPHggbZKnLBwGpEBRImE2/132",
    "phone": "13691928282",
    "localUrl": "http://localhost:8091/wx_game_group/#/",
    "isRegister": "1"
  }
  localStorage.setItem('urlData', JSON.stringify(params))
}

Vue.use(Toast);
Vue.use(loading);
Vue.prototype.$loading = loading;
Vue.config.productionTip = false
Vue.prototype.httpUrl = baseUrl;
import 'minireset.css';
import 'animate.css';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
import 'url-search-params-polyfill';
import Vue from 'vue';
import App from '@/App.vue';
import router from '@/route';
import store from '@/store';
import { Loading } from 'vant';
import VConsole from 'vconsole/dist/vconsole.min.js';
if (window.VUE_APP_BASE_API === 'http://www.jbfsoft.net' || window.VUE_APP_BASE_API === 'http://test2.jbfsoft.net') {
  const vConsole = new VConsole();
}
Vue.use(Loading);
// 引入lib-flexible  移动端适配 rem布局
import 'amfe-flexible';
import '@/utils/date';

import GlobalUtils from '@/utils/globalUtils';
Vue.use(GlobalUtils)


Vue.config.productionTip = false;

const app = new Vue({
  router,
  store,
  render: h => h(App)
});

// 全局监听reject异常问题
window.addEventListener('unhandledrejection', function(event) {
  event.preventDefault()
  console.log('捕获到异常：', event);
})

// 首页数据处理
import { homeControl, loadingColor } from '@/utils/homeDataControl.js';
loadingColor()
// 处理首页进入方式
homeControl(resolve => resolve(app, Vue));

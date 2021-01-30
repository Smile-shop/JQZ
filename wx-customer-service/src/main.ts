import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import moment from 'moment';
import { Dialog } from 'vant';
Vue.use(Dialog);

import VConsole from 'vconsole/dist/vconsole.min.js';
if (VUE_APP_BASE_API === 'http://www.jbfsoft.net' || VUE_APP_BASE_API === 'http://test2.jbfsoft.net') {
  const vConsole = new VConsole();
}

// 引入lib-flexible  移动端适配 rem布局
import 'amfe-flexible';

// 全局组件
import Header from '@/components/Header.vue';
Vue.component('Header', Header);

// 时间
Vue.filter('datefmt', (input: string, fmtstring: string) => {
  if (input) {
    return moment(input).format(fmtstring);
  }
});

// 全局混入
// import CommonMixin from '@/mixin/CommonMixin';
// Vue.mixin(CommonMixin);

// 全局方法
// import { goBack } from '@/utils/functions';
// Vue.prototype.goBack = goBack;
// import httpServer from '@/utils/http';
// Vue.prototype.httpServer = httpServer;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');

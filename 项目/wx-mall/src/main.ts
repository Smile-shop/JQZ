import 'whatwg-fetch';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './stores';
import 'normalize.css';
import { Dialog, ImagePreview } from 'vant';
import eruda from 'eruda';

if (VUE_APP_BASE_API === 'http://www.jbfsoft.net' || VUE_APP_BASE_API === 'http://test2.jbfsoft.net') {
  (eruda as any).init();
}
Vue.config.productionTip = false;

import './filters/index';
import './directives/index';

Vue.use(Dialog);
Vue.use(ImagePreview);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

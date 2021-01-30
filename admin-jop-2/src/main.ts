import Vue from 'vue';
import Antd from 'ant-design-vue';
import VueCompositionAPI from '@vue/composition-api';
import App from './App.vue';
import router from './router';
import store from './store';
import 'ant-design-vue/dist/antd.css';
import PageWrapper from './layout/page-wrapper.vue';
import { permission } from './directives';
import 'ant-design-vue/dist/antd.less';
import 'minireset.css';
import './styles/index.scss';

Vue.config.productionTip = false;
Vue.use(Antd);
Vue.use(VueCompositionAPI);

Vue.component('page-wrapper', PageWrapper);
Vue.directive('permission', permission);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

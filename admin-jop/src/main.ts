import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'minireset.css';
import './styles/var.scss';
import './styles/common.scss';
import './router/router-control';
import './filters/index';
import VeLine from 'v-charts/lib/line.common';
Vue.component(VeLine.name, VeLine);

Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

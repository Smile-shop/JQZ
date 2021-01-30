import { createApp, h } from 'vue'
import App from './App.vue'
import store from './store/index';
import router from './router/index';
import 'normalize.css';
import 'minireset.css';
import './styles/index.scss'
import { getEnv } from './utils/env';
import eruda from 'eruda';

if (getEnv().env != 'production') {
  (eruda as any).init();
}

const app = createApp(App);
app.use(store);
app.use(router);
app.mount('#app');

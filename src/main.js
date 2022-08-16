import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
// 导入vant
import Vant, { Lazyload } from 'vant';
import './assets/reset.min.css';
import 'vant/lib/index.css';
import 'amfe-flexible';
import { handleMaxWidth } from './assets/utils';
handleMaxWidth();
window.addEventListener('resize', handleMaxWidth)

const app = createApp(App);
app.use(Vant); 
app.use(store); 
app.use(router);
app.use(Lazyload, {
  lazyComponent: true,
})
app.mount('#app');
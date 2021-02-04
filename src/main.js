import Vue from 'vue';
import AntDesign from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue';

import router from './router/index';
import store from './store/index';

Vue.use(AntDesign);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');

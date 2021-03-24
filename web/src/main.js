/* eslint-disable no-param-reassign */
import Vue from 'vue';
import ViewUI from 'view-design';
import locale from 'view-design/dist/locale/pt-BR';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/less/index.less';
import vueAxios from './plugins/vue-axios';
import vueMoment from './plugins/vue-moment';

Vue.config.productionTip = false;

Vue.use(ViewUI, {
  locale,
});
Vue.use(vueAxios);
Vue.use(vueMoment);

Vue.$http.interceptors.request.use((config) => {
  const token = localStorage.auth;
  if (token) config.headers.common.Authorization = `Bearer ${token}`;

  config.headers.common.lng = 'pt-BR';

  return config;
});

new Vue({
  router,
  store,
  render: (h) => h(App),
  async beforeMount() {
    this.$Notice.config({
      top: 55,
      duration: 3,
    });
  },
}).$mount('#app');

// eslint-disable-next-line import/prefer-default-export
export const bus = new Vue();

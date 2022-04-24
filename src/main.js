import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import '@babel/polyfill';

Vue.config.productionTip = false;
Vue.prototype.$EventBus = new Vue();

new Vue({
  router: router,
  store: store,
  vuetify,

  render: (h) => {
    return h(App);
  },
}).$mount('#app');

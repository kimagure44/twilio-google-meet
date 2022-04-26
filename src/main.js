import Vue from 'vue';
import App from './app.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import '@babel/polyfill';
import Twilio from 'twilio-video';

Vue.config.productionTip = false;
Vue.prototype.$EventBus = new Vue();
Vue.prototype.$Twilio = Twilio;
new Vue({
  router,
  store,
  vuetify,

  render: (h) => {
    return h(App);
  },
}).$mount('#app');

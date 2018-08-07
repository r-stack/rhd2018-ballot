// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@fortawesome/fontawesome-free-webfonts/css/fontawesome.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-brands.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-regular.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css';
import VueFire from 'vuefire';

import Vue from 'vue';
import App from './App';
import router from './router';


Vue.config.productionTip = false;

Vue.use(VueFire);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});

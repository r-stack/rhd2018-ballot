import '@fortawesome/fontawesome-free-webfonts/css/fontawesome.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-brands.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-regular.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css';
import 'buefy/dist/buefy.css';
import Vue from 'vue';
import App from './App.vue';
import router from './router';

import Buefy from 'buefy';
import { rtdbPlugin } from 'vuefire';

Vue.config.productionTip = false;

Vue.use(rtdbPlugin);
Vue.use(Buefy);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');

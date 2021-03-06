// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@fortawesome/fontawesome-free-webfonts/css/fontawesome.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-brands.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-regular.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css';
import 'buefy/lib/buefy.css';
import 'bulma-switch/dist/css/bulma-switch.min.css';

import VueFire from 'vuefire';
import Buefy from 'buefy';

import Vue from 'vue';
import App from './App';
import router from './router';
import { auth } from './firebase';


Vue.config.productionTip = false;

Vue.use(VueFire);
Vue.use(Buefy);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  created() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // if logged in, jump to vote page
        // this.$router.push('/vote');
        console.log('logged in');
      } else {
        // if not, jump to login page
        // this.$router.push('/login');
        console.log('not logged in');
      }
    }, (e) => {
      console.error(e);
    });
  },
});

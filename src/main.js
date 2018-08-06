// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@fortawesome/fontawesome-free-webfonts/css/fontawesome.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-brands.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-regular.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css';
import firebase from 'firebase';
import VueFire from 'vuefire';

import Vue from 'vue';
import App from './App';
import router from './router';


Vue.config.productionTip = false;

const config = {
  apiKey: 'AIzaSyDHTIe72Evqv6ovvazqrjcQTvoejO1j9Fw',
  authDomain: 'rhd2018-ballot.firebaseapp.com',
  databaseURL: 'https://rhd2018-ballot.firebaseio.com',
  projectId: 'rhd2018-ballot',
  storageBucket: 'rhd2018-ballot.appspot.com',
  messagingSenderId: '923540796704',
};
firebase.initializeApp(config);

Vue.use(VueFire);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});

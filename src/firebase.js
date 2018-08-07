import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyDHTIe72Evqv6ovvazqrjcQTvoejO1j9Fw',
  authDomain: 'rhd2018-ballot.firebaseapp.com',
  databaseURL: 'https://rhd2018-ballot.firebaseio.com',
  projectId: 'rhd2018-ballot',
  storageBucket: 'rhd2018-ballot.appspot.com',
  messagingSenderId: '923540796704',
};
const firebaseApp = firebase.initializeApp(config);

export const auth = firebaseApp.auth();
export const db = firebaseApp.database();

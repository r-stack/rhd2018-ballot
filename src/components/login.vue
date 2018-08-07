<template>
  <div class="login">
    <h1 class="title is-size-4">Enter your name</h1>
    <input class="input is-large" type="text" key="username-input" v-model="username" />
    <button class="button is-block is-large is-fullwidth"
     @click="login(username)" :disabled="!username">Login!</button>
  </div>
</template>

<script>
import { auth, db } from './../firebase';

const usersRef = db.ref('users');

export default {
  name: 'login',
  data() {
    // TODO: Get auth info before routing
    const username = auth.currentUser ? auth.currentUser.displayName : '';
    return {
      username,
    };
  },
  methods: {
    login(username) {
      auth.signInAnonymously().then(res =>
        usersRef.child(res.user.uid).set({
          name: username,
        }),
      ).then(() => {
        auth.currentUser.updateProfile({
          displayName: username,
        });
      }).catch((e) => {
        console.error(e);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

<template>
  <section class="login hero is-success is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <h3 class="title has-text-grey">Login</h3>
          <p class="subtitle has-text-grey">Please login to proceed.</p>
          <div class="box">
            <figure class="avatar">
              <img src="https://placehold.it/128x128">
            </figure>
            <form>
              <div class="field">
                <div class="control">
                  <input class="input is-large" type="text" placeholder="Your Name" autofocus=""
                         v-model="username" />
                </div>
              </div>
              <button class="button is-block is-info is-large is-fullwidth"
                      @click="login(username)" :disabled="!username">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { auth, db } from './../firebase';

const usersRef = db.ref('users');

export default {
  name: 'login',
  data() {
    const username = auth.currentUser ? auth.currentUser.displayName : '';
    return {
      username,
    };
  },
  methods: {
    login(username) {
      auth.signInAnonymously()
        .then(res =>
          usersRef.child(res.user.uid).set({
            name: username,
          }),
        )
        .then(() => {
          auth.currentUser.updateProfile({
            displayName: username,
          });
        })
        .then(() => {
          this.$router.push('/vote');
        })
        .catch((e) => {
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

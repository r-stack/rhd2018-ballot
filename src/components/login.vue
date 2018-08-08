<template>
  <section id="login" class="hero is-success is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <h3 class="title has-text-grey">Login</h3>
          <p class="subtitle has-text-grey">Please login to vote.</p>
          <div class="box">
            <figure class="avatar">
              <img src="./../assets/r-stack.png">
            </figure>
            <form>
              <div class="field">
                <div class="control">
                  <input class="input is-large" type="text" placeholder="Your Name" autofocus=""
                         v-model="username" />
                </div>
              </div>
              <button class="button is-block is-info is-large is-fullwidth"
                      @click="login(username)" :disabled="!username || username.length > 63 || isClicked">
                      Login
              </button>
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
      isClicked: false,
    };
  },
  methods: {
    login(username) {
      this.isClicked = true;
      // TODO: if username.length > 63, show error message
      auth.signInAnonymously()
        .then(res => {
          console.log(res);
          return usersRef.child(res.user.uid).set({
              name: username,
          });
        })
        .then(() => {
          console.log("2");
          return auth.currentUser.updateProfile({
            displayName: username,
          });
        })
        .then(() => {
          console.log(3);
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
html,body {
  font-family: 'Open Sans', serif;
  font-size: 14px;
  font-weight: 300;
}
.hero.is-success {
  background: #F2F6FA;
}
.hero .nav, .hero.is-success .nav {
  -webkit-box-shadow: none;
  box-shadow: none;
}
.box {
  margin-top: 5rem;
}
.avatar {
  margin-top: -70px;
  padding-bottom: 20px;
}
.avatar img {
  padding: 5px;
  width: 128px;
  background: #fff;
  border-radius: 50%;
  -webkit-box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);
  box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);
}
input {
  font-weight: 300;
}
p {
  font-weight: 700;
}
p.subtitle {
  padding-top: 1rem;
}
</style>

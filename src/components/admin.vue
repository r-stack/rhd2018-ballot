<template>
  <section class="admin hero is-success is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <h3 class="title has-text-grey">Admin console</h3>
          <div class="field">
            <input id="statusSwitch" type="checkbox" class="switch is-rtl" v-model="statusSwitch">
            <label for="statusSwitch">投票受付</label>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { auth, db } from './../firebase';

export default {
  name: 'admin',
  data() {
    return {
      statusSwitch: false,
      meta: undefined,
    };
  },
  created() {
    const metaRef = db.ref('meta');
    this.createdPromise = new Promise((resolve, reject) => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          // if logged in
          resolve();
        } else {
          // if not
          reject(Error('not logged in'));
        }
      }, (e) => {
        reject(e);
      });
    })
      .then(() => new Promise((resolve, reject) => {
        this.$bindAsObject('meta', metaRef, () => {
          reject(Error('cannot bind meta'));
        }, () => {
          resolve();
        });
      }));
  },
  mounted() {
    this.createdPromise
      .then(() => {
        console.log(this.meta.isOpen);
        this.statusSwitch = this.meta.isOpen;
      })
      .catch((e) => {
        console.error(e);
      });
  },
  watch: {
    statusSwitch(newVal) {
      this.$firebaseRefs.meta.child('isOpen').set(newVal);
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
</style>

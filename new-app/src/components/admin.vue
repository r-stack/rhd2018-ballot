<template>
  <section class="admin hero is-success is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <h3 class="title has-text-grey">Admin console</h3>
          <div class="field">
            <input id="statusSwitch" type="checkbox" class="switch is-rtl" v-model="statusSwitch" />
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
  async created() {
    const metaRef = db.ref('meta');
    await this.$rtdbBind('meta', metaRef);
    this.statusSwitch = this.meta.isOpen;
    console.log('admin.created(): complete');
  },
  async mounted() {
    console.log('admin.mounted()', this.meta);
  },
  watch: {
    async statusSwitch(newVal) {
      try {
        await this.$firebaseRefs.meta.child('isOpen').set(newVal);
      } catch (e) {
        console.log(e);
        this.$toast.open({
          message: e,
          position: 'is-bottom',
          type: 'is-primary',
        });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body {
  font-family: "Open Sans", serif;
  font-size: 14px;
  font-weight: 300;
}
.hero.is-success {
  background: #f2f6fa;
}
.hero .nav,
.hero.is-success .nav {
  -webkit-box-shadow: none;
  box-shadow: none;
}
</style>

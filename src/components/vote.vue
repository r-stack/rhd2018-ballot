<template>
  <div id="vote">
  <section class="vote hero is-success is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <h3 class="title has-text-grey">投票</h3>
          <p class="subtitle has-text-grey">投票してください</p>
          <div class="box">
            <!-- <figure class="avatar">
              <img src="https://placehold.it/128x128">
            </figure> -->
            <form v-on:submit.prevent="vote">

              <div class="field">
                <label class="label">新規性</label>
                <div class="control has-icons-left has-icons-right">
                  <div class="select is-fullwidth">
                    <select v-model="user.surpriseVote">
                      <option value="0">----</option>
                      <option value="1">Party A</option>
                      <option value="2">Party B</option>
                      <option value="3">Party C</option>
                      <option value="4">Party D</option>
                      <option value="5">Party E</option>
                      <option value="6">Party F</option>
                      <option value="7">Party G</option>
                    </select>
                  </div>
                  <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <span class="icon is-small is-right">
                    <i class="fas fa-exclamation-triangle"></i>
                  </span>
                </div>
                <p class="help">アイデアが革新的でユニークか</p>
              </div>

              <div class="field">
                <label class="label">ゲーム化度</label>
                <div class="control has-icons-left has-icons-right">
                  <div class="select is-fullwidth">
                    <select v-model="user.impressionVote">
                      <option value="0">----</option>
                      <option value="1">Party A</option>
                      <option value="2">Party B</option>
                      <option value="3">Party C</option>
                      <option value="4">Party D</option>
                      <option value="5">Party E</option>
                      <option value="6">Party F</option>
                      <option value="7">Party G</option>
                    </select>
                  </div>
                  <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <span class="icon is-small is-right">
                    <i class="fas fa-exclamation-triangle"></i>
                  </span>
                </div>
                <p class="help">ゲームっぽい要素をうまく取り込んで課題を解決</p>
              </div>

              <div class="field">
                <label class="label">完成度</label>
                <div class="control has-icons-left has-icons-right">
                  <div class="select is-fullwidth">
                    <select v-model="user.techVote">
                      <option value="0">----</option>
                      <option value="1">Party A</option>
                      <option value="2">Party B</option>
                      <option value="3">Party C</option>
                      <option value="4">Party D</option>
                      <option value="5">Party E</option>
                      <option value="6">Party F</option>
                      <option value="7">Party G</option>
                    </select>
                  </div>
                  <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <span class="icon is-small is-right">
                    <i class="fas fa-exclamation-triangle"></i>
                  </span>
                </div>
                <p class="help">デモがキチンと動くか、コンセプトが実現しそうか</p>
              </div>
              <button type="submit"
                      class="button is-large is-primary is-rounded"
                      :disabled="!meta.isOpen">
                <span class="icon is-medium">
                  <i class="fas fa-box-open"></i>
                </span>
                <span>投票する</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
  </div>
</template>

<script>
import { auth, db } from '@/firebase';

export default {
  name: 'Vote',
  data() {
    console.log(auth, db);
    return {
      msg: '投票',
      comment: '',
      name: '',
      user: {
        surpriseVote: '0',
        impressionVote: '0',
        techVote: '0',
      },
      meta: { isOpen: false },
    };
  },
  beforeCreate() {
    console.log('vote: beforeCreate');
  },
  created() {
    console.log('vote: created');
    const metaRef = db.ref('meta');
    this.createdPromise = new Promise(async (resolve, reject) => {
      console.log('vote: bind metaRef');
      await this.$rtdbBind('meta', metaRef);
      console.log('vote: bind userRef');
      this.userRef = db.ref(`users/${auth.currentUser.uid}`);
      await this.$rtdbBind('user', this.userRef);
      resolve();
    });
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
  methods: {
    vote() {
      console.log('vote form submitted.');
      console.log(this.user.surpriseVote);
      console.log(this.user.impressionVote);
      console.log(this.user.techVote);
      const self = this;
      if (this.meta && !this.meta.isOpen) {
        console.log('isOpen=', this.meta.isOpen);
        this.$toast.open({
          message: '現在投票はできません',
          position: 'is-bottom',
          type: 'is-primary',
        });
        return;
      }
      if (!this.user.surpriseVote || this.user.surpriseVote === '0') {
        console.log('surpriseVote is required.');
        this.$toast.open({
          message: '全部入力してください',
          position: 'is-bottom',
          type: 'is-danger',
        });
        return;
      }
      if (!this.user.impressionVote || this.user.impressionVote === '0') {
        console.log('impressionVote is required.');
        this.$toast.open({
          message: '全部入力してください',
          position: 'is-bottom',
          type: 'is-danger',
        });
        return;
      }
      if (!this.user.techVote || this.user.techVote === '0') {
        console.log('techVote is required.');
        this.$toast.open({
          message: '全部入力してください',
          position: 'is-bottom',
          type: 'is-danger',
        });
        return;
      }
      if (!this.userRef) {
        console.log('no this.userRef');
        this.$toast.open({
          message: '1秒後にもっかい投票してね',
          position: 'is-bottom',
          type: 'is-danger',
        });
        return;
      }
      this.userRef.update({
        surpriseVote: this.user.surpriseVote,
        impressionVote: this.user.impressionVote,
        techVote: this.user.techVote,
      }, (error) => {
        if (error) {
          console.log('Failed vote', error);
          self.$toast.open({
            message: 'なんか失敗しました。もう一回お願い！',
            position: 'is-bottom',
            type: 'is-danger',
          });
        } else {
          console.log('Vote successfully.');
          self.$toast.open({
            message: '投票しました！',
            position: 'is-bottom',
            type: 'is-success',
          });
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hero.is-success {
  background: #F2F6FA;
}
h1,
h2 {
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

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
                <label class="label">驚き</label>
                <div class="control has-icons-left has-icons-right">
                  <div class="select is-fullwidth">
                    <select v-model="user.surpriseVote">
                      <option value="0">----</option>
                      <option value="1">Team 1</option>
                      <option value="2">Team 2</option>
                      <option value="3">Team 3</option>
                      <option value="4">Team 4</option>
                      <option value="5">Team 5</option>
                      <option value="6">Team 6</option>
                      <option value="7">Team 7</option>
                      <option value="8">Team 8</option>
                    </select>
                  </div>
                  <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <span class="icon is-small is-right">
                    <i class="fas fa-exclamation-triangle"></i>
                  </span>
                </div>
                <p class="help">ユニーク、びっくり</p>
              </div>

              <div class="field">
                <label class="label">感動</label>
                <div class="control has-icons-left has-icons-right">
                  <div class="select is-fullwidth">
                    <select v-model="user.impressionVote">
                      <option value="0">----</option>
                      <option value="1">Team 1</option>
                      <option value="2">Team 2</option>
                      <option value="3">Team 3</option>
                      <option value="4">Team 4</option>
                      <option value="5">Team 5</option>
                      <option value="6">Team 6</option>
                      <option value="7">Team 7</option>
                      <option value="8">Team 8</option>
                    </select>
                  </div>
                  <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <span class="icon is-small is-right">
                    <i class="fas fa-exclamation-triangle"></i>
                  </span>
                </div>
                <p class="help">いいね、使ってみたい</p>
              </div>

              <div class="field">
                <label class="label">技術</label>
                <div class="control has-icons-left has-icons-right">
                  <div class="select is-fullwidth">
                    <select v-model="user.techVote">
                      <option value="0">----</option>
                      <option value="1">Team 1</option>
                      <option value="2">Team 2</option>
                      <option value="3">Team 3</option>
                      <option value="4">Team 4</option>
                      <option value="5">Team 5</option>
                      <option value="6">Team 6</option>
                      <option value="7">Team 7</option>
                      <option value="8">Team 8</option>
                    </select>
                  </div>
                  <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <span class="icon is-small is-right">
                    <i class="fas fa-exclamation-triangle"></i>
                  </span>
                </div>
                <p class="help">技術的にすごい、完成度がすごい</p>
              </div>
              <button type="submit" class="button is-large is-primary is-rounded">
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
const ballotRef = db.ref(`/users/`);
export default {
  name: 'Vote',
  data() {
    console.log(auth, db);
    return {
      msg: '投票',
      comment: '',
      name: '',
      user: {
        'surpriseVote':"0",
        'impressionVote':"0",
        "techVote":"0",
      },
      meta: undefined,
    };
  },
  beforeCreate: function(){
    console.log("vote: beforeCreate");
    auth.onAuthStateChanged((user) =>{
      if(user){
        this.user = user;
        //TODO: bind
      }
    })
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
    }))
    .then(() => new Promise((resolve, reject) => {
      this.userRef = db.ref('users/' + auth.currentUser.uid)
      this.$bindAsObject('user', this.userRef, () => {
        reject(Error('cannot bind user'));
      }, () => {
        resolve();
      });
    }))
    
    ;

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
  methods:{
    vote: function() {
      console.log("vote form submitted.");
      console.log(this.user.surpriseVote);
      console.log(this.user.impressionVote);
      console.log(this.user.techVote);
      if(!this.user.surpriseVote || this.user.surpriseVote === '0'){
        console.log("surpriseVote is required.");
        return;
      }
      if(!this.user.impressionVote || this.user.impressionVote === '0'){
        console.log("impressionVote is required.");
        return;
      }
      if(!this.user.techVote || this.user.techVote === '0'){
        console.log("techVote is required.");
        return;
      }
      if(!this.userRef){
        console.log("no this.userRef");
        return;
      }
      this.userRef.update({
        'surpriseVote': this.user.surpriseVote,
        'impressionVote': this.user.impressionVote,
        'techVote': this.user.techVote,
      }, function(error){
        if(error){
          console.log("Failed vote", error);
        }else{
          console.log("Vote successfully.");
          alert("Voted");
        }
      })


    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

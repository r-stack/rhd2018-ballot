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
                    <select v-model="odo">
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
                    <select v-model="kan">
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
                    <select v-model="tech">
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
// const ballotRef = db.ref(`/users/${auth.currentUser.uid}`);
export default {
  name: 'Vote',
  data() {
    console.log(auth, db);
    return {
      msg: '投票',
      odo: 0,
      kan: 0,
      tech: 0,
      comment: '',
      name: '',
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
  firebase: {
    ballot: `/users/`,
  },
  methods:{
    vote: function() {
      console.log("vote form submitted.");
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

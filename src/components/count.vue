<template>
  <section id="count" class="hero is-success is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <h3 class="title has-text-grey">{{votedUserNum + " / " + userNum + "人投票済み"}}</h3>
        <div v-if="isOpen">



        <div class="column is-4 is-offset-4">
          <table class="table">
            <thead>
              <tr>
                <th>Party#</th>
                <th>新規性</th>
                <th>ゲーム化度</th>
                <th>完成度</th>
                <th>合計点</th>
              </tr>
              <tr v-for="team in teams" :key="team.teamId">
                <td>{{team.teamId}}</td>
                <td>{{team.surprisePoint}}</td>
                <td>{{team.impressionPoint}}</td>
                <td>{{team.techPoint}}</td>
                <td>{{team.totalPoint}}</td>
              </tr>
            </thead>
          </table>
        </div>
        </div><!-- v-id -->
      </div>
    </div>
  </section>
</template>

<script>
import _ from 'underscore';
import { auth, db } from './../firebase';

export default {
  name: 'count',
  data() {
    return {
      users: undefined,
      meta: undefined,
    };
  },
  created() {
    const metaRef = db.ref('meta');
    const usersRef = db.ref('users');
    this.createdPromise = new Promise(async (resolve, reject) => {
      console.log('count: bind metaRef');
      await this.$rtdbBind('meta', metaRef);
      console.log('count: bind userRef');
      await this.$rtdbBind('users', usersRef);
      resolve();
    });
  },
  mounted() {
    this.createdPromise
      .then(() => {
        console.log('ok');
      })
      .catch((e) => {
        console.error(e);
      });
    const canvas = this.$refs.canvas;
    console.log('count:mounted()', canvas);
  },
  computed: {
    teams() {
      const surprisePoints = _.pluck(this.users, 'surpriseVote');
      const impressionPoints = _.pluck(this.users, 'impressionVote');
      const techPoints = _.pluck(this.users, 'techVote');
      const teamPoints = [];
      const teamLabel = 'ABCDEFG';
      for (let i = 0; i < teamLabel.length; i++) {
        teamPoints[i] = {
          teamId: `Party ${teamLabel[i]}`,
          surprisePoint: _.filter(surprisePoints, (p) => p === (i + 1).toString())
            .length,
          impressionPoint: _.filter(
            impressionPoints,
            (p) => p === (i + 1).toString(),
          ).length,
          techPoint: _.filter(techPoints, (p) => p === (i + 1).toString()).length,
        };
      }
      for (let i = 0; i < teamLabel.length; i++) {
        const teamPoint = teamPoints[i];
        teamPoints[i].totalPoint =
          teamPoint.surprisePoint +
          teamPoint.impressionPoint +
          teamPoint.techPoint;
      }
      return teamPoints;
    },
    isOpen() {
      console.log('count:isOpen', this.meta);
      return this.meta ? this.meta.isOpen : false;
    },
    userNum() {
      if (this.users) {
        return Object.keys(this.users).length;
      } else {
        return 0;
      }
    },
    votedUserNum() {
      const votedUsers = _.filter(
        this.users,
        (user) =>
          user.surpriseVote !== undefined &&
          user.impressionVote !== undefined &&
          user.techVote !== undefined,
      );
      return votedUsers.length;
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
.box {
  margin-top: 5rem;
}
.avatar {
  margin-top: -70px;
  padding-bottom: 20px;
}
.avatar img {
  padding: 5px;
  background: #fff;
  border-radius: 50%;
  -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1),
    0 0 0 1px rgba(10, 10, 10, 0.1);
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
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

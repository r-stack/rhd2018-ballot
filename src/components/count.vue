<template>
  <section id="count" class="hero is-success is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <table class="table">
            <thead>
              <tr>
                <th>Team#</th>
                <th>驚き点</th>
                <th>感動点</th>
                <th>技術点</th>
                <th>合計点</th>
              </tr>
              <tr v-for="team in teams">
                <td>{{team.teamId}}</td>
                <td>{{team.surprisePoint}}</td>
                <td>{{team.impressionPoint}}</td>
                <td>{{team.techPoint}}</td>
                <td>{{team.totalPoint}}</td>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { auth, db } from './../firebase';
import _ from 'underscore';

export default {
  name: 'count',
  data() {
    return {
      uRef: db.ref('users'),
      users: undefined,
      meta: undefined,
    };
  },
  firebase: {
    users: db.ref('users'),
  },
  created() {
    const metaRef = db.ref('meta');
    const usersRef = db.ref('users');
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
        this.$bindAsArray('users', usersRef, () => {
          reject(Error('cannot bind users'));
        }, () => {
          resolve();
        });
      }))
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
        console.log('ok');
      })
      .catch((e) => {
        console.error(e);
      });
  },
  computed: {
    teams() {
      const surprisePoints = _.pluck(this.users, 'surpriseVote');
      const impressionPoints = _.pluck(this.users, 'impressionVote');
      const techPoints = _.pluck(this.users, 'techVote');
      const teamPoints = new Array();
      for (let i = 0; i < 8; i++) {
        teamPoints[i] = {
          teamId: (i + 1).toString(),
          surprisePoint: _.filter(surprisePoints, p => p === (i + 1).toString()).length,
          impressionPoint: _.filter(impressionPoints, p => p === (i + 1).toString()).length,
          techPoint: _.filter(techPoints, p => p === (i + 1).toString()).length,
        }
      }
      for (let i = 0; i < 8; i++) {
        let teamPoint = teamPoints[i]
        teamPoints[i].totalPoint = teamPoint.surprisePoint + teamPoint.impressionPoint + teamPoint.techPoint;
      }
      return teamPoints;
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

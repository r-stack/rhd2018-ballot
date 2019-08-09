<template>
  <section id="game" class="hero is-success is-fullheight is-centered">
    <canvas id="gameCanvas" ref="gameCanvas" width="800" height="600" v-on:click="onclick" />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import _, { List } from 'underscore';
import { auth, db } from './../firebase';
import { AdvancedBloomFilter } from '@pixi/filter-advanced-bloom';
import * as PIXI from 'pixi.js';
import * as PIXIS from 'pixi-sound';

interface User {
  totalPoint: number;
  surpriseVote: string;
  impressionVote: string;
  techVote: string;

}
@Component
export default class Game extends Vue {
  public users: User[] = [];
  public meta = {isOpen: true};
  private createdPromise: Promise<void>;
  private PIXIApp?: PIXI.Application;
  private trophy?: PIXI.Texture;
  private win?: PIXI.Sprite;
  private ranking: number[] = [];
  private parties: PIXI.Sprite[] = [];
  private ticker: (delta: any) => void;
  startTime: number;
  count: number;
  complete: boolean = false;


  public data() {
    return {
      users: undefined,
      meta: undefined,
    };
  }

  public created() {
    const metaRef = db.ref('meta');
    const usersRef = db.ref('users');
    this.createdPromise = new Promise(async (resolve, reject) => {
      console.log('count: bind metaRef');
      await this.$rtdbBind('meta', metaRef);
      console.log('count: bind userRef');
      await this.$rtdbBind('users', usersRef);
      resolve();
    });
  }

  public mounted() {
    this.createdPromise
      .then(() => {
        console.log('ok');
      })
      .catch((e) => {
        console.error(e);
      });
    const canvas = this.$refs.gameCanvas as HTMLCanvasElement;
    console.log('count:mounted()', canvas);
    this.PIXIApp = new PIXI.Application({
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
      view: canvas,
      antialias: true,
      transparent: false,
    });

    PIXIS.default.add({
      1: require('./../assets/sounds/damage1.mp3'),
      2: require('./../assets/sounds/damage2.mp3'),
      3: require('./../assets/sounds/damage3.mp3'),
      4: require('./../assets/sounds/damage4.mp3'),
      5: require('./../assets/sounds/damage5.mp3'),
      6: require('./../assets/sounds/damage6.mp3'),
      'win': require('./../assets/sounds/win.mp3'),
    });

    const bg = new PIXI.Sprite(PIXI.Texture.from(require('./../assets/images/bg.png')));
    this.PIXIApp.stage.addChild(bg);
    const t1 = PIXI.Texture.from(require('./../assets/images/p1.png'));
    const t2 = PIXI.Texture.from(require('./../assets/images/p2.png'));
    const t3 = PIXI.Texture.from(require('./../assets/images/p3.png'));
    const t4 = PIXI.Texture.from(require('./../assets/images/p4.png'));
    const t5 = PIXI.Texture.from(require('./../assets/images/p5.png'));
    const t6 = PIXI.Texture.from(require('./../assets/images/p6.png'));
    const t7 = PIXI.Texture.from(require('./../assets/images/p7.png'));
    function createSprite(t: PIXI.Texture): PIXI.Sprite {
      const p = new PIXI.Sprite(t);
      p.anchor.set(0.5);
      return p;
    }
    const p1 = createSprite(t1);
    const p2 = createSprite(t2);
    const p3 = createSprite(t3);
    const p4 = createSprite(t4);
    const p5 = createSprite(t5);
    const p6 = createSprite(t6);
    const p7 = createSprite(t7);

    const parties = this.parties = [
      p1, p2, p3, p4, p5, p6, p7
    ]
    for (let i=0;i<parties.length;i++){
      const p = parties[i];
      p.x = 100 * i + 100;
      p.y = 420;

      this.PIXIApp.stage.addChild(p);
    }

    const trophyUrl = require('./../assets/images/trophy.png');
    this.trophy = PIXI.Texture.from(trophyUrl);
    this.win = new PIXI.Sprite(this.trophy);
    this.win.anchor.set(0.5);
    this.win.scale.set(0.5, 0.5);
    this.win.x = 400;
    this.PIXIApp.stage.addChild(this.win);
    console.log(this.win);
    // this.PIXIApp.stop();
  }

  get rank() {
    return this.teams.sort((a,b)=> a.totalPoint-b.totalPoint);
  }
  get teams() {
      const surprisePoints = _.pluck(this.users, 'surpriseVote');
      const impressionPoints = _.pluck(this.users, 'impressionVote');
      const techPoints = _.pluck(this.users, 'techVote');
      const teamPoints = [];
      const teamLabel = 'ABCDEFG';
      for (let i = 0; i < teamLabel.length; i++) {
        teamPoints[i] = {
          teamIdx: i,
          teamId: `Party ${teamLabel[i]}`,
          surprisePoint: _.filter(surprisePoints, (p) => p === (i + 1).toString())
            .length,
          impressionPoint: _.filter(
            impressionPoints,
            (p) => p === (i + 1).toString(),
          ).length,
          techPoint: _.filter(techPoints, (p) => p === (i + 1).toString()).length,
          totalPoint: 0,
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
    }

  get isOpen() {
      console.log('count:isOpen', this.meta);
      return this.meta ? this.meta.isOpen : false;
    }

  get  userNum() {
      if (this.users) {
        return Object.keys(this.users).length;
      } else {
        return 0;
      }
    }

  get votedUserNum() {
      const votedUsers = _.filter(
        this.users,
        (user) =>
          user.surpriseVote !== undefined &&
          user.impressionVote !== undefined &&
          user.techVote !== undefined,
      );
      return votedUsers.length;
  }

  public onclick() {
    console.log(this.teams);
    console.log(this.rank);
    const ranking = this.rank.map((d)=> d.teamIdx);
    console.log(ranking);
    this.ranking = ranking;
    this.startGame();

  }
  public startGame(): any {
    const app: PIXI.Application = this.PIXIApp;
    // randmize initial direction
    app.start();
    if (!this.ticker){
      for(const p of this.parties){
        p.scale.x = Math.random()> 0.5 ? 1 : -1;
      }
      this.startTime = new Date().getTime();
      this.count = -1;
      this.ticker = (delta)=>{this.battle(delta)};
      app.ticker.add(this.ticker);
    } else if(this.complete) {
    } else {
      app.stop();
    }
  }
  public goComplete(){
      console.log("go complete");
      const app: PIXI.Application = this.PIXIApp;
      PIXIS.default.play('win');
      app.ticker.remove(this.ticker);
      app.ticker.add((delta)=>{
        if(this.win.y < 300){
          this.win.y += delta; 
        }
        const p = this.parties[this.ranking[6]];
        if(p.x < 400){
          p.x += 0.5 * delta;
        }

      });
  }
  public battle(delta){
    const app: PIXI.Application = this.PIXIApp;
    const cnow = new Date().getTime();
    for(let i=0; i<this.parties.length;i++){
      const p = this.parties[this.ranking[i]];
      // const p = this.parties[i];
      const group = i % 2 === 0 ? [400,100]:[700,400];

      if(p.rotation > 0){
        continue;
      }
      
      if (p.scale.x > 0){
        p.x += 15 * delta;
        if(p.x > group[0]){
          p.scale.x = -1;
        }
      } else {
        p.x -= 15 * delta;
        if(p.x < group[1]){
          p.scale.x = 1;
        }
      }
    }
    const time = cnow - this.startTime - 2000;
    const nowcount = time / 2000;
    if(time >= 0 && this.count < nowcount && this.count < 6){
      this.count += 1;
      console.log(this.count);
      const p = this.parties[this.ranking[this.count]];
      if (this.count < 6){
        p.rotation += 90;
        PIXIS.default.play(`${this.count+1}`);
        app.ticker.add((delta)=>{
          p.alpha -= delta*0.01;
        })
      }else{
        this.complete = true;
        this.goComplete();
      }
    }



  }
}
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
#gameCanvas {
  width: 800px;
  height: 600px;
}
</style>

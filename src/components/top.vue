<template>
  <div class="top">
    <h1>{{ msg }}</h1>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h2 class="title">Ballot投票</h2>
          <h2 class="subtitle"> Ecosystem</h2>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'top',
  data () {
    return {
      msg: 'Welcome to BALLOT'
    }
  }
}
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

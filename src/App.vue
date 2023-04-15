<template>
  <ul>
    <li><router-link to="/"> Home </router-link></li>
    <li><router-link to="/canvas"> Canvas </router-link></li>
    <li><router-link to="/textlayer"> Text Layer</router-link></li>
  </ul>
  <router-view></router-view>
</template>

<script>
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
ul {
  list-style-type: none;
  display: flex;
  justify-content: space-around;
}
</style>

<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <div >
      <img hidden :src="`${img}`" :key="`preloadimage-${key}`" v-for="(img, key) in images">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: {}
    }
  },
  mounted() {
    this.importAll(require.context("./assets/", true, /\.png$/));
  },
  methods: {
    importAll(r) {
      var imgs = {};
      r.keys().forEach(key => (imgs[key] = r(key)));
      this.images = imgs;
    }
  }
}
</script>

<style>

body {
  height: 100vh;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  user-select: none;
  height: 100%;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<template>
  <div id="app">
    <button id="opensettings" @click="showSettings = true">SETTINGS</button>
    <Settings v-if="showSettings" @closesettings="showSettings = false" :settings="settings" @updateSettings="updateSettings"></Settings>
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
import Settings from '@/components/Settings.vue';

export default {
  components: {
    Settings
  },
  data() {
    return {
      images: {},
      settings: {
        animationDuration: 1000
      },
      showSettings: false
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
    },
    updateSettings (e) {
      this.settings = e;
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

#opensettings {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 100;
}
</style>

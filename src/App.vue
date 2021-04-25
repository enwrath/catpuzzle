<template>
  <div id="app">
    <button id="opensettings" @click="showSettings = true">⚙️</button>
    <Settings v-if="showSettings" @closesettings="showSettings = false" :settings="settings" @updateSettings="updateSettings"></Settings>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <div hidden>
      <input id="animSpeed" type="number" disabled v-model="settings.animationDuration" />
      <img :src="`${img}`" :key="`preloadimage-${key}`" v-for="(img, key) in images">
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
    this.importAll(require.context("./assets/", true, /\.webp$/));
    this.loadSettings();
  },
  methods: {
    importAll(r) {
      var imgs = {};
      r.keys().forEach(key => (imgs[key] = r(key)));
      this.images = imgs;
    },
    updateSettings(e) {
      this.settings = e;
      this.saveSettings();
    },
    loadSettings() {
      const a = localStorage.getItem("animSpeed");
      if (a !== null) this.settings.animationDuration = parseInt(a);
    },
    saveSettings() {
      localStorage.setItem("animSpeed", this.settings.animationDuration);
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
h1 {
  margin-top: 0;
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
  max-width: 4rem;
  height: 2rem;
  max-height: 2rem;
  font-size: 1.5rem;
  width: 4rem;
  line-height: 0;
}
</style>

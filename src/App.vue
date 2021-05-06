<template>
  <div id="app" @click="startMusic">
    <button id="opensettings" @click="showSettings = true">⚙️</button>
    <Settings v-if="showSettings" @closesettings="showSettings = false" :settings="settings" @playsound="playSound" @updateSettings="updateSettings"></Settings>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" @playsound="playSound"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" @playsound="playSound"></router-view>
    <div hidden>
      <audio id="music" preload="auto" loop :src="require(`@/assets/music.ogg`)">
      </audio>
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
        animationDuration: 1000,
        volume: 0.3,
        volumemusic: 0.3
      },
      showSettings: false,
      sounds: {
        good: require('@/assets/good.ogg'),
        bad: require('@/assets/bad.ogg')
      }
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
      document.getElementById("music").volume = this.settings.volumemusic;
      this.saveSettings();
    },
    startMusic() {
      document.getElementById("music").volume = this.settings.volumemusic;
      document.getElementById("music").play();
    },
    loadSettings() {
      const a = localStorage.getItem("animSpeed");
      if (a !== null) this.settings.animationDuration = parseInt(a);

      const b = localStorage.getItem("volume");
      if (b !== null) {
        this.settings.volume = parseFloat(b);
      }

      const c = localStorage.getItem("volumemusic");
      if (c !== null) {
        this.settings.volumemusic = parseFloat(c);
        document.getElementById("music").volume = this.settings.volumemusic;
      }
    },
    saveSettings() {
      localStorage.setItem("animSpeed", this.settings.animationDuration);
      localStorage.setItem("volume", this.settings.volume);
      localStorage.setItem("volumemusic", this.settings.volumemusic);
    },
    playSound(e){
      console.log(e)
      var audio = document.createElement('audio');
      audio.src = this.sounds[e];
      document.body.appendChild(audio);
      audio.volume = this.settings.volume;
      audio.play();

      audio.onended = function () {
        this.parentNode.removeChild(this);
      }
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
  background: rgb(117,148,126);
  background: linear-gradient(180deg, rgba(117,148,126,1) 10%, rgba(112,193,137,1) 50%, rgba(117,148,126,1) 90%);
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
  max-width: 3.5rem;
  height: 2rem;
  max-height: 2rem;
  font-size: 1.5rem;
  width: 4rem;
  line-height: 0;
  border-radius: 10%;
  background-color: #8abcd2;
  margin: 2px;
}
#opensettings:hover {
  background-color: #9fe2ff;
}
</style>

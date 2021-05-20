<template>
  <div class="container">
    <div class="subcontainer">
      <button class="topright" @click="$emit('closesettings')">X</button>
      <h3>Settings</h3>

      <h4>Music volume</h4>
      <input type="range" id="volumemusic" name="volume" min="0" max="1" step="0.01" v-model.number="volumemusic" @change="volumeChangeMusic">

      <h4>Sound Volume</h4>
      <input type="range" id="volume" name="volume" min="0" max="1" step="0.01" v-model.number="volume" @change="volumeChange">

      <h4>Animation Speed</h4>
      <button @click="changeSpeed(1000)" :class="{selectedBtn : animationDuration===1000}">Normal</button>
      <button @click="changeSpeed(500)" :class="{selectedBtn : animationDuration===500}">Fast</button>
      <button @click="changeSpeed(200)" :class="{selectedBtn : animationDuration===200}">Very fast</button>
      <button @click="changeSpeed(0)" :class="{selectedBtn : animationDuration===0}">No animations</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Settings',
  props: {
    settings: Object
  },
  data() {
    return {
      animationDuration: this.settings.animationDuration,
      volume: this.settings.volume,
      volumemusic: this.settings.volumemusic
    }
  },
  methods: {
    volumeChange() {
      this.updateSettings();
      this.$emit('playsound', 'good');
    },
    volumeChangeMusic() {
      this.updateSettings();
    },
    updateSettings() {
      const newSettings = {animationDuration: this.animationDuration, volume: this.volume, volumemusic: this.volumemusic};
      this.$emit("updateSettings", newSettings);
    },
    changeSpeed(e) {
      this.animationDuration = e;
      this.updateSettings();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  position: absolute;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}
.subcontainer {
  position: relative;
  font-size: 3vw;
  padding: 10vh 10vw;
  background: #b59191;
  border-style: solid;
  border-color: #8c7228
}
.topright {
  font-size: 3vw;
  font-weight: bold;
  position: absolute;
  top: 0;
  right: 0;
}
.selectedBtn {
  background-color: #b3ffd7;
}
.selectedBtn:hover {
  background-color: #b3ffd7;
}
button {
  vertical-align: top;
  width: 10vw;
  height: 6vw;
  font-size: 1.5vw;
  border-radius: 10%;
  background-color: #8abcd2;
}
button:hover {
  background-color: #9fe2ff;
}
h3 {
  margin-top: -1em;
}

/* Generated with some online tool */
input[type=range] {
  width: 100%;
  margin: 8px 0;
  background-color: transparent;
  -webkit-appearance: none;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  background: #8abcd2;
  border: 0;
  border-radius: 6px;
  width: 100%;
  height: 16px;
  cursor: pointer;
}
input[type=range]::-webkit-slider-thumb {
  margin-top: -8px;
  width: 16px;
  height: 32px;
  background: #b3ffd7;
  border: 2px solid #000000;
  border-radius: 4px;
  cursor: pointer;
  -webkit-appearance: none;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: #9cc7d9;
}
input[type=range]::-moz-range-track {
  background: #8abcd2;
  border: 0;
  border-radius: 6px;
  width: 100%;
  height: 16px;
  cursor: pointer;
}
input[type=range]::-moz-range-thumb {
  width: 16px;
  height: 32px;
  background: #b3ffd7;
  border: 2px solid #000000;
  border-radius: 4px;
  cursor: pointer;
}
input[type=range]::-ms-track {
  background: transparent;
  border-color: transparent;
  border-width: 8px 0;
  color: transparent;
  width: 100%;
  height: 16px;
  cursor: pointer;
}
input[type=range]::-ms-fill-lower {
  background: #78b1cb;
  border: 0;
  border-radius: 12px;
}
input[type=range]::-ms-fill-upper {
  background: #8abcd2;
  border: 0;
  border-radius: 12px;
}
input[type=range]::-ms-thumb {
  width: 16px;
  height: 32px;
  background: #b3ffd7;
  border: 2px solid #000000;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0px;
  /*Needed to keep the Edge thumb centred*/
}
input[type=range]:focus::-ms-fill-lower {
  background: #8abcd2;
}
input[type=range]:focus::-ms-fill-upper {
  background: #9cc7d9;
}
@supports (-ms-ime-align:auto) {
  /* Pre-Chromium Edge only styles, selector taken from hhttps://stackoverflow.com/a/32202953/7077589 */
  input[type=range] {
    margin: 0;
    /*Edge starts the margin from the thumb, not the track as other browsers do*/
  }
}

</style>

<template>
  <div class="container">
    <div class="subcontainer">
      <button class="topright" @click="$emit('closesettings')">X</button>
      SETTINGS<br />
      <label for="animSpeed">Animation duration</label><br />
      <input type="range" id="animSpeed" name="animSpeed" min="0" max="1000" v-model.number="animationDuration" @change="updateSettings">
    </div>
  </div>
</template>

<script>

export default {
  name: 'PuzzleCompleted',
  props: {
    settings: Object
  },
  data() {
    return {
      animationDuration: this.settings.animationDuration
    }
  },
  methods: {
    updateSettings() {
      const newSettings = {animationDuration: this.animationDuration};
      this.$emit("updateSettings", newSettings);
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
  margin-top: -20%;
  padding: 2em;
  background: #ab7e5d;
  width: 60%;
  height: 40%;
  border-style: solid;
  border-color: #8c7228
}
.topright {
  position: absolute;
  top: 0;
  right: 0;
}
</style>

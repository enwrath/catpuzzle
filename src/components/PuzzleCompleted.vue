<template>
  <div class="container">
    <div class="subcontainer">

      <h1>Level Completed!</h1>
      <br /><br /><br />
      <button @click="$emit('restartlevel')">Replay level</button>

      <router-link v-if="fromEditor" to="/leveledit" custom v-slot="{ navigate }">
        <button @click="navigate">Back to level editor</button>
      </router-link>
      <router-link v-if="!fromEditor" to="/levelselect" custom v-slot="{ navigate }">
        <button @click="navigate">Level selection</button>
      </router-link>
      <router-link v-if="nextLevelExists && !fromEditor" :to="`/game/${worldId}-${nextLevel}`" custom v-slot="{ navigate }">
        <button @click="navigate">Next level</button>
      </router-link>

      <p>
        TODO: add images here
      </p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PuzzleCompleted',
  props: {
    nextLevelExists: Boolean,
    nextLevel: Number,
    worldId: String,
    fromEditor: Boolean,
    currentLevel: String
  },
  mounted() {
    if (this.worldId !== "custom") this.markCompleted();
  },
  methods: {
    markCompleted() {
      const keystring = `world-${this.worldId}`;
      const data = localStorage.getItem(keystring);
      if (data === null) localStorage.setItem(keystring, JSON.stringify([this.currentLevel]));
      else {
        const parsed = JSON.parse(data);
        if (!parsed.includes(this.currentLevel)) {
          parsed.push(this.currentLevel);
          localStorage.setItem(keystring, JSON.stringify(parsed));
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  position: absolute;
  z-index: 50;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}
.subcontainer {
  margin-top: -20%;
  padding: 2em;
  background: #ab7e5d;
  width: 60%;
  height: 40%;
  border-style: solid;
  border-color: #8c7228
}
button {
  height: 3em;
  margin: 0.25em;
}
</style>

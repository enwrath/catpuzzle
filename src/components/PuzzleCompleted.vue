<template>
  <div>
    <p >PUZZLE COMPLETE! ALL CATS ARE IN BOXES.</p>
    <button @click="$emit('restartlevel')">Replay level</button>
    <router-link to="/levelselect" custom v-slot="{ navigate }">
      <button @click="navigate">Level selection</button>
    </router-link>
    <router-link v-if="nextLevelExists" :to="`/game/${nextLevel}`" custom v-slot="{ navigate }">
      <button @click="navigate">Next level</button>
    </router-link>
  </div>
</template>

<script>

export default {
  name: 'PuzzleCompleted',
  props: {
    nextLevelExists: Boolean,
    nextLevel: Number
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  background: green;
  position: absolute;
  left: 2em;
  top: 2em;
  padding: 5em;
  z-index: 50;
}
</style>

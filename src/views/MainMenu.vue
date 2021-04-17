<template>
  <div>
    <h1>CAT PUZZLE BOX GAME</h1>
    <router-link to="/levelselect" custom v-slot="{ navigate }">
      <button @click="navigate">Play</button>
    </router-link>
    <router-link to="/leveledit" custom v-slot="{ navigate }">
      <button @click="navigate">Level editor</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'MainMenu'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
button {
  width: 30%;
  min-width: 12em;
  height: 4em;
  margin-bottom: 2em;
}
</style>

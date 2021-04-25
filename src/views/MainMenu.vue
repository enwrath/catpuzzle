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
h1 {
  margin-top: 2rem;
}
div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
button {
  width: 30%;
  min-width: 8em;
  height: 2em;
  margin-bottom: 1em;
  border-radius: 1em;
  background-color: #8abcd2;
  font-size: xx-large;
  font-weight: bold;
  text-shadow: -1px 1px 0 #000000,1px 1px 0 #000000,1px -1px 0 #000000,-1px -1px 0 #000000;
  color: #FFFFFF;
  box-shadow: 1px 4px #888888;
}
button:hover {
  background-color: #9fe2ff;
}
</style>

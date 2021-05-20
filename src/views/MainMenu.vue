<template>
  <div>
    <img :src="require(`@/assets/cat.webp`)" />
    <h1>Kittzzles</h1>
    <h3>Kitten Puzzles</h3>
    <router-link to="/levelselect" custom v-slot="{ navigate }">
      <button @click="navigate">Play</button>
    </router-link>
    <router-link to="/leveledit" custom v-slot="{ navigate }">
      <button @click="navigate">Level editor</button>
    </router-link>
    <router-link to="/about" custom v-slot="{ navigate }">
      <button @click="navigate">About</button>
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
  font-size: 5.5vw;
  text-shadow: -1px 1px 0 #000000,1px 1px 0 #000000,1px -1px 0 #000000,-1px -1px 0 #000000;
  color: #FFFFFF;
  margin-bottom: 0;
  text-decoration: underline;
}
h3 {
  font-size: 2.5vw;
  margin-top: 0;
  text-shadow: -1px 1px 0 #000000,1px 1px 0 #000000,1px -1px 0 #000000,-1px -1px 0 #000000;
  color: #FFFFFF;
}
div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
button {
  width: 40vw;
  height: 10vh;
  margin-bottom: 5vh;
  border-radius: 5vw;
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
img {
  width: 17vw;
  max-width: 240px;
}
</style>

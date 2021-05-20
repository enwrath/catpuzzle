<template>
  <div>
    <router-link to="/" custom v-slot="{ navigate }">
      <button class="backbutton" @click="navigate">Back</button>
    </router-link>
    <img :src="require(`@/assets/cat.webp`)" />
    <h1>Kittzzles</h1>
    <h3>Kitten Puzzles</h3>
    <p>
      Created with VueJS as a learning experience.
      <br />
      This is a test build, with all the planned features implemented.
      <br />
      This game uses local storage to save settings and completed levels.
      <br /><br />
      Music:<br />
      Just Add Synths by <a target="_blank" rel="noopener noreferrer" href="https://opengameart.org/users/3xblast">3xBlast</a>
    </p>
  </div>
</template>

<script>
export default {
  name: 'About'
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
p {
  font-size: 3vw;
  text-shadow: -1px 1px 0 #000000,1px 1px 0 #000000,1px -1px 0 #000000,-1px -1px 0 #000000;
  color: #FFFFFF;
}
div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
img {
  width: 17vw;
  max-width: 240px;
}
</style>

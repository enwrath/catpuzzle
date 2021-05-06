<template>
  <div>
    <router-link to="/" custom v-slot="{ navigate }">
      <button class="backbutton" @click="navigate">Back</button>
    </router-link>
    <br />
    <img :src="require(`@/assets/cat.webp`)" />
    <h1>Kittzzles</h1>
    <h3>Kitten Puzzles</h3>
    <br /><br />
    <p>
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
  font-size: 3em;
  text-shadow: -1px 1px 0 #000000,1px 1px 0 #000000,1px -1px 0 #000000,-1px -1px 0 #000000;
  color: #FFFFFF;
  margin-bottom: 0;
  text-decoration: underline;
}
h3 {
  margin-top: 0;
  text-shadow: -1px 1px 0 #000000,1px 1px 0 #000000,1px -1px 0 #000000,-1px -1px 0 #000000;
  color: #FFFFFF;
}
p {
  font-size: 1.5em;
  text-shadow: -1px 1px 0 #000000,1px 1px 0 #000000,1px -1px 0 #000000,-1px -1px 0 #000000;
  color: #FFFFFF;
}
div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
img {
  width: 8em;
}
</style>

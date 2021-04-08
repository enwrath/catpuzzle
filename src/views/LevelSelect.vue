<template>
  <div>
    <router-link to="/">Back to main menu</router-link>
    <div v-if="worldSelected === '-1'">
      <h1>Select World</h1>
      <div :key="`world-${i}`" v-for="(world, i) in levels.worlds" >
        <button @click="worldSelected=i">{{world.name}}</button>
      </div>
      <button @click="worldSelected='all'">All levels</button>
    </div>
    <div v-if="worldSelected !== '-1' && worldSelected !== 'all'">
      <button @click="worldSelected='-1'">Back to world selection</button>
      <h1>Select Level</h1>
      <div :key="`level-${level}`" v-for="level in levels.worlds[worldSelected].levels" >
        <router-link :to="`/game/${level}`">{{levels.levels[level].name}}</router-link>
      </div>
    </div>
    <div v-if="worldSelected==='all'">
      <button @click="worldSelected='-1'">Back to world selection</button>
      <div :key="`level-all-${level.id}`" v-for="level in levels.levels" >
        <router-link :to="`/game/${level.id}`">{{level.name}}</router-link>
      </div>
    </div>

    <div>
      <h1>Custom level</h1>
      <input type="text" v-model="levelBase64" id="customLevel" placeholder="Paste level code here">

      <router-link :to="`/game/custom-${levelBase64}`" custom v-slot="{ navigate }">
        <button @click="navigate" :disabled="levelBase64 === ''">Testplay</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import levelList from "../data/levellist.json";

export default {
  name: 'LevelSelect',
  data() {
    return {
      levels: levelList,
      levelBase64: "",
      worldSelected: "-1"
    };
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

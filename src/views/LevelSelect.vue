<template>
  <div>
    <router-link to="/">Back to main menu</router-link>
    <h1>Select level</h1>
    <div :key="`level-${level.id}`" v-for="level in levels" >
      <router-link :to="`/game/${level.id}`">{{level.name}}</router-link>
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
      levelBase64: ""
    };
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

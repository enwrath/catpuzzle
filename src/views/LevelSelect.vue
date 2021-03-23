<template>
  <div>
    <router-link to="/">Back to main menu</router-link>
    <h1>Select level</h1>
    <div :key="`level-${level.id}`" v-for="level in levels" >
      <router-link :to="`/game/${level.id}`">{{level.name}}</router-link>
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
    };
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

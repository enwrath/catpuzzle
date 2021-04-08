<template>
  <div>
    <router-link to="/">Back to main menu</router-link>
    <div v-if="worldSelected === ''">
      <h1>Select World</h1>
      <div class="worldContainer">
        <div :key="`world-${world.id}`" v-for="(world, i) in levels" class="worldSelect" :style="`margin-left: ${i * 2 + 1}em;`">
          <button class="bigbutton" @click="worldSelected=world.id">{{world.name}}</button>
        </div>
      </div>
    </div>
    <div v-else>
      <button @click="worldSelected=''">Back to world selection</button>
      <h1>Select Level</h1>
      <div class="levelContainer">
        <div :key="`level-${level.id}`" v-for="(level, i) in levels[worldSelected].levels" class="levelSelect" >
          <router-link :to="`/game/${levels[worldSelected].id}-${level.id}`" custom v-slot="{ navigate }">
            <button class="bigbutton" @click="navigate">{{i}}</button>
          </router-link>
        </div>
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
      worldSelected: ""
    };
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.worldContainer {
  display: flex;
  flex-direction: column;
  margin: auto;
}
.worldSelect {
  width: 60%;
  height: 4em;
  margin-bottom: 0.25em;
}
.levelContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  max-width: 30em;
  margin:auto;
}
.levelSelect {
  width: 4em;
  height: 4em;
  margin: 0.25em;
}
.bigbutton {
  width: 100%;
  height: 100%;
}
</style>

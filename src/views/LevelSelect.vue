<template>
  <div>
    <div v-if="worldSelected === ''">

      <router-link to="/" custom v-slot="{ navigate }">
        <button class="backbutton" @click="navigate">Back</button>
      </router-link>
      <h1>Select World</h1>
      <div class="worldContainer">
        <div :key="`world-${world.id}`" v-for="world in levels" class="worldSelect" :style="`margin-left: ${world.id * 5}%;`">
          <button class="bigbutton" @click="worldSelected=world.id">{{world.name}}<br />
            Levels completed:
            {{completionData.totals[world.id]}}</button>
        </div>
      </div>
    </div>
    <div v-else>
      <button class="backbutton" @click="worldSelected=''">Back</button>
      <h1>Select Level</h1>
      <div class="levelContainer">
        <div :key="`level-${level.id}`" v-for="level in levels[worldSelected].levels" class="levelSelect" >
          <router-link :to="`/game/${levels[worldSelected].id}-${level.id}`" custom v-slot="{ navigate }">
            <button class="bigbutton" :class="{completed: completionData[worldSelected].includes(level.id)}" @click="navigate">{{level.id}}</button>
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
      worldSelected: "",
      completionData: {totals: {}}
    }
  },
  activated() {
    this.checkLevelCompletions();
  },
  methods: {
    checkLevelCompletions() {
      const newData = {totals: {}};
      for (const world of Object.keys(this.levels)) {
        const keystring = `world-${world}`;
        const data = localStorage.getItem(keystring);
        if (data !== null) {
          const parsed = JSON.parse(data);
          newData[world] = parsed;
          newData.totals[world] = `${parsed.length}/${Object.keys(this.levels[world].levels).length}`;
        } else {
          newData[world] = [];
          newData.totals[world] = `0/${Object.keys(this.levels[world].levels).length}`;
        }
      }
      this.completionData = newData;
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.worldContainer {
  display: flex;
  flex-direction: column;
  margin: auto;

  height: 100%;
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
.completed {
  border-style: solid;
  border-color: gold;
}
</style>

<template>
  <div>
    <div v-if="worldSelected === ''">

      <router-link to="/" custom v-slot="{ navigate }">
        <button class="backbutton" @click="navigate">Back</button>
      </router-link>
      <h1>Select World</h1>
      <div class="worldContainer">
        <div :key="`world-${world.id}`" v-for="world in levels" class="worldSelect">
          <button class="bigbutton" @click="worldSelected=world.id">{{world.name}}<br />
            {{completionData.totals[world.id]}} complete</button>
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

    <div class="customlevel">
      <h2>Custom level</h2>
      <div class="customcontainer">
        <input type="text" v-model="levelBase64" id="customLevel" placeholder="Paste level code here">
        <br /><br />
        <router-link :to="`/game/custom-${levelBase64}`" custom v-slot="{ navigate }">
          <button class="bigbutton smallerbutton" @click="navigate" :disabled="levelBase64 === ''">Start</button>
        </router-link>
        <button class="bigbutton smallerbutton" @click="levelBase64=''" :disabled="levelBase64 === ''">Clear</button>
      </div>
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
          newData.totals[world] = `${(100*parsed.length/Object.keys(this.levels[world].levels).length).toString().split(".")[0]}%`;
        } else {
          newData[world] = [];
          newData.totals[world] = "0%";
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
  align-items: center;
  height: 100%;
  padding-bottom: 2em;
}
.worldSelect {
  width: 60%;
  height: 4em;
  min-width: 15em;
  margin-bottom: 0.5em;
}
.levelContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 30em;
  margin:auto;
  padding-bottom: 2em;
}
.levelSelect {
  width: 4em;
  height: 4em;
  margin: 0.25em;
}
.bigbutton {
  width: 100%;
  height: 100%;
  border-radius: 1em;
  background-color: #8abcd2;
  font-size: x-large;
  text-shadow: -1px 1px 0 #000000,1px 1px 0 #000000,1px -1px 0 #000000,-1px -1px 0 #000000;
  color: #FFFFFF;
  box-shadow: 1px 2px #888888;
}
.bigbutton:hover {
  background-color: #9fe2ff;
}
.smallerbutton {
  width: 4em;
}
.smallerbutton:disabled {
  background-color: #b59191
}
.completed {
  border-style: solid;
  border-color: gold;
  border-width: 0.2em;
}
.customcontainer {
  margin: auto;
  width: 60%;
  min-width: 15em;
}
.customlevel {
  padding: 1em;
  border-top: 1px dashed #9eb797;
}
h1 {
  padding-top: 2rem;
}
</style>

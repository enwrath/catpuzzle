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
        let data = null;
        try {
          data = JSON.parse(localStorage.getItem(keystring));

        } catch (exception) {
          const worldLevels = document.getElementById(keystring);
          if (worldLevels !== null) {
            data = worldLevels.innerHTML.split("-");
          }
          console.log("localstorage not available");
        }
        if (data !== null) {
          newData[world] = data;
          newData.totals[world] = `${(100*data.length/Object.keys(this.levels[world].levels).length).toString().split(".")[0]}%`;
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
  padding-bottom: 3vh;
}
.worldSelect {
  width: 60vw;
  height: 10vh;
  margin-bottom: 2vh;
}
.levelContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 60vw;
  margin: auto;
  padding-bottom: 3vh;
}
.levelSelect {
  width: 8vw;
  height: 8vh;
  margin: 0.5vw;
}
.bigbutton {
  width: 100%;
  height: 100%;
  border-radius: 4vw;
  background-color: #8abcd2;
  font-size: 3vmin;
  text-shadow: -1px 1px 0 #000000,1px 1px 0 #000000,1px -1px 0 #000000,-1px -1px 0 #000000;
  color: #FFFFFF;
  box-shadow: 1px 2px #888888;
}
.bigbutton:hover {
  background-color: #9fe2ff;
}
.smallerbutton {
  width: 30vw;
  height: 10vh;
}
.smallerbutton:disabled {
  background-color: #b59191
}
.completed {
  border-style: solid;
  border-color: gold;
  border-width: 0.2vmin;
}
.customcontainer {
  margin: auto;
}
.customlevel {
  padding: 1vmin;
  border-top: 2px dashed #8abcd1
}
input {
  font-size: 4vh;
  width: 60vw;
  height: 5vh;
}
h1 {
  font-size: 6.5vmin;
  padding-top: 5vh;
  text-shadow: -1px 1px 0 #000000,1px 1px 0 #000000,1px -1px 0 #000000,-1px -1px 0 #000000;
  color: #FFFFFF;
}
h2 {
  font-size: 3.5vmin;
  text-shadow: -1px 1px 0 #000000,1px 1px 0 #000000,1px -1px 0 #000000,-1px -1px 0 #000000;
  color: #FFFFFF;
}
</style>

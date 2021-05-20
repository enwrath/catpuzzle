<template>
  <div class="container">
    <div class="subcontainer">

      <h1>Level Completed!</h1>
      <br />
      <div class="btncontainer">
        <button @click="$emit('restartlevel')">Replay level</button>

        <router-link v-if="fromEditor" to="/leveledit" custom v-slot="{ navigate }">
          <button @click="navigate">Back to level editor</button>
        </router-link>

        <router-link v-if="!fromEditor" to="/levelselect" custom v-slot="{ navigate }">
          <button @click="navigate">Level selection</button>
        </router-link>

        <router-link v-if="nextLevelExists && !fromEditor" :to="`/game/${worldId}-${nextLevel}`" custom v-slot="{ navigate }">
          <button @click="navigate">Next level</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PuzzleCompleted',
  props: {
    nextLevelExists: Boolean,
    nextLevel: Number,
    worldId: String,
    fromEditor: Boolean,
    currentLevel: String
  },
  mounted() {
    if (this.worldId !== "custom") this.markCompleted();
  },
  methods: {
    markCompleted() {
      try {
        const keystring = `world-${this.worldId}`;
        const data = localStorage.getItem(keystring);
        if (data === null) localStorage.setItem(keystring, JSON.stringify([this.currentLevel]));
        else {
          const parsed = JSON.parse(data);
          if (!parsed.includes(this.currentLevel)) {
            parsed.push(this.currentLevel);
            localStorage.setItem(keystring, JSON.stringify(parsed));
          }
        }
      } catch (exception) {
        console.log("localstorage not available");
        const worldLevels = document.getElementById(`world-${this.worldId}`);
        if (worldLevels === null) {
          let s = document.createElement("SPAN");
          s.id = `world-${this.worldId}`;
          s.innerHTML = this.currentLevel;
          document.getElementById("completedLevelsNoLocalStorage").appendChild(s);
        } else {
          worldLevels.innerHTML = `${worldLevels.innerHTML}-${this.currentLevel}`;
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  position: absolute;
  z-index: 50;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}
.subcontainer {
  font-size: 3vw;
  padding: 10vh 10vw;
  background: #ab7e5d;
  border-style: solid;
  border-color: #8c7228
}
.btncontainer {
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
}
@media (orientation: landscape) {
  .btncontainer {
    flex-direction: row;
    justify-content: center;
  }
}
button {
  width: 10vw;
  height: 6vw;
  font-size: 2vw;
  padding: 0;
  border-radius: 10%;
  background-color: #8abcd2;
  margin-left: 1vw;
  font-weight: bold;
  border-style: ridge;
}
button:hover {
  background-color: #9fe2ff;
}
</style>

<template>
  <div class="Sidebar">
    <div class="BoxLeft">
      <img :src="require(`@/assets/box.png`)" />
      <span>X</span><span class="BigText">{{boxesLeft}}</span>
    </div>
    <button :disabled="!canUndo" @click="$emit('undomove')">
      <img v-if="canUndo" :src="require(`@/assets/undo.png`)" />
      <img v-else :src="require(`@/assets/undodisabled.png`)" />
    </button>
    <button @click="$emit('restartlevel')">
      <img :src="require(`@/assets/restart.png`)" /></button>
  </div>
</template>

<script>

export default {
  name: 'Sidebar',
  props: {
    boxesLeft: Number,
    canUndo: Boolean
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Sidebar {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  margin-top: 2em;
  color: white;
}
@media only screen and (min-width: 500px) {
  .Sidebar {
    flex-direction: column;
  }
}
.BoxLeft {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
}
img {
  width: 4em;
  height: 4em;
}
.BigText = {
  font-size: xxx-large;
}
</style>

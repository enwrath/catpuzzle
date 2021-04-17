<template>
  <div class="Sidebar">
    <button class="BoxLeft" :class="{ActiveItem: itemSelected==='box'}" @click="$emit('selectbox')">
      <img :src="require(`@/assets/box.png`)" />
      <p>X{{boxesLeft}}</p>
    </button>
    <button v-if="fishLeft !== -1" @click="$emit('selectfish')" class="BoxLeft" :class="{ActiveItem: itemSelected==='fish'}">
      <img :src="require(`@/assets/fish.png`)" />
      <p>X{{fishLeft}}</p>
    </button>
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
    fishLeft: Number,
    canUndo: Boolean,
    itemSelected: String
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
  margin: auto;
  margin-top: 0;
  margin-left: 0;
  color: white;
  flex-wrap: wrap;
  margin-right: 4em;
}
.ActiveItem {
  background: cyan;
}
@media (orientation: landscape) {
  .Sidebar {
    flex-direction: column;
    margin-right: 0em;
  }
}
.BoxLeft {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
}
button {
  width: 5em;
  height: 5em;
  padding: 0;
}
img {
  width: 100%;
  height: 100%;
}
p {
  margin-left: -75%;
  font-size: 1.5em;
  font-weight: bold;
  text-shadow: -1px 1px 0 #FFFFFF,1px 1px 0 #FFFFFF,1px -1px 0 #FFFFFF,-1px -1px 0 #FFFFFF;
}
</style>

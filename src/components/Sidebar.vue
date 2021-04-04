<template>
  <div class="Sidebar">
    <button class="BoxLeft" :class="{ActiveItem: itemSelected==='box'}" @click="$emit('selectbox')">
        <img :src="require(`@/assets/box.png`)" />
        <span>X</span><span class="BigText">{{boxesLeft}}</span>
    </button>
    <button v-if="fishLeft !== -1" @click="$emit('selectfish')" class="BoxLeft" :class="{ActiveItem: itemSelected==='fish'}">
      <img :src="require(`@/assets/fish.png`)" />
      <span>X</span><span class="BigText">{{fishLeft}}</span>
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
  color: white;
}
.ActiveItem {
  background: cyan;
}
@media only screen and (min-width: 700px) {
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

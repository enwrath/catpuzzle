<template>
  <div class="Sidebar">
    <button :key="`${item}-button`" v-for="item in tileTypes" :class="{ActiveItem: itemSelected===item}" @click="$emit('selectitem', item)">
        <img :src="require(`@/assets/${item}.png`)" />
    </button>
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
  },
  data() {
    return {
      tileTypes: ["eraser", "box", "fish", "cat"]
    }
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
.ActiveItem {
  background: cyan;
}
@media only screen and (min-width: 500px) {
  .Sidebar {
    flex-direction: column;
  }
}
img {
  width: 4em;
  height: 4em;
}
</style>

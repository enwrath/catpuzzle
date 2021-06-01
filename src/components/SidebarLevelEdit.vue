<template>
  <div>
    <div class="Sidebar">
      <button :key="`${item}-button`" v-for="item in tileTypes" :class="{ActiveItem: itemSelected===item}" @click="$emit('selectitem', item)">
        <img :src="require(`@/assets/${item}.webp`)" />
      </button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SidebarLevelEdit',
  props: {
    itemSelected: String,
    levelBase64: String
  },
  data() {
    return {
      tileTypes: ["tilebg", "tilehint", "block", "box", "fish", "cat", "cat2", "cat3", "cat4", "pushup", "pushright", "pushdown", "pushleft"]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  margin: auto;
  margin-top: 0;
  margin-left: 0;
  color: white;
  flex-wrap: wrap;
  height: 100%;

}
.ActiveItem {
  background-color: #b3ffd7;
}
.ActiveItem:hover {
  background-color: #b3ffd7;
}
img {
  height: 100%;
  width: 100%;
  object-fit: contain;
}
button {
  width: 10vw;
  height: 7vh;
  padding: 0;
  border-radius: 10%;
  background-color: #8abcd2;
  font-weight: bold;
  border-style: ridge;
}
button:hover {
  background-color: #9fe2ff;
}
</style>

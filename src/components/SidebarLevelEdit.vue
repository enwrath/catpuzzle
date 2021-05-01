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
      tileTypes: ["tilebg", "block", "box", "fish", "cat", "cat2", "cat3", "cat4", "pushup", "pushright", "pushdown", "pushleft"]
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
@media (orientation: landscape) {
  .Sidebar {
    flex-direction: column;
  }
}
img {
  height: 100%;
}
button {
  width: 5em;
  height: 3em;
  padding: 0;
  border-radius: 10%;
  background-color: #8abcd2;
  margin: 2px;
  font-weight: bold;
  border-style: ridge;
}
button:hover {
  background-color: #9fe2ff;
}
</style>

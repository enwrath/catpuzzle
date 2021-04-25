<template>
  <div class="Sidebar">
    <router-link :to="`/game/custom-${levelBase64}`" custom v-slot="{ navigate }">
      <button @click="navigate">Testplay</button>
    </router-link>
    <div :key="`${name}-amount`" v-for="(amount, name) of amounts">
      {{ name }}: {{ amount}}
      <button @click="$emit('changeamount', {item: name, increase: true})">+</button>
      <button @click="$emit('changeamount', {item: name, increase: false})">-</button>
    </div>
    <button @click="$emit('sizechange', {row: true, grow: true})">Add a row</button>
    <button @click="$emit('sizechange', {row: false, grow: true})">Add a column</button>
    <button @click="$emit('sizechange', {row: true, grow: false})">Remove last row</button>
    <button @click="$emit('sizechange', {row: false, grow: false})">Remove last column</button>
    <button :key="`${item}-button`" v-for="item in tileTypes" :class="{ActiveItem: itemSelected===item}" @click="$emit('selectitem', item)">
        <img :src="require(`@/assets/${item}.webp`)" />
    </button>
  </div>
</template>

<script>

export default {
  name: 'SidebarLevelEdit',
  props: {
    amounts: Object,
    itemSelected: String,
    levelBase64: String
  },
  data() {
    return {
      tileTypes: ["tilebg","box", "fish", "block", "cat", "cat2", "cat3", "cat4", "pushup", "pushright", "pushdown", "pushleft"]
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
  margin-right: 4em;

}
.ActiveItem {
  background: cyan;
}
@media (orientation: landscape) {
  .Sidebar {
    flex-direction: column;
    margin-right: 0;
  }
}
img {
  width: 4em;
  height: 4em;
}
</style>

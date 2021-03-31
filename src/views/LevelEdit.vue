<template>
  <div class="FlexRow">
    <SidebarLevelEdit :itemSelected="itemSelected" @selectitem="itemChange"></SidebarLevelEdit>
    <div class="FlexColumn">
      <router-link to="/">Back to main menu</router-link>
      <h1>This is level editor</h1>

      <Board @placebox="mouseClick" :data="data"></Board>
    </div>
  </div>
</template>

<script>
import Board from '@/components/Board.vue';
import SidebarLevelEdit from '@/components/SidebarLevelEdit.vue';

export default {
  name: 'LevelEdit',
  components: {
    Board, SidebarLevelEdit
  },
  data() {
    return {
      data: {
        totalBoxes: 1,
        tiles: [["","cat",""],["","",""],["","",""]],
        animations: [],
        animations2: [],
        timer: ''
      },
      itemSelected: "box"
    }
  },
  methods: {
    mouseClick(e) {
      if (this.itemSelected === "eraser") this.setTile(e.y, e.x, "");
      else this.setTile(e.y, e.x, this.itemSelected);
    },
    itemChange(e) {
      this.itemSelected = e;
    },
    setTile(y, x, stuff) {
      console.log("setting tile to",stuff)
      const newRow = this.data.tiles[y].slice(0);
      newRow[x] = stuff;
      this.$set(this.data.tiles, y, newRow);
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

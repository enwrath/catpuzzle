<template>
  <div class="FlexRow">
    <SidebarLevelEdit :levelBase64="levelToBase64" :itemSelected="itemSelected" @selectitem="itemChange" @sizechange="changeSize"></SidebarLevelEdit>
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
    changeSize(e) {
      if (e.row && e.grow) this.addNewRow();
      else if (e.row && !e.grow) this.deleteLastRow();
      if (!e.row && e.grow) this.addNewColumn();
      else if (!e.row && !e.grow) this.deleteLastColumn();
    },
    addNewRow() {
      let newRow = [];
      for (let i = 0; i < this.data.tiles[0].length; i++) {
        newRow.push("");
      }
      this.$set(this.data.tiles, this.data.tiles.length, newRow);
    },
    addNewColumn() {
      for (const row of this.data.tiles) row.push("");
    },
    deleteLastRow() {
      if (this.data.tiles.length <= 1) return;
      this.data.tiles.pop();
    },
    deleteLastColumn() {
      if (this.data.tiles[0].length <= 1) return;
      console.log("teat")
      for (const row of this.data.tiles) row.pop();
    }
  },
  computed: {
    boxesOnBoard: function () {
      return this.data.tiles.flat().filter(x => x.includes("box")).length;
    },
    levelToBase64: function () {
      const boxes = this.boxesOnBoard + this.boxesAllowed;
      const level = {boxes: boxes, tiles: this.data.tiles};
      return btoa(JSON.stringify(level));
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

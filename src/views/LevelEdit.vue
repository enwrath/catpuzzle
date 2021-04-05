<template>
  <div class="FlexRow">
    <SidebarLevelEdit @changeamount="amountChange" :levelBase64="levelToBase64" :itemSelected="itemSelected" @selectitem="itemChange" @sizechange="changeSize" :amounts="amounts"></SidebarLevelEdit>
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
        tiles: [["","cat",""],["","",""],["","",""]]
      },
      amounts: {
        box: 1,
        fish: 1
      },
      itemSelected: "box",
    }
  },
  methods: {
    mouseClick(e) {
      if (this.itemSelected === "eraser") this.setTile(e.y, e.x, "");
      else this.addToTile(e.y, e.x, this.itemSelected);
    },
    itemChange(e) {
      this.itemSelected = e;
    },
    amountChange(e) {
      const c = e.increase ? 1 : -1;
      this.amounts[e.item] += c;
      if (this.amounts[e.item] < 0) this.amounts[e.item] = 0;
    },
    addToTile(y, x, stuff) {
      console.log("adding",stuff)
      let newTile = this.data.tiles[y][x];
      const splitTile = newTile.split("-");
      // Can't stack above boxes
      if (splitTile[splitTile.length-1] === "box" && !stuff.includes("cat")) return;
      // Can't stack non-cats above cats
      if (splitTile[splitTile.length-1].includes("cat") && !stuff.includes("cat")) return;
      // Can't stack anything above box-cat
      if (splitTile.length >= 2 && splitTile[splitTile.length-1].includes("cat") && splitTile[splitTile.length-2] === "box") return;
      if (newTile === "") newTile = stuff;
      else newTile = newTile + "-" + stuff;
      this.setTile(y, x, newTile);
    },
    setTile(y, x, stuff) {
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
      const boxes = this.boxesOnBoard + this.amounts.box;
      const level = {boxes: boxes, fish: this.amounts.fish, tiles: this.data.tiles, from: "editor"};
      return btoa(JSON.stringify(level));
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a,h1 {
  color: white;
}
</style>

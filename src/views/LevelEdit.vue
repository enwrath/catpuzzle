<template>
  <div class="FlexRow">
    <SidebarLevelEdit @changeamount="amountChange" :levelBase64="levelToBase64Editor" :itemSelected="itemSelected" @selectitem="itemChange" @sizechange="changeSize" :amounts="amounts"></SidebarLevelEdit>
    <router-link to="/" custom v-slot="{ navigate }">
      <button class="backbutton" @click="navigate"><br />Back</button>
    </router-link>
    <div class="FlexColumn">
      <div class="itemRow">
        <div class="itemColumn">
          <span>Export code:</span>
          <input type="text" value="" id="levelExport" readonly>
          <button @click="exportLevel">Copy level code</button>
        </div><div class="itemColumn">
          <span>Import code:</span>
          <input type="text" value="" id="levelImport" placeholder="Paste level code here">
          <button @click="importLevel">Load level</button>
        </div>
      </div>


      <Board @placebox="mouseClick" @rightclick="rightClick" :data="data"></Board>
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
        tiles: [["","",""],["","",""],["","",""]]
      },
      amounts: {
        box: 1,
        fish: 1
      },
      itemSelected: "box",
      importInput: "",
      exportInput: ""
    }
  },
  methods: {
    mouseClick(e) {
      if (this.itemSelected === "eraser") this.setTile(e.y, e.x, "");
      else this.addToTile(e.y, e.x, this.itemSelected);
      this.exportInput.value = this.levelToBase64;
    },
    rightClick(e) {
      this.deleteTopItem(e.y, e.x);
    },
    itemChange(e) {
      this.itemSelected = e;
    },
    amountChange(e) {
      const c = e.increase ? 1 : -1;
      this.amounts[e.item] += c;
      if (this.amounts[e.item] < 0) this.amounts[e.item] = 0;
      this.exportInput.value = this.levelToBase64;
    },
    deleteTopItem(y, x) {
      let newTile = this.data.tiles[y][x];
      const splitTile = newTile.split("-");
      if (splitTile.length <= 1) this.setTile(y,x,"");
      else {
        const tile = splitTile.slice(0,-1).join("-");
        this.setTile(y,x,tile);
      }
    },
    addToTile(y, x, stuff) {
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
      for (const row of this.data.tiles) row.pop();
    },
    exportLevel() {
      this.exportInput.select();
      this.exportInput.setSelectionRange(0, 99999);
      document.execCommand("copy");
    },
    importLevel() {
      try {
        const d = atob(this.importInput.value);
        const levelData = JSON.parse(d);
        // TODO: Verify that data is good
        this.data.tiles = levelData.tiles;
        this.amounts.box = levelData.boxes - this.boxesOnBoard;
        this.amounts.fish = levelData.fish;
      }
      catch(err) {
        alert("Imported map data is bad.")
      }
    }
  },
  computed: {
    boxesOnBoard: function () {
      return this.data.tiles.flat().filter(x => x.includes("box")).length;
    },
    levelToBase64: function () {
      const boxes = this.boxesOnBoard + this.amounts.box;
      const level = {boxes: boxes, fish: this.amounts.fish, tiles: this.data.tiles};
      return btoa(JSON.stringify(level));
    },
    levelToBase64Editor: function () {
      const boxes = this.boxesOnBoard + this.amounts.box;
      const level = {boxes: boxes, fish: this.amounts.fish, tiles: this.data.tiles, from: "editor"};
      return btoa(JSON.stringify(level));
    }
  },
  mounted() {
    this.exportInput = document.getElementById("levelExport");
    this.importInput = document.getElementById("levelImport");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a,h1 {
  color: white;
}
.itemRow {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
.itemColumn {
  display: flex;
  flex-direction: column;
  color: white;
}
</style>

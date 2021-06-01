<template>
  <div class="FlexColumn">
    <div class="Topbar">
      <router-link :to="`/game/custom-${levelToBase64Editor}`" custom v-slot="{ navigate }">
        <button class="topbutton" @click="navigate">Play</button>
      </router-link>
      <button class="topbutton" @click="amountChange('box', true)">House +</button>
      <button class="topbutton" @click="amountChange('box', false)">House -</button>
      <button class="topbutton" @click="amountChange('fish', true)">Fish +</button>
      <button class="topbutton" @click="amountChange('fish', false)">Fish -</button>
      <button class="topbutton" @click="changeSize(true, true)">Add row</button>
      <button class="topbutton" @click="changeSize(true, false)">Remove row</button>
      <button class="topbutton" @click="changeSize(false, true)">Add column</button>
      <button class="topbutton" @click="changeSize(false, false)">Remove column</button>
    </div>

    <div class="FlexRow">
      <SidebarLevelEdit :levelBase64="levelToBase64Editor" :itemSelected="itemSelected" @selectitem="itemChange" :amounts="amounts"></SidebarLevelEdit>
      <router-link to="/" custom v-slot="{ navigate }">
        <button class="backbutton" @click="navigate">Back</button>
      </router-link>
      <div class="FlexColumn">
        <div class="itemRow">
          <div class="itemColumn">
            <span class="spanleftpad">Items:</span>
            <span class="spanleftpad">House: {{ amounts.box }}</span>
            <span class="spanleftpad">Fish: {{ amounts.fish }}</span>
          </div>
          <div class="itemColumn">
            <span>Export:</span>
            <input type="text" value="" id="levelExport" readonly>
            <button class="topbutton slim" @click="exportLevel">Copy level</button>
          </div>
          <div class="itemColumn">
            <span>Import:</span>
            <input type="text" value="" id="levelImport" placeholder="Paste level code here">
            <button class="topbutton slim" @click="importLevel">Load level</button>
          </div>
        </div>


        <Board @placebox="mouseClick" @rightclick="rightClick" :data="data" :itemInfo="{canUse: false}"></Board>
      </div>
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
        tiles: [["","",""],["","",""],["","",""]],
        confusedCats: [],
        highlightedTiles: [],
        hoverTile: {x: -1, y: -1},
        showHighlight: false
      },
      amounts: {
        box: 1,
        fish: 1
      },
      itemSelected: "box",
      importInput: "",
      exportInput: "",
      floorTiles: ["pushup","pushdown","pushleft","pushright","box","block","tilehint"]
    }
  },
  methods: {
    mouseClick(e) {
      if (this.itemSelected === "tilebg") this.setTile(e.y, e.x, "");
      else this.addToTile(e.y, e.x, this.itemSelected);
      this.exportInput.value = this.levelToBase64;
    },
    rightClick(e) {
      this.deleteTopItem(e.y, e.x);
    },
    itemChange(e) {
      this.itemSelected = e;
    },
    amountChange(item, increase) {
      const c = increase ? 1 : -1;
      this.amounts[item] += c;
      if (this.amounts[item] < 0) this.amounts[item] = 0;
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
      //Floortiles can't be stacked on top of others, remove old stuff when placing
      if (this.floorTiles.includes(stuff)) this.setTile(y,x,stuff);
      else {
        let newTile = this.data.tiles[y][x];
        const splitTile = newTile.split("-");
        // Can't stack above boxes (except cat to box)
        if (splitTile[splitTile.length-1] === "box" && !stuff.includes("cat")) return;
        // Can't stack non-cats above cats
        if (splitTile[splitTile.length-1].includes("cat") && !stuff.includes("cat")) return;
        // Can't stack anything above box-cat
        if (splitTile.length >= 2 && splitTile[splitTile.length-1].includes("cat") && splitTile[splitTile.length-2] === "box") return;
        if (newTile === "") newTile = stuff;
        else newTile = newTile + "-" + stuff;
        this.setTile(y, x, newTile);
      }
    },
    setTile(y, x, stuff) {
      const newRow = this.data.tiles[y].slice(0);
      newRow[x] = stuff;
      this.$set(this.data.tiles, y, newRow);
    },
    changeSize(row, grow) {
      if (row && grow) this.addNewRow();
      else if (row && !grow) this.deleteLastRow();
      if (!row && grow) this.addNewColumn();
      else if (!row && !grow) this.deleteLastColumn();
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
    this.exportInput.value = this.levelToBase64;
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
  width: 33%;
  font-size: 2vmin;
  align-items: baseline;
  margin-left: -1vw;
}
.itemColumn:first-child {
  width: 25%;
}
.topbutton {
  width: 10vw;
  height: 7vh;
  padding: 0;
  border-radius: 10%;
  font-size: 2vmin;
  background-color: #8abcd2;
  font-weight: bold;
  border-style: ridge;
}
.topbutton:hover {
  background-color: #9fe2ff;
}
.Topbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  margin: auto;
  margin-top: 0;
  margin-left: 0;
  color: white;
  flex-wrap: wrap;
  margin-right: 8vw;
}
.slim {
  height: 3vh;
  width: 80%;
  margin: 0;
}
span {
  font-weight: bold;
  text-shadow: -1px 1px 0 #000000,1px 1px 0 #000000,1px -1px 0 #000000,-1px -1px 0 #000000;
}
.spanleftpad {
    padding-left: 10%;
}
input {
  padding: 0;
  width: 80%;
}
</style>

<template>
  <div class="FlexRow">
    <Sidebar :boxesLeft="boxesLeft" :canUndo="canUndo" @undomove="undoMove" @selectfish="setItem('fish')" @selectbox="setItem('box')" :fishLeft="fishLeft" :itemSelected="itemSelected" @restartlevel="loadLevel"></Sidebar>
    <div class="FlexColumn">
      <div v-if="victory">
        <PuzzleCompleted @restartlevel="loadLevel" :nextLevel="nextLevel" :nextLevelExists="nextLevelExists"></PuzzleCompleted>
      </div>

      <div v-if="'message' in levelData">
        <LevelMessage :message="levelData.message"></LevelMessage>
      </div>
      <Board @placebox="mouseClick" :data="data"></Board>
    </div>
  </div>
</template>

<script>
import Board from '@/components/Board.vue';
import Sidebar from '@/components/Sidebar.vue';
import PuzzleCompleted from '@/components/PuzzleCompleted.vue';
import LevelMessage from '@/components/LevelMessage.vue';
import levelList from "@/data/levellist.json";

export default {
  name: 'Game',
  components: {
    Board, Sidebar, PuzzleCompleted, LevelMessage
  },
  data() {
    return {
      data: {
        totalBoxes: 1,
        tiles: [],
        tempTiles: [],
        history: {
          tileHistory: [],
          fishHistory: []
        },
        animations: [],
        animations2: [],
        timer: '',
        fishUsed: 0
      },
      levels: levelList,
      animating: false,
      victory: false,
      levelData: {},
      itemSelected: "box",
      passableTiles: ["","pushleft","pushright","pushup","pushdown","fish"],
      goalTiles: ["box", "fish"],
      subTurnData: {
        tilesPushedTo: []
      }
    }
  },
  created() {
    console.log("created level id:",this.$route.params.levelId);
    this.loadLevel();
  },
  watch: {
    $route() {
      console.log("watched levelid: ",this.$route.params.levelId);
      this.loadLevel();
    }
  },
  methods: {
    loadLevel() {
      //Set them empty to prevent problems when Game is not created from scratch
      this.levelData = this.levels[this.$route.params.levelId];
      this.data.tiles = [];
      this.data.history = {
        tileHistory: [],
        fishHistory: []
      },
      this.data.tempTiles = [];
      this.data.animations = [];
      this.data.animations2 = [];
      this.animating = false;
      this.victory = false;
      this.itemSelected = "box";
      this.data.fishUsed = 0;
      this.data.totalBoxes = this.levelData.boxes;
      clearTimeout(this.data.timer);
      console.log("loading level ",this.$route.params.levelId);
      for (const row in this.levelData.tiles) {
        this.$set(this.data.tiles, row, [...this.levelData.tiles[row]]);
      }
    },
    mouseClick(e) {
      if (!this.victory && !this.animating) {
        if (this.itemSelected === 'box' && this.boxesOnBoard < this.data.totalBoxes) {
          this.placeItem(e.y, e.x);
        } else if (this.itemSelected === 'fish' && this.fishLeft > 0) {
          this.placeItem(e.y, e.x);
          this.data.fishUsed += 1;
        }
      }
    },
    placeItem(y, x) {
      this.addToHistory();
      this.newTempTiles();
      this.setTile(y, x, this.itemSelected);
      //also add box to current tiles instantly so it's visible
      const newRow = this.data.tiles[y].slice(0);
      newRow[x] = this.itemSelected;
      this.$set(this.data.tiles, y, newRow);
      this.moveCats();
    },
    setItem(name) {
      this.itemSelected = name;
    },
    checkVictory() {
        if (this.data.tiles.flat().every(x => !x.includes("cat") || (x.includes("cat") && x.includes("box")))) this.victory = true;
    },
    clearAnimations(first) {
      if (first) this.data.animations.splice(0);
      else this.data.animations2.splice(0);
    },
    animations2Start() {
      for (const row in this.data.animations2) {
        this.$set(this.data.animations, row, this.data.animations2[row]);
      }
      this.data.timer = setTimeout(this.afterAnimation, 950);
    },
    newTempTiles() {
      for (const row in this.data.tiles) {
        this.$set(this.data.tempTiles, row, [...this.data.tiles[row]]);
      }
    },
    useTempTiles() {
      for (const row in this.data.tiles) {
        this.$set(this.data.tiles, row, [...this.data.tempTiles[row]]);
      }
    },
    setTile(y, x, stuff) {
      const newRow = this.data.tempTiles[y].slice(0);
      newRow[x] = stuff;
      this.$set(this.data.tempTiles, y, newRow);
    },
    addToHistory() {
      this.$set(this.data.history.tileHistory, this.data.history.tileHistory.length, [...this.data.tiles]);
      this.$set(this.data.history.fishHistory, this.data.history.fishHistory.length, this.data.fishUsed);
      //this.history.push([...this.tiles]);
    },
    undoMove() {
      if (this.data.history.tileHistory.length === 0) return;
      this.clearAnimations(true);
      this.clearAnimations(false);
      this.animating = false;
      clearTimeout(this.data.timer);
      for (const row in this.data.tiles) {
        this.$set(this.data.tiles, row, this.data.history.tileHistory[this.data.history.tileHistory.length-1][row]);
      }
      this.data.fishUsed = this.data.history.fishHistory[this.data.history.fishHistory.length-1];
      this.$delete(this.data.history.tileHistory, this.data.history.tileHistory.length-1);
      this.$delete(this.data.history.fishHistory, this.data.history.fishHistory.length-1);
    },
    moveCats() {
      this.subTurnData.tilesPushedTo = [];

      let moves = [];
      for (let y = 0; y < this.data.tempTiles.length; y++){
        for (let x = 0; x < this.data.tempTiles[y].length; x++){
          let currentCat = this.data.tempTiles[y][x];

          // Forbidden regexp tech from SO
          // Can end up with cat above cat, so this kinda fixes it so the top one can move
          // Happens only in super specific cases
          // Probably can't end up with 3 cat stack???
          if ((currentCat.match(/cat/g) || []).length === 2) {
            currentCat = currentCat.split("-")[1];
          }

          if (currentCat === "cat") {
            const n = this.neighbourTiles(y,x);
            for (const tile of n) {
              if (this.goalTiles.includes(this.data.tempTiles[tile.y][tile.x])) {
                moves.push({x1: x, x2:tile.x, y1:y, y2:tile.y, cat:"cat"});
              }
            }
          } else if (currentCat === "cat2") {
            const n = this.cat2MoveTiles(y,x);
            for (const tile of n) {
              if (this.goalTiles.includes(this.data.tempTiles[tile.y][tile.x])) {
                moves.push({x1: x, x2:tile.x, y1:y, y2:tile.y, cat:"cat2"});
              }
            }
          } else if (currentCat === "cat3") {
            const n = this.cat3MoveTiles(y,x);
            for (const tile of n) {
              if (this.goalTiles.includes(this.data.tempTiles[tile.y][tile.x])) {
                moves.push({x1: x, x2:tile.x, y1:y, y2:tile.y, cat:"cat3"});
              }
            }
          } else if (currentCat.includes("push") && currentCat.includes("-")) {
            const move = this.pushCat(y, x);
            if ("x1" in move) moves.push(move);
          }
        }
      }

      // 2 cats cant fit into the same box -> rip box
      const filteredMoves = this.filterMoves(moves);

      for (const m of filteredMoves.allowed) {
        this.setCatPosition(m, m.y1, m.x1, m.y2, m.x2);
        this.addAnimation(m.y1,m.x1,m.y2,m.x2, false);
      }
      for (const m of filteredMoves.bad) {
        if (this.data.tempTiles[m.y2][m.x2].includes("box")) {
          this.setTile(m.y2, m.x2, "broken-box");
        } else {
          //Non box stuff just disappears
          this.setTile(m.y2, m.x2, "");
        }
        this.addAnimation(m.y1,m.x1,m.y2,m.x2, true);
        if (m.cat === "cat2") {
          if (Math.abs(m.y2-m.y1) === 2 || Math.abs(m.x2-m.x1) === 2) {
            let newY, newX;
            if (m.y2 < m.y1) newY = m.y2+1;
            else if (m.y2 > m.y1) newY = m.y2-1;
            else newY = m.y1;
            if (m.x2 < m.x1) newX = m.x2+1;
            else if (m.x2 > m.x1) newX = m.x2-1;
            else newX = m.x1;
            this.setCatPosition(m, m.y1, m.x1, newY, newX);
          }
        }

      }

      if (filteredMoves.allowed.length > 0 || filteredMoves.bad.length > 0) {
        this.animating = true;
        this.data.timer = setTimeout(this.afterAnimation, 950);
      } else {
        this.useTempTiles();
        this.animating = false;
        this.checkVictory();
      }
    },
    pushCat(y, x) {
      //tile is of format push(direction)-(cat)
      const cat = this.data.tempTiles[y][x].split("-")[1];
      const direction = this.data.tempTiles[y][x].split("-")[0].split("push")[1];
      if (direction === "left") {
        if (this.canPushTo(y, x-1) && !this.subTurnData.tilesPushedTo.some(tile => tile.x === x-1 && tile.y === y)) {
          this.subTurnData.tilesPushedTo.push({y: y, x: x-1});
          return {x1: x, x2:x-1, y1:y, y2:y, cat:cat};
        }
      } else if (direction === "right") {
        if (this.canPushTo(y, x+1) && !this.subTurnData.tilesPushedTo.some(tile => tile.x === x+1 && tile.y === y)) {
          this.subTurnData.tilesPushedTo.push({y: y, x: x+1});
          return {x1: x, x2:x+1, y1:y, y2:y, cat:cat};
        }
      } else if (direction === "up") {
        if (this.canPushTo(y-1, x) && !this.subTurnData.tilesPushedTo.some(tile => tile.x === x && tile.y === y-1)) {
          this.subTurnData.tilesPushedTo.push({y: y-1, x: x});
          return {x1: x, x2:x, y1:y, y2:y-1, cat:cat};
        }
      } else if (direction === "down") {
        if (this.canPushTo(y+1, x) && !this.subTurnData.tilesPushedTo.some(tile => tile.x === x && tile.y === y+1)) {
          this.subTurnData.tilesPushedTo.push({y: y+1, x: x});
          return {x1: x, x2:x, y1:y, y2:y+1, cat:cat};
        }
      }

      return {};
    },
    canPushTo(y, x) {
      return this.data.tempTiles[y] !== undefined && this.data.tempTiles[y][x] !== undefined && (this.passableTiles.includes(this.data.tempTiles[y][x]) || this.goalTiles.includes(this.data.tempTiles[y][x]));
    },
    setCatPosition(move, y1, x1, y2, x2) {
      const newTile = this.data.tempTiles[y2][x2] === "" ? "" : `${this.data.tempTiles[y2][x2]}-`;
      const oldTile = this.data.tempTiles[y1][x1].includes("-") ? this.data.tempTiles[y1][x1].split("-")[0] : "";
      if (newTile.includes("fish")) {
        //Fish just gets eaten
        this.setTile(y2, x2, move.cat);
      } else {
        this.setTile(y2, x2, `${newTile}${move.cat}`);
      }
      this.setTile(y1, x1, oldTile);
    },
    addAnimation(y1, x1, y2, x2, badmove) {
      const xdist = `${(x2-x1)*100}%`;
      const ydist = `${(y2-y1)*100}%`;
      this.data.animations.push({x:x1, y:y1, name:"move", xdistance: xdist, ydistance: ydist});

      if (badmove) {
        const xdir = (x2 < x1 ) ? -1 : 1;
        const ydir = (y2 < y1 ) ? -1 : 1;
        const badx = (x2 === x1) ? 0 : xdir;
        const bady = (y2 === y1) ? 0 : ydir;
        this.data.animations2.push({x:x2-badx, y:y2-bady, name:"arrive", xdistance: `${badx*100}%`, ydistance: `${bady*100}%`});
      }
    },
    afterAnimation() {
      this.useTempTiles();
      this.clearAnimations(true);
      if (this.data.animations2.length !== 0) {
        this.animations2Start();
        this.clearAnimations(false);
      } else {
      this.moveCats();
      }
    },
    filterMoves(moves) {
      let allowedMoves = [];
      let badMoves = [];
      let actualMoves = [];
      for (const m of moves) {
        const multipleMoves = moves.filter(x => x.x1 === m.x1 && x.y1 === m.y1);
        // If cat can move to multiple boxes, do not move at all
        if (multipleMoves.length === 1) actualMoves.push(m);
      }
      for (const m of actualMoves) {
        const overlapMoves = actualMoves.filter(x => x.x2 === m.x2 && x.y2 === m.y2);
        // All moves overlap with self
        if (overlapMoves.length === 1) allowedMoves.push(m);
        else badMoves.push(m);
      }
      return {allowed: allowedMoves, bad: badMoves};
    },
    neighbourTiles(y, x) {
      let neighbours = [];
      //If the value is undefined then we are in hell anyway...
      if (this.data.tiles[y+1] !== undefined && this.data.tiles[y+1][x] !== undefined) neighbours.push({x:x, y:y+1});
      if (this.data.tiles[y-1] !== undefined && this.data.tiles[y-1][x] !== undefined) neighbours.push({x:x, y:y-1});
      if (this.data.tiles[y][x+1] !== undefined) neighbours.push({x:x+1, y:y});
      if (this.data.tiles[y][x-1] !== undefined) neighbours.push({x:x-1, y:y});
      return neighbours;
    },
    cat2MoveTiles(y,x) {
      let neighbours = this.neighbourTiles(y,x);
      //Kitten can move 2tiles in direction
      if (this.data.tiles[y+1] !== undefined && this.passableTiles.includes(this.data.tiles[y+1][x]) && this.data.tiles[y+2] !== undefined && this.data.tiles[y+2][x] !== undefined) neighbours.push({x:x, y:y+2});
      if (this.data.tiles[y-1] !== undefined && this.passableTiles.includes(this.data.tiles[y-1][x]) && this.data.tiles[y-2] !== undefined && this.data.tiles[y-2][x] !== undefined) neighbours.push({x:x, y:y-2});
      if (this.data.tiles[y][x+1] !== undefined && this.passableTiles.includes(this.data.tiles[y][x+1]) && this.data.tiles[y][x+2] !== undefined) neighbours.push({x:x+2, y:y});
      if (this.data.tiles[y][x-1] !== undefined && this.passableTiles.includes(this.data.tiles[y][x-1]) && this.data.tiles[y][x-2] !== undefined) neighbours.push({x:x-2, y:y});
      return neighbours;
    },
    cat3MoveTiles(y, x) {
      let neighbours = [];
      //If the value is undefined then we are in hell anyway...
      if (this.data.tiles[y+1] !== undefined && this.data.tiles[y+1][x+1] !== undefined) neighbours.push({x:x+1, y:y+1});
      if (this.data.tiles[y+1] !== undefined && this.data.tiles[y+1][x-1] !== undefined) neighbours.push({x:x-1, y:y+1});
      if (this.data.tiles[y-1] !== undefined && this.data.tiles[y-1][x+1] !== undefined) neighbours.push({x:x+1, y:y-1});
      if (this.data.tiles[y-1] !== undefined && this.data.tiles[y-1][x-1] !== undefined) neighbours.push({x:x-1, y:y-1});
      return neighbours;
    },
  },
  computed: {
    boxesOnBoard: function () {
      return this.data.tiles.flat().filter(x => x.includes("box")).length;
    },
    boxesLeft: function () {
      return this.data.totalBoxes - this.boxesOnBoard;
    },
    nextLevel: function () {
      return parseInt(this.$route.params.levelId)+1;
    },
    nextLevelExists: function () {
      return this.nextLevel in this.levels;
    },
    canUndo: function () {
      return this.data.history.tileHistory.length > 0 && !this.victory;
    },
    fishLeft: function () {
      if ("fish" in this.levelData) return this.levelData.fish - this.data.fishUsed;
      else return -1;
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.FlexRow {
  display: flex;
  flex-direction: column;
  background: #353558;
  height: 100%;
}
@media only screen and (min-width: 500px) {
  .FlexRow {
    display: flex;
    flex-direction: row;
    background: #353558;
    height: 100%;
  }
}
.FlexColumn {
  display: flex;
  flex-direction: column;
  align-content: center;
  width: 100%;
  height: 100%;
}
</style>

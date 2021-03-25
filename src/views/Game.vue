<template>
  <div class="FlexRow">
    <Sidebar :boxesLeft="boxesLeft" :canUndo="canUndo" @undomove="undoMove" @restartlevel="loadLevel"></Sidebar>
    <div class="FlexColumn">
      <div v-if="victory">
        <PuzzleCompleted @restartlevel="loadLevel" :nextLevel="nextLevel" :nextLevelExists="nextLevelExists"></PuzzleCompleted>
      </div>

      <div v-if="'message' in levelData">
        <LevelMessage :message="levelData.message"></LevelMessage>
      </div>
      <Board @placebox="boxPlaced" :data="data"></Board>
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
        history: [],
        animations: [],
        animations2: [],
        timer: ''
      },
      levels: levelList,
      animating: false,
      victory: false,
      levelData: {}
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
      this.data.history = [];
      this.data.tempTiles = [];
      this.data.animations = [];
      this.data.animations2 = [];
      this.animating = false;
      this.victory = false;
      this.data.totalBoxes = this.levelData.boxes;
      clearTimeout(this.data.timer);
      console.log("loading level ",this.$route.params.levelId);
      for (const row in this.levelData.tiles) {
        this.$set(this.data.tiles, row, [...this.levelData.tiles[row]]);
      }
    },
    boxPlaced(e) {
      if (!this.victory && !this.animating && this.boxesOnBoard < this.data.totalBoxes) {
        this.addToHistory();
        this.newTempTiles();
        this.setTile(e.y, e.x, "box");
        //also add box to current tiles instantly so it's visible
        const newRow = this.data.tiles[e.y].slice(0);
        newRow[e.x] = "box";
        this.$set(this.data.tiles, e.y, newRow);
        this.moveCats();
      }
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
      this.$set(this.data.history, this.data.history.length, [...this.data.tiles]);
      //this.history.push([...this.tiles]);
    },
    undoMove() {
      if (this.data.history.length === 0) return;
      this.clearAnimations(true);
      this.clearAnimations(false);
      this.animating = false;
      clearTimeout(this.data.timer);
      for (const row in this.data.tiles) {
        this.$set(this.data.tiles, row, this.data.history[this.data.history.length-1][row]);
      }
      this.$delete(this.data.history, this.data.history.length-1);
    },
    moveCats() {
      let moves = [];
      for (let y = 0; y < this.data.tempTiles.length; y++){
        for (let x = 0; x < this.data.tempTiles[y].length; x++){
          if (this.data.tempTiles[y][x] === "cat") {
            const n = this.neighbourTiles(y,x);
            for (const tile of n) {
              if (this.data.tempTiles[tile.y][tile.x] === "box") {
                moves.push({x1: x, x2:tile.x, y1:y, y2:tile.y, cat:"cat"});
              }
            }
          } else if (this.data.tempTiles[y][x] === "cat2") {
            const n = this.cat2MoveTiles(y,x);
            for (const tile of n) {
              if (this.data.tempTiles[tile.y][tile.x] === "box") {
                moves.push({x1: x, x2:tile.x, y1:y, y2:tile.y, cat:"cat2"});
              }
            }
          }
        }
      }

      // 2 cats cant fit into the same box -> rip box
      const filteredMoves = this.filterMoves(moves);

      for (const m of filteredMoves.allowed) {

        this.setTile(m.y2, m.x2, `box-${m.cat}`);
        this.setTile(m.y1, m.x1, "");
        this.addAnimation(m.y1,m.x1,m.y2,m.x2, false);
      }
      for (const m of filteredMoves.bad) {
        this.setTile(m.y2, m.x2, "broken-box");
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
            this.setTile(m.y1, m.x1, "");
            //This tile should be empty! Based on earlier checks
            this.setTile(newY, newX, m.cat);
          }
        }

      }
      //TODO: somehow communicate user what happened
      //visuals????????? oh no
      if (filteredMoves.allowed.length > 0 || filteredMoves.bad.length > 0) {
        this.animating = true;
        this.data.timer = setTimeout(this.afterAnimation, 950);
      } else {
        this.useTempTiles();
        this.animating = false;
        this.checkVictory();
      }
    },
    addAnimation(y1, x1, y2, x2, badmove) {
      if (y1 === y2) {
        const tilesMoved = `${Math.abs(x2-x1)*100}%`;
        if (x2 - x1 < 0) {
          this.data.animations.push({x:x1, y:y1, name:"move", xdistance: `-${tilesMoved}`, ydistance: "0"});
          if (badmove) this.data.animations2.push({x:x2+1, y:y2, name:"arrive", xdistance:"-100%", ydistance: "0"});
        }
        else {
          this.data.animations.push({x:x1, y:y1, name:"move", xdistance: tilesMoved, ydistance: "0"});
          if (badmove) this.data.animations2.push({x:x2-1, y:y2, name:"arrive", xdistance:"100%", ydistance: "0"});
        }
      } else {
        const tilesMoved = `${Math.abs(y2-y1)*100}%`;
        if (y2 - y1 < 0) {
          this.data.animations.push({x:x1, y:y1, name:"move", xdistance: "0", ydistance: `-${tilesMoved}`});
          if (badmove) this.data.animations2.push({x:x2, y:y2+1, name:"arrive", xdistance: "0", ydistance:"-100%"});
        }
        else {
          this.data.animations.push({x:x1, y:y1, name:"move", xdistance: "0", ydistance: tilesMoved});
          if (badmove) this.data.animations2.push({x:x2, y:y2-1, name:"arrive", xdistance: "0", ydistance:"100%"});
        }
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
      if (this.data.tiles[y+1] !== undefined && this.data.tiles[y+1][x] === "" && this.data.tiles[y+2] !== undefined && this.data.tiles[y+2][x] !== undefined) neighbours.push({x:x, y:y+2});
      if (this.data.tiles[y-1] !== undefined && this.data.tiles[y-1][x] === "" && this.data.tiles[y-2] !== undefined && this.data.tiles[y-2][x] !== undefined) neighbours.push({x:x, y:y-2});
      if (this.data.tiles[y][x+1] !== undefined && this.data.tiles[y][x+1] === "" && this.data.tiles[y][x+2] !== undefined) neighbours.push({x:x+2, y:y});
      if (this.data.tiles[y][x-1] !== undefined && this.data.tiles[y][x-1] === "" && this.data.tiles[y][x-2] !== undefined) neighbours.push({x:x-2, y:y});
      return neighbours;
    }
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
      return this.data.history.length > 0 && !this.victory;
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

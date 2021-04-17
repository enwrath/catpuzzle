<template>
  <div class="FlexRow">
    <router-link to="/levelselect" custom v-slot="{ navigate }">
      <button class="backbutton" @click="navigate"><br />Back</button>
    </router-link>

    <PuzzleCompleted v-if="victory" @restartlevel="loadLevel" :currentLevel="levelId" :nextLevel="nextLevel" :worldId="worldId" :nextLevelExists="nextLevelExists" :fromEditor="fromEditor"></PuzzleCompleted>

    <Sidebar :boxesLeft="boxesLeft" :canUndo="canUndo" @undomove="undoMove" @selectfish="setItem('fish')" @selectbox="setItem('box')" :fishLeft="fishLeft" :itemSelected="itemSelected" @restartlevel="loadLevel"></Sidebar>
    <div class="FlexColumn">
      <router-link v-if="fromEditor" to="/leveledit" custom v-slot="{ navigate }">
        <button @click="navigate">Back to level editor</button>
      </router-link>

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
      fromEditor: false,
      animationDuration: 1000
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
    loadMapData(b64data, isCustom) {
      const d = atob(b64data);
      const data = JSON.parse(d);
      const level = {boxes: data.boxes, fish: data.fish, tiles: data.tiles};
      if (isCustom) {
        if ("from" in data && data.from === "editor") this.fromEditor = true;
        return level;
      }
      level.name = this.levels[this.worldId].levels[this.levelId].name;
      if ("message" in this.levels[this.worldId].levels[this.levelId]) {
        level.message = this.levels[this.worldId].levels[this.levelId].message;
      }
      return level;
    },
    loadLevel() {
      //Set them empty to prevent problems when Game is not created from scratch
      console.log(this.$route.params.levelId)
      if (this.$route.params.levelId.includes("custom-")) {
        this.levelData = this.loadMapData(this.$route.params.levelId.split("custom-")[1], true);
      } else {
        if (this.worldId in this.levels && this.levelId in this.levels[this.worldId].levels) {
          this.levelData = this.loadMapData(this.levels[this.worldId].levels[this.levelId].data, false);
        } else {
          // TODO: make something nicer
          alert("Trying to load non-existing map! Returning to main menu")
          window.location = '/';
        }
      }
      this.data.tiles = [];
      this.data.history = {
        tileHistory: [],
        fishHistory: []
      },
      this.data.tempTiles = [];
      this.data.animations = [];
      this.data.animations2 = [];
      this.animating = true;
      this.victory = false;
      this.itemSelected = "box";
      this.data.fishUsed = 0;
      this.data.totalBoxes = this.levelData.boxes;
      clearTimeout(this.data.timer);
      console.log("loading level ",this.$route.params.levelId);
      for (const row in this.levelData.tiles) {
        this.$set(this.data.tiles, row, [...this.levelData.tiles[row]]);
      }

      if (this.boxesLeft === 0 && this.fishLeft > 0) this.itemSelected = "fish";
      //Resolve any cats-on-pushers situations
      //Animations don't happen if no timeout here
      this.data.timer = setTimeout(this.firstActionCheck, Math.max(this.animationDuration/10, 0));

    },
    updateSettings() {
      this.animationDuration = document.getElementById("animSpeed").value;
    },
    firstActionCheck() {
      this.newTempTiles();
      this.moveCats();
    },
    mouseClick(e) {
      if (!this.victory && !this.animating) {
        if (this.data.tiles[e.y][e.x] !== "") return;
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
        if (this.data.tiles.flat().every(x => !x.includes("cat") || (x.includes("cat") && x.includes("box") && !x.includes("broken")))) this.victory = true;
    },
    clearAnimations(first) {
      if (first) this.data.animations.splice(0);
      else this.data.animations2.splice(0);
    },
    animations2Start() {
      for (const row in this.data.animations2) {
        this.$set(this.data.animations, row, this.data.animations2[row]);
      }
      this.data.timer = setTimeout(this.afterAnimation, Math.max(this.animationDuration-50, 0));
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
      this.updateSettings();
      let moves = [];
      for (let y = 0; y < this.data.tempTiles.length; y++){
        for (let x = 0; x < this.data.tempTiles[y].length; x++){
          let currentCat = this.data.tempTiles[y][x];


          if (currentCat.includes("push") && currentCat.includes("-")) {
            const move = this.pushCat(y, x);
            if ("x1" in move) moves.push(move);
            continue;
          }

          if (!currentCat.includes("cat")) continue;

          // Only topmost cat moves by itself
          // Handle pushers etc. stack movements before this!
          //Don't move cats in boxes!!!!
          if (currentCat.includes("box") && !currentCat.includes("broken")) continue;
          const splitCats = currentCat.split("-");
          currentCat = splitCats[splitCats.length-1];

          if (currentCat === "cat") {
            const n = this.neighbourTiles(y,x);
            for (const tile of n) {
              const tilesplit = this.data.tempTiles[tile.y][tile.x].split("-");
              const tiletop = tilesplit[tilesplit.length-1];
              if (this.goalTiles.includes(tiletop)) {
                moves.push({x1: x, x2:tile.x, y1:y, y2:tile.y, cat:"cat"});
              }
            }
          } else if (currentCat === "cat2") {
            const n = this.cat2MoveTiles(y,x);
            for (const tile of n) {
              const tilesplit = this.data.tempTiles[tile.y][tile.x].split("-");
              const tiletop = tilesplit[tilesplit.length-1];
              if (this.goalTiles.includes(tiletop)) {
                moves.push({x1: x, x2:tile.x, y1:y, y2:tile.y, cat:"cat2"});
              }
            }
          } else if (currentCat === "cat3") {
            const n = this.cat3MoveTiles(y,x);
            for (const tile of n) {
              const tilesplit = this.data.tempTiles[tile.y][tile.x].split("-");
              const tiletop = tilesplit[tilesplit.length-1];
              if (this.goalTiles.includes(tiletop)) {
                moves.push({x1: x, x2:tile.x, y1:y, y2:tile.y, cat:"cat3"});
              }
            }
          } else if (currentCat === "cat4") {
            let actions = [];
            const n = this.cat2MoveTiles(y,x);
            for (const tile of n) {
              const tilesplit = this.data.tempTiles[tile.y][tile.x].split("-");
              const tiletop = tilesplit[tilesplit.length-1];
              if (this.goalTiles.includes(tiletop)) {
                actions.push({x1: x, x2:tile.x, y1:y, y2:tile.y, cat:"cat4"});
              }
            }
            const n2 = this.neighbourTiles(y,x);
            for (const tile of n2) {
              const topcat = this.data.tempTiles[tile.y][tile.x].split("-");
              const targetCat = topcat[topcat.length-1];
              if (targetCat.includes("cat") && targetCat != "cat4") {
                if (!(topcat.length > 1 && topcat[topcat.length-2] == "box")) {
                  let newX = tile.x;
                  if (x < tile.x) newX = tile.x+1;
                  else if (x > tile.x) newX = tile.x-1;
                  let newY = y;
                  if (y < tile.y) newY = tile.y+1;
                  else if (y > tile.y) newY = tile.y-1;
                  actions.push({x1: tile.x, x2:newX, y1:tile.y, y2:newY, cat:targetCat, type:"hit"});
                }
              }
            }
            if (actions.length === 1) {
              moves.push(actions[0]);
              if ("type" in actions[0]) {
                const xdist = `${(actions[0].x1-x)*30}%`;
                const ydist = `${(actions[0].y1-y)*30}%`;
                this.data.animations.push({x:x, y:y, name:"hit", xdistance: xdist, ydistance: ydist, duration: this.animationDuration});
              }
            }
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
          // Multiple cats will attempt this!
          if (!this.data.tempTiles[m.y2][m.x2].includes("brokenbox")) {
            this.setTile(m.y2, m.x2, this.data.tempTiles[m.y2][m.x2].replace("box", "brokenbox"));
          }
        } else if (this.data.tempTiles[m.y2][m.x2].includes("fish")) {
          //If tile has things other than fish, preserve them
          //And make sure there is no trailing or starting or double "-"
          let newTile = this.data.tempTiles[m.y2][m.x2].replace("fish","").replace("--","-");
          if (newTile.length > 0 && newTile[0] === "-") newTile = newTile.slice(1);
          if (newTile.length > 0 && newTile[newTile.length-1] === "-") newTile = newTile.slice(0,-1);
          this.setTile(m.y2, m.x2, newTile);
        }
        this.addAnimation(m.y1,m.x1,m.y2,m.x2, true);
        if (m.cat === "cat2" || m.cat === "cat4") {
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
        clearTimeout(this.data.timer);
        this.data.timer = setTimeout(this.afterAnimation, Math.max(this.animationDuration-50, 0));
      } else {
        this.useTempTiles();
        this.animating = false;
        clearTimeout(this.data.timer);
        this.data.timer = setTimeout(this.clearAnimations, Math.max(this.animationDuration-50, 0), true);
        this.checkVictory();
      }
    },
    pushCat(y, x) {
      //tile is of format push(direction)-(cat)(-s)
      const cat = this.data.tempTiles[y][x].split("-").slice(1,this.data.tempTiles[y][x].length-1).join("-");

      const direction = this.data.tempTiles[y][x].split("-")[0].split("push")[1];
      if (direction === "left") {
        if (this.canPushTo(y, x-1)) {
          return {x1: x, x2:x-1, y1:y, y2:y, cat:cat, type:"force"};
        }
      } else if (direction === "right") {
        if (this.canPushTo(y, x+1)) {
          return {x1: x, x2:x+1, y1:y, y2:y, cat:cat, type:"force"};
        }
      } else if (direction === "up") {
        if (this.canPushTo(y-1, x)) {
          return {x1: x, x2:x, y1:y, y2:y-1, cat:cat, type:"force"};
        }
      } else if (direction === "down") {
        if (this.canPushTo(y+1, x)) {
          return {x1: x, x2:x, y1:y, y2:y+1, cat:cat, type:"force"};
        }
      }
      return {};
    },
    canPushTo(y, x) {
      return this.data.tempTiles[y] !== undefined && this.data.tempTiles[y][x] !== undefined && (this.passableTiles.includes(this.data.tempTiles[y][x]) || this.goalTiles.includes(this.data.tempTiles[y][x]));
    },
    setCatPosition(move, y1, x1, y2, x2) {
      const oldSplit = this.data.tempTiles[y1][x1].split("-");
      let oldTile = this.data.tempTiles[y1][x1].includes("-") ? oldSplit.slice(0,oldSplit.length-1).join("-") : "";
      const newSplit = this.data.tempTiles[y2][x2].split("-");
      let newTile = this.data.tempTiles[y2][x2] === "" ? "" : `${this.data.tempTiles[y2][x2]}-`;

      //Push everything onward
      if (this.data.tempTiles[y1][x1].includes("push")) {
        oldTile = oldSplit[0];
      }
      //Fish just gets eaten
      if (newTile.includes("fish")) {
        newTile = newSplit.slice(0,newSplit.length-1).join("-");
      }
      // Can there be more things than boxes on tile?
      if (newTile.includes("box") && move.cat.includes("-")) {
        newTile = "brokenbox-";
      }
      this.setTile(y2, x2, `${newTile}${move.cat}`);
      this.setTile(y1, x1, oldTile);
    },
    addAnimation(y1, x1, y2, x2, badmove) {
      const xdist = `${(x2-x1)*100}%`;
      const ydist = `${(y2-y1)*100}%`;
      this.data.animations.push({x:x1, y:y1, name:"move", xdistance: xdist, ydistance: ydist, duration: this.animationDuration});

      if (badmove) {
        const xdir = (x2 < x1 ) ? -1 : 1;
        const ydir = (y2 < y1 ) ? -1 : 1;
        const badx = (x2 === x1) ? 0 : xdir;
        const bady = (y2 === y1) ? 0 : ydir;
        this.data.animations2.push({x:x2-badx, y:y2-bady, name:"arrive", xdistance: `${badx*100}%`, ydistance: `${bady*100}%`, duration: this.animationDuration});
      }
    },
    afterAnimation() {
      this.useTempTiles();
      this.clearAnimations(true);
      if (this.data.animations2.length !== 0) {
        this.animations2Start();
        this.clearAnimations(false);
      } else {
        //Some animations break if this isn't on timeout
        this.data.timer = setTimeout(this.moveCats, Math.max(this.animationDuration/10, 0));
        //this.moveCats();
      }
    },
    tileExists(y, x) {
      return y >= 0 && x >= 0 && y < this.data.tiles.length && x < this.data.tiles[0].length;
    },
    filterMoves(moves) {
      let allowedMoves = [];
      let badMoves = [];
      let multiHits = [];
      let multiHitStarts = [];
      let actualMoves = [];
      for (const m of moves) {
        // Drop all moves that try to go out of bounds
        if (!this.tileExists(m.y2, m.x2)) continue;

        const multipleMoves = moves.filter(x => x.x1 === m.x1 && x.y1 === m.y1);
        const multipleMovesWithoutHit = multipleMoves.filter(x => !("type" in x) || ("type" in x && x.type != "hit"));
        // If cat can move to multiple boxes, do not move at all
        // If cat has one own move and x amount of hitpushes, do own move
        if (multipleMovesWithoutHit.length === 1 && (!("type" in m) || ("type" in m && m.type != "hit"))) actualMoves.push(m);
        else if (multipleMovesWithoutHit.length !== 1) {
          const multipleMovesWithHit = multipleMoves.filter(x => "type" in x && x.type === "hit");
          if (multipleMovesWithHit.length === 1 && "type" in m && m.type === "hit") actualMoves.push(m);
          else if ("type" in m && m.type === "hit") multiHits.push(m);
        }
      }

      for (const m of multiHits) {
        if (multiHitStarts.some(x => x.x1 === m.x1 && x.y1 === m.y1)) continue;
        multiHitStarts.push({x1:m.x1,y1:m.y1});
        const multipleMoves = multiHits.filter(x => x.x1 === m.x1 && x.y1 === m.y1);
        let xForce = 0;
        let yForce = 0;
        for (const hit of multipleMoves) {
          if (hit.x1 < hit.x2) xForce += 1;
          else if (hit.x1 > hit.x2) xForce -= 1;
          if (hit.y1 < hit.y2) yForce += 1;
          else if (hit.y1 > hit.y2) yForce -= 1;
        }
        if (xForce === 0 && yForce === 0) continue;
        actualMoves.push({x1: m.x1, x2:m.x1+xForce, y1:m.y1, y2:m.y1+yForce, cat:m.cat});
      }

      for (const m of actualMoves) {

        if ("type" in m && m.type === "force") {
          allowedMoves.push(m);
          continue;
        }

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
    worldId: function () {
      const split = this.$route.params.levelId.split("-");
      if (split.length === 2) return split[0];
      else return "";
    },
    levelId: function () {
      const split = this.$route.params.levelId.split("-");
      if (split.length === 2) return split[1];
      else return split[0];
    },
    nextLevel: function () {
      return parseInt(this.levelId)+1;
    },
    nextLevelExists: function () {
      if (this.worldId === "custom") return false;
      return this.nextLevel in this.levels[this.worldId].levels;
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
<style>
.FlexRow {
  display: flex;
  flex-direction: column;
  background: #353558;
  height: 100%;
}
@media (orientation: landscape) {
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
  flex-grow: 1;
}
.backbutton {
  position: absolute;
  right: 0;
  top: 4rem;
  font-weight: 800;
  width: 4rem;
  height: 4rem;
  background-image: url('~@/assets/undo.png');
  background-size: contain;
  z-index: 60;
}
</style>

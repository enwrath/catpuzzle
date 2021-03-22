<template>
  <div>
    <p>Boxes {{boxesOnBoard}} / {{data.totalBoxes}}</p>
    <button :disabled="data.history.length===0" @click="undoMove">UNDO</button>
    <Board @placebox="boxPlaced" :data="data"></Board>
  </div>
</template>

<script>
import Board from '@/components/Board.vue'

export default {
  name: 'Game',
  components: {
    Board
  },
  data() {
    return {
      data: {
        totalBoxes: 3,
        tiles: [["","","cat",""],["kitten","","","cat"],["block","","","block"],["cat","","",""]],
        tempTiles: [],
        history: [],
        animations: [],
        animations2: [],
        timer: '',
        animating: false
      }
    }
  },
  methods: {
    boxPlaced(e) {
      if (!this.animating && this.boxesOnBoard < this.data.totalBoxes) {
        this.addToHistory();
        this.newTempTiles();
        this.setTile(e.y, e.x, "box");
        this.moveCats();
      }
    },
    clearAnimations(first) {
      if (first) this.data.animations.splice(0);
      else this.data.animations2.splice(0);
    },
    animations2Start() {
      for (const row in this.data.animations2) {
        this.$set(this.data.animations, row, this.data.animations2[row]);
      }
      this.timer = setTimeout(this.afterAnimation, 1000);
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
      this.clearAnimations();
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
          } else if (this.data.tempTiles[y][x] === "kitten") {
            const n = this.kittenMoveTiles(y,x);
            for (const tile of n) {
              if (this.data.tempTiles[tile.y][tile.x] === "box") {
                moves.push({x1: x, x2:tile.x, y1:y, y2:tile.y, cat:"kitten"});
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
        console.log(m)
      }
      for (const m of filteredMoves.bad) {
        console.log(m)
        this.setTile(m.y2, m.x2, "broken-box");
        this.addAnimation(m.y1,m.x1,m.y2,m.x2, true);
        if (m.cat === "kitten") {
          if (Math.abs(m.y2-m.y1) === 2 || Math.abs(m.x2-m.x1) === 2) {
            let newY, newX;
            if (m.y2 - m.y1 <= 1) newY = m.y1;
            else if (m.y2 - m.y1 < 0) newY = m.y2+1;
            else newY = m.y2-1;
            if (m.x2 - m.x1 <= 1) newX = m.x1;
            else if (m.x2 - m.x1 < 0) newX = m.x2+1;
            else newX = m.x2-1;
            this.setTile(m.y1, m.x1, "");
            //This tile should be empty! Based on earlier checks
            this.setTile(newY, newX, m.cat);
          }
        }

      }
      //TODO: somehow communicate user what happened
      //visuals????????? oh no
      this.animating = true;
      this.timer = setTimeout(this.afterAnimation, 1000);
    },
    addAnimation(y1, x1, y2, x2, badmove) {
      if (y1 === y2) {
        if (x2 - x1 < 0) {
          this.data.animations.push({x:x1, y:y1, name:"moveLeft"});
          if (badmove) this.data.animations2.push({x:x1, y:y1, name:"arriveLeft"});
        }
        else {
          this.data.animations.push({x:x1, y:y1, name:"moveRight"});
          if (badmove) this.data.animations2.push({x:x1, y:y1, name:"arriveRight"});
        }
      } else {
        if (y2 - y1 < 0) {
          this.data.animations.push({x:x1, y:y1, name:"moveUp"});
          if (badmove) this.data.animations2.push({x:x1, y:y1, name:"arriveUp"});
        }
        else {
          this.data.animations.push({x:x1, y:y1, name:"moveDown"});
          if (badmove) this.data.animations2.push({x:x1, y:y1, name:"arriveDown"});
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
      this.animating = false;
      }
    },
    filterMoves(moves) {
      let allowedMoves = [];
      let badMoves = [];

      for (const m of moves) {
        const overlapMoves = moves.filter(x => x.x2 === m.x2 && x.y2 === m.y2);
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
    kittenMoveTiles(y,x) {
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
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

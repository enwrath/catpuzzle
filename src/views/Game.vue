<template>
  <div>
    <span>Boxes {{boxesOnBoard}} / {{data.totalBoxes}}</span>
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
        totalBoxes: 2,
        tiles: [["","","cat",""],["","","","cat"],["block","","","block"]]
      }
    }
  },
  methods: {
    boxPlaced(e) {
      if (this.boxesOnBoard < this.data.totalBoxes) {
        this.setTile(e.y, e.x, "box");
        this.moveCats();
      }
    },
    setTile(y, x, stuff) {
      const newRow = this.data.tiles[y].slice(0);
      newRow[x] = stuff;
      this.$set(this.data.tiles, y, newRow);
    },
    moveCats() {
      let moves = [];
      for (let y = 0; y < this.data.tiles.length; y++){
        for (let x = 0; x < this.data.tiles[y].length; x++){
          if (this.data.tiles[y][x] === "cat") {
            const n = this.neighbourTiles(y,x);
            for (const tile of n) {
              if (this.data.tiles[tile.y][tile.x] === "box") {
                moves.push({x1: x, x2:tile.x, y1:y, y2:tile.y});
              }
            }
          }
        }
      }

      // 2 cats cant fit into the same box -> rip box
      const filteredMoves = this.filterMoves(moves);

      for (const m of filteredMoves.allowed) {
        this.setTile(m.y2, m.x2, "box-cat");
        this.setTile(m.y1, m.x1, "");
      }
      for (const m of filteredMoves.bad) {
        this.setTile(m.y2, m.x2, "broken-box");
      }
      //TODO: somehow communicate user what happened
      //visuals????????? oh no

    },
    filterMoves(moves) {
      let allowedMoves = [];
      let badMoves = [];

      for (const m of moves) {
        const overlapMoves = moves.filter(x => x.x1 !== m.x1 && x.y1 !== m.y1 && x.x2 === m.x2 && x.y2 === m.y2);
        if (overlapMoves.length === 0) allowedMoves.push(m);
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

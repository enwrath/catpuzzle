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
        tiles: [["","block","cat","cat"],["","","",""],["block","","","block"]]
      }
    }
  },
  methods: {
    boxPlaced(e) {
      if (this.boxesOnBoard < this.data.totalBoxes) {
        const newRow = this.data.tiles[e.y].slice(0);
        newRow[e.x] = "box"
        this.$set(this.data.tiles, e.y, newRow);
        this.moveCats();
      }
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
      console.log(moves);
      //Check that no two cats try to go to same spot
      //Actually move the cats
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

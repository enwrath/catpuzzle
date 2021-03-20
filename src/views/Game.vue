<template>
  <div>
    <span>Boxes for this map: {{data.totalBoxes}}</span>
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
      const newRow = this.data.tiles[e.y].slice(0);
      newRow[e.x] = "box"
      this.$set(this.data.tiles, e.y, newRow)
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

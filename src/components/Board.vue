<template>
  <div>
    BOARD:
    <div class="TileRow" :key="`row-${y}`" v-for="(row, y) in data.tiles">
      <BoardTile @placebox="placeBox" :inside="tile" :x="x" :y="y" :key="`tile-${x}-${y}`" v-for="(tile, x) in row" />
    </div>

  </div>
</template>

<script>
import BoardTile from '@/components/BoardTile.vue'

export default {
  name: 'GameBoard',
  components: {
    BoardTile
  },
  props: {
    data: Object
  },
  methods: {
    placeBox (e) {
      this.$emit("placebox", e);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

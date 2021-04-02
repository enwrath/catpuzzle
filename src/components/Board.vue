<template>
  <div class="Board">
    <div class="TileRow" :key="`row-${y}`" v-for="(row, y) in data.tiles">
      <BoardTile :tileSize="tileSize" @placebox="placeBox" :inside="tile" :x="x" :y="y" :animations="data.animations" :key="`tile-${x}-${y}`" v-for="(tile, x) in row" />
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
  data() {
    return {
      width: 240,
      height: 240,
      maxTileSize: 240
    }
  },
  props: {
    data: Object
  },
  methods: {
    placeBox (e) {
      this.$emit("placebox", e);
    },
    getWidthHeight() {
      this.width = this.$el.clientWidth - 48;
      this.height = this.$el.clientHeight - 48;
    }
  },
  mounted() {
    this.getWidthHeight();
    window.addEventListener('resize', this.getWidthHeight);
  },
  computed: {
    tileSize: function () {
      const tileW = Math.floor(this.width / this.data.tiles[0].length);
      const tileH = Math.floor(this.height / this.data.tiles.length);
      let size = tileH;
      if (tileW < tileH) size = tileW;
      if (size > this.maxTileSize) return this.maxTileSize
      else return size;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Board {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  height: 100%;
  width: 100%;
}
.TileRow {
  display: flex;
}
</style>

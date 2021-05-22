<template>
  <div class="Board" :style="`margin-top: ${topMargin}px`">
    <div class="TileRow" :key="`row-${y}`" v-for="(row, y) in data.tiles">
      <BoardTile :confusedCats="data.confusedCats" :tileSize="tileSize" @placebox="placeBox" @rightclick="rightClick" :inside="tile" :x="x" :y="y" :animations="data.animations" :key="`tile-${x}-${y}`" v-for="(tile, x) in row" />
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
    rightClick (e) {
      this.$emit("rightclick", e);
    },
    getWidthHeight() {
      this.width = 0.9 * this.$el.clientWidth;
      this.height = 0.9 * this.$el.clientHeight;
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
      return size;
    },
    topMargin: function () {
      const extraheight = this.height - this.tileSize * this.data.tiles.length;
      return extraheight / 2;
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

<template>
  <div>
    BOARD!
    <BoardTile></BoardTile>
  </div>
</template>

<script>
import BoardTile from '@/components/BoardTile.vue'

export default {
  name: 'GameBoard',
  components: {
    BoardTile
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

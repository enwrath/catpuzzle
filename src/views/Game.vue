<template>
  <div>
    <span>Boxes left: {{boxesLeft}}</span>
    <Board></Board>
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
      boxesLeft: 2
    }
  },
  methods: {
    boxPlaced() {
      console.log("box placed");
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

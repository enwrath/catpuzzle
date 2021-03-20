<template>
  <div>
    <span>Boxes left: {{boxesLeft}}</span>
  </div>
</template>

<script>

export default {
  name: 'Game',
  components: {
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

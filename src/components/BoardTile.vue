<template>
  <div @click="placeBox()">
    Tile {{x}}, {{y}} <br />
    {{inside}} <br />
    {{canPlaceBox}}
  </div>
</template>

<script>
export default {
  name: 'BoardTile',
  props: {
    inside: String,
    x: Number,
    y: Number
  },
  computed: {
    canPlaceBox: function () {
      return this.inside === "";
    }
  },
  methods: {
    placeBox() {
      if (this.canPlaceBox) this.$emit("placebox", {x:this.x, y:this.y})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  display: inline-block;
  width: 100px;
  height: 100px;
  background: gray;
}
div:hover {
  background: cyan;
}
</style>

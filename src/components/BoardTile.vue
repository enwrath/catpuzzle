<template>
  <div @click="placeBox()">
    <img v-if="inside==='cat'" :class="animationName" src="../assets/cat.png" />
    <p v-else>
      Tile {{x}}, {{y}} <br />
      {{inside}}
    </p>
  </div>
</template>

<script>
export default {
  name: 'BoardTile',
  props: {
    inside: String,
    x: Number,
    y: Number,
    animations: Array
  },
  data() {
    return {
      animationName: "idleAnimation"
    }
  },
  watch: {
    animations: function () {
      this.checkAnimation();
    }
  },
  computed: {
    canPlaceBox: function () {
      return this.inside === "";
    }
  },
  methods: {
    placeBox() {
      if (this.canPlaceBox) this.$emit("placebox", {x:this.x, y:this.y})
    },
    checkAnimation() {
      const selfanim =  this.animations.filter(x => x.x === this.x && x.y === this.y);
      if (selfanim.length === 0) this.animationName = "idleAnimation";
      else this.animationName = selfanim[0].name;
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
img {
  width: 100%;
  height: 100%;
  z-index: 10;
  position: relative;
}
.moveLeft {
  animation-duration: 1s;
  animation-name: moveleft;
}
@keyframes moveleft {
  0% { margin-left: 0; }
  100% { margin-left: -100%; }
}
.moveRight {
  animation-duration: 1s;
  animation-name: moveright;
}
@keyframes moveright {
  0% { margin-left: 0; }
  100% { margin-left: 100%; }
}
.moveUp {
  animation-duration: 1s;
  animation-name: moveup;
}
@keyframes moveup {
  0% { margin-top: 0; }
  100% { margin-top: -100%; }
}
.moveDown {
  animation-duration: 1s;
  animation-name: movedown;
}
@keyframes movedown {
  0% { margin-top: 0; }
  100% { margin-top: 100%; }
}

.arriveLeft {
  animation-duration: 1s;
  animation-name: arriveleft;
}
@keyframes arriveleft {
  0% { margin-left: -100%; }
  100% { margin-left: 0; }
}
.arriveRight {
  animation-duration: 1s;
  animation-name: arriveright;
}
@keyframes arriveright {
  0% { margin-left: 100%; }
  100% { margin-left: 0; }
}
.arriveUp {
  animation-duration: 1s;
  animation-name: arriveup;
}
@keyframes arriveup {
  0% { margin-top: -100%; }
  100% { margin-top: 0; }
}
.arriveDown {
  animation-duration: 1s;
  animation-name: arrivedown;
}
@keyframes arrivedown {
  0% { margin-top: 100%; }
  100% { margin-top: 0; }
}



.idleAnimation {
  animation-duration: 1s;
  animation-name: moveidle;
  animation-iteration-count: infinite;
}

@keyframes moveidle {
  0% { margin-left: 0; }
  33% { margin-left: 5%; }
  66%, 72% { margin-left: -5%; }
  100% { margin-left: 0; }
}
</style>

<template>
  <div @click="placeBox()">
    <img v-if="inside==='cat'||inside==='kitten'" :class="animationName" :style="`--distance: ${animDistance}`" :src="require(`@/assets/${inside}.png`)" />
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
      animationName: "idleAnimation",
      animDistance: "0"
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
      if (selfanim.length === 0) {
        this.animationName = "idleAnimation";
        this.animDistance = "0";
      }
      else {
        this.animationName = selfanim[0].name;
        this.animDistance = selfanim[0].distance;
      }
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
  --distance: 100%;
}
.moveHor {
  animation-duration: 1s;
  animation-name: movehor;
}
@keyframes movehor {
  0% { left: 0; }
  100% { left: var(--distance); }
}
.moveVer {
  animation-duration: 1s;
  animation-name: movever;
}
@keyframes movever {
  0% { top: 0; }
  100% { top: var(--distance); }
}

.arriveHor {
  animation-duration: 1s;
  animation-name: arrivehor;
}
@keyframes arrivehor {
  0% { left: var(--distance); }
  100% { left: 0; }
}
.arriveVer {
  animation-duration: 1s;
  animation-name: arrivever;
}
@keyframes arrivever {
  0% { top: var(--distance); }
  100% { top: 0; }
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

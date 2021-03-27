<template>
  <div @click="placeBox()" :style="`width: ${tileSize}px; height: ${tileSize}px`">
    <img v-if="inside!==''" :class="{[animationName]: hasActiveCat}" :style="`--xdistance: ${xDistance}; --ydistance: ${yDistance}; z-index: ${ownZ}`" :src="require(`@/assets/${inside}.png`)" />
    <p v-else>
      Tile {{x}}, {{y}}
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
    animations: Array,
    tileSize: Number
  },
  data() {
    return {
      animationName: "idleAnimation",
      xDistance: "0",
      yDistance: "0"
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
    },
    hasActiveCat: function() {
      return this.inside.includes("cat") && !this.inside.includes("box");
    },
    ownZ: function () {
      if (this.hasActiveCat) return 10;
      else return 5;
    },
    tileMaxSize: function() {
      return 1;
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
        this.xDistance = selfanim[0].xdistance;
        this.yDistance = selfanim[0].ydistance;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  display: inline-block;
  background: gray;
}
div:hover {
  background: cyan;
}
img {
  position: relative;
  width: 100%;
  height: 100%;
  --ydistance: 100%;
  --xdistance: 100%;
}
.move {
  animation-duration: 1s;
  animation-name: move;
}
@keyframes move {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(var(--xdistance), var(--ydistance), 0); }
}
.arrive {
  animation-duration: 1s;
  animation-name: arrive;
}
@keyframes arrive {
  0% { transform: translate3d(var(--xdistance), var(--ydistance), 0); }
  100% { transform: translate3d(0, 0, 0); }
}

.idleAnimation {
  animation-duration: 1s;
  animation-name: moveidle;
  animation-iteration-count: infinite;
}

@keyframes moveidle {
  0% { transform: translate3d(0, 0, 0); }
  33% { transform: translate3d(5%, -0, 0); }
  66% { transform: translate3d(-5%, 0, 0); }
  100% { transform: translate3d(0, 0, 0); }
}
</style>

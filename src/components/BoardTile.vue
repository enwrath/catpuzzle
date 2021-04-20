<template>
  <div class="topdiv" @contextmenu.prevent="rightClick" @click="placeBox()">
    <img v-if="floorImage!==''" class="floorimg" :src="require(`@/assets/${floorImage}.png`)" />
    <div :class="{[animationName]: isAnimated && btmImagesAnimate }" :style="`width: ${tileSize}px; height: ${tileSize}px; --xdistance: ${xDistance}; --ydistance: ${yDistance}; --duration: ${animDuration};`">
      <img v-if="img1!==''" :class="{[animationName]: isAnimated && !btmImagesAnimate }" :style="`--xdistance: ${xDistance}; --ydistance: ${yDistance}; --duration: ${animDuration}; z-index: 3;`" :src="require(`@/assets/${img1}.png`)" />
      <img :key="`${x}${y}-img-${i}`" v-for="(img, i) in btmImages" class="belowimage" :style="`--xdistance: ${xDistance}; --ydistance: ${yDistance}; margin-left: -${95-i*30}%; z-index: 2;`" :src="require(`@/assets/${img}.png`)"  />
    </div>
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
      yDistance: "0",
      animDuration: "1s"
    }
  },
  watch: {
    animations: function () {
      this.checkAnimation();
    }
  },
  computed: {
    img1: function () {
      if (this.inside === "") return "";
      const splitTile = this.inside.split("-");
      if (splitTile.length === 1) return splitTile[0]
      else if (splitTile.length >= 2 && splitTile[splitTile.length-2] === "box" && splitTile[splitTile.length-1].includes("cat")) return splitTile[splitTile.length-2] + "-" + splitTile[splitTile.length-1];
      else return splitTile[splitTile.length-1];
    },
    btmImages: function () {
      const splitTile = this.inside.split("-");
      let topImages = 1;
      if (this.img1.includes("-")) topImages = 2;
      if (splitTile.length <= topImages) return [];
      else return splitTile.slice(0, -topImages).reverse().slice(0,3).filter(x => x.includes("cat")); //max 3 shown
    },
    hasActiveCat: function() {
      return this.img1.includes("cat") && (!this.img1.includes("box") || this.img1.includes("broken"));
    },
    isAnimated: function() {
      return this.hasActiveCat || this.animationName !== "idleAnimation";
    },
    ownZ: function () {
      if (this.hasActiveCat) return 10;
      else return 5;
    },
    btmImagesAnimate: function() {
      return this.inside.includes("push") && this.animationName !== "idleAnimation";
    },
    floorImage: function() {
      const splitTile = this.inside.split("-").filter(x => !x.includes("cat"));
      if (splitTile.length === 0) return "";
      else return splitTile[0];
    }
  },
  methods: {
    placeBox() {
      this.$emit("placebox", {x:this.x, y:this.y})
    },
    rightClick() {
      this.$emit("rightclick", {x:this.x, y:this.y})
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
        this.animDuration = `${selfanim[0].duration/1000}s`
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.topdiv {
  display: inline-block;
  background: gray;
  position: relative;
  outline: 1px solid black;
}
.topdiv:hover {
  background: cyan;
}
img {
  position: relative;
  width: 100%;
  height: 100%;
  --ydistance: 0;
  --xdistance: 0;
  --duration: 1s;
}
.belowimage {
  position: absolute;
  width: 30%;
  height: 30%;
  z-index: 4;
}
.floorimg {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.move {
  animation-duration: var(--duration);
  animation-name: move;
}
@keyframes move {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(var(--xdistance), var(--ydistance), 0); }
}
.arrive {
  animation-duration: var(--duration);
  animation-name: arrive;
}
@keyframes arrive {
  0% { transform: translate3d(var(--xdistance), var(--ydistance), 0); }
  100% { transform: translate3d(0, 0, 0); }
}
.hit {
  animation-duration: var(--duration);
  animation-name: hit;
}
@keyframes hit {
  0% { transform: translate3d(0, 0, 0); }
  25% { transform: translate3d(var(--xdistance), var(--ydistance), 0); }
  100% { transform: translate3d(0, 0, 0); }
}
.idleAnimation {
  animation-duration: 2s;
  animation-name: moveidle;
  animation-iteration-count: 0;
}

@keyframes moveidle {
  0% { transform: translate3d(0, 0, 0); }
  33% { transform: translate3d(5%, -0, 0); }
  66% { transform: translate3d(-5%, 0, 0); }
  100% { transform: translate3d(0, 0, 0); }
}
</style>

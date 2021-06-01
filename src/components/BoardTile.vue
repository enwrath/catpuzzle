<template>
  <div class="topdiv" @contextmenu.prevent="rightClick" @click="placeBox()" @mouseover="hoverTile" @mouseleave="hoverTileEnd">
    <div v-if="isHighlighted" class="highlight"></div>
    <img v-if="showHoverItem" class="hoverImg" :src="require(`@/assets/${itemInfo.item}.webp`)" />
    <div v-if="isConfused" class="confusedDiv">
      <img :key="`${x}${y}-confused-${i}`" v-for="i in confusedAngles" :style="`transform: rotate(${i}deg);`" :src="require(`@/assets/arrowright.webp`)"  />
      <img :src="require(`@/assets/qmark.webp`)" />
    </div>
    <img v-if="floorImage!==''" class="floorimg" :src="require(`@/assets/${floorImage}.webp`)" />
    <div :style="`width: ${tileSize}px; height: ${tileSize}px;`">
      <img v-if="img1!==''" :class="{[animationName]: isAnimated }" :style="`--xdistance: ${xDistance}%; --ydistance: ${yDistance}%; --duration: ${animDuration}; z-index: ${zIndex};`" :src="require(`@/assets/${img1}.webp`)" />
      <img :key="`${x}${y}-img-${i}`" v-for="(img, i) in btmImages" :class="{[animationName]: isAnimated && btmImagesAnimate }" class="belowimage" :style="`--xdistance: ${xDistance*4}%; --ydistance: ${yDistance*4}%; margin-left: -${87.5-i*25}%; z-index: ${zIndex-1};`" :src="require(`@/assets/${img}.webp`)"  />
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
    tileSize: Number,
    confusedCats: Array,
    itemInfo: Object,
    highlights: Array,
    showHighlight: Boolean
  },
  data() {
    return {
      animationName: "idleAnimation",
      xDistance: "0",
      yDistance: "0",
      animDuration: "1s",
      hovering: false
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
    showHoverItem: function() {
      return this.itemInfo.canUse && this.hovering && (this.inside === "" || this.inside === "tilehint");
    },
    isAnimated: function() {
      return this.animationName !== "idleAnimation";
    },
    btmImagesAnimate: function() {
      return this.inside.includes("push") && this.animationName !== "idleAnimation";
    },
    floorImage: function() {
      const splitTile = this.inside.split("-").filter(x => !x.includes("cat"));
      if (splitTile.length === 0) return "";
      else return splitTile[0];
    },
    zIndex: function() {
      if (this.isAnimated) return 10;
      return 5;
    },
    isConfused: function() {
      return !this.isAnimated && this.hasActiveCat && this.confusedCats.some(x => x.x === this.x && x.y === this.y);
    },
    isHighlighted: function() {
      return this.showHighlight && this.highlights.some(x => x.x === this.x && x.y === this.y);
    },
    confusedAngles: function() {
      if (!this.isConfused) return [];
      let angles = [];
      let confusions = this.confusedCats.filter(x => x.x === this.x && x.y === this.y);
      for (const c of confusions) {
        let angle = 0;
        if (c.xdist === 0 || c.ydist === 0) {
          if (c.xdist < 0) angle = 180;
          else if (c.ydist < 0) angle = 270;
          else if (c.ydist > 0) angle = 90;
        } else {
          if (c.xdist < 0 && c.ydist < 0) angle = 225;
          else if (c.xdist < 0 && c.ydist > 0) angle = 135;
          else if (c.xdist > 0 && c.ydist > 0) angle = 45;
          else if (c.xdist > 0 && c.ydist < 0) angle = 315;
        }
        angles.push(angle);
      }
      return angles;
    }
  },
  methods: {
    placeBox() {
      this.$emit("placebox", {x:this.x, y:this.y});
    },
    hoverTile() {
      this.hovering = true;
      this.$emit("hover", {start: true, x:this.x, y:this.y});
    },
    hoverTileEnd() {
      this.hovering = false;
      this.$emit("hover", {start: false, x:this.x, y:this.y});
    },
    rightClick() {
      this.$emit("rightclick", {x:this.x, y:this.y});
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
  background-image: url('~@/assets/tilebg.webp');
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
  width: 25%;
  height: 25%;
}
.floorimg {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.confusedDiv {
  position: absolute;
  width: 30%;
  height: 30%;
  left: 0;
  bottom: 0;
  z-index: 45;
}
.confusedDiv > img {
  position: absolute;
  left: 0;
  right: 0;
}
.highlight {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 46;
  background-color: white;
  opacity: 0.4;
}
.hoverImg {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 50%;
  width: 100%;
  height: 100%;
  z-index: 30;
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

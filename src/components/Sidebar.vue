<template>
  <div class="Sidebar">
    <button :disabled="boxesLeft <= 0" :class="{ActiveItem: itemSelected==='box'}" @click="$emit('selectbox')">
      House<br />
      X{{boxesLeft}}
    </button>
    <button :disabled="fishLeft <= 0" @click="$emit('selectfish')" :class="{ActiveItem: itemSelected==='fish'}">
      Fish<br />
      X{{fishLeft > 0 ? fishLeft : 0}}
    </button>
    <button :disabled="!canUndo" @click="$emit('undomove')">
      UNDO
    </button>
    <button @click="$emit('restartlevel')">
      RESTART</button>
  </div>
</template>

<script>

export default {
  name: 'Sidebar',
  props: {
    boxesLeft: Number,
    fishLeft: Number,
    canUndo: Boolean,
    itemSelected: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Sidebar {
  padding-top: 0;
  display: flex;
  flex-direction: row;
  color: white;
  flex-wrap: wrap;
  margin-right: 8vw;
}
.ActiveItem {
  background-color: #b3ffd7;
}
.ActiveItem:hover {
  background-color: #b3ffd7;
}
@media (orientation: landscape) {
  .Sidebar {
    flex-direction: column;
    padding-top: 10vh;
    margin-right: 0;
  }
}
.BoxLeft {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
}
button {
  height: 10vh;
  font-size: 2vw;
  width: 10vw;
  padding: 0;
  border-radius: 10%;
  background-color: #8abcd2;
  margin: 2px;
  font-weight: bold;
  border-style: ridge;
}
button:hover {
  background-color: #9fe2ff;
}
img {
  width: 100%;
  height: 100%;
}
p {
  margin-left: -75%;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: -1px 1px 0 #FFFFFF,1px 1px 0 #FFFFFF,1px -1px 0 #FFFFFF,-1px -1px 0 #FFFFFF;
}
</style>

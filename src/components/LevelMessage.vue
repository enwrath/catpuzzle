<template>
  <div class="main">
    <div class="bubble">
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LevelMessage',
  props: {
    message: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-right: 4rem;
}
.bubble {
  position: relative;
	background: #cce2c6;
	border-radius: .8em;
  display: inline-block;
  display: flex;
  align-items: center;
  margin: 0.5em 0 0.5em 1em;
  padding: 1em;
}
</style>

<template>
  <div class="main">
    <img :src="require(`@/assets/cat.png`)" />
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
  background: #353558;
  padding-right: 1em;
  justify-content: center;
  align-items: center;
  margin-right: 4rem;
}
.bubble {
  position: relative;
	background: #c7ecd2;
	border-radius: .4em;
  display: inline-block;
  display: flex;
  align-items: center;
  margin: 0.5em 0 0.5em 1em;
  padding: 1em;
}

.bubble:after {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 1em solid transparent;
	border-right-color: #c7ecd2;
	border-left: 0;
	margin-top: -1em;
	margin-left: -1em;
}
img {
  max-height: 5em;
}
</style>

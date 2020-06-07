<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>

<script>
export default {
   beforemounted() {
    document.querySelector("body").style.height = window.innerHeight + "px";
  }
}
</script>
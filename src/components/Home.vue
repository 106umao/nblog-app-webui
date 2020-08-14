<template>
  <div id="container">
      <router-view></router-view>
  </div>
</template>
<script>

export default {
  name: 'home'
}
</script>

<style scoped>
/* 给定 el-container一个固定的高度 header 和footer 就会变成粘性布局！ */
#container {
  background-color: #f5f5f5;
  padding: 10px 4%;
  width: auto;
  height:auto;
}
</style>

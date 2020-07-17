<template>
  <el-container id="container" direction="vertical">
    <myheader></myheader>
    <el-main class="main">
      <router-view></router-view>
    </el-main>
    <el-footer height="auto">
      <el-row type="flex" justify="center">
        <el-col align="center">
          <img width="100px" height="100px" src="../assets/tomato.jpg" />
        </el-col>
      </el-row>
    </el-footer>
      <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>
  </el-container>
</template>

<script>

export default {
  name: 'home'
}
</script>

<style scoped>
/* 给定 el-container一个固定的高度 header 和footer 就会变成粘性布局！ */
.el-container {
  background-color: #f5f5f5;
  width: 100%;
  min-height: 100%;
}
.main {
  width: 100%;
  padding: 20px 8%;
}
.el-row {
  position: static;
}
.el-footer {
  background-color: white;
}
</style>

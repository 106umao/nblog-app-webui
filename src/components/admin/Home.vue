<template>
  <el-container class="container">
    <el-header class="header">
      <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
          <p style="position:relative;left:40px;color:white">番茄钟社交平台后台管理系统</p>
        <div style="float:right;position:relative;right:40px;top:-40px" @click="$router.push('/')">
          <el-button>
            返回
          </el-button>
        </div>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside width="400px">
        <el-menu :router="true"
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu>
            <template slot="title">
              <span></span>
            </template>
            <el-menu-item index="/admin/user">用户管理</el-menu-item>
          <el-menu-item index="/admin/note">文章管理</el-menu-item>
          <el-menu-item index="/admin/tag">标签管理</el-menu-item>
          <el-menu-item index="/admin/category">分类管理</el-menu-item>
          <el-menu-item index="/admin/comment">评论管理</el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-container>
        <el-main><router-view></router-view></el-main>
        <el-footer>
          <div style="background-coloe:black "></div>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'AdminHome',
  data() {
    return {}
  }
}
</script>
<style scoped>
.el-header {
  padding: 0px !important;
}
.container {
  height: 100%;
  width: 100%;
}
.el-aside {
  background-color: #545c64 !important;
  height: 100%;
  border-right: 0px;
}
.el-menu {
  background-color: #545c64 !important;
  height: 100%;
  border-right: 0px !important;
}
.el-footer {
  background-color: #545c64 !important;
}
.el-main{
  padding: 50px !important;
  background-color: #F5F6F7;
}
</style>

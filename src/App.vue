<template>
  <div style="overflow-x: hidden;height: 100%" class="container">
    <el-backtop target=".container" :bottom="150" :right="100">
      <div
        style="{
        height: 100%;
        width: 100%;
        background-color: #FFFFFF;
        box-shadow: 0 0 2px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
        border-radius: 30px;
      }"
      >
        <i class="el-icon-caret-top"></i>
      </div>
    </el-backtop>
    <myheader></myheader>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style scope>
.container{
  height: 100%;
}
</style>

<template>
  <el-card :body-style="{padding:'0 4px 4px 4px'}">
    <el-card @click.native="click()" :body-style="{padding:'10px 20px'}" id="li" shadow="hover">
      <el-row type="flex" justify="space-around">
        <el-col :span="20">
          <span class="iconfont iconshoucang"></span>
          <p style="margin:10px;display:inline">我的收藏</p>
        </el-col>
        <el-col :span="4">
          <el-tag type="info" size="mini">999+</el-tag>
        </el-col>
      </el-row>
    </el-card>
    <el-card @click.native="click()" :body-style="{padding:'10px 20px'}" id="li" shadow="hover">
      <el-row type="flex" justify="space-around">
        <el-col :span="20">
          <span class="iconfont iconguanzhu1"></span>
          <p style="margin:10px;display:inline">我的关注</p>
        </el-col>
        <el-col :span="4">
          <el-tag type="info" size="mini">999+</el-tag>
        </el-col>
      </el-row>
    </el-card>
    <el-card @click.native="click()" :body-style="{padding:'10px 20px'}" id="li" shadow="hover">
        <span class="iconfont iconhuodong"></span>
        <p style="margin:10px;display:inline">活动中心</p>
    </el-card>
    <el-card @click.native="click()" :body-style="{padding:'10px 20px'}" id="li" shadow="hover">
        <span class="iconfont iconbangzhu"></span>
        <p style="margin:10px;display:inline">帮助中心</p>
    </el-card>
  </el-card>
</template>
<script>
export default {
  name: 'operation-list',
  methods: {
    click() {
      alert('click')
    }
  }
}
</script>
<style scoped>
.el-card{
  border:0px;
  font-size:17px;
  color:#8590A6;
}
#li{
  height:40px;
  margin-top:4px;
  cursor: pointer;
}

</style>

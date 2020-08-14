<template>
  <el-card shadow="hover">
    <template v-if="true">
      <el-avatar :size="50" :src="circleUrl"></el-avatar>
     <div  style="color:#9E97B0;text-align:center;font-size:12px">
        <el-row >
        <el-col :span="12">
           <p>昨日被阅读数</p>
           <p style="color:black;font-size:16px" ><b>0</b></p>
        </el-col>
        <el-col :span="12">
          <p>昨日被赞同数</p>
          <p style="color:black;font-size:16px" ><b>0</b></p>
        </el-col>
      </el-row>
     </div>
    <!-- <template v-if="loginUser">
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <<a href="#">
            <img class="avatar" :src="this.$baseServer+'/static/'+loginUser.avatar" />
          </a> -->
        <!-- </el-col> -->
        <!-- <el-col :span="20">
          <el-row type="flex" align="bottom">
            <el-col :span="10">
              <a style="display:block;padding-top:15px" href="#/personalNoteList">
                {{
                loginUser.username
                }}
              </a>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="3">
          <div style="position:relative;top:-20px;left:-40px">
            <el-tooltip class="item" effect="dark" content="我的收藏夹" placement="top-end">
              <el-button @click="$router.push('/myfavorite')" type="text">
                <i class="iconfont iconshoucang" style="color: #409EFF;font-size:12px">MyFavorite</i>
              </el-button>
            </el-tooltip>
          </div>
        </el-col> -->
      <!-- </el-row>
      <el-row>
        <el-col></el-col>
        <el-col></el-col>
        <el-col></el-col>
      </el-row> -->
    </template>
    <!-- <template v-if="!loginUser"> -->
          <template v-if="false">
      <el-row>
        <el-col :span="12">
          <router-link to="/login">去登陆</router-link>
        </el-col>
        <el-col :span="12">
          <router-link to="/register">去注册</router-link>
        </el-col>
      </el-row>
      <el-row>
        <el-col></el-col>
        <el-col></el-col>
        <el-col></el-col>
      </el-row>
    </template>
  </el-card>
</template>
<script>
export default {
  name: 'loginuser-desc',
  data() {
    return {
      loginUser: {},
      key: '',
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  },
  mounted() {
    const loginUser = JSON.parse(window.localStorage.getItem('loginUser'))
    this.loginUser = loginUser
  },
  methods: {
  }
}
</script>
<style scoped>
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 3px;
}
.el-avatar{
  display: block;
  margin-right: auto;
  margin-left: auto;
  cursor:pointer;
}
.el-card{
  margin-bottom: 8px;
}
</style>

<template>
  <el-card>
    <template v-if="loginUser">
      <el-row type="flex">
        <el-col :span="10">
          <a href="#">
            <img class="avatar" :src="this.$baseServer+'/static/'+loginUser.avatar" />
          </a>
        </el-col>
        <el-col :span="20">
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
        </el-col>
      </el-row>
      <el-row>
        <el-col></el-col>
        <el-col></el-col>
        <el-col></el-col>
      </el-row>
    </template>
    <template v-if="!loginUser">
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
      key: ''
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
</style>

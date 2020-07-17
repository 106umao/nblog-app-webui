<template>
<div>
  <el-header class="header-color" height="61px">
    <el-row type="flex" justify="space-between">
     <el-col :xs="20" :sm="0" :md="0" :lg="0" :xl="0">
        <p style="font-size:20px;line-height:1;color:#409EFF">
          <i class="el-icon-s-promotion"></i>番茄钟交流平台
        </p>
      </el-col>
       <el-col :xs="0" :sm="6" :md="6" :lg="6" :xl="6">
      </el-col>
       <el-col :xs="0" :sm="6" :md="6" :lg="6" :xl="6">
        <el-menu
          @select="logout"
          class="el-menu-demo"
          mode="horizontal"
          :router="true"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/home">首页</el-menu-item>
          <el-submenu v-if="loginUser"  index="4">
            <template slot="title">个人中心</template>
            <el-menu-item index="/personalNoteList">{{loginUser.username}}</el-menu-item>
            <el-menu-item v-if="loginUser.role!==0" index="/admin/user">后台管理</el-menu-item>
          </el-submenu>
          <el-submenu index="3" v-if="loginUser">
            <template slot="title">创作</template>
            <el-menu-item index="/edit/note/0">随手记</el-menu-item>
            <el-menu-item index="/edit/note/2">短时番茄钟</el-menu-item>
            <el-menu-item index="/edit/note/1">长时番茄钟</el-menu-item>
          </el-submenu>
          <el-menu-item v-if="loginUser" index="/logout">登出</el-menu-item>
          <el-menu-item v-if="!loginUser" index="/login">登录</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :xs="4" :sm="0" :md="0" :lg="0" :xl="0">
        <div class="downshow">
          <el-button  icon="el-icon-s-unfold"></el-button>
        </div>
      </el-col>
    </el-row>
  </el-header>
   <el-collapse-transition>
       <div v-show="dropDownShow" class="dropdown">
            <ul class="dropdown-top-ul">
              <li class="dropdown-top-li" v-for="(item, index) in leftMenuList" :key="index" @click="toActiveMenuItem(item)">{{ item.titleName }}</li>
            </ul>
            <ul class="dropdown-bottom-ul">
              <li class="dropdown-bottom-li" v-for="(item, index) in rightMenuList" :key="index" @click="toActiveMenuItem(item)">{{ item.titleName }}</li>
            </ul>
          </div>
  </el-collapse-transition>
</div>
</template>

<script>
export default {
  name: 'myheader',
  data () {
    return {
      key: '',
      loginUser: null
    }
  },
  methods: {
    keySearch: val => {
      console.log(val)
    },
    logout(path) {
      if (path === '/logout') {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('loginUser')
        setTimeout(() => this.$router.push('/'), '100')
      }
    }
  },
  mounted () {
    const loginUser = JSON.parse(window.localStorage.getItem('loginUser'))
    this.loginUser = loginUser
  }
}
</script>
<style scoped>
.el-header {
  background-color: white;
  position: static;
  top: 0px;
  border-bottom: 1px solid #e6e6e6;
}
.el-input {
  margin: 17px 0;
}
.downshow{
  position: absolute;
  top:10px;

}
</style>

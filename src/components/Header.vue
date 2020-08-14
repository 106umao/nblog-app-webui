<template>
<div>
  <el-header class="header-color" height="61px">
    <el-row type="flex" justify="space-between">
     <el-col :xs="20" :sm="12" :md="12" :lg="12" :xl="12">
       <router-link to="/home">
       <div>
         <span id="homeicon">
           <svg class="myicon" aria-hidden="true" >
             <use xlink:href="#iconmao"></use>
            </svg>
         </span>
          <p style="font-size:20px;display:inline;">
              S T A C K
          </p>
       </div>
       </router-link>
      </el-col>
       <el-col :xs="0" :sm="0" :md="3" :lg="4" :xl="4">
      </el-col>
       <el-col :xs="0" :sm="12" :md="10" :lg="8" :xl="8">
        <el-menu
          class="el-menu-demo"
          mode="horizontal"
          :router="true"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/home">首页</el-menu-item>
          <el-menu-item index="/archived">归档</el-menu-item>
          <el-menu-item index="/editArticle">创作</el-menu-item>
          <el-menu-item index="/edit/note/1">提问</el-menu-item>
          <div v-if="loginUser">
            <el-submenu   index="4">
              <template slot="title">个人中心</template>
              <el-menu-item index="/personalNoteList">{{loginUser.username}}</el-menu-item>
            </el-submenu>

            <el-menu-item index="/logout">登出</el-menu-item>
          </div>
          <el-menu-item v-if="!loginUser" index="/login">登录</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :xs="2" :sm="0" :md="0" :lg="0" :xl="0">
        <div class="downshow">
          <el-button @click="act" type="text" icon="el-icon-s-unfold"></el-button>
        </div>
      </el-col>
    </el-row>
  </el-header>
   <el-collapse-transition>
       <div v-show="isDrop" class="dropdown">
      <el-menu
       :router="true"
       background-color=""
          active-text-color="#409EFF"
      >
        <el-menu-item index="/home">首页</el-menu-item>
                  <el-menu-item index="/archived">归档</el-menu-item>
                  <el-menu-item index="editArticle">创作</el-menu-item>
                  <el-menu-item index="/edit/note/1">提问</el-menu-item>
                  <div v-if="loginUser">
                    <el-submenu   index="4">
                      <template slot="title">我的</template>
                      <el-menu-item index="/personalNoteList">{{loginUser.username}}</el-menu-item>
                    </el-submenu>

                    <el-menu-item index="/logout">登出</el-menu-item>
                  </div>
                  <el-menu-item v-if="!loginUser" index="/login">登录</el-menu-item>
       </el-menu>
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
      loginUser: null,
      isDrop: false
    }
  },
  methods: {
    act: function () {
      this.isDrop = !this.isDrop
    },
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
#homeicon{
  top: 10px;
  position: relative;
}
.myicon {
   width: 40px;
  height: 40px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
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
a{
  color: black;
  text-decoration:none;
}
.el-menu-item{
  text-align:center;
}
</style>

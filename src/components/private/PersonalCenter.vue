<template>
<div>
  <el-row>
    <el-col :span="6">
      <div style="position:relative; top:-15px">
        <el-input
          placeholder="在这里输入你想要搜索的内容"
          v-model="key"
          @change="keySearch($event)"
          prefix-icon="el-icon-search"
          size="mini"
        ></el-input>
      </div>
    </el-col>
  </el-row>
  <el-row type="flex" :gutter="20" class="row-bg">
    <el-col :span="18">
      <router-view></router-view>
    </el-col>
    <el-col :span="6">
      <loginuser-desc></loginuser-desc>
      <el-card>
        <el-row>
          <el-col>性别--->{{userInfo.sex===1?'男':'女'}}</el-col>
        </el-row>
        <el-row>
          <el-col>邮箱</el-col>
          <el-col>{{userInfo.email}}</el-col>
        </el-row>
        <el-row>
          <el-col>加入时间--->{{timeago(userInfo.createTime)}}</el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
</div>

</template>

<script>
export default {
  name: 'pcenter',
  data() {
    return {
      loginUser: {},
      userInfo: {},
      key: ''
    }
  },
  async mounted() {
    const loginUser = JSON.parse(window.localStorage.getItem('loginUser'))
    this.loginUser = loginUser
    const res = await this.$http.get('/user/info/' + loginUser.id)
    if (res.status === 200) {
      this.userInfo = res.data
    }
  },
  methods: {
    pattern: function(param) {
      return this.$DateUtils.pattern(param)
    },
    timeago: function(param) {
      return this.$DateUtils.timeago(param)
    },
    async keySearch(event) {
      const res = await this.$http.get('/note/searchByKey/' + this.key, {
        params: {
          userId: this.loginUser.id
        }
      })
      if (res.status === 200) {
        this.$message('查询成功')
        this.$hub.$emit('key-search-data', res.data)
      }
    }
  }
}
</script>
<style scoped>
.el-row {
  margin-top: 15px !important;
}
</style>

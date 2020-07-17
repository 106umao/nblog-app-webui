<template>
  <div>
    <el-table :data="userList" :stripe="true" :border="true" style="width: 100%" height="430px">
      <el-table-column align="center" fixed type="index" :index="1"></el-table-column>
      <el-table-column align="center" width="80" fixed prop="id" label="id"></el-table-column>
      <el-table-column align="center" width="160" fixed prop="username" label="用户名"></el-table-column>
      <el-table-column align="center" width="180" prop="email" label="邮箱"></el-table-column>
      <el-table-column align="center" width="160" prop="password" label="密码"></el-table-column>
      <el-table-column align="center" width="60" prop="sex" label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.sex==1?'男':'女'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="160" prop="avatar" label="头像地址"></el-table-column>
      <el-table-column align="center" width="160" prop="createTime" label="加入时间">
        <template slot-scope="scope">
          <span>{{timeago(scope.row.createTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="160" prop="updateTime" label="修改时间">
        <template slot-scope="scope">
          <span>{{timeago(scope.row.updateTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" prop="role" label="所属角色">
        <template slot-scope="scope">
          <span>{{scope.row.role==0?'普通成员':scope.row.role==1?'子管理员':'超级管理员'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="150" fixed="right" prop="content" label="操作">
        <template slot-scope="scope">
          <el-button @click="deleteRow(scope)" type="text" size="small">删除</el-button>
          <el-button v-if="scope.row.role!=3" @click="update(scope.row)" type="text" size="small">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      :close-on-press-escape="true"
      :before-close="handleClose"
      :visible.sync="visible"
      direction="ltr"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="updateForm" label-width="100px">
          <el-form-item label="用户名">
            <el-input v-model="updateForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="updateForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="updateForm.sex" placeholder="选择一个性别">
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="updateForm.role" placeholder="选择一个角色">
              <el-option label="普通成员" value="1"></el-option>
              <el-option label="子管理员" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="头像地址">
            <el-input v-model="updateForm.avatar" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
          <div>
            <el-button @click="$refs.drawer.closeDrawer()">取 消</el-button>
            <el-button
              type="primary"
              @click="updateSubmit"
              :loading="loading"
            >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
          </div>
        </el-form-item>
        </el-form>

      </div>
    </el-drawer>
  </div>
</template>
<script>
export default {
  name: 'User',
  data() {
    return {
      userList: [],
      loading: false,
      updateForm: {},
      visible: false
    }
  },
  mounted() {
    const loginUser = JSON.parse(window.localStorage.getItem('loginUser'))
    this.loginUser = loginUser
    this.init()
  },
  methods: {
    async init() {
      const { data: userList, status } = await this.$http.get('/user/admin')
      if (status === 200) {
        this.$message.success('初始化页面')
        this.userList = userList
        console.log(this.userList)
      }
    },
    async deleteRow(scope) {
      const { status } = await this.$http.delete('/user/admin/' + scope.row.id)
      if (status === 200) {
        this.$message('移除成功')
        this.userList.splice(scope.$index, 1)
      }
    },
    pattern: function(param) {
      return this.$DateUtils.pattern(param)
    },
    timeago: function(param) {
      return this.$DateUtils.timeago(param)
    },
    update(data) {
      console.log(data)
      this.updateForm = data
      this.visible = true
    },
    handleClose(done) {
      this.updateForm = {}
      this.visible = false
      this.loading = false
    },
    async updateSubmit() {
      this.loading = true
      const { status } = await this.$http.post('/user/admin',
        this.updateForm
      )
      console.log(status)
      if (status === 200) {
        this.$message.success('修改成功')
        this.loading = false
        this.visible = false
      }
    }
  }
}
</script>

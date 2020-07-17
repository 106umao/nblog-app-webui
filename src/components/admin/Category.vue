<template>
  <div>
    <el-table :data="categoryList" :stripe="true" :border="true"  style="width: 100%" height="430px">
      <el-table-column align="center" fixed type="index" :index="1"></el-table-column>
      <el-table-column align="center" width="80" fixed prop="id" label="id"></el-table-column>
      <el-table-column align="center" width="80" fixed prop="content" label="内容"></el-table-column>
      <el-table-column align="center" width="80" prop="userId" label="创建者id"></el-table-column>
       <el-table-column align="center" width="160"  prop="createTime" label="创建时间">
        <template slot-scope="scope">
          <span>{{timeago(scope.row.createTime)}}</span>
      </template>
      </el-table-column>
      <el-table-column align="center" width="160"  prop="updateTime" label="修改时间">
        <template slot-scope="scope">
          <span>{{timeago(scope.row.updateTime)}}</span>
      </template>
      </el-table-column>

      <el-table-column align="center" width="150" fixed="right" prop="content" label="操作">
        <template slot-scope="scope">
          <el-button @click="deleteRow(scope)" type="text" size="small">删除</el-button>
          <el-button
            @click="update(scope.row)"
            type="text"
            size="small"
          >修改</el-button>
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
          <el-form-item label="分类内容">
            <el-input v-model="updateForm.content" autocomplete="off"></el-input>
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
      categoryList: [],
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
      const { data: categoryList, status } = await this.$http.get(
        '/category/admin'
      )
      if (status === 200) {
        this.$message.success('初始化页面')
        this.categoryList = categoryList
        console.log(this.categoryList)
      }
    },
    async deleteRow(scope) {
      const { status } = await this.$http.delete('/category/admin/' + scope.row.id)
      if (status === 200) {
        this.$message('移除成功')
        this.categoryList.splice(scope.$index, 1)
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
      const { status } = await this.$http.post('/category/admin',
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

<template>
  <div>
    <el-table :data="commentList" :stripe="true" :border="true"  style="width: 100%" height="430px">
      <el-table-column align="center" fixed type="index" :index="1"></el-table-column>
      <el-table-column align="center" width="80" fixed prop="id" label="id"></el-table-column>
      <el-table-column align="center" width="80" fixed prop="userId" label="评论者id"></el-table-column>
      <el-table-column align="center" width="80" prop="content" label="内容"></el-table-column>
      <el-table-column align="center" width="80" prop="noteId" label="文章id"></el-table-column>
       <el-table-column align="center" width="160"  prop="createTime" label="发布时间">
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
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'User',
  data() {
    return {
      commentList: []
    }
  },
  mounted() {
    const loginUser = JSON.parse(window.localStorage.getItem('loginUser'))
    this.loginUser = loginUser
    this.init()
  },
  methods: {
    async init() {
      const { data: commentList, status } = await this.$http.get(
        '/comment/admin'
      )
      if (status === 200) {
        this.$message.success('初始化页面')
        this.commentList = commentList
        console.log(this.commentList)
      }
    },
    async deleteRow(scope) {
      const { status } = await this.$http.delete('/comment/admin/' + scope.row.id)
      if (status === 200) {
        this.$message('移除成功')
        this.commentList.splice(scope.$index, 1)
      }
    },
    pattern: function(param) {
      return this.$DateUtils.pattern(param)
    },
    timeago: function(param) {
      return this.$DateUtils.timeago(param)
    }
  }
}
</script>

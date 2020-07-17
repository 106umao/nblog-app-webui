<template>
  <el-table :data="favoriteList" style="width: 100%" max-height="100%">
    <el-table-column fixed type="index" :index="indexMethod"></el-table-column>
    <el-table-column width="180" fixed prop="createTime" label="收藏时间"></el-table-column>
    <el-table-column width="120" prop="authorName" label="作者"></el-table-column>
    <el-table-column width="160" prop="email" label="作者邮箱"></el-table-column>
    <el-table-column width="120" prop="title" label="标题"></el-table-column>
    <el-table-column width="300" prop="content" label="内容"></el-table-column>
    <el-table-column width="150" fixed="right" prop="content" label="操作">
      <template slot-scope="scope">
        <el-button
          @click="deleteRow(scope)"
          type="text"
          size="small"
        >移除</el-button>
        <el-button @click="$router.push('/public/noteDetail/'+scope.row.noteId)" type="text" size="small">查看</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: 'my-favorite',
  data() {
    return {
      favoriteList: [],
      loginUser: {}
    }
  },
  mounted() {
    const loginUser = JSON.parse(window.localStorage.getItem('loginUser'))
    this.loginUser = loginUser
    this.init()
  },
  methods: {
    async deleteRow(scope) {
      const { status } = await this.$http.delete('/note/favorite/' + scope.row.id)
      if (status === 200) {
        this.$message('移除收藏')
        this.favoriteList.splice(scope.$index, 1)
      }
    },
    indexMethod(index) {
      return index + 1
    },
    pattern: function(param) {
      return this.$DateUtils.pattern(param)
    },
    timeago: function(param) {
      return this.$DateUtils.timeago(param)
    },
    async init() {
      const { data: favoriteList, status } = await this.$http.get(
        '/favorite/all/' + this.loginUser.id
      )
      if (status === 200) {
        this.$message.success('初始化页面')
        favoriteList.forEach(item => {
          const obj = {
            id: item.id,
            title: item.note.title,
            content: item.note.content,
            noteId: item.noteId,
            authorId: item.note.user.userId,
            authorName: item.note.user.username,
            createTime: this.pattern(item.createTime),
            email: item.note.user.email
          }
          this.favoriteList.push(obj)
        })
        console.log(this.favoriteList)
      }
    }
  }
}
</script>

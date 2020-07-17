<template>
  <div>
    <el-table :data="noteList" :stripe="true" :border="true" style="width: 100%" height="430px">
            <el-table-column align="center" fixed type="expand" width="50" label="详情">
        <template slot-scope="scope">
        <el-form label-position="left" label-width="200px">
          <el-form-item label="标题">
            <span>{{ scope.row.title }}</span>
          </el-form-item>
           <el-form-item label="内容">
            <span>{{ scope.row.content }}</span>
          </el-form-item>
           <el-form-item label="来源">
            <span>{{scope.row.backfill==1?'社区回填':'用户自建'}}</span>
          </el-form-item>
          <el-form-item label="是否共享">
             <span>{{scope.row.share==1?'已共享':'未共享'}}</span>
          </el-form-item>
          <el-form-item label="点赞数">
             <span>{{scope.row.star}}</span>
          </el-form-item>
          <el-form-item label="开始时间">
              <span>{{scope.row.contentType==0?'无':pattern(scope.row.startTime)}}</span>
          </el-form-item>
          <el-form-item label="结束时间">
              <span>{{scope.row.contentType==0?'无':pattern(scope.row.endTime)}}</span>
          </el-form-item>
          <el-form-item label="文章类型">
          <span>{{scope.row.contentType==0?'随手记':scope.row.contentType==1?'长番茄钟':'短番茄钟'}}</span>
          </el-form-item>
          <el-form-item label="开始时间">
              <span>{{scope.row.contentType==0?'无':scope.row.startTime}}</span>
          </el-form-item>
          <el-form-item label="创建时间">
          <span>{{timeago(scope.row.createTime)}}</span>
          </el-form-item>
          <el-form-item label="最后修改时间">
          <span>{{timeago(scope.row.updateTime)}}</span>
          </el-form-item>
        </el-form>
      </template>
      </el-table-column>
      <el-table-column align="center" fixed type="index" :index="1" width="50" label="索引"></el-table-column>
      <el-table-column align="center" width="50" fixed prop="id" label="id" ></el-table-column>
      <el-table-column align="center" width="80"  prop="userId" label="创建者id"></el-table-column>
      <el-table-column align="center" width="80" prop="customCategoryId" label="类别id"></el-table-column>
      <el-table-column align="center" width="80" prop="communityTagId" label="标签id"></el-table-column>
      <el-table-column align="center" width="80" prop="backfill" label="来源">
        <template slot-scope="scope">
          <span>{{scope.row.backfill==1?'社区回填':'用户自建'}}</span>
      </template>
      </el-table-column>
      <el-table-column align="center" width="80" prop="share" label="是否共享">
        <template slot-scope="scope">
          <span>{{scope.row.share==1?'已共享':'未共享'}}</span>
      </template>
      </el-table-column>
      <el-table-column align="center" width="80" prop="star" label="点赞数"></el-table-column>
      <el-table-column align="center" width="160" prop="startTime" label="开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.contentType==0?'无':scope.row.startTime}}</span>
      </template>
      </el-table-column>
      <el-table-column align="center" width="160" prop="endTime" label="结束时间">
        <template slot-scope="scope">
          <span>{{scope.row.contentType==0?'无':scope.row.startTime}}</span>
      </template>
      </el-table-column>
      <el-table-column align="center" width="80" prop="contentType" label="文章类型">
        <template slot-scope="scope">
          <span>{{scope.row.contentType==0?'随手记':scope.row.contentType==1?'长番茄钟':'短番茄钟'}}</span>
      </template>
      </el-table-column>
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
      noteList: []
    }
  },
  mounted() {
    const loginUser = JSON.parse(window.localStorage.getItem('loginUser'))
    this.loginUser = loginUser
    this.init()
  },
  methods: {
    async init() {
      const { data: noteList, status } = await this.$http.get(
        '/note/admin'
      )
      if (status === 200) {
        this.$message.success('初始化页面')
        this.noteList = noteList
        console.log(this.noteList)
      }
    },
    async deleteRow(scope) {
      const { status } = await this.$http.delete('/note/admin/' + scope.row.id)
      if (status === 200) {
        this.$message('移除成功')
        this.noteList.splice(scope.$index, 1)
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

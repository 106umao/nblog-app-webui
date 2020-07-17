<template>
   <div>
           <el-tabs tabPosition="bottom" v-model="currentNoteType"  @tab-click="handleClick">
        <el-tab-pane :layz="true" label="全部" name="3">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
            <el-breadcrumb-item>全部</el-breadcrumb-item>
          </el-breadcrumb>
        </el-tab-pane>
        <el-tab-pane :layz="true" label="随手记" name="0">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
            <el-breadcrumb-item>随手记</el-breadcrumb-item>
          </el-breadcrumb>
        </el-tab-pane>
        <el-tab-pane :layz="true" label="长番茄钟" name="1">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
            <el-breadcrumb-item>长番茄钟</el-breadcrumb-item>
          </el-breadcrumb>
        </el-tab-pane>
        <el-tab-pane :layz="true" label="短番茄钟" name="2">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
            <el-breadcrumb-item>短番茄钟</el-breadcrumb-item>
          </el-breadcrumb>
        </el-tab-pane>
      </el-tabs>
      <div class="grid-content bg-purple">
        <el-card :key="index" v-for="(item, index) in noteList" class="box-card">
          <el-row type="flex" class="note-card">
            <el-col :span="21">
              <el-row class="content-row">
                <router-link :to="'/personalNoteDetail/'+item.id">{{item.title}}</router-link>
              </el-row>
              <el-row class="content-row content" type="flex">
                <el-col :span="3">
                  <el-tag size="mini">
                    {{
                    item.contentType === 0
                    ? '随手记'
                    : item.contentType === 1
                    ? '长番茄钟'
                    : '短番茄钟'
                    }}
                  </el-tag>
                </el-col>
                <el-col :span="7">发布于 {{timeago(item.createTime)}}</el-col>
                <el-col v-if="item.contentType!=0" :span="7">开始时间 {{pattern(item.startTime)}}</el-col>
                <el-col v-if="item.contentType!=0" :span="7">结束时间 {{pattern(item.endTime)}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="3">
              <span style="font-size:12px">来源 {{item.backfill===1?'社区回填':'自建'}}</span>
            </el-col>
            <el-col :span="2">
              <el-button type="text">
              <i class="iconshanchu iconfont" @click="deleteRow(item.id)"></i>
              </el-button>
            </el-col>
          </el-row>
        </el-card>
        <el-pagination
          @prev-click="pageChange"
          @next-click="pageChange"
          @current-change="pageChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="noteTotal"
        ></el-pagination>
      </div>
   </div>
</template>
<script>
export default {
  name: 'personal-note',
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      currentNoteType: '3', // 0 随手记 1 长番茄钟 2短番茄钟 3 推荐
      noteList: [],
      noteTotal: 0
    }
  },
  // 在vue单文件组件中 箭头函数不的this为定义时赋值，不能指向vue实例，而function定义的函数则有
  methods: {
    getNoteList() {
      console.log(this.loginUser.id)
      return this.$http.get('note/personalpage/', {
        params: {
          type: this.currentNoteType,
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          userId: this.loginUser.id
        }
      })
    },
    async pageChange(currentPage) {
      this.currentPage = currentPage
      const currentNoteList = await this.getNoteList()
      this.noteList = currentNoteList.data.noteList
      this.noteTotal = currentNoteList.data.total
    },
    handleClick: async function(tab) {
      const currentNoteList = await this.getNoteList()
      this.noteList = currentNoteList.data.noteList
      this.noteTotal = currentNoteList.data.total
    },
    async deleteRow(noteId) {
      const { status } = await this.$http.delete('/note/admin/' + noteId)
      if (status === 200) {
        this.$message('移除成功')
        const currentNoteList = await this.getNoteList()
        this.noteList = currentNoteList.data.noteList
        this.noteTotal = currentNoteList.data.total
      }
    },
    timeago: function(param) {
      return this.$DateUtils.timeago(param)
    },
    pattern: function(param) {
      return this.$DateUtils.pattern(param)
    }
  },
  async mounted() {
    const loginUser = JSON.parse(window.localStorage.getItem('loginUser'))
    this.loginUser = loginUser
    const currentNoteList = await this.getNoteList()
    this.noteList = currentNoteList.data.noteList
    this.noteTotal = currentNoteList.data.total
    this.$hub.$on('key-search-data', (data) => {
      this.noteList = data.noteList
      this.noteTotal = data.total
    })
    console.log(currentNoteList)
  }
}
</script>
<style scoped>
.el-container {
  background-color: #f5f5f5;
  width: 100%;
  height: 100%;
  min-height: 100%;
}
.main {
  width: 100%;
  padding: 20px 8%;
}
.el-row {
  position: static;
}
.el-footer {
  background-color: white;
}
.el-card {
  margin-bottom: 15px;
}
.content {
  font-size: 12px;
}
.box-card {
  margin: 0;
  padding: 0px;
  height: 88px;
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 3px;
}
.content-row {
  margin: 5px 0;
}
</style>

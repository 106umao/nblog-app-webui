<template>
  <el-row type="flex" :gutter="20" class="row-bg">
    <el-col :xs="24" :span="18">
      <router-view></router-view>
    </el-col>
    <el-col :xs="0" :span="6" >
      <loginuser-desc></loginuser-desc>
      <operation-list></operation-list>
      <tag-group :tag-list="tagList" margin="5px"></tag-group>
      <copyright-one id="right"></copyright-one>
    </el-col>
  </el-row>
</template>
<script>

export default {
  name: 'note-list',
  data() {
    return {
      tagList: [
        {
          id: 1,
          content: '编程'
        },
        {
          id: 2,
          content: 'Java'
        },
        {
          id: 3,
          content: '英语'
        },
        {
          id: 4,
          content: 'SOA'
        },
        {
          id: 5,
          content: 'WEB'
        },
        {
          id: 6,
          content: 'SpringBoot'
        },
        {
          id: 7,
          content: 'SpringSecurity'
        }, {
          id: 8,
          content: 'Android'
        }, {
          id: 9,
          content: 'Vert.x'
        }
      ],
      currentPage: 1,
      pageSize: 20,
      currentNoteType: '3', // 0 随手记 1 长番茄钟 2短番茄钟 3 推荐
      noteList: [],
      loginUser: null,
      noteTotal: 0
    }
  },
  // 在vue单文件组件中 箭头函数不的this为定义时赋值，不能指向vue实例，而function定义的函数则有
  methods: {
    getNoteList() {
      return this.$http.get('note/page/' + this.currentNoteType, {
        params: {
          pageSize: this.pageSize,
          currentPage: this.currentPage
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
    timeago: function(param) {
      return this.$DateUtils.timeago(param)
    }
  },
  async mounted() {
    const currentNoteList = await this.getNoteList()
    this.noteList = currentNoteList.data.noteList
    this.noteTotal = currentNoteList.data.total
    this.loginUser = JSON.parse(window.localStorage.getItem('loginUser'))
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
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 3px;
}
.content-row {
  margin: 5px 0;
}
#right{
  position: sticky;
  top: 100px;
}
</style>

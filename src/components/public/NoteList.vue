<template>
   <div style="height:100%">
      <div class="grid-content bg-purple">
        <el-card  shadow="hover" :key="index" v-for="(item, index) in noteList" class="box-card" >
          <el-row type="flex" class="note-card">
            <el-col :span="2">
              <a href="#">
                <img class="avatar" :src="'http://localhost:8081/static/'+item.avatar" />
              </a>
            </el-col>
            <el-col :span="21">
              <el-row class="content-row">
                <router-link :to="'/public/noteDetail/'+item.id">{{item.title}}</router-link>
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
                <el-col :span="2">
                  <a href="javascript:void(0);">{{ item.username }}</a>
                </el-col>
                <el-col :span="5">{{ timeago(item.createTime) }}</el-col>
                 <el-col v-if="tag" :span="5">社区标签：{{tag}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="2">
              <i class="icondayizan iconfont">{{item.star}}</i>
            </el-col>
            <el-col :span="2">
              <el-button type="text">
              <i class="iconshanchu iconfont" @click="deleteRow(item.id)"></i>
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </div>
          <ul  v-infinite-scroll="load"
            infinite-scroll-delay ="300"
          >
          </ul>
   </div>

</template>
<script>
export default {
  name: 'note-list',
  data() {
    return {
      count: 0,
      tag: null,
      currentPage: 1,
      pageSize: 20,
      currentNoteType: '3', // 0 随手记 1 长番茄钟 2短番茄钟 3 推荐
      noteList: [
      ],
      i: 0,
      noteTotal: 0
    }
  },
  // 在vue单文件组件中 箭头函数不的this为定义时赋值，不能指向vue实例，而function定义的函数则有
  methods: {
    load () {
      console.log(this.count)
      this.noteList.push({
        id: this.i++
      })
      this.noteList.push({
        id: this.i++
      })
      this.noteList.push({
        id: this.i++
      })
      this.noteList.push({
        id: this.i++
      })
      this.noteList.push({
        id: this.i++
      })
      this.noteList.push({
        id: this.i++
      })
      console.log(this.noteList)
      this.count += 2
    },
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
      console.log(this.currentNoteType)
      if (this.currentNoteType !== 4) {
        const currentNoteList = await this.getNoteList()
        this.noteList = currentNoteList.data.noteList
        this.noteTotal = currentNoteList.data.total
        this.tag = null
      }
    },
    timeago: function(param) {
      return this.$DateUtils.timeago(param)
    },
    async deleteRow(noteId) {
      const { status } = await this.$http.delete('/note/admin/' + noteId)
      if (status === 200) {
        this.$message('移除成功')
        const currentNoteList = await this.getNoteList()
        this.noteList = currentNoteList.data.noteList
        this.noteTotal = currentNoteList.data.total
      }
    }
  },
  async mounted() {
    const currentNoteList = await this.getNoteList()
    this.noteList = currentNoteList.data.noteList
    this.noteTotal = currentNoteList.data.total
    this.$hub.$on('tag-click', (data) => {
      console.log(data)
      this.noteList = data.data
      this.noteTotal = data.data.length
      this.tag = data.tagName
      this.currentNoteType = 4
    })
  }
}
</script>
<style scoped>

.el-row {
  position: static;
}

.el-card {
  margin-bottom: 15px;
}
.content {
  font-size: 12px;
}
.box-card {
  margin-bottom: 2px;
  padding: 0px;
  height: 88px;
  cursor:pointer;
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

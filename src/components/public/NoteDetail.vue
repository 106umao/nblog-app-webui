<template>
  <div v-show="noteD">
    <el-card class="box-card">
      <div slot="header">
        <p style="font-size:24px;margin-top:5px"><b>搜索思想——DFS and BFS（基础基础篇）</b></p>
        <div style=" display: flex;justify-content:space-between">
          <div style="display:flex;">
             <el-avatar :size="38" :src="circleUrl"></el-avatar>
              <div style="margin-left:10px">
                <p style="font-size:15px;margin:0;cursor:pointer"><b>Linkcheng</b></p>
                <p style="font-size:14px;margin:0">博客地址：www.bincjs.cns</p>
              </div>
          </div>
          <div class="hidden-xs-only">
            <el-button type="primary" size="medium" icon="el-icon-plus">关注他</el-button>
          </div>
        </div>
          <p style="font-size: 14px;;color: #8590a6;cursor:pointer;display:inline-block">
          469 人赞同了该文章
        </p>
        <mavon-editor previewBackground="#FFFFFF" boxShadowStyle="0px 0px" :subfield="false" :boxShadow="false" defaultOpen="preview" :toolbarsFlag="false" v-model="noteD.content"/>
         <p v-if="!editOrPublish" style="font-size: 14px;;color: #8590a6;cursor:pointer;display:inline-block" @click="editOrPublish = !editOrPublish">
          发布于 2017-01-23
        </p>
         <p v-if="editOrPublish" style="font-size: 14px;;color: #8590a6;cursor:pointer;display:inline-block" @click="editOrPublish = !editOrPublish">
          编辑于 2019-04-20
        </p>
        <div style="position:relative;left:-5px">
          <tag-group :tag-list="tagList" ></tag-group>
        </div>
        <div style=" display: flex;flex-wrap:wrap;justify-content:space-between">
            <div style="padding-top:7px">
              <el-button-group>
                <el-button type="primary" size="small" icon="el-icon-caret-top">赞同 469</el-button>
                <div style="position:relative;left:5px;display:inline-block">
                    <el-button type="primary" size="small"><i class="el-icon-caret-bottom"></i></el-button>
                </div>
              </el-button-group>
            </div>
            <p style="font-size: 14px;color: #8590a6;cursor:pointer;;display:inline-block">
              <span style="font-size: 14px;" class="iconfont iconicon_comment"> 44条评论</span>
            </p>
            <p style="font-size: 14px;color: #8590a6;cursor:pointer;;display:inline-block">
              <span style="font-size: 14px;" class="iconfont iconfenxiang2"> 分享</span>
            </p>
            <p style="font-size: 14px;color: #8590a6;cursor:pointer;;display:inline-block">
              <span style="font-size: 14px;" class="iconfont iconshoucang"> 收藏</span>
            </p>
            <p style="font-size: 14px;color: #8590a6;cursor:pointer;;display:inline-block">
              <span style="font-size: 14px;" class="iconfont iconwenzhangzhuanzai"> 申请转载</span>
            </p>
            <p style="font-size: 14px;;color: #8590a6;cursor:pointer;;display:inline-block">
              <span style="font-size: 14px;" class="iconfont iconjubao"> 举报</span>
            </p>

        </div>
        <el-divider><p><b>本文所属以下分类</b></p></el-divider>
        <div style="display:flex;">
              <div style="margin-left:10px">
                <p style="font-size:15px;margin:0;cursor:pointer"><b>算法理解与实现</b></p>
                <p style="font-size:14px;margin:0">本人对于一些算法的见解</p>
              </div>
          </div>
      </div>
      <el-form
          :rules="commentFormRules"
          ref="commentFormRef"
          :model="commentForm"
          label-width="80px"
        >
          <el-form-item prop="content" label-width="0px">
            <el-input
              placeholder="我知道你想说些什么"
              :autosize="{minRows: 4}"
              type="textarea"
              v-model="commentForm.content"
            ></el-input>
          </el-form-item>
          <el-button type="primary" @click="commentSubmit">发表评论</el-button>
        </el-form>
      </el-card>
      <el-card :key="index" v-for="(item, index) in (commentList)" class="note-card">
        <el-row type="flex">
          <el-col :span="2">
            <a href="#">
              <el-avatar
                :size="50"
                shape="square"
                :src="'http://localhost:8081/static/'+item.user.avatar"
              ></el-avatar>
              <!-- <img class="avatar" :src="'http://localhost:8081/static/'+item.user.avatar" /> -->
            </a>
          </el-col>
          <el-col :span="21">
            <el-row class="content-row content" type="flex">
              <el-col :span="2">
                <a href="javascript:void(0);">{{item.user.username}}</a>
              </el-col>
              <el-col id="callTime" :span="5">回复于{{timeago(item.createTime)}}</el-col>
              <el-col>#{{index+1}}楼</el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <div id="comment-content">{{item.content}}</div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  props: ['noteId'],
  name: 'noteDetail',
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
        }
      ],
      editOrPublish: true,
      loginUser: null,
      commentList: [],
      noteD: {
        content: '',
        note: {
          title: ''
        }
      },
      commentForm: {
        content: ''
      },
      commentFormRules: {
        content: [
          { required: true, message: '内容不能为空', trigger: ['change'] },
          {
            min: 5,
            max: 200,
            message: '最少得五个字符，最多两百字符',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
    const loginUser = JSON.parse(window.localStorage.getItem('loginUser'))
    this.loginUser = loginUser
  },
  methods: {
    async init() {
      const res = await this.$http.get('/note/get/' + this.noteId)
      if (res.status === 200) {
        this.commentList = res.data.commentList.reverse()
        this.noteD = res.data
      }
      if (this.loginUser !== null) {
        const { data: customCategory, status } = await this.$http.get('/category/list/' + this.loginUser.id)
        if (status === 200) {
          this.customCategory = customCategory
        }
      }
    },
    commentSubmit() {
      if (!this.loginUser) {
        this.$message.error('请登录后再评论')
        return
      }
      this.$refs.commentFormRef.validate(async flag => {
        if (flag) {
          const res = await this.$http.put('/comment/add', {
            userId: this.loginUser.id,
            content: this.commentForm.content,
            noteId: parseInt(this.noteId)
          })
          if (res.status === 200) {
            this.commentForm = {}
            this.$message.success('评论成功')
            this.init()
          }
        }
      })
    },
    pattern: function(param) {
      return this.$DateUtils.pattern(param)
    },
    timeago: function(param) {
      return this.$DateUtils.timeago(param)
    },
    async starHandler(noteId, event) {
      if (!this.isStar) {
        const res = await this.$http.put('/note/star/' + noteId)
        if (res.status === 200) {
          this.noteD.note.star += 1
        }
      } else {
        const res = await this.$http.delete('/note/star/' + noteId)
        if (res.status === 200) {
          this.noteD.note.star -= 1
        }
      }
      this.isStar = !this.isStar
    },
    async backfillHandler(type, noteId, event) {
      if (!this.loginUser) {
        this.$message.warning('请登录后进行回填操作')
        return
      }
      if (type === 'show' && this.isBackfill === false) {
        this.backfillFormVisible = true
        return
      }
      if (!this.isBackfill) {
        console.log(true)
        this.$refs.backfillFormRef.validate(async flag => {
          console.log(true)
          if (flag) {
            const res = await this.$http.put('/note/backfill/' + noteId, {
              customCategoryId: this.backfillForm.category,
              startTime: this.backfillForm.actionTime[0],
              endTime: this.backfillForm.actionTime[1],
              userId: this.loginUser.id
            })
            if (res.status === 200) {
              this.$message.success('已回填')
              this.isBackfill = !this.isBackfill
              this.backfillNoteId = res.data.id
              this.backfillFormVisible = !this.backfillFormVisible
              this.noteD.backfillCount += 1
            }
          }
        })
      } else {
        const res = await this.$http.put('/note/unbackfill/' + noteId, {
          userId: this.loginUser.id,
          backfillNoteId: this.backfillNoteId
        })
        if (res.status === 200) {
          this.$message.success('已取消')
          this.isBackfill = !this.isBackfill
          this.noteD.backfillCount -= 1
        }
      }
    },
    async favoriteHandler(noteId, event) {
      if (!this.loginUser) {
        this.$message.warning('请登录后进行收藏操作')
        return
      }
      if (!this.isFavorite) {
        const res = await this.$http.put('/note/favorite/' + noteId, {
          userId: this.loginUser.id
        })
        if (res.status === 200) {
          this.$message.success('已收藏')
          this.favoriteNoteId = res.data.id
          this.isFavorite = !this.isFavorite
          this.noteD.favoriteCount++
        }
      } else {
        const res = await this.$http.put('/note/unfavorite', {
          noteId: noteId,
          userId: this.loginUser.id
        })
        if (res.status === 200) {
          this.$message.success('已取消收藏')
          this.noteD.favoriteCount--
          this.isFavorite = !this.isFavorite
        }
      }
    }
  }
}
</script>

<style scoped>
#callTime {
  margin-top: 5px;
  font-size: 12px;
}
#comment-content {
  overflow: hidden;
  margin-top: 12px;
  width: 100%;
  padding-right: 50px;
}

.star-fill-count {
  line-height: 2;
  font-size: 12px;
}
.note-box {
  margin: 0;
  padding: 0px;
  width: 100%;
}
.box-card {
  margin: 0;
  padding: 0px;
}
.desc{

  font-size: 12px;
}
.el-avatar{
  display: block;
  cursor:pointer;
  flex-shrink:0;
}
</style>

<template>
  <div v-show="noteD">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div v-if="noteD.note.contentType!=0" style="float:right;color:#409EFF">
          <el-row>
            <el-col :span="20">当前时间 {{year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds}}</el-col>
            <el-col>{{now}}</el-col>
            <el-col v-if="dis>0">此轮番茄钟倒计时/秒 {{date}}</el-col>
          </el-row>
        </div>
        <el-row>
          <el-col>
            <p style="font-size:20px">{{noteD.note.title}}</p>
          </el-col>
          <el-col>
            <el-row :gutter="0" type="flex" justify="start" class="desc">
              <el-col :span="2">作者 {{noteD.username}}</el-col>
              <el-col :span="3">
                类型 {{
                noteD.note.contentType === 0
                ? '随手记'
                : noteD.note.contentType === 1
                ? '长番茄钟'
                : '短番茄钟'
                }}
              </el-col>
              <el-col :span="5">发布 {{pattern(noteD.note.createTime)}}</el-col>
              <el-col :span="3">分类 {{noteD.category}}</el-col>
              <el-col :span="2">标签 {{noteD.tag}}</el-col>
              <el-col
                :span="5"
                v-if="noteD.note.contentType!==0"
              >开始 {{pattern(noteD.note.createTime)}}</el-col>
              <el-col :span="5" v-if="noteD.note.contentType!==0">结束 {{pattern(noteD.note.endTime)}}</el-col>
            </el-row>
          </el-col>
          <el-col>
            <el-row type="flex" class="star-fill-count">
              <el-col :span="3">已赞({{noteD.note.star}})</el-col>
              <el-col :span="3">已回填({{noteD.backfillCount}})</el-col>
              <el-col :span="3">已收藏({{noteD.favoriteCount}})</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-button style="float: right; padding: 10px 0;margin:0 5px" type="text">
          <p v-if="!noteD.note.share&&!noteD.note.backfill" @click="shareCommunity">分享到社区</p>
          <p v-else-if="noteD.note.share&&!noteD.note.backfill" @click="shareCommunity">取消分享</p>
          <p v-else>通过社区回填，不可分享至社区</p>
        </el-button>
      </div>
      <div>{{noteD.note.content}}</div>
    </el-card>
    <div width="100%">
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
    <el-dialog :destroy-on-close="true" title="社区回填" :visible.sync="backfillFormVisible  ">
      <el-form :model="backfillForm" ref="backfillFormRef" :rules="backfillFormRules">
        <el-form-item label="选择一个自己的分类" prop="category">
          <el-select no-data-text="无分类" v-model="backfillForm.category" placeholder="请选择分类">
            <el-option
              :key="index"
              v-for="(item,index) in customCategory"
              :label="item.content"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="actionTime" v-if="noteD.note.contentType!==0" label="选择时间">
          <el-date-picker
            v-model="backfillForm.actionTime"
            format="yyyy-MM-dd HH:mm"
            type="datetimerange"
            :picker-options="noteD.note.contentType===1?pickerOptionsLong:pickerOptionsShort"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="backfillFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="backfillHandler('submit',noteD.note.id,$event)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ['noteId'],
  name: 'noteDetail',
  data() {
    return {
      date: '',
      pickerOptionsLong: {
        shortcuts: [
          {
            text: '最近15天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 15)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近30天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近90天月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近180天月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      pickerOptionsShort: {
        shortcuts: [
          {
            text: '25分钟后',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 1800 * 1000)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      customCategory: [],
      loginUser: null,
      backfillFormVisible: false,
      backfillNoteId: '',
      backfillForm: {
        category: '',
        actionTime: ''
      },
      backfillFormRules: {
        category: [
          {
            required: true,
            message: '没有分类就先去个人中心新建一个吧',
            trigger: ['blur', 'change']
          }
        ],
        actionTime: [
          {
            validator: (rule, value, callback) => {
              if (this.noteD.note.contentType === 1) {
                if (value[1] - value[0] < 3600 * 1000 * 24 * 15) {
                  return callback(new Error('长番茄钟不能短于15天'))
                }
              } else if (this.noteD.note.contentType === 2) {
                if (value[1] - value[0] !== 1800 * 1000) {
                  return callback(new Error('短番茄钟只能用标准的25分钟'))
                }
              }
              return callback()
            },
            trigger: ['blur', 'change']
          }
        ]
      },
      isStar: false,
      isBackfill: false,
      isFavorite: false,
      commentList: [],
      noteD: {
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
      },
      year: 0,
      month: 0,
      day: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      nowTimeStamp: new Date().getTime(),
      dis: -1
    }
  },
  mounted() {
    this.init()
    const loginUser = JSON.parse(window.localStorage.getItem('loginUser'))
    this.loginUser = loginUser
    setInterval(() => {
      this.year = new Date().getFullYear()
      this.month = new Date().getMonth() + 1
      this.day = new Date().getDate()
      this.hours = new Date().getHours()
      this.minutes = new Date().getMinutes()
      var ss = new Date().getTime() % 60000
      this.seconds = (ss - (ss % 1000)) / 1000
      if (this.dis > 0) {
        this.dis--
        var dd = parseInt(this.dis / 1000 / 60 / 60 / 24, 10)
        var hh = parseInt(this.dis / 1000 / 60 / 60 % 24, 10)
        var mm = parseInt(this.dis / 1000 / 60 % 60, 10)
        var mss = parseInt(this.dis / 1000 % 60, 10)
        dd = dd < 10 ? ('0' + dd) : dd // 天
        hh = hh < 10 ? ('0' + hh) : hh // 时
        mm = mm < 10 ? ('0' + mm) : mm // 分
        mss = ss < 10 ? ('0' + mss) : mss // 秒
        this.date = dd + '天' + hh + '时' + mm + '分' + mss + '秒'
      }
      if (this.dis === 0) {
        this.$confirm('番茄钟' + this.noteD.note.title + '完成啦！', '通知', {
          confirmButtonText: '收到',
          type: 'success'
        })
        this.$message.success()
        let flag = 20
        setInterval(() => {
          if (!flag) {
            return
          }
          flag--
          this.$notify({
            title: '请注意休息',
            message: '您的' + this.noteD.note.title + '番茄钟完成!'
          })
        }, 100)
      }
    }, 1000)
  },
  computed: {
    daojishi() {
      const dis = this.dis
      const year = new Date(dis).getFullYear()
      const month = new Date(dis).getMonth() + 1
      const day = new Date(dis).getDate()
      const hours = new Date(dis).getHours()
      const minutes = new Date(dis).getMinutes()
      var ss = new Date(dis).getTime() % 60000
      const seconds = (ss - (ss % 1000)) / 1000
      return year + '年' + month + '月' + day + '天' + hours + '时' + minutes + '分' + seconds + '秒'
    },
    now: function(param) {
      if (
        this.noteD.note.startTime <= this.nowTimeStamp &&
        this.nowTimeStamp <= this.noteD.note.endTime
      ) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.dis = this.noteD.note.endTime - this.nowTimeStamp
        return '此番茄钟已开始'
      } else if (this.noteD.note.endTime < this.nowTimeStamp) {
        return '此番茄钟已结束'
      } else if (this.noteD.note.startTime > this.nowTimeStamp) {
        return '此番茄钟未开始'
      }
      console.log(this.noteD.note.startTime - this.nowTimeStamp)
      return 'bug'
    }
  },
  methods: {
    async shareCommunity() {
      if (!this.noteD.note.share) {
        const res = await this.$http.post('/note/share/' + this.noteD.note.id)
        if (res.status === 200) {
          this.$message.success('成功分享')
          const temp = this.noteD
          temp.note.share = 1
          this.noteD = temp
        }
      } else {
        const res = await this.$http.delete('/note/share/' + this.noteD.note.id)
        if (res.status === 200) {
          this.$message.success('取消分享')
          const temp = this.noteD
          temp.note.share = 0
          this.noteD = temp
        }
      }
    },
    async init() {
      console.log('aa')
      const res = await this.$http.get('/note/get/' + this.noteId)
      console.log(res)

      if (res.status === 200) {
        this.commentList = res.data.commentList.reverse()
        this.noteD = res.data
      }
      if (this.loginUser !== null) {
        const { data: customCategory, status } = await this.$http.get(
          '/category/list/' + this.loginUser.id
        )
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
.desc {
  font-size: 12px;
}
</style>

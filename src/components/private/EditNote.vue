<template>
  <div>
    <el-form
      :inline="true"
      :model="categoryForm"
      ref="categoryFormRef"
      :rules="categoryFormRules"
      label-width="200px"
      class="demo-form-inline"
    >
      <el-form-item prop="content" label="添加或删除分类">
        <el-input v-model="categoryForm.content" placeholder="输入一个分类"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="removeCategory">删除</el-button>
        <el-button type="primary" @click="addCategory">添加</el-button>
      </el-form-item>
    </el-form>

    <el-form label-width="200px" :model="editForm" ref="editFormRef" :rules="editFormRules">
      <el-form-item label="选择一个自己的分类" prop="category">
        <el-select no-data-text="无分类" v-model="editForm.category" placeholder="请选择分类">
          <el-option
            :key="index"
            v-for="(item,index) in customCategory"
            :label="item.content"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择一个社区的标签" prop="tag">
        <el-select no-data-text="无标签" v-model="editForm.tag" placeholder="请选择标签">
          <el-option
            :key="index"
            v-for="(item,index) in publicTag"
            :label="item.content"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="title" label="在这里输入标题">
        <el-input :clearable="true" v-model="editForm.title"></el-input>
      </el-form-item>
      <el-form-item prop="content" label="在这里输入你要记录的内容">
        <el-input
          type="textarea"
          :autosize="{minRows:6}"
          :clearable="true"
          v-model="editForm.content"
        ></el-input>
      </el-form-item>
      <el-form-item prop="actionTime" v-if="contentType!=0" label="选择时间">
        <el-date-picker
          v-model="editForm.actionTime"
          format="yyyy-MM-dd HH:mm"
          type="datetimerange"
          :picker-options="contentType==1?pickerOptionsLong:pickerOptionsShort"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          value-format="timestamp"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('editFormRef')">重置</el-button>
        <el-button type="primary" @click="submitForm('editFormRef')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  async mounted() {
    this.init()
  },
  props: ['contentType'],
  data() {
    return {
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
              end.setTime(start.getTime() + 1500 * 1000)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      customCategory: [],
      loginUser: null,
      categoryForm: {},
      categoryFormRules: {},
      publicTag: [],
      editForm: {
        category: '',
        actionTime: 0,
        tag: ''
      },
      editFormRules: {
        tag: [
          {
            required: true,
            message: '这儿是必填项',
            trigger: ['blur', 'change']
          }
        ],
        title: [
          {
            required: true,
            message: '这儿是必填项',
            trigger: ['blur', 'change']
          }
        ],
        content: [
          {
            required: true,
            message: '这儿是必填项',
            trigger: ['blur', 'change']
          }
        ],
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
              if (this.contentType === 1) {
                if (value[1] - value[0] < 3600 * 1000 * 24 * 15) {
                  return callback(new Error('长番茄钟不能短于15天'))
                }
              } else if (this.contentType === 2) {
                if (value[1] - value[0] !== 1800 * 1000) {
                  return callback(new Error('短番茄钟只能用标准的25分钟'))
                }
              }
              return callback()
            },
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    async init() {
      this.loginUser = JSON.parse(localStorage.getItem('loginUser'))
      if (this.loginUser !== null) {
        var { data: customCategory, status } = await this.$http.get(
          '/category/list/' + this.loginUser.id
        )
        if (status === 200) {
          this.customCategory = customCategory
        }
        var { data: publicTag, status: status1 } = await this.$http.get('/tag/list')
        if (status1 === 200) {
          this.publicTag = publicTag
        }
      }
    },
    async addCategory() {
      const res = await this.$http.put('/category/add', {
        content: this.categoryForm.content,
        userId: this.loginUser.id
      })
      if (res.status === 200) {
        this.$message.success('成功添加分类-->' + this.categoryForm.content)
        this.init()
      } else {
        this.$message.error(res.msg)
      }
    },
    async removeCategory() {
      this.$messageBox
        .confirm('删除分类的过程会将所有分类的依赖项删除！', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          const res = await this.$http.post('/category/remove', {
            content: this.categoryForm.content,
            userId: this.loginUser.id
          })
          if (res.status === 200) {
            this.$message.success('成功移除分类-->' + this.categoryForm.content)
            this.init()
          }
        })
        .catch(() => {
          this.$message.success('取消删除')
        })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate(async flag => {
        if (flag) {
          this.customCategory.forEach(item => {
            if (item.content === this.editForm.category) {
              this.editForm.category = item.id
            }
          })

          const res = await this.$http.put('/note/add', {
            title: this.editForm.title,
            content: this.editForm.content,
            customCategoryId: this.editForm.category,
            contentType: this.contentType,
            startTime: this.editForm.actionTime[0],
            endTime: this.editForm.actionTime[1],
            userId: this.loginUser.id,
            communityTagId: this.editForm.tag
          })
          if (res.status === 200) {
            this.$router.push('/personalNoteList')
            this.$message.success({
              message: '添加成功',
              centeer: true
            })
          } else {
            this.$message.error({
              message: res.msg,
              center: true
            })
          }
        }
      })
    }
  }
}
</script>
<style scoped>
.loginFrame {
  width: 30%;
  padding: 3%;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.el-row {
  width: 100%;
}
</style>

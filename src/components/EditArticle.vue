<template>
  <div style="margin:10px 2%;">

    <el-form :model="editForm" clearable="true" ref="editFormRef" :rules="editFormRules">
      <div style=" display: flex;flex-wrap:wrap-reverse;justify-content:space-between">
        <el-form-item  prop="tag">
        <el-select no-data-text="无分类，联系管理员" v-model="editForm.tag" placeholder="请为文章选择分类">
          <el-option
            :key="index"
            v-for="(item,index) in publicTag"
            :label="item.content"
            :value="item.id"
          ></el-option>
        </el-select>
        </el-form-item>
        <div style="margin-bottom:10px;">
              <el-button  class="el-button-group-b" icon="el-icon-refresh-left" size="medium"  type="danger" plain @click="resetForm('editFormRef')">重置</el-button>
              <el-button  class="el-button-group-b" icon="el-icon-check" type="primary" size="medium" plain @click="submitForm('editFormRef')">提交</el-button>
        </div>
      </div>

      <div role="tagPool">
        <el-tag
          :key="tag"
          v-for="tag in tagPool"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="newTagVal"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="addTag"
          @blur="addTag"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" icon="el-icon-plus" @click="showInput">添加标签</el-button>
      </div>
      <!-- <el-row type="flex">
        <el-col></el-col>
      </el-row> -->
      <el-form-item prop="title">
        <el-input :clearable="true" placeholder="请输入文章标题" v-model="editForm.title"></el-input>
      </el-form-item>
      <el-form-item prop="content">
        <mavon-editor ref=md @imgAdd="imageAdd" @imgDel="imageDel"  v-model="editForm.content"/>
      </el-form-item>
    </el-form>
</div>

</template>
<script>

export default {
  name: 'edit-article',
  data() {
    return {
      value: '',
      tagPool: [],
      newTagVal: '',
      inputVisible: false,
      customCategory: [],
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
  methods:
  {
    handleClose(tag) {
      this.tagPool.splice(this.tagPool.indexOf(tag), 1)
    },
    imageDel($file, a) {
      console.log($file)
      console.log(a)
    },
    imageAdd(pos, $file, event) {
    // 第一步.将图片上传到服务器.
      var formdata = new FormData()
      formdata.append('image', $file)
      this.$http({
        url: 'server url',
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((url) => {
      // 第二步.将返回的url替换到文本原位置![...](./0) -> ![...](url)
      /**
               * $vm 指为mavonEditor实例，可以通过如下两种方式获取
               * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
               * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
               */
        this.$refs.md.$img2Url(pos, url)
      })
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async addTag() {
      const inputValue = this.newTagVal
      if (inputValue) {
        this.tagPool.push(inputValue)
      }
      this.newTagVal = ''
      this.inputVisible = false
    // 调用api
    // const res = await this.$http.put('/category/add', {
    //   content: this.categoryForm.content,
    //   userId: this.loginUser.id
    // })
    // if (res.status === 200) {
    //   this.$message.success('成功添加分类-->' + this.categoryForm.content)
    //   this.init()
    // } else {
    //   this.$message.error(res.msg)
    // }
    },
    resetForm(formName) {
      this.tagPool.splice(0, this.tagPool.length)

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
  },
  watch: {
    value(val) {

    }
  }
}
</script>
<style scoped>
 .el-tag {
   margin-right: 10px;
    margin-bottom:10px;
 }
 .button-new-tag {
    /* margin-left: 10px; */
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    margin-bottom:10px;
  }
  .input-new-tag {
    margin-bottom:10px;
    width: 90px;
    /* margin-left: 10px; */
    vertical-align: bottom;
  }
  .el-button-group-b{
    margin-left: 0;
    margin-right: 0;
  }
</style>

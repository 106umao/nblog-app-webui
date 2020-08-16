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
          <el-autocomplete
            clearable
            resize
            :fetch-suggestions="querySearchAsync"
            class="input-new-tag"
            v-if="inputVisible"
            v-model="newTagVal"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="addTag"
            @blur="addTag"
          >
          </el-autocomplete>
          <el-button v-if="!inputVisible" class="button-new-tag" size="small" icon="el-icon-plus" @click="showInput">添加标签</el-button>
      </div>
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
      restaurants: [],
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
      setTimeout(() => {
        this.inputVisible = false
        const inputValue = this.newTagVal
        if (inputValue) {
          this.tagPool.push(inputValue)
        }
        this.newTagVal = ''
      }, 150)
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
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 3000 * Math.random())
    },
    createStateFilter(queryString) {
      return (item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    loadAll() {
      return [
        { value: '三全鲜食（北新泾店）', address: '长宁区新渔路144号' },
        { value: 'Hot honey 首尔炸鸡（仙霞路）', address: '上海市长宁区淞虹路661号' },
        { value: '新旺角茶餐厅', address: '上海市普陀区真北路988号创邑金沙谷6号楼113' },
        { value: '泷千家(天山西路店)', address: '天山西路438号' },
        { value: '胖仙女纸杯蛋糕（上海凌空店）', address: '上海市长宁区金钟路968号1幢18号楼一层商铺18-101' },
        { value: '贡茶', address: '上海市长宁区金钟路633号' },
        { value: '豪大大香鸡排超级奶爸', address: '上海市嘉定区曹安公路曹安路1685号' },
        { value: '茶芝兰（奶茶，手抓饼）', address: '上海市普陀区同普路1435号' },
        { value: '十二泷町', address: '上海市北翟路1444弄81号B幢-107' },
        { value: '星移浓缩咖啡', address: '上海市嘉定区新郁路817号' },
        { value: '阿姨奶茶/豪大大', address: '嘉定区曹安路1611号' },
        { value: '新麦甜四季甜品炸鸡', address: '嘉定区曹安公路2383弄55号' },
        { value: 'Monica摩托主题咖啡店', address: '嘉定区江桥镇曹安公路2409号1F，2383弄62号1F' },
        { value: '浮生若茶（凌空soho店）', address: '上海长宁区金钟路968号9号楼地下一层' },
        { value: 'NONO JUICE  鲜榨果汁', address: '上海市长宁区天山西路119号' },
        { value: 'CoCo都可(北新泾店）', address: '上海市长宁区仙霞西路' },
        { value: '快乐柠檬（神州智慧店）', address: '上海市长宁区天山西路567号1层R117号店铺' },
        { value: 'Merci Paul cafe', address: '上海市普陀区光复西路丹巴路28弄6号楼819' },
        { value: '猫山王（西郊百联店）', address: '上海市长宁区仙霞西路88号第一层G05-F01-1-306' },
        { value: '枪会山', address: '上海市普陀区棕榈路' },
        { value: '纵食', address: '元丰天山花园(东门) 双流路267号' },
        { value: '钱记', address: '上海市长宁区天山西路' },
        { value: '壹杯加', address: '上海市长宁区通协路' },
        { value: '唦哇嘀咖', address: '上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元' },
        { value: '爱茜茜里(西郊百联)', address: '长宁区仙霞西路88号1305室' },
        { value: '爱茜茜里(近铁广场)', address: '上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺' },
        { value: '鲜果榨汁（金沙江路和美广店）', address: '普陀区金沙江路2239号金沙和美广场B1-10-6' },
        { value: '开心丽果（缤谷店）', address: '上海市长宁区威宁路天山路341号' },
        { value: '超级鸡车（丰庄路店）', address: '上海市嘉定区丰庄路240号' },
        { value: '妙生活果园（北新泾店）', address: '长宁区新渔路144号' },
        { value: '香宜度麻辣香锅', address: '长宁区淞虹路148号' },
        { value: '凡仔汉堡（老真北路店）', address: '上海市普陀区老真北路160号' },
        { value: '港式小铺', address: '上海市长宁区金钟路968号15楼15-105室' },
        { value: '蜀香源麻辣香锅（剑河路店）', address: '剑河路443-1' },
        { value: '北京饺子馆', address: '长宁区北新泾街道天山西路490-1号' },
        { value: '饭典*新简餐（凌空SOHO店）', address: '上海市长宁区金钟路968号9号楼地下一层9-83室' },
        { value: '焦耳·川式快餐（金钟路店）', address: '上海市金钟路633号地下一层甲部' },
        { value: '动力鸡车', address: '长宁区仙霞西路299弄3号101B' },
        { value: '浏阳蒸菜', address: '天山西路430号' },
        { value: '四海游龙（天山西路店）', address: '上海市长宁区天山西路' },
        { value: '樱花食堂（凌空店）', address: '上海市长宁区金钟路968号15楼15-105室' },
        { value: '壹分米客家传统调制米粉(天山店)', address: '天山西路428号' },
        { value: '福荣祥烧腊（平溪路店）', address: '上海市长宁区协和路福泉路255弄57-73号' },
        { value: '速记黄焖鸡米饭', address: '上海市长宁区北新泾街道金钟路180号1层01号摊位' },
        { value: '红辣椒麻辣烫', address: '上海市长宁区天山西路492号' },
        { value: '(小杨生煎)西郊百联餐厅', address: '长宁区仙霞西路88号百联2楼' },
        { value: '阳阳麻辣烫', address: '天山西路389号' },
        { value: '南拳妈妈龙虾盖浇饭', address: '普陀区金沙江路1699号鑫乐惠美食广场A13' }
      ]
    }
  },
  mounted() {
    this.restaurants = this.loadAll()
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
    width: 120px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    margin-bottom:10px;
  }
  .input-new-tag {
    margin-bottom:10px;
    width: 120px;
    /* margin-left: 10px; */
    vertical-align: bottom;
  }
  .el-button-group-b{
    margin-left: 0;
    margin-right: 0;
  }
</style>

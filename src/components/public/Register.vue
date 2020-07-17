
<template>
  <div
    style="background-color:#F4F5F5;width:100%;height:100%;display:flex; justify-content: center;align-items: center;"
  >
    <div class="loginFrame">
      <el-row>
        <el-col>
          <p style="font-size:20px; color:#409EFF" align="center">注册账户</p>
          <el-form
            :model="registerForm"
            :rules="registerFormRules"
            ref="registerFormRef"
            label-width="0"
          >
           <el-form-item prop="username">
              <el-input
                type="text"
                v-model="registerForm.username"
                placeholder="enter username"
              >
                <span class="iconfont icon-password" slot="prefix"></span>
              </el-input>
            </el-form-item>
            <el-form-item prop="email">
              <el-input
                v-model="registerForm.email"
                autocomplete="off"
                disableautocomplete
                placeholder="123456@qq.com"
              >
                <span slot="prefix" class="iconfont icon-email"></span>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="registerForm.password"
                placeholder="enter password"
              >
                <span class="iconfont icon-password" slot="prefix"></span>
              </el-input>
            </el-form-item>
            <el-form-item prop="repassword">
              <el-input
                type="password"
                v-model="registerForm.repassword"
                placeholder="enter password"
              >
                <span class="iconfont icon-password" slot="prefix"></span>
              </el-input>
            </el-form-item>

            <el-button type="primary" @click="submitForm('registerFormRef')">注册</el-button>
            <el-button @click="resetForm('registerFormRef')">重置</el-button>
            <span style="position:relative;left:140px">
              <router-link to="/login">已有账户，去登录</router-link>
            </span>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      const reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/
      if (reg.test(value)) {
        callback()
      } else {
        return callback(new Error('请输入格式正确的邮箱'))
      }
    }
    return {
      registerForm: {
        email: '',
        password: '',
        repassword: '',
        username: ''
      },
      registerFormRules: {
        email: [{ validator: checkEmail, trigger: ['blur', 'change'] }],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '请输入6-16位密码', trigger: ['blur', 'change'] }
        ],
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 2, max: 8, message: '请输入2-8位', trigger: ['blur', 'change'] }
        ],
        repassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '请输入6-16位密码', trigger: ['blur', 'change'] },
          {
            validator: (rule, value, callback) => {
              console.log(this.registerForm.password + this.registerForm.repassword + value)
              if (this.registerForm.password === value) {
                return callback()
              } else {
                return callback(new Error('请输入两次相同的密码'))
              }
            },
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async flag => {
        if (flag) {
          const res = await this.$http.put('/user/register', {
            email: this.registerForm.email,
            password: this.registerForm.password,
            repassword: this.registerForm.repassword,
            username: this.registerForm.username
          })
          if (res.status === 200) {
            this.$router.push('/login')
            this.$message.success({
              message: '注册成功',
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
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

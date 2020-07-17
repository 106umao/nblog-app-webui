
<template>
  <div style="background-color:#F4F5F5;width:100%;height:100%;display:flex; justify-content: center;align-items: center;">
    <div class="loginFrame">
    <el-row>
      <el-col>
      <p style="font-size:20px; color:#409EFF" align="center">用户登录</p>
        <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" label-width="0">
          <el-form-item prop="email">
            <el-input v-model="loginForm.email" autocomplete="off" disableautocomplete placeholder="123456@qq.com">
              <span slot="prefix" class="iconfont icon-email"></span>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" placeholder="enter password">
              <span class="iconfont icon-password" slot="prefix"></span>
            </el-input>
          </el-form-item>
          <el-button type="primary" @click="submitForm('loginFormRef')">登录</el-button>
          <el-button @click="resetForm('loginFormRef')">重置</el-button>
          <span style="position:relative;left:140px">
            <router-link to="/register">注册一个账户</router-link>
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
      loginForm: {
        email: '',
        password: ''
      },
      loginFormRules: {
        email: [{ validator: checkEmail, trigger: ['blur', 'change'] }],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '请输入6-16位密码', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async flag => {
        if (flag) {
          const res = await this.$http.get('/sso/login', {
            params: {
              email: this.loginForm.email,
              password: this.loginForm.password
            }
          })
          if (res.status === 200) {
            window.localStorage.setItem('loginUser', JSON.stringify(res.data))
            this.$router.push('/')
            this.$message.success({
              message: '登录成功',
              centeer: true
            })
          } else {
            this.$message.error({
              message: '邮箱或密码错误',
              centeer: true
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
.loginFrame{
  width: 30%;
  padding: 3%;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)

}
.el-row {
  width: 100%;
}
</style>

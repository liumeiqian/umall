<template>
  <div class="login">
    <el-form
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      label-width="100px"
      class="loginForm"
    >
      <el-form-item>
        <h2>欢迎登录</h2>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="loginForm.password"
          clearable
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login('loginForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUserLogin } from "../utils/axios";
import {mapActions} from 'vuex'

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    ...mapActions(['changeUserInfoAction']),

    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getUserLogin(this.loginForm)
          .then(res => {
            console.log(res);
            if(res.data.code == 200) {
              this.$message.success(res.data.msg)
              // sessionStorage.setItem('userInfo', JSON.stringify(res.data.list))

              this.changeUserInfoAction(res.data.list)

              this.$router.push('/home')
            }else {
              this.$message.error(res.data.msg)
            }
          })
        } else {
          console.log("error submit!!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '../stylus/index.styl';

.login {
  width: 100vw;
  height: 100vh;
  background-color: $firstBgColor;
  position: relative;
}

.el-form {
  width: 400px;
  background-color: #fff;
  padding: 50px 60px 30px 0;
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -200px -230px;
}
</style>
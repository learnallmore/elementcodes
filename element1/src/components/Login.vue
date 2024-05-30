<template>
  <el-form  :model="loginForm" :rules="rules" class="login-container" label-position="left"
           label-width="0px" v-loading="loading">
    <h3 class="login_title">系统管理员登录</h3>
    <el-form-item prop="username">
      <!--auto-complete 可以用在搜索框推荐-->
      <el-input type="text" prefix-icon="el-icon-user-solid" v-model="loginForm.username"  placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" prefix-icon="el-icon-s-grid" v-model="loginForm.password"  placeholder="密码" show-password></el-input>
    </el-form-item>
    <el-checkbox class="login_remember" v-model="checked" label-position="left">记住密码</el-checkbox>
    <el-form-item style="width: 100%">
      <el-button type="primary" @click.native.prevent="submitClick" style="width: 100%">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

import {postRequest} from "../utils/api";

export default {
  name: "Login",
  data(){


        return{
      checked: true,
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}]   //blur是在input失去焦点时触发
      },
      loading: false
    }
  },
  methods: {//组件对象的方法，与data(){}同级
    submitClick: function () {
      var _this = this; //this指向组件login，vue实例也算一个组件，父组件
      this.loading = true;
      postRequest("user/adminlogin",
        {
        //这里的this指向外层调用者，因为在方法中，也是指向组件login
        username: this.loginForm.username,
        password: this.loginForm.password
      }).then(response=> { //执行完postRequest后,接resp箭头函数resp作为参数本身是一个对象，是什么？
        console.log(response.data);
        _this.loading = false;//如果这里用this就是指向resp，resp是服务器发回的对象，有data，status
        if (response.status == 200) {//这个status是服务器返回请求的对象的status
          //服务器return
          var json = response.data;
          if (json.success == true) {//这个status是在data字段里，是respbean里的，自己定义的status
            _this.$router.replace({path: '/mainpage',query:{username:_this.loginForm.username}});
            _this.$alert(json.msg,'成功！');
          } else {
            _this.$alert(json.msg, '失败!');
          }
        }
      }).catch(err=>{//把.then的第二个函数改到.catch中
        _this.loading = false;
        _this.$alert('服务器错误', '失败!');
      });
    }
  }
}
</script>

<style scoped>
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

.login_remember {
  margin: 0px 0px 35px 0px;
  text-align: left;
}
</style>

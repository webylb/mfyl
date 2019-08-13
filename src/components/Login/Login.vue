<template>
  <div class="login">
    <div class="login-wrap"> 
      <div class="login-box">
        <div class="login-img">
          <img src="./images/login-img.png" alt="">
        </div>
        <div class="login-form">
          <div class="login-logo">
            <img src="./images/login-logo.png" alt="">
          </div>
          <el-form :model="ruleForm" label-position="top" :rules="rules" ref="ruleForm" class="logon-ruleForm">
            <el-form-item prop="userName">
              <el-input clearable placeholder="用户名" type="text" v-model="ruleForm.userName" autocomplete="off" prefix-icon="el-icon-user"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input clearable placeholder="密码" type="password" v-model="ruleForm.password" minlength="6" autocomplete="off" prefix-icon="el-icon-lock" @keyup.enter.native="submitForm('ruleForm')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')" class="sub-btn">立即登录</el-button>
            </el-form-item>
          </el-form>
          <div class="login-contact">
            <p>有任何疑问可联系客服：400-668-0091</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as core from "../../api/login.js"
export default {
  data () {
    var validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账户名'));
      } else {
        callback();
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    }
    
    return {
      ruleForm: {
        userName:'',
        password: ''
      },
      rules: {
        userName: [
          { validator: validateUserName, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    
  },
  mounted () {
    
  },
  created () {
   
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.requestLogin()
          //this.$router.push('/employees-management')
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }, 
    requestLogin(){
      core.login({username:this.ruleForm.userName,password: this.ruleForm.password}).then(res => {
        //console.log(res)
        if(res.code && res.code == "00"){
          this.$router.push('/')
        }else{
          this.$message.closeAll()
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      }).catch(err => {
        this.$message.error(err);          
      });
    }
  }
}
</script>

<style lang="less">
.login {
  min-width: 1190px;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: #fff url("./images/login-bg.png") no-repeat center;
  background-size: cover;

  .login-wrap {
    background-color: #ccc;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 67.03%;
    background-color: #ffffff;
    box-shadow: 0px 0px 22px 2px 
      rgba(44, 123, 201, 0.1);
    border-radius: 24px;
    box-sizing: border-box;
    padding-bottom: 36%;
    
    .login-box {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .login-img {
        width: 46.54%;
        margin-right: 6%;
        img { 
          width: 100%;
          object-fit: cover;
        }
      }

      .login-form {
        width: 35.12%;

        .login-logo{
          text-align: center;
          margin-bottom: 6.8%;
          img {
            width: 38.5%;
            height: auto;
          }
        }

      
        .el-form-item {
          margin-bottom: 5.5%;

          .el-form-item__content {
            line-height: inherit;
          }

          .el-input__inner {
            height: 6.64%;
            line-height: 6.64%;
            padding-top: 2.6%;
            padding-bottom: 2.6%;
          }
          .el-input__icon {
            line-height: 100%;
          }
          .el-button {
            padding: 2.6% 2.8%;
            height: 6.64%;
          }
        }

        .sub-btn {
          width: 100%;
          margin-top: 3.60%;
        }

        .login-contact {
          text-align: left;
          font-size: 14px;
          color: #333;
          margin: 0;
        }
        .el-form-item__error {
          padding-top: 2px;
        }
      }
    }
  }
}
@media (min-width: 1024px){
  .login .el-button{ font-size: 12px;}
} /*>=1024的设备*/

@media (min-width: 1100px) {
  .login .el-button{ font-size: 14px;}
} /*>=1100的设备*/
@media (min-width: 1280px) {
  .login .el-button{ font-size: 14px;}
} /*>=1280的设备*/

@media (min-width: 1366px) {
  .login .el-button{ font-size: 14px;}
}  

@media (min-width: 1440px) {
  .login .el-button{ font-size: 16px;}
} 

@media (min-width: 1680px) {
  .login .el-button{ font-size: 16px;}
} 
@media (min-width: 1920px) {
  .login .el-button{ font-size: 16px;}
} 


</style>


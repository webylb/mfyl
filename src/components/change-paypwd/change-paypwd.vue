<template>
  <div class="change-paypwd">
    <div class="change-paypwd-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>企业设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/account-settings' }">账户设置</el-breadcrumb-item>
        <el-breadcrumb-item>修改支付密码</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-steps :active="actived" align-center>
      <el-step title="验证身份">1</el-step>
      <el-step title="设置密码">2</el-step>
      <el-step title="修改成功">3</el-step>
    </el-steps> 
    <el-form ref="form" :validate-on-rule-change='false' v-if="actived == 1" :model="form" :inline="false" label-position="center" label-width="100px" class="form" style="width: 500px; margin: 50px auto;">
      <el-form-item label="手机号：" prop="phone">
        {{ form.phone }}
      </el-form-item>
      <el-form-item label="验证码：" prop="code">
        <div class="btn-group"> 
          <el-input v-model="form.code" placeholder="请输入验证码" clearable></el-input><el-button @click="getPvc(actived)">{{ btnText }}</el-button>
        </div>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="checkCode('form')">下一步</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="setForm" :validate-on-rule-change='false' v-else-if="actived == 2" :model="setForm" :inline="false" :rules="rulesSetForm" label-position="center" label-width="100px"  class="form" style="width: 500px; margin: 50px auto;">
      <el-form-item label="新密码：" prop="pass">
        <el-input show-password v-model="setForm.pass" placeholder="请输入6位数新密码" maxlength="6" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="checkPass">
        <el-input show-password v-model="setForm.checkPass" placeholder="请输入6位数新密码" maxlength="6" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="setNewPassword('setForm')">下一步</el-button>
      </el-form-item>
    </el-form>
    <div v-else style="text-align:center;margin-top:50px;">
      <div class="margin:20px auto;text-align:center;font-size;16px;">
        <div style="text-align:center;"> 
          <i class="el-icon-success" style="color:#67c23a;fontSize: 80px"></i>
        </div>
        <div style="text-align:center;font-size: 18px;margin: 10px 0;margin-bottom:50px;">恭喜你，支付密码修改成功</div>
      </div>
    </div>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <div class="margin:20px auto;text-align:center;font-size;16px;height:42px;" v-if="pvc">
        <img src="/pvc/generate/pvc" alt="" style="margin: 0 auto;display: block;margin-bottom: 20px;width: 100px;">
      </div>
      <el-form ref="dialogForm" :inline="false" label-position="center" label-width="100px">
        <el-form-item label="手机号：" prop="phone">
          <el-input v-model="dialogForm.pvc" placeholder="请输入图形验证码" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getCode(actived)">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as core from '../../api/benefit-merchant'
import tool from '../../utils/common'

export default {
  name: 'changePaypwd',
  data() {
    var validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请先输入验证码'));
      } else {
        callback();
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.setForm.checkPass !== '') {
          this.$refs.setForm.validateField('checkPass');
        }
        callback();
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.setForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      pvc: null,
      dialogVisible: false,
      dialogForm: {
        pvc: null
      },
      actived: 1,
      form: {
        phone: '--',
        code: ''
      },
      setForm: {
        pass: '',
        checkPass: ''
      },
      rulesSetForm: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      btnText: '获取验证码',
      times: 60,
      timer: null,
      getCodeStatus: true
    }
  },
  created(){
    this.getMerchantDetail()
  },
  methods: {
    getMerchantDetail(){
      core.getMerchantDetail().then(res => {
        //console.log(res)
        if(res.code && res.code == '00'){
          this.form.phone = res.data.bindPhone || '--'
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    checkCode(formName){
      if(this.form.code){
        clearInterval(this.timer)
        this.btnText = "获取验证码"
        this.times = 60
        this.$refs[formName].clearValidate()
        this.actived = 2
      }else{
        this.$message.closeAll();
        this.$message.info("请输入验证码");
      }
    },
    getCode(step){
      this.times = 60
      if(step == '1'){
        this.timer = setInterval(() => {
          this.times--
          this.btnText =  this.times + "s"
          if(this.times === 1){
            clearInterval(this.timer)
            this.btnText = "重新获取"
          }
        }, 1000);
        core.getChangePasswordCode({mobile: this.form.phone,code: this.dialogForm.pvc}).then(res => {
          //console.log(res)
          if(res.code && res.code == '00'){
            this.dialogVisible = false
          }else{
            this.dialogForm.pvc = null
            this.dialogVisible = false
            clearInterval(this.timer)
            this.btnText = "重新获取"
            this.$message.closeAll();
            this.$message.info(res.message);
          }
        }).catch(err => {
          this.dialogForm.pvc = null
          clearInterval(this.timer)
          this.btnText = "重新获取"
          this.$message.closeAll();
          this.$message.info(err);
        })
      }
    },
    getPvc(step){
      this.dialogForm.pvc = null
      this.pvc = false
      core.getPvc().then(res => {
        if(!res.code){
          this.pvc = true;
          this.dialogVisible = true
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    dialogClose(){
      this.dialogVisible = false
    },
    setNewPassword(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          core.changeNewPassword({vCode:this.form.code,newPassword:this.setForm.pass,sureNewPassword:this.setForm.checkPass}).then(res => {
          if(res.code && res.code == '00'){
              this.actived = 3
            }else{
              this.$message.closeAll();
              this.$message.info(res.message);
            }
          }).catch(err => {
            this.$message.closeAll();
            this.$message.info(err);
          })
          
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}

</script>
<style lang='less'>
.change-paypwd {

   .change-paypwd-title {
    margin:20px 0;
    width: 100%;
    font-size: 24px;
    padding-bottom: 15px;
    box-sizing: border-box;
    border-bottom: 1PX solid #EBEEF5;
  }

  .form .el-form-item {
    padding: 20px 0 0;
    width: 560px;
    margin: 0 auto;
    margin-bottom: 20px;
    border-bottom: none;
    .el-form-item__label { 
      font-size: 16px;
    }
    .el-form-item__content {
      font-size: 16px;
    }
  }

  .btn-group {
    display: flex;
    justify-content: flex-start;
    .el-input {
      width: 280px;
      float: left
    }
    .el-button {
      width: 160px;
      margin-left: 10px;
      float: left;
      padding: 0;
    }
  }
}

</style>
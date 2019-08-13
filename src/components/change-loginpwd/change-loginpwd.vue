<template>
  <div class="bind-phonenum">
    <div class="bind-phonenum-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>企业设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/account-settings' }">账户设置</el-breadcrumb-item>
        <el-breadcrumb-item>修改登录密码</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" :model="form" :inline="false" :rules="rules" label-position="center" label-width="140px">
      <el-form-item label="企业名称：">
        <div>{{ companyName }}</div>
      </el-form-item>
      <el-form-item label="账户名：">
        <div> 
          {{ username }}
        </div>
      </el-form-item>
      <el-form-item label="旧密码：" prop="oldPass">
        <el-input show-password v-model="form.oldPass" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="pass">
        <el-input show-password v-model="form.pass" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="再次确认新密码：" prop="checkPass">
        <el-input show-password v-model="form.checkPass" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="setPass('form')">立即修改</el-button>
      </el-form-item>

    </el-form>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <div class="margin:20px auto;text-align:center;font-size;16px;">
        <div style="text-align:center;"> 
          <i class="el-icon-success" style="color:#67c23a;fontSize: 80px"></i>
        </div>
        <div style="text-align:center;font-size: 18px;margin: 10px 0;">登录密码修改成功</div>
        <div style="text-align:center;margin:0 25px;">
          
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogClose">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as core from '../../api/benefit-merchant'
import tool from '../../utils/common'

export default {
  name: 'bindPhonenum',
  data() {
    var validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'));
      } else {
        callback();
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass');
        }
        callback();
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.form.pass) {
        callback(new Error('两次输入新密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      companyName: '--',
      username: '--',
      dialogVisible: false,
      form: {
        oldPass: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        oldPass:[
          { validator: validateOldPass, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  created(){
    this.getMerchantDetail()
  },
  methods: {
    getMerchantDetail(){
      core.getMerchantDetail().then(res => {
        console.log(res)
        if(res.code && res.code == '00'){
          this.companyName = res.data.companyName || '--'
          this.username = res.data.username || '--'
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
      this.$router.push('/login')
    },
    setPass(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          core.changeLoginPassword({oldPassword:this.form.oldPass,newPassword:this.form.pass,sureNewPassword:this.form.checkPass}).then(res => {
            //console.log(res)
            if(res.code && res.code == '00'){
              this.$refs[formName].clearValidate()
              this.dialogVisible = true
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
.bind-phonenum {

   .bind-phonenum-title {
    margin:20px 0;
    width: 100%;
    font-size: 24px;
    padding-bottom: 15px;
    box-sizing: border-box;
    border-bottom: 1PX solid #EBEEF5;
  }

  .el-form-item {
    padding: 20px 0 0;
    width: 660px;
    margin-bottom: 20px;
    border-bottom: none;
    .el-form-item__label { 
      font-size: 16px;
    }
    .el-form-item__content {
      font-size: 16px;
    }
  }
}

</style>
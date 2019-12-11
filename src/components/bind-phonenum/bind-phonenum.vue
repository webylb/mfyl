<template>
  <div class="bind-phonenum">
    <div class="bind-phonenum-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>企业设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/account-settings' }">账户设置</el-breadcrumb-item>
        <el-breadcrumb-item>绑定手机号</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" :model="form" :inline="false" :rules="rules" label-position="center" label-width="100px" class="form">
      <el-form-item label="手机号：" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="验证码：" prop="code">
        <div class="btn-group">
          <el-input v-model="form.code" placeholder="请输入验证码" clearable></el-input><el-button @click="getPvc">{{ btnText }}</el-button>
        </div>

      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="setPhone('form')">立即绑定</el-button>
      </el-form-item>

    </el-form>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <div class="margin:20px auto;text-align:center;font-size;16px;height:42px;" v-if="pvc">
        <img src="/pvc/generate/pvc" alt="" style="margin: 0 auto;display: block;margin-bottom: 20px;width: 100px;">
      </div>
      <el-form class="dialogForm" ref="dialogForm" :inline="false" label-position="center" label-width="100px">
        <el-form-item label="验证码：" prop="phone">
          <el-input v-model="dialogForm.pvc" placeholder="请输入图形验证码" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getCode">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title=""
      :visible.sync="dialogSuccessVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <div class="margin:20px auto;text-align:center;font-size;16px;">
        <div style="text-align:center;">
          <i class="el-icon-success" style="color:#67c23a;fontSize: 80px"></i>
        </div>
        <div style="text-align:center;font-size: 18px;margin: 10px 0;">手机号绑定成功！</div>
        <div style="text-align:center;margin:0 25px;">

        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import * as core from '../../api/benefit-merchant'
import tool from '../../utils/common'
import { truncate } from 'fs';

export default {
  name: 'bindPhonenum',
  data() {
    var validatePhonenum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请先输入手机号'));
      } else {
        if (!tool.isPhone(value)) {
          callback(new Error('请输入正确的手机号'));
        }else{
          callback();
        }
      }
    }
    var validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请先输入验证码'));
      } else {
        callback();
      }
    }
    return {
      pvc: null,
      dialogVisible: false,
      dialogSuccessVisible: false,
      dialogForm: {
        pvc: null
      },
      form: {
        phone: '',
        code: ''
      },
      rules: {
        phone: [
          { validator: validatePhonenum, trigger: 'blur' }
        ],
        code: [
          { validator: validateCode, trigger: 'blur' }
        ]
      },
      btnText: '获取验证码',
      times: 60,
      timer: null,
      getCodeStatus: true
    }
  },
  created(){

  },
  methods: {
    ...mapMutations([
      'SAVE_BIND_PHONE'
    ]),
    setPhone(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          core.bindMobile({mobile: this.form.phone,vCode: this.form.code}).then(res => {
            //console.log(res)
            if(res.code && res.code == '00'){
              this.dialogSuccessVisible = true
              this.SAVE_BIND_PHONE(this.form.phone)
              clearInterval(this.timer)
              this.btnText = "获取验证码"
              this.form = {
                phone: '',
                code: ''
              }
              let timer2 = null
              clearTimeout(timer2)
              timer2 = setTimeout(res=>{
                this.dialogSuccessVisible = false
                this.$router.push('/account-settings')
              },3000)
            }else{
              clearInterval(this.timer)
              this.btnText = "重新获取"
              this.$message.closeAll();
              this.$message.info(res.message);
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getCode(){
      this.times = 60
      this.timer = setInterval(() => {
        this.times--
        this.btnText =  this.times + "s"
        if(this.times <= 1){
          clearInterval(this.timer)
          this.btnText = "重新获取"
        }
      }, 1000);

      core.getBindMobileCode({mobile: this.form.phone,code: this.dialogForm.pvc}).then(res => {
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

    },
    getPvc(){
      this.pvc = false
      if(tool.isPhone(this.form.phone)){
        core.getPvc().then(res => {
          if(!res.code){
            //let url = window.URL.createObjectURL(res)
            //console.log(url)
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
      }else{
        this.$message.closeAll()
        this.$message({
          message: '请先输正确的手机号!',
          type: 'warning'
        });
      }
    },
    dialogClose(){
      this.dialogVisible = false
      this.dialogSuccessVisible = false
    }
  }
}

</script>
<style lang='less' scope>
.bind-phonenum {
   .bind-phonenum-title {
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
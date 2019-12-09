<template>
  <div class="change-phonenum">
    <div class="change-phonenum-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>企业设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/account-settings' }">账户设置</el-breadcrumb-item>
        <el-breadcrumb-item>修改手机号</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-steps :active="actived" align-center>
      <el-step title="验证身份">1</el-step>
      <el-step title="绑定新手机号">2</el-step>
      <el-step title="修改成功">3</el-step>
    </el-steps>
    <el-form ref="form" :validate-on-rule-change='false' v-if="actived == 1" :model="form" :inline="false" label-position="center" label-width="100px" class="form" style="width: 500px; margin: 50px auto;">
      <el-form-item label="手机号：" prop="phone">
        {{ bindPhone }}
      </el-form-item>
      <el-form-item label="验证码：" prop="code">
        <div class="btn-group">
          <el-input v-model="form.code" placeholder="请输入验证码" clearable></el-input><el-button @click="getPvc(actived)">{{ btnText }}</el-button>
        </div>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="unsetPhone('form')">下一步</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="setForm" :validate-on-rule-change='false' v-else-if="actived == 2" :model="setForm" :inline="false" :rules="rulesSetForm" label-position="center" label-width="100px" style="width: 500px; margin: 50px auto;">
      <el-form-item label="手机号：" prop="phone">
        <el-input v-model="setForm.phone" placeholder="请输入手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="验证码：" prop="code">
        <div class="btn-group">
          <el-input v-model="setForm.code" placeholder="请输入验证码" clearable></el-input><el-button @click="getPvc(actived)">{{ btnText }}</el-button>
        </div>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="setPhone('setForm')">下一步</el-button>
      </el-form-item>
    </el-form>
    <div v-else style="text-align:center;margin-top:50px;">
      <div class="margin:20px auto;text-align:center;font-size;16px;">
        <div style="text-align:center;">
          <i class="el-icon-success" style="color:#67c23a;fontSize: 80px"></i>
        </div>
        <div style="text-align:center;font-size: 18px;margin: 10px 0;margin-bottom:50px;">恭喜你，手机号换绑成功</div>
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
import { mapState, mapMutations } from 'vuex'
import * as core from '../../api/benefit-merchant'
import tool from '../../utils/common'

export default {
  name: 'changePhonenum',
  data() {
    var validatePhonenum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请先输入手机号'));
      } else {
        let telReg = /^1[0-9]{10}$/;
        if (!telReg.test(value)) {
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
      dialogForm: {
        pvc: null
      },
      actived: 1,
      form: {
        phone: '--',
        code: ''
      },
      setForm: {
        phone: '',
        code: ''
      },
      rulesSetForm: {
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
      timer2: null,
      getCodeStatus: true
    }
  },
  created(){

  },
  computed: {
    ...mapState({
      bindPhone: state => state.bindPhone,
    }),
  },
  methods: {
    ...mapMutations([
      'SAVE_BIND_PHONE'
    ]),
    unsetPhone(formName){
      if(this.form.code){
        clearInterval(this.timer)
        this.btnText = "获取验证码"
        this.times = 60
        this.$refs[formName].clearValidate()
        this.actived = 2
      }
    },
    getCode(step){
      this.times = 60
      if(step == '1'){
        this.timer = setInterval(() => {
          this.times--
          this.btnText =  this.times + "s"
          if(this.times <= 1){
            clearInterval(this.timer)
            this.btnText = "重新获取"
          }
        }, 1000);
        core.getChangeMobileCode({code: this.dialogForm.pvc}).then(res => {
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
      }else{
        this.timer2 = setInterval(() => {
          this.times--
          this.btnText =  this.times + "s"
          if(this.times <= 1){
            clearInterval(this.timer2)
            this.btnText = "重新获取"
          }
        }, 1000);
        core.getChangeMobileCodeTwo({newMobile: this.setForm.phone,code: this.dialogForm.pvc}).then(res => {
          //console.log(res)
          if(res.code && res.code == '00'){
            this.dialogVisible = false
          }else{
            this.dialogForm.pvc = null
            this.dialogVisible = false
            clearInterval(this.timer2)
            this.btnText = "重新获取"
            this.$message.closeAll();
            this.$message.info(res.message);
          }
        }).catch(err => {
          this.dialogForm.pvc = null
          clearInterval(this.timer2)
          this.btnText = "重新获取"
          this.$message.closeAll();
          this.$message.info(err);
        })
      }


    },
    getPvc(step){
      this.dialogForm.pvc = null
      this.pvc = false
      let phone = null
      if(step == '1'){
        phone = this.bindPhone
      }else{
        phone = this.setForm.phone
      }
      if(tool.isPhone(phone)){
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
    },
    setPhone(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          core.bindNewMobile({vCode1:this.form.code,vCode2:this.setForm.code,newMobile:this.setForm.phone}).then(res => {
          if(res.code && res.code == '00'){
              this.actived = 3
              this.SAVE_BIND_PHONE(this.setForm.phone)
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
.change-phonenum {

   .change-phonenum-title {
    margin:20px 0;
    width: 100%;
    font-size: 24px;
    padding-bottom: 15px;
    box-sizing: border-box;
    border-bottom: 1PX solid #EBEEF5;
  }

  .form .el-form-item {
    padding: 20px 0 0;
    width: 500px;
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
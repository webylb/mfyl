<template>
  <div class="account-settings">
    <div class="account-settings-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>企业设置</el-breadcrumb-item>
        <el-breadcrumb-item>账户设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" :inline="false" label-position="center" label-width="140px">
      <el-form-item label="绑定手机号：">
        <div class="text-wrap">
          <p style="margin: 0">
            <span class="title">{{ bindPhone }}</span>
            <span v-if="check(bindPhone)" class="content" @click="changePhone">修改</span>
            <span v-else class="content" @click="setPhone">去绑定</span>
          </p>
        </div>
      </el-form-item>
      <el-form-item label="登录密码：">
        <div class="text-wrap">
          <p style="margin: 0">
            <span class="title">登录魔方优礼账户时需要输入的密码</span>
            <span class="content" @click="changeLoginPwd">修改</span>
          </p>
        </div>
      </el-form-item>
      <el-form-item label="支付密码：">
        <div class="text-wrap">
          <p style="margin: 0">
            <span class="title">在账户支付时需要输入的密码</span>
            <span v-if="havePayPassword" class="content" @click="changePayPwd">修改</span>
            <span v-else class="content" @click="changePayPwd">去设置</span>
          </p>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import * as core from '../../api/benefit-merchant'
import tool from '../../utils/common'

export default {
  name: 'accountSettings',
  data() {
    return {

    }
  },
  created(){

  },
  computed: {
    ...mapState({
      bindPhone: state => state.bindPhone,
      havePayPassword: state => state.havePayPassword,
    }),
  },
  methods: {
    check(phone){
      return tool.isPhone(phone)
    },
    setPhone(){
      this.$router.push('/account-settings/bind-phonenum')
    },
    changePhone(){
      this.$router.push('/account-settings/change-phonenum')
    },
    setLoginPwd(){

    },
    changeLoginPwd(){
      if(!tool.isPhone(this.bindPhone)){
        this.$message.closeAll();
        this.$message({
          message: '请先绑定手机号!',
          type: 'warning'
        });
      }else{
        this.$router.push('/account-settings/change-loginpwd')
      }
    },
    setPayPwd(){

    },
    changePayPwd(){
      if(!tool.isPhone(this.bindPhone)){
        this.$message.closeAll();
        this.$message({
          message: '请先绑定手机号!',
          type: 'warning',
          duration: 0
        });
      }else{
        this.$router.push('/account-settings/change-paypwd')
      }
    }

  }
}

</script>
<style lang='less' scope>
.account-settings {

   .account-settings-title {
    margin:20px 0;
    width: 100%;
    font-size: 24px;
    padding-bottom: 15px;
    box-sizing: border-box;
    border-bottom: 1PX solid #EBEEF5;
  }

  .text-wrap {
    p {
      display: flex;
      justify-content: space-between;

      .content {
        color: #409EFF;
        cursor: pointer;
      }

    }
  }

  .el-form-item {
    padding: 0 20px 20px;
    width: 660px;
    margin-bottom: 20px;
    border-bottom: 1PX solid #ccc;
    .el-form-item__label {
      font-size: 16px;
    }
    .el-form-item__content {
      font-size: 16px;
    }
  }
}

</style>
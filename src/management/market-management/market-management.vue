<template>
  <div class="immediately-purchase">
    <div class="immediately-purchase-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城管理</el-breadcrumb-item>
        <el-breadcrumb-item>商城设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" :model="form" :inline="false" label-position="center" label-width="140px">
      <el-form-item label="天猫商品售价:">
        <el-input clearable style="width:200px;margin-right:10px;" v-model="form.email">
          <template slot="append">倍数</template>
        </el-input>
        <span>*成本价</span>
      </el-form-item>
      <el-form-item label="自营商品售价:">
        <el-input clearable style="width:200px;margin-right:10px;" v-model="form.email">
          <template slot="append">倍数</template>
        </el-input>
        <span>*成本价</span>
        <el-button style="margin-left:10px;" @click.prevent="addItemValue()" icon="el-icon-plus"></el-button>
      </el-form-item>
      <el-form-item>
        <div class="page-content" v-if="form.camInfo.length > 0">
          <div>
            <el-collapse-transition>
              <div v-show="showList">
                <el-form ref="form" :model="form" :inline="false">
                  <el-form-item>
                    <div v-for="item in form.camInfo"
                    :key="item.key" style="margin-bottom: 10px;" :data-length="form.camInfo.length">
                      <el-select v-model="item.faceValue" clearable placeholder="请选择发货渠道" style="width: 150px;">
                        <el-option
                          v-for="item in options.camInfoOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <el-input clearable style="width: 150px;margin:0 10px;" v-model="item.amount" @change="changeNeedMoney">
                        <template slot="append">倍数</template>
                      </el-input>
                      <span>*成本价</span>
                      <el-button style="margin-left:10px;" @click.prevent="removeItemValue(item)" icon="el-icon-delete"></el-button>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </el-collapse-transition>
          </div>
          <el-button v-if="!showList" type="text" icon="el-icon-arrow-down" @click="showList = !showList">展开</el-button>
          <el-button v-else type="text" icon="el-icon-arrow-up" @click="showList = !showList">收起</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent="submitForm(form)" type="primary">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import * as merchantCore from '../../api/benefit-merchant'
import * as core from '../../api/benefit-cam'
import tool from '../../utils/common'
import { setTimeout, clearTimeout } from 'timers';

export default {
  name: 'immediatelyPurchase',
  data() {
    return {
      dialogVisible: false,
      form: {
        isVirtual: 'Y',
        camInfo: [],
        email:'',
        payPassword: null
      },
      dialogForm: {
        name:'',
        userName:''
      },
      options: {
        camInfoOptions: [{
          value: 10,
          label: '10元'
        },
        {
          value: 20,
          label: '20元'
        },
        {
          value: 50,
          label: '50元'
        },
        {
          value: 100,
          label: '100元'
        },
        {
          value: 200,
          label: '200元'
        },
        {
          value: 500,
          label: '500元'
        }]
      },
      showList: false
    }
  },
  created(){
    this.getDeliveryInfo()
  },
  computed: {

  },
  methods: {
    getDeliveryInfo(opts){
      merchantCore.getDeliveryInfo(opts).then(res => {
        if(res.code && res.code == '00'){
          if(res.data){
            this.receiverName = res.data.receiverName || '--'
            this.phoneNumber = res.data.phoneNumber || '--'
            this.deliveryAddress = res.data.deliveryAddress || '--'
          }
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    changeNeedMoney(){
      this.form.camInfo.forEach((item,index) => {
        if(item.faceValue == ""){
          this.form.camInfo.splice(index,1)
          if(this.form.camInfo.length < 1){
            this.form.camInfo = [{
              amount: '',
              faceValue: ''
            }]
          }
        }else{
          this.needMoney += item.faceValue * item.amount
        }
      })
    },
    submitForm(formName) {
      if(this.form.camInfo.length < 1){
        this.$message.closeAll();
        this.$message.warning("请选择充值面值及数量");
        return false;
      }else{
        for(let i = 0, length = this.form.camInfo.length; i<length; i++){
          if(this.form.camInfo[i].faceValue == "" && this.form.camInfo[i].amount == "" && this.form.camInfo.length > 1){
            this.form.camInfo.splice(i,1)
            return false;
          }
          if(this.form.camInfo[i].faceValue == ""){
            this.$message.closeAll();
            this.$message.warning("请选择充值面值");
            return false;
          }
          if(this.form.camInfo[i].amount == ""){
            this.$message.closeAll();
            this.$message.warning("请填写采购数量");
            return false;
          }
        }
      }
      if(this.form.isVirtual == "Y"){
        if(!tool.isEmail(this.form.email)){
          this.$message.closeAll();
          this.$message.warning("请输入您有效的邮箱地址");
          return false;
        }
      }
      this.subSure()
    },
    subSure(){
      if(this.accountBalance > this.needMoney){//余额充足
        if(!this.havePayPassword){
          this.dialogPwdNoVisible = true
        }else{
          this.dialogPwdVisible = true
        }
      }else{//余额不足
        this.dialogPwdHintVisible = true
      }
    },
    setPwd(){
      this.$router.push('/account-settings')
    },
    subRecharge(){
      this.$router.push({path:'/account-recharge/immediately-recharge',query:{return: '/pwd-purchase/immediately-purchase'}})
    },

    getMerchantDetail(){
      merchantCore.getMerchantDetail().then(res => {
        if(res.code && res.code == '00'){
          this.UPDATA_ACCOUNT_BALANCE(res.data.accountBalance || 0)
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    removeItemValue(val){
      var index = this.form.camInfo.indexOf(val)
      if (index !== -1) {
        this.form.camInfo.splice(index, 1)
      }
      this.changeNeedMoney()
    },
    addItemValue(){
      this.form.camInfo.push({
        amount: '',
        faceValue: ''
      });
      this.showList = true
    },
  }
}

</script>
<style lang='less' scope>
.immediately-purchase {
    min-height: 300px;

   .immediately-purchase-title{
    margin:20px 0;
    width: 100%;
    font-size: 24px;
    padding-bottom: 15px;
    box-sizing: border-box;
    border-bottom: 1PX solid #EBEEF5;
  }

  .page-content {
    margin-top: 16px;
    background-color: #f5f5f5;
    max-width: 450px;
    border-radius: 10px;
    padding: 10px;
    text-align: center;

    .pagination-box {
      text-align: right;
      margin-top: 10px;
    }

  }
  .el-dialog__body {
    padding: 0px 16px;
  }
  .el-form-item {
    margin-bottom: 18px;
  }
  .el-message-box {
    width: 400PX;
  }
}

</style>
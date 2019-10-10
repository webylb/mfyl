<template>
  <div class="immediately-purchase">
    <div class="immediately-purchase-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/pwd-purchase' }">卡密采购</el-breadcrumb-item>
        <el-breadcrumb-item>立即采购</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" :model="form" :inline="false" label-position="center" label-width="140px">
      <el-form-item label="采购类型">
        <el-select v-model="form.isVirtual" clearable placeholder="请选择采购类型" style="width: 150px;">
          <el-option
            v-for="item in options.isVirtualOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="采购面值以及数量">
        <div  v-for="(item, index) in form.camInfo"
        :key="item.key" style="margin-bottom: 10px;" :data-length="form.camInfo.length">
          <el-select v-model="item.faceValue" clearable placeholder="请选择采购类型" style="width: 150px;">
            <el-option
              v-for="item in options.camInfoOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input  placeholder="请填写采购数量" clearable style="width: 150px;margin:0 20px;" v-model="item.amount" @change="changeNeedMoney"></el-input>
          <el-button v-if="index == form.camInfo.length - 1" @click.prevent="addItemValue()">添加</el-button>
          <el-button v-else @click.prevent="removeItemValue(item)" icon="el-icon-delete"></el-button>
        </div>
        <div>
            累计需使用：{{ needMoney }} 元    您的账户余额：{{ accountBalance }} 元  <span class="toRecharge" @click="subRecharge()">去充值</span>
        </div>
      </el-form-item>
      <el-form-item label="邮寄地址" v-if="form.isVirtual == 'N'">
        <div>
          <p style="margin: 0">收货人：{{ receiverName }}</p>
          <p style="margin: 0">收货电话：{{ phoneNumber }}</p>
          <p style="margin: 0">收货地址：{{ deliveryAddress }}</p>
          <p style="margin: 0;font-size: 12px">魔方优礼会把实体卡邮寄到您的收货地址（邮寄地址可在企业设置中修改）</p>
        </div>

      </el-form-item>
      <el-form-item v-else label="邮箱地址">
        <el-input clearable placeholder="请输入您有效的邮箱地址" style="width:200px" v-model="form.email"></el-input>
        <div>
          <p style="margin: 0;font-size: 12px;color:red">用于接收电子卡密表格（电子卡密将以邮件的方式发送）</p>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent="submitForm(form)" type="primary">提交申请</el-button>
      </el-form-item>
    </el-form>
    <div class="page-content">
    </div>
    <el-dialog
      title="支付密码"
      :visible.sync="dialogPwdVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <div>
        <div class="pwd-box">
          <el-input v-model="form.payPassword" maxlength="6" type="tel" placeholder="" class="pwd-input" @input.native="inputPwd($event)"></el-input>
          <div class="fake-box">
            <input type="password" v-model="pwd1" readonly="">
            <input type="password" v-model="pwd2" readonly="">
            <input type="password" v-model="pwd3" readonly="">
            <input type="password" v-model="pwd4" readonly="">
            <input type="password" v-model="pwd5" readonly="">
            <input type="password" v-model="pwd6" readonly="">
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="subCamOrder">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="支付密码"
      :visible.sync="dialogPwdNoVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <div style="margin: 10px auto;text-align: center;">
        您还未设置支付密码
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="setPwd">设 置</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogPwdHintVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <div style="margin: 10px auto;text-align: center;">
        您的企业账户积余额不足，请立即进行积分充值
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="subRecharge">立即充值</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title=""
      :visible.sync="dialogPwdSuccessVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <div class="margin:20px auto;text-align:center;font-size;16px;">
        <div style="text-align:center;">
          <i class="el-icon-success" style="color: #67c23a;fontSize: 80px"></i>
        </div>
        <div style="text-align:center;margin:10px 25px;font-size:16px;">
         采购已申请，魔方优礼将在2个工作日内为您受理！
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
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
        camInfo: [{
          amount: '',
          faceValue: ''
        }],
        email:'',
        payPassword: null
      },
      dialogForm: {
        name:'',
        userName:''
      },
      options: {
        isVirtualOptions: [{
          value: 'N',
          label: '实体卡',

        },
        {
          value: 'Y',
          label: '电子卡密',
        }],
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
        },
        {
          value: 1000,
          label: '1000元'
        },
        {
          value: 5000,
          label: '5000元'
        }]
      },
      receiverName: '--',
      phoneNumber: '--',
      deliveryAddress: '--',
      needMoney: 0,
      dialogPwdVisible: false,
      dialogPwdNoVisible: false,
      dialogPwdHintVisible: false,
      dialogPwdSuccessVisible: false,
      pwd1: '',
      pwd2: '',
      pwd3: '',
      pwd4: '',
      pwd5: '',
      pwd6: ''
    }
  },
  created(){
    this.getDeliveryInfo()
  },
  computed: {
    ...mapState({
      accountBalance: state => state.accountBalance,
      havePayPassword: state => state.havePayPassword,
    }),
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
    dialogClose(){
      this.dialogPwdVisible = false
      this.dialogPwdNoVisible = false
      this.dialogPwdHintVisible = false
      this.dialogPwdSuccessVisible = false;
    },
    changeNeedMoney(){
      this.needMoney = 0
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
      if(!this.form.isVirtual){
        this.$message.warning("请选择充值卡密类型");
        return false;
      }
      this.form.camInfo.forEach((item,index) => {
        if(item.faceValue == ""){
          this.form.camInfo.splice(index,1)
        }
      })
      if(this.form.camInfo.length < 1){
        this.form.camInfo.push({
          amount: '',
          faceValue: ''
        });
        this.$message.warning("请选择充值面值及数量");
        return false;
      }
      if(this.form.isVirtual == "Y"){
        if(!tool.isEmail(this.form.email)){
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
      this.$router.push('/account-recharge/immediately-recharge')
    },
    subCamOrder(){
      if(this.form.payPassword.length < 1){
        this.$message.warning("请输入支付密码");
        return false;
      }
      core.subCamOrder(this.form).then(res => {
        //console.log(res)
        if(res.code && res.code == '00'){
          this.pwd1 = '',
          this.pwd2 = '',
          this.pwd3 = '',
          this.pwd4 = '',
          this.pwd5 = '',
          this.pwd6 = '',
          this.form.payPassword = ''
          this.dialogPwdVisible = false
          this.dialogPwdSuccessVisible = true
          const timer = null
          clearTimeout(timer)
          timer = setTimeout(res=>{
            this.form.camInfo = [{
              amount: '',
              faceValue: ''
            }];
            this.needMoney = 0
            this.form.email = ''
            this.dialogPwdSuccessVisible = false
          },3000)
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
    },
    inputPwd(event){
      //console.log(event)
    }
  },
  watch: {
    'form.payPassword':function(newVal){
      let arr = []
      for(let i=0,legth=newVal.length;i<legth;i++){
        arr.push(newVal[i])
      }
      //console.log(arr)
      this.pwd1 = arr[0]
      this.pwd2 = arr[1]
      this.pwd3 = arr[2]
      this.pwd4 = arr[3]
      this.pwd5 = arr[4]
      this.pwd6 = arr[5]
    }
  },
}

</script>
<style lang='less'>
.immediately-purchase {

   .immediately-purchase-title{
    margin:20px 0;
    width: 100%;
    font-size: 24px;
    padding-bottom: 15px;
    box-sizing: border-box;
    border-bottom: 1PX solid #EBEEF5;
  }

  .toRecharge {
    color: #409EFF;
    text-decoration: underline;
    margin-left: 10px;
    cursor: pointer;
  }

  .page-content {
    margin-top: 16px;

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
  .pwd-box{
      width:270Px;
      height: 45Px;
	    position: relative;
	    border: 1Px solid #e5e5e5;
	    border-radius: 3Px;
      overflow:hidden;
      margin: 0 auto;
  }

	.pwd-box .el-input {
		  width: 100%;
	    height: 45Px;
	    color: transparent;
	    position: absolute;
	    top: 0;
	    left: 0;
	    border: none;
	    font-size: 18Px;
	    opacity: 0;
	    z-index: 1;
      letter-spacing: 35Px;

      input {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
      }
  }

  .fake-box {
    width: 270px;
    display: flex;
    justify-content: flex-start;

    input{
        flex-grow: 1;
        width: 0;
        height: 45Px;
        border: none;
        border-right: 1px solid #e5e5e5;
        box-sizing: border-box;
        text-align: center;
        font-size: 30Px;
        background: #fff;
        &:nth-last-child(1){
          border:none;
        }
    }

  }

  .el-message-box {
    width: 400PX;
  }
}

</style>
<template>
  <div class="immediately-recharge">
    <div class="immediately-recharge-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/account-recharge' }">账户充值</el-breadcrumb-item>
        <el-breadcrumb-item>立即充值</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" :model="form" :inline="false" label-position="center" label-width="140px" v-loading="loading">
      <el-form-item label="充值金额">
        <el-input v-model="form.rechargeNum" clearable style="width:150px" placeholder="请输入充值金额"></el-input>
      </el-form-item>

      <el-form-item label="充值渠道" v-if="purchaseMode === 'YuFuKuan'">
          <el-radio-group v-model="form.type">
            <el-radio label="BankTransfer">银行卡</el-radio>
            <el-radio label="Alipay">支付宝</el-radio>
          </el-radio-group>
      </el-form-item>
      <el-form-item label="付款信息" v-if="form.type == 'Alipay' && purchaseMode === 'YuFuKuan'">
        <div>
          <p style="margin: 0">支付宝账号：{{ AlipayInfo.alipayAccount }}</p>
          <p style="margin: 0">账户名称：{{ AlipayInfo.accountName }}</p>
          <p style="margin: 0" v-if="AlipayInfo.alipayQrCode"><img :src="AlipayInfo.alipayQrCode" alt="" style="width:200px;height:atuo;"></p>
          <p style="margin: 0;font-size: 12px;color:red">(请通过线下支付方式支付费用到该收款账号)</p>
        </div>
      </el-form-item>
      <el-form-item label="收款方信息" v-if="form.type == 'BankTransfer' && purchaseMode === 'YuFuKuan'">
        <div v-if="bankInfo">
          <p style="margin: 0">行联号：{{ bankInfo.bankLineNumber }}</p>
          <p style="margin: 0">开户行：{{ bankInfo.bankOpeningBank }}</p>
          <p style="margin: 0">账户名称：{{ bankInfo.accountName }}</p>
          <p style="margin: 0">银行账户：{{ bankInfo.bankAccount }}</p>
          <p style="margin: 0;font-size: 12px;color:red">(请通过线下支付方式支付费用到该收款账号)</p>
        </div>
      </el-form-item>
      <el-form-item label="上传转账凭证" v-if="purchaseMode === 'YuFuKuan'">
        <el-upload
          :action="action"
          list-type="picture-card"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <div>
          <p style="margin: 0;font-size: 12px;color:red">请上传转账截图或拍照</p>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent="submitForm(form)" type="primary">提交申请</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="确认充值信息"
      :visible.sync="dialogHintVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <div style="text-align: center;margin: 20px 0;">
        本次充值{{ form.rechargeNum }}元，付款：¥{{ form.rechargeNum }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogHintVisible = false">取 消</el-button>
        <el-button type="primary" @click="subRecharge">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title=""
      :visible.sync="dialogSuccessVisible"
      width="450px"
      :before-close="dialogClose"
      center>
      <div class="margin:20px auto;text-align:center;font-size;16px;">
        <div style="text-align:center;">
          <i class="el-icon-success" style="color: #67c23a;fontSize: 80px"></i>
        </div>
        <div style="text-align:center;margin:10px;font-size:16px;">
          充值申请已提交，魔方优礼将在2个工作日内为您受理。
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import CONGIF from "../../api/config"
import * as core from '../../api/benefit-recharge'

export default {
  name: 'immediatelyRecharge',
  data() {
    var validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入员工名'));
      } else {
        callback();
      }
    }
    return {
      action: CONGIF.UPLOAD_IMAGE,
      loading: true,
      form: {
        rechargeNum: '',
        type: 'BankTransfer'
      },
      transferVouchers: [],
      dialogHintVisible: false,
      dialogSuccessVisible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      bankInfo: null,
      AlipayInfo: null,
      receiveMoneyAccountId: null
    }
  },
  computed: {
    ...mapState({
      purchaseMode: state => state.purchaseMode
    }),
  },
  created(){
    this.getReceiveAccountInfo()
  },
  methods: {
    getReceiveAccountInfo(){
      core.getReceiveAccountInfo().then(res => {
        //console.log(res)
        if(res.code && res.code == '00'){
          //this.rechargeInfo = res.data
          res.data.forEach((item,index) => {
            if(item.receiveType == 'BankTransfer'){
              this.bankInfo = item
            }else if(item.receiveType == 'Alipay'){
              this.AlipayInfo = item
            }
          })
          this.loading = false
        }else{
          this.loading = false
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.loading = false
        this.$message.closeAll();
        this.$message.info(err);
      })

    },
    dialogClose(){
      this.dialogHintVisible = false
      this.dialogSuccessVisible = false;
    },
    submitForm(formName) {
      if(!this.form.rechargeNum){
        this.$message.closeAll();
        this.$message.warning("请输入充值金额");
        return false
      }
      if(this.transferVouchers && this.transferVouchers.length < 1 && this.purchaseMode === 'YuFuKuan'){
        this.$message.closeAll();
        this.$message.warning("您还未上传转账凭证哦");
        return false
      }
      this.dialogHintVisible = true
    },
    subRecharge(){
      this.dialogHintVisible = false

      if(this.form.type == 'BankTransfer'){
        this.receiveMoneyAccountId = this.bankInfo.id
      }else{
        this.receiveMoneyAccountId = this.AlipayInfo.id
      }
      const data = {
        money: this.form.rechargeNum,
        rechargeType: this.form.type ,
        receiveMoneyAccountId: this.receiveMoneyAccountId,
        transferVouchers: this.transferVouchers
      }

      core.subRecharge(data).then(res => {
        // console.log(res)
        if(res.code && res.code == '00'){
          this.dialogSuccessVisible = true;
          let timer = null
          clearTimeout(timer)
          timer = setTimeout(res=>{
            this.dialogSuccessVisible = false
            if(this.$route.query.return){
              this.$router.push(this.$route.query.return)
            }
          },1500)
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    handleRemove(file, fileList) {
      //console.log(file);
      this.transferVouchers.forEach((item,index) => {
        if(item == file.response.data){
          this.transferVouchers.splice(index,1)
        }
      })
    },
    handlePreview(file) {
      //console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(file,fileList){
      //console.log(file,fileList);
      this.transferVouchers.push(file.data)
    }
  }
}

</script>
<style lang='less' scope>
.immediately-recharge {

   .immediately-recharge-title{
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
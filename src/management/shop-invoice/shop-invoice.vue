<template>
  <div class="shop-invoice">
    <div class="shop-invoice-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/merchant-management' }">商户管理</el-breadcrumb-item>
        <el-breadcrumb-item>开票信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" :inline="false" label-position="center" label-width="140px" v-loading="loading">
      <el-form-item label="企业名称:">
        <div>
          <p style="margin: 0">{{ invoiceCompanyName }}</p>
        </div>
      </el-form-item>
      <el-form-item label="开票信息:">
        <div class="text-wrap">
          <p style="margin: 0"><span class="title">开票企业名称</span><span class="content">{{ invoiceCompanyName }}</span></p>
          <p style="margin: 0"><span class="title">纳税识别号</span><span class="content">{{ taxIdentificationNumber || '--' }}</span></p>
          <p style="margin: 0"><span class="title">地址</span><span class="content">{{ invoiceCompanyAddress || '--' }}</span></p>
          <p style="margin: 0"><span class="title">电话号码</span><span class="content">{{ invoiceCompanyPhoneNumber || '--' }}</span></p>
          <p style="margin: 0"><span class="title">开户银行</span><span class="content">{{ bankOpeningBank || '--' }}</span></p>
          <p style="margin: 0"><span class="title">银行账号</span><span class="content">{{ bankAccount || '--' }}</span></p>
          <p style="margin: 0;margin-bottom:10px;">
            <span class="title">开票内容</span>
            <span class="content">
              <p v-for="(item,index) in formatStr(taxRate)" :key="index" style="margin: 0;height: 30px;text-align:left;justify-content: flex-start;">
                税率 <span style="dispaly:inline-block;width:60px; text-align:center;">{{ formatVal(item.taxRate) }}</span> {{ item.description }}
              </p>
            </span>
          </p>
          <p style="margin: 0"><el-button type="primary" @click="changeInfo">修改</el-button></p>
        </div>
      </el-form-item>
      <el-form-item label="邮寄地址:">
        <div class="text-wrap">
          <p style="margin: 0"><span class="title">收货人</span><span class="content">{{ receiverName || '--' }}</span></p>
          <p style="margin: 0"><span class="title">电话号码</span><span class="content">{{ phoneNumber || '--' }}</span></p>
          <p style="margin: 0;margin-bottom:10px;"><span class="title">地址</span><span class="content">{{ deliveryAddress || '--' }}</span></p>
          <p style="margin: 0"><el-button type="primary" @click="changeAddress">修改</el-button></p>
        </div>
      </el-form-item>
    </el-form>

    <el-dialog
      title="开票信息"
      :visible.sync="dialogInfoVisible"
      width="420px"
      :before-close="dialogClose"
      center>
      <el-form ref="dialogInfoForm" :model="dialogInfoForm" label-width="100px">
        <el-form-item label="企业名称:">
          <el-input v-model="dialogInfoForm.invoiceCompanyName" clearable placeholder="" readonly :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="纳税识别号*:">
          <span v-if="taxIdentificationNumber">
            <el-input v-model="dialogInfoForm.taxIdentificationNumber" clearable placeholder="请输入纳税识别号" readonly :disabled="true" ></el-input>
          </span>
          <span v-else>
            <el-input v-model="dialogInfoForm.taxIdentificationNumber" clearable placeholder="请输入纳税识别号" ></el-input>
          </span>
        </el-form-item>
        <el-form-item label="地址*:">
          <el-input v-model="dialogInfoForm.invoiceCompanyAddress" @focus="checkFocusVal(dialogInfoForm.invoiceCompanyAddress,'invoiceCompanyAddress')" clearable placeholder="" ></el-input>
        </el-form-item>
        <el-form-item label="电话号码*:">
          <el-input v-model="dialogInfoForm.invoiceCompanyPhoneNumber" @focus="checkFocusVal(dialogInfoForm.invoiceCompanyPhoneNumber,'invoiceCompanyPhoneNumber')" clearable placeholder="" ></el-input>
        </el-form-item>
        <el-form-item label="开户银行*:">
          <el-input v-model="dialogInfoForm.bankOpeningBank" @focus="checkFocusVal(dialogInfoForm.bankOpeningBank,'bankOpeningBank')" clearable placeholder="" ></el-input>
        </el-form-item>
        <el-form-item label="银行账号*:">
          <el-input v-model="dialogInfoForm.bankAccount" @focus="checkFocusVal(dialogInfoForm.bankAccount,'bankAccount')" clearable placeholder="" ></el-input>
        </el-form-item>
        <el-form-item label="开票内容*:">
          <el-checkbox-group v-model="dialogInfoForm.checkedTaxRate" :min="1">
            <el-checkbox v-for="(item,index) in invoiceTaxRatesJson" :label="item.taxRate" :key="index">{{ formatVal(item.taxRate) }} {{ item.description }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="subCompanyInfo">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="邮寄地址"
      :visible.sync="dialogAddressVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <el-form ref="dialogAddressForm" :model="dialogAddressForm" label-width="80px">
        <el-form-item label="收票人*:">
          <el-input v-model="dialogAddressForm.receiverName" @focus="checkAdressFocusVal(dialogAddressForm.receiverName,'receiverName')" clearable placeholder="" ></el-input>
        </el-form-item>
        <el-form-item label="电话*:">
          <el-input v-model="dialogAddressForm.phoneNumber" @focus="checkAdressFocusVal(dialogAddressForm.phoneNumber,'phoneNumber')" clearable placeholder="" ></el-input>
        </el-form-item>
        <el-form-item label="地址*:">
          <el-input v-model="dialogAddressForm.deliveryAddress" @focus="checkAdressFocusVal(dialogAddressForm.deliveryAddress,'deliveryAddress')" clearable placeholder="" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddressVisible = false">取 消</el-button>
        <el-button type="primary" @click="subAddressInfo">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as core from '../../api/merchant'
import tool from '../../utils/common'

export default {
  name: 'shopInvoice',
  data() {
    return {
      loading: false,
      merchantId: null,
      readonly: true,
      invoiceTaxRatesJson: [
        {
          description: "信息服务费／渠道服务费等",
          taxRate: '0.06'
        },
        {
          description: "详见清单",
          taxRate: '0.13'
        }
      ],//开票内容
      dialogInfoForm: {
        invoiceCompanyName: null,//开票企业名称
        taxIdentificationNumber: null,//纳税识别号
        invoiceCompanyAddress: null,//开票地址
        invoiceCompanyPhoneNumber: null,//开票电话号
        bankOpeningBank: null,//开户银行
        bankAccount: null, //银行账号
        checkedTaxRate: [],//税率选择
      },
      dialogAddressForm: {
        receiverName: null, //收货人
        phoneNumber: null, //收货人电话
        deliveryAddress: null,//收获地址
      },
      dialogInfoVisible: false,
      dialogAddressVisible: false,
      receiverName: null, //收货人
      phoneNumber: null, //收货人电话
      deliveryAddress: null,//收获地址

      invoiceCompanyName: null,//开票企业名称
      taxIdentificationNumber: null,//纳税识别号
      invoiceCompanyAddress: null,//开票地址
      invoiceCompanyPhoneNumber: null,//开票电话号
      bankOpeningBank: null,//开户银行
      bankAccount: null, //银行账号,
      taxRate: '[{"description":"信息服务费／渠道服务费等","taxRate":"0.06"},{"description":"详见清单","taxRate":"0.13"}]',//开票内容
      deliveryId: null,
      checkedTaxRate: null
    }
  },
  created(){
    if(this.$route.query.id){
      this.merchantId = this.$route.query.id
      this.getInvoiceInfo({merchantId: this.merchantId})
      this.getDeliveryInfo({merchantId: this.merchantId})
    }
  },
  methods: {
    formatStr(str){
      return JSON.parse(str)
    },
    formatVal(val){
      return val*100 + "%"
    },
    getInvoiceInfo(opts){
      core.getInvoiceInfo(opts).then(res => {
        if(res.code && res.code == '00'){
          this.invoiceCompanyName = res.data.companyName
          if(res.data.invoiceInfo){ //没数据不存在
            this.taxIdentificationNumber = res.data.invoiceInfo.taxIdentificationNumber || null
            this.invoiceCompanyAddress = res.data.invoiceInfo.invoiceCompanyAddress || null
            this.invoiceCompanyPhoneNumber = res.data.invoiceInfo.invoiceCompanyPhoneNumber || null
            this.bankOpeningBank = res.data.invoiceInfo.bankOpeningBank || null
            this.bankAccount = res.data.invoiceInfo.bankAccount || null
            this.invoiceId = res.data.invoiceInfo.id || null
            this.taxRate = res.data.invoiceInfo.taxRate
            const arr = []
            JSON.parse(this.taxRate).forEach((item,index) => {
              arr.push(item.taxRate)
            })
            this.checkedTaxRate = arr
            this.dialogInfoForm.checkedTaxRate = arr
          }else{
            this.dialogInfoForm.invoiceCompanyName = this.invoiceCompanyName,
            this.dialogInfoForm.checkedTaxRate = ['0.06', '0.13']
            this.checkedTaxRate = ['0.06', '0.13']
          }
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
    getDeliveryInfo(opts){
      core.getDeliveryInfo(opts).then(res => {
        if(res.code && res.code == '00'){
          if(res.data){
            this.receiverName = res.data.receiverName || null
            this.phoneNumber = res.data.phoneNumber || null
            this.deliveryAddress = res.data.deliveryAddress || null
            this.deliveryId = res.data.id
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
      this.dialogInfoVisible = false
      this.dialogAddressVisible = false;
    },
    checkFocusVal(val,type){
      if(val == '--'){
        this.dialogInfoForm[type] = null
      }
    },
    checkAdressFocusVal(val,type){
      if(val == '--'){
        this.dialogAddressForm[type] = null
      }
    },
    subCompanyInfo(){
      var data = {
        merchantId: this.merchantId ,
        invoiceCompanyName: this.dialogInfoForm.invoiceCompanyName,
        invoiceId: this.invoiceId
      }
      if(!this.dialogInfoForm.taxIdentificationNumber){
        this.$message.closeAll();
        this.$message.info('请输入纳税识别号');
        return false
      }
      data.taxIdentificationNumber = this.dialogInfoForm.taxIdentificationNumber
      if(!this.dialogInfoForm.invoiceCompanyAddress){
        this.$message.closeAll();
        this.$message.info('请输入开票企业地址');
        return false
      }
      data.invoiceCompanyAddress = this.dialogInfoForm.invoiceCompanyAddress
      if(!this.dialogInfoForm.invoiceCompanyPhoneNumber){
        this.$message.closeAll();
        this.$message.info('请输入开票企业电话号码');
        return false
      }else{
        if(!tool.isTel(this.dialogInfoForm.invoiceCompanyPhoneNumber)){
          this.$message.closeAll();
          this.$message.info('请输入正确的电话号码');
          return false
        }
      }
      data.invoiceCompanyPhoneNumber = this.dialogInfoForm.invoiceCompanyPhoneNumber
      if(!this.dialogInfoForm.bankOpeningBank){
        this.$message.closeAll();
        this.$message.info('请输入开票企业开户银行');
        return false
      }else{
        if(!tool.isBankName(this.dialogInfoForm.bankOpeningBank)){
          this.$message.closeAll();
          this.$message.info('请输入正确的银行名称');
          return false
        }
      }
      data.bankOpeningBank = this.dialogInfoForm.bankOpeningBank
      if(!this.dialogInfoForm.bankAccount){
        this.$message.closeAll();
        this.$message.info('请输入开票企业银行账号');
        return false
      }else{
        if(!tool.isNum(this.dialogInfoForm.bankAccount)){
          this.$message.closeAll();
          this.$message.info('请输入正确的银行账号');
          return false
        }
      }
      data.bankAccount = this.dialogInfoForm.bankAccount
      if(this.dialogInfoForm.checkedTaxRate.length < 1){
        this.$message.closeAll();
        this.$message.info('请选择开票企业开票内容');
        return false
      }
      data.invoiceTaxRatesJsonString = []
      for(let i=0,length = this.invoiceTaxRatesJson.length; i<length;i++){
        for(let j=0,length2 = this.dialogInfoForm.checkedTaxRate.length; j<length2;j++){
          if(this.invoiceTaxRatesJson[i].taxRate == this.dialogInfoForm.checkedTaxRate[j]){
            data.invoiceTaxRatesJsonString.push(this.invoiceTaxRatesJson[i])
          }
        }
      }
      data.invoiceTaxRatesJsonString = JSON.stringify(data.invoiceTaxRatesJsonString)

      core.editInvoiceInfo(data).then(res => {
        if(res.code && res.code == '00'){
          this.$message.success("操作成功");
          this.dialogInfoVisible = false
          this.getInvoiceInfo({merchantId: this.merchantId})
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    subAddressInfo(){
      var data = {
        merchantId: this.merchantId,
        deliveryId: this.deliveryId
      }
      if(!this.dialogAddressForm.receiverName){
        this.$message.closeAll();
        this.$message.info('请输入收货人姓名');
        return false
      }
      data.receiverName = this.dialogAddressForm.receiverName
      if(!this.dialogAddressForm.phoneNumber){
        this.$message.closeAll();
        this.$message.info('请输入收货人手机号码');
        return false
      }else{
        if(!tool.isPhone(this.dialogAddressForm.phoneNumber)){
          this.$message.closeAll();
          this.$message.info('请输入正确的手机号码');
          return false
        }
      }
      data.phoneNumber = this.dialogAddressForm.phoneNumber
      if(!this.dialogAddressForm.deliveryAddress){
        this.$message.closeAll();
        this.$message.info('请输入收货地址');
        return false
      }
      data.deliveryAddress = this.dialogAddressForm.deliveryAddress
      core.editDeliveryInfo(data).then(res => {
        if(res.code && res.code == '00'){
          this.$message.success("操作成功");

          this.dialogAddressVisible = false
          this.getDeliveryInfo({merchantId: this.merchantId})
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    changeInfo(){
      this.dialogInfoVisible = true
      this.dialogInfoForm.invoiceCompanyName = this.invoiceCompanyName
      this.dialogInfoForm.taxIdentificationNumber = this.taxIdentificationNumber
      this.dialogInfoForm.invoiceCompanyAddress = this.invoiceCompanyAddress
      this.dialogInfoForm.invoiceCompanyPhoneNumber = this.invoiceCompanyPhoneNumber
      this.dialogInfoForm.bankOpeningBank = this.bankOpeningBank
      this.dialogInfoForm.bankAccount = this.bankAccount
      this.dialogInfoForm.checkedTaxRate = this.checkedTaxRate
    },
    changeAddress(){
      this.dialogAddressVisible = true
      this.dialogAddressForm.receiverName =  this.receiverName
      this.dialogAddressForm.phoneNumber = this.phoneNumber
      this.dialogAddressForm.deliveryAddress = this.deliveryAddress
    }
  }
}

</script>
<style lang='less' scope>
.shop-invoice {

   .shop-invoice-title {
    margin:20px 0;
    width: 100%;
    font-size: 24px;
    padding-bottom: 15px;
    box-sizing: border-box;
    border-bottom: 1PX solid #EBEEF5;
  }

  .text-wrap {
    border: 1PX solid #ccc;
    padding: 10px 30px;
    box-sizing: border-box;
    border-radius: 5px;
    width: 700px;
    margin-top: 10Px;
    p {
      display: flex;
      justify-content: space-between;

      &:last-child {
        justify-content: flex-end
      }

    }


  }

  .el-dialog__body {
    padding: 0px 16px;
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  .el-checkbox {
    line-height: 25Px;
    display: block;
  }
}

</style>
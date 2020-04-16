<template>
  <div class="account-recharge">
    <div class="account-recharge-title">
      账户余额: {{ accountBalance }} 元
      <el-button size="small" @click.prevent="toImmediately" type="primary">立即充值</el-button>
    </div>
    <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="70px">
      <el-form-item label="时间">
        <el-date-picker
          v-model="form.times"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="充值渠道">
        <el-select v-model="form.rechargeType" clearable placeholder="请选择" style="width: 140px">
          <el-option
            v-for="item in options.rechargeTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审批状态">
        <el-select v-model="form.reviewStatus" clearable placeholder="请选择" style="width: 140px">
          <el-option
            v-for="item in options.reviewStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float:right;">
        <el-button type="primary" @click="search()">立即查询</el-button>
      </el-form-item>
    </el-form>
    <div class="page-content">
      <el-table :data="tableData" stripe style="width: 100%;border:1px solid #EBEEF5;" v-loading="loading">
        <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
        <el-table-column label="创建时间" align="center" width="160">
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.submitTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rechargeMoney" label="充值金额(元)" align="center"> </el-table-column>
        <el-table-column label="充值渠道" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.payType == 'BankTransfer'">银行卡</span>
            <span v-else>支付宝</span>
          </template>
        </el-table-column>
        <el-table-column label="收款方信息" align="center" width="240">
          <template slot-scope="scope">
            <div v-if="scope.row.payType == 'BankTransfer'" style="text-align:left;">
              <p style="margin: 0;">行联号：{{ scope.row.bankLineNumber }}</p>
              <p style="margin: 0;">开户行：{{ scope.row.bankOpeningBank }}</p>
              <p style="margin: 0;">账户名称：{{ scope.row.accountName }}</p>
              <p style="margin: 0;">银行账户：{{ scope.row.bankAccount }}</p>
            </div>
            <div v-else style="text-align:left;">
              <p style="margin: 0;">支付宝账号：{{ scope.row.alipayAccount }}</p>
              <p style="margin: 0;">账户名称：{{ scope.row.accountName }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="转账凭证" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.purchaseMode == 'HouFuKuan'">--</span>
            <el-button type="text" v-else @click="goLook(scope.row.id, scope.row.rechargeStatus)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.rechargeStatus == 'WAIT'">申请中</span>
            <span v-else-if="scope.row.rechargeStatus == 'SUCCESS'">已通过</span>
            <span v-else>已拒绝</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="发票" prop="name" align="center" width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.payStatus == 'WAIT'">
              --
            </div>
            <div v-else-if="scope.row.payStatus == 'FAIL'">
              --
            </div>
            <div v-else>
              <el-button
                @click="makeOutInvoice(scope.row.id, scope.$index, 'APPLY')"
                type="primary"
                size="small"
                v-if="scope.row.isMakeOutAnInvoice == 'N'"
                >申请发票</el-button
              >
              <el-button
                @click="makeOutInvoice(scope.row.id, scope.$index, 'WAIT')"
                type="primary"
                size="small"
                v-else-if="scope.row.isMakeOutAnInvoice == 'Y' && scope.row.makeOutAnInvoiceStatus == 'WAIT'"
                >发票申请中</el-button
              >
              <el-button
                @click="makeOutInvoice(scope.row.id, scope.$index, 'SUCCESS')"
                type="primary"
                size="small"
                v-else-if="scope.row.isMakeOutAnInvoice == 'Y' && scope.row.makeOutAnInvoiceStatus == 'SUCCESS'"
                >发票已邮寄</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="pageTotal > 10" class="pagination-box">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="10"
          layout="sizes, prev, pager, next, jumper"
          :total="pageTotal"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog title="发票申请" :visible.sync="dialogVisible" width="400px" :before-close="dialogClose" center>
      <el-form ref="dialogform" :model="dialogform" label-width="80px">
        <el-form-item label="邮寄物流:" class="dialogCompanyInfo" v-if="invoiceStatus == 'SUCCESS'">
          <p><span>快递公司：</span>{{ expressCompany }}</p>
          <p><span>物流单号：</span>{{ logisticsNumber }}</p>
        </el-form-item>
        <el-form-item label="开票内容:">
          <el-radio-group v-model="dialogform.taxRate" class="dialogRadio">
            <el-radio v-for="(item, index) in checkedTaxRateText" :label="item.taxRate" :key="index"
              >{{ formatVal(item.taxRate) }} {{ item.description }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开票信息:" class="dialogCompanyInfo">
          <p><span>企业名称：</span>{{ invoiceCompanyName }}</p>
          <p><span>纳税识别号：</span>{{ taxIdentificationNumber }}</p>
          <p><span>地址：</span>{{ invoiceCompanyAddress }}</p>
          <p><span>电话号码：</span>{{ invoiceCompanyPhoneNumber }}</p>
          <p><span>开户银行：</span>{{ bankOpeningBank }}</p>
          <p><span>银行账号：</span>{{ bankAccount }}</p>
        </el-form-item>
        <el-form-item label="邮寄地址:" class="dialogCompanyInfo">
          <p><span>收票人：</span>{{ receiverName }}</p>
          <p><span>电话：</span>{{ phoneNumber }}</p>
          <p><span>地址：</span>{{ deliveryAddress }}</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div v-if="invoiceStatus == 'APPLY'">
          <el-button @click="changeInvoiceInfo">修改信息</el-button>
          <el-button type="primary" @click="subDialogform">立即申请</el-button>
        </div>
        <div v-else-if="invoiceStatus == 'WAIT'">
          <el-button type="primary" disabled>发票申请中</el-button>
        </div>
      </span>
    </el-dialog>
    <el-dialog title="查看凭证" :visible.sync="dialogImgVisible" width="422px" @close="dialogClose()" center>
      <div style="margin:20px auto;text-align:center;font-size:16px;text-align:center;">
        <div v-for="item in imgList" :key="item.id">
          <el-image
            :src="item.voucherPictureUrl"
            style="display: block;margin: 0 auto;margin-bottom:5px;max-width:390px;height:auto"
          >
            <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div>
          </el-image>
          <div v-if="lookStatus === 'WAIT'" style="marin-top:10px;">
            <el-upload
              class=""
              :action="action"
              :on-success="function (res,file){return handleSuccess(res,file,item.id)}"
              :on-exceed="handleExceed"
              :limit="limit"
              :file-list="fileList"
              :show-file-list="false"
              accept="image/jpeg,image/gif,image/png,image/bmp"
            >
              <el-button type="text">更换凭证</el-button>
            </el-upload>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogImgVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateImage(lookStatus)">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { mapState, mapMutations } from 'vuex'
  import * as core from '../../api/benefit-recharge'
  import * as merchantCore from '../../api/benefit-merchant'
  import tool from '../../utils/common'
  import CONGIF from '../../api/config'

  export default {
    name: 'accountRecharge',
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() - 3600 * 1000 * 24 * 1 > Date.now()
          }
        },
        action: CONGIF.UPLOAD_IMAGE,
        limit: 1,
        fileList: [],
        loading: true,
        money: 200,
        dialogVisible: false,
        dialogImgVisible: false,
        editId: null,
        editIndex: null,
        invoiceStatus: null,
        form: {
          times: '',
          rechargeType: null,
          reviewStatus: null
        },
        dialogform: {
          taxRate: null
        },
        options: {
          rechargeTypeOptions: [
            {
              value: 'BankTransfer',
              label: '银行卡'
            },
            {
              value: 'Alipay',
              label: '支付宝'
            }
          ],
          reviewStatusOptions: [
            {
              value: 'WAIT',
              label: '申请中'
            },
            {
              value: 'SUCCESS',
              label: '已通过'
            },
            {
              value: 'FAIL',
              label: '已拒绝'
            }
          ]
        },
        pageSize: 10,
        currentPage: 1,
        pageTotal: 0,
        tableData: [],
        imgList: [],

        receiverName: '--', //收货人
        phoneNumber: '--', //收货人电话
        deliveryAddress: '--', //收获地址

        invoiceCompanyName: '--', //开票企业名称
        taxIdentificationNumber: '--', //纳税识别号
        invoiceCompanyAddress: '--', //开票地址
        invoiceCompanyPhoneNumber: '--', //开票电话号
        bankOpeningBank: '--', //开户银行
        bankAccount: '--', //银行账号,
        taxRate:
          '[{"description":"信息服务费／渠道服务费等","taxRate":"0.06"},{"description":"详见清单","taxRate":"0.13"}]', //开票内容
        checkedTaxRateText: [],

        expressCompany: '',
        logisticsNumber: '',
        lookId: '',
        lookStatus: '',
        changeImg: false
      }
    },
    created() {
      this.getRechargeOrderList({ currentPage: this.currentPage, pageSize: this.pageSize })
    },
    computed: {
      ...mapState({
        accountBalance: state => state.accountBalance,
        merchantId: state => state.merchantId
      })
    },
    methods: {
      getRechargeOrderList(opts) {
        core
          .getRechargeOrderList(opts)
          .then(res => {
            //console.log(res)
            if (res.code && res.code == '00') {
              this.pageTotal = res.data.amount
              this.tableData = res.data.data
              this.loading = false
            } else {
              this.loading = false
              this.$message.closeAll()
              this.$message.info(res.message)
            }
          })
          .catch(err => {
            this.loading = false
            this.$message.closeAll()
            this.$message.info(err)
          })
      },
      formatDate(val) {
        return tool.formatDate(val)
      },
      formatVal(val) {
        return val * 100 + '%'
      },
      search(opts) {
        this.loading = true
        let data = null
        if (opts) {
          data = opts
        } else {
          this.currentPage = 1
          data = { currentPage: 1, pageSize: this.pageSize }
        }
        if (this.form.times) {
          data.startTime = this.form.times[0]
          data.endTime = this.form.times[1]
        }
        if (this.form.rechargeType) {
          data.rechargeType = this.form.rechargeType
        }
        if (this.form.reviewStatus) {
          data.reviewStatus = this.form.reviewStatus
        }
        this.getRechargeOrderList(data)
      },
      handleSizeChange(val) {
        this.pageSize = val
        let data = {
          currentPage: 1,
          pageSize: val
        }
        this.search(data)
      },
      handleCurrentChange(val) {
        this.currentPage = val
        let data = {
          currentPage: val,
          pageSize: this.pageSize
        }
        this.search(data)
      },
      dialogClose() {
        this.dialogVisible = false
        this.dialogImgVisible = false
        this.imgList = []
      },
      toImmediately() {
        this.$router.push('/account-recharge/immediately-recharge')
      },
      goLook(id, status) {
        this.changeImg = false
        this.fileList = []
        this.lookId = id
        this.lookStatus = status
        core
          .getRechargeVouchers({ rechargeMoneyOrderId: id })
          .then(res => {
            if (res.code && res.code == '00') {
              this.imgList = res.data
              this.dialogImgVisible = true
            } else {
              this.$message.closeAll()
              this.$message.info(res.message)
            }
          })
          .catch(err => {
            this.$message.closeAll()
            this.$message.info(err)
          })
      },
      makeOutInvoice(id, index, status) {
        this.editIndex = index
        this.editId = id
        this.invoiceStatus = status
        if (status == 'SUCCESS') {
          this.getTaxRateInfo()
          this.getOrderInvoiceInfo()
        } else {
          this.getInvoiceInfo()
          this.getDeliveryInfo()
        }
        this.dialogVisible = true
      },
      getInvoiceInfo(opts) {
        merchantCore
          .getInvoiceInfo(opts)
          .then(res => {
            if (res.code && res.code == '00') {
              this.invoiceCompanyName = res.data.companyName
              if (res.data.invoiceInfo) {
                //没数据不存在
                this.taxIdentificationNumber = res.data.invoiceInfo.taxIdentificationNumber || '--'
                this.invoiceCompanyAddress = res.data.invoiceInfo.invoiceCompanyAddress || '--'
                this.invoiceCompanyPhoneNumber = res.data.invoiceInfo.invoiceCompanyPhoneNumber || '--'
                this.bankOpeningBank = res.data.invoiceInfo.bankOpeningBank || '--'
                this.bankAccount = res.data.invoiceInfo.bankAccount || '--'
                this.invoiceId = res.data.invoiceInfo.id || null
                this.taxRate = res.data.invoiceInfo.taxRate
                const arr = []
                JSON.parse(this.taxRate).forEach((item, index) => {
                  arr.push(item.taxRate)
                })
                this.checkedTaxRateText = JSON.parse(this.taxRate)
                if (arr.length == 1) {
                  this.dialogform.taxRate = arr[0]
                } else {
                  this.dialogform.taxRate = null
                }
              } else {
                this.checkedTaxRateText = JSON.parse(this.taxRate)
                this.dialogform.taxRate = null
              }
            } else {
              this.$message.closeAll()
              this.$message.info(res.message)
            }
          })
          .catch(err => {
            this.$message.closeAll()
            this.$message.info(err)
          })
      },
      getDeliveryInfo(opts) {
        merchantCore
          .getDeliveryInfo(opts)
          .then(res => {
            if (res.code && res.code == '00') {
              this.receiverName = res.data.receiverName || '--'
              this.phoneNumber = res.data.phoneNumber || '--'
              this.deliveryAddress = res.data.deliveryAddress || '--'
              this.deliveryId = res.data.id
            } else {
              this.$message.closeAll()
              this.$message.info(res.message)
            }
          })
          .catch(err => {
            this.$message.closeAll()
            this.$message.info(err)
          })
      },
      subDialogform() {
        if (!this.dialogform.taxRate) {
          this.$message.closeAll()
          this.$message.warning('请勾选开票内容')
        }
        let taxRate = Number(this.dialogform.taxRate)
        core
          .applyInvoice({ rechargeMoneyOrderId: this.editId, taxRate: taxRate })
          .then(res => {
            if (res.code && res.code == '00') {
              this.tableData[this.editIndex].isMakeOutAnInvoice = 'Y'
              this.tableData[this.editIndex].makeOutAnInvoiceStatus = 'WAIT'
              this.dialogVisible = false
            } else {
              this.$message.closeAll()
              this.$message.info(res.message)
            }
          })
          .catch(err => {
            this.$message.closeAll()
            this.$message.info(err)
          })
      },
      changeInvoiceInfo() {
        this.$router.push('/company-info')
      },
      getTaxRateInfo(opts) {
        merchantCore
          .getInvoiceInfo(opts)
          .then(res => {
            if (res.code && res.code == '00') {
              if (res.data.invoiceInfo) {
                //没数据不存在
                this.taxRate = res.data.invoiceInfo.taxRate
              }
            } else {
              this.$message.closeAll()
              this.$message.info(res.message)
            }
          })
          .catch(err => {
            this.$message.closeAll()
            this.$message.info(err)
          })
      },
      getOrderInvoiceInfo() {
        core
          .getOrderInvoiceInfo({ rechargeMoneyOrderId: this.editId })
          .then(res => {
            if (res.code && res.code == '00') {
              this.expressCompany = res.data.expressCompany
              this.logisticsNumber = res.data.logisticsNumber
              this.invoiceCompanyName = res.data.invoiceCompanyName
              this.taxIdentificationNumber = res.data.taxIdentificationNumber
              this.invoiceCompanyAddress = res.data.invoiceCompanyAddress
              this.invoiceCompanyPhoneNumber = res.data.phoneNumber
              this.bankOpeningBank = res.data.bankOpeningBank
              this.bankAccount = res.data.bankAccount
              this.receiverName = res.data.receiverName
              this.phoneNumber = res.data.deliveryPhoneNumber
              this.deliveryAddress = res.data.deliveryAddress

              const arr = []
              const arr2 = []
              JSON.parse(this.taxRate).forEach((item, index) => {
                if (item.taxRate == res.data.taxRate) {
                  arr.push(item.taxRate)
                  arr2.push(item)
                }
              })
              this.checkedTaxRateText = arr2
              this.dialogform.taxRate = arr[0]
            } else {
              this.$message.closeAll()
              this.$message.info(res.message)
            }
          })
          .catch(err => {
            this.$message.closeAll()
            this.$message.info(err)
          })
      },
      handleSuccess(file, fileList, id) {
        // console.log(file,fileList)
        // this.fileList = [{
        //   name: fileList.name,
        //   url: fileList.response.data
        // }],
        this.changeImg = true
        this.imgList.forEach((item, index) => {
          if(item.id === id){
            item.voucherPictureUrl = fileList.response.data
          }
        })
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，请删除后继续上传`)
      },
      updateImage(status) {
        if (status === 'WAIT' && this.changeImg) {
          this.updateRechargeVouchers(this.imgList)
        }else{
          this.dialogImgVisible = false
        }
      },
      updateRechargeVouchers(opts){
        core
          .updateRechargeVouchers(opts)
          .then(res => {
            if (res.code && res.code == '00') {
              this.$message.closeAll()
              this.$message.success('保存成功')
            } else {
              this.$message.closeAll()
              this.$message.info(res.message)
            }
          })
          .catch(err => {
            this.$message.closeAll()
            this.$message.info(err)
          })
      }
    }
  }
</script>
<style lang="less" scope>
  .account-recharge {
    .account-recharge-title {
      margin: 20px 0;
      width: 100%;
      font-size: 24px;
      padding-bottom: 15px;
      box-sizing: border-box;
      border-bottom: 1px solid #ebeef5;
      display: flex;
      align-items: center;
      .el-button {
        margin-left: 60px;
      }
    }

    .page-content {
      // margin-top: 16px;

      .pagination-box {
        text-align: right;
        margin-top: 10px;
      }
    }
    .el-dialog__body {
      padding: 0px 16px;
    }
    .el-form-item {
      margin-bottom: 15px;
    }
    .el-message-box {
      width: 400px;
    }
    .dialogRadio {
      .el-radio {
        margin: 12px 0;
        display: block;
      }
    }
    .dialogCompanyInfo {
      color: #bbb;
      .el-form-item__content {
        padding-top: 30px;
      }

      p {
        margin: 0;
        height: 30px;
        line-height: 30px;
        span {
          width: 100px;
          display: inline-block;
        }
      }
    }
    .el-input--suffix .el-input__inner {
      padding-right: 10px;
    }
  }
</style>

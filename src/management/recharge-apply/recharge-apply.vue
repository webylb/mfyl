<template>
  <div class="user-management">
    <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="80px">
      <el-form-item label="时间:">
         <el-date-picker style="width: 140px;padding-right:0"
            v-model="form.startTime"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
            :picker-options="pickerOptions">
          </el-date-picker>
      </el-form-item>

      <el-form-item label="商户名称:">
        <el-input style="width: 120px" v-model="form.merchantName" clearable></el-input>
      </el-form-item>

      <el-form-item label="充值渠道:">
        <el-select v-model="form.rechargeType" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options.rechargeTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="采购模式:">
        <el-select v-model="form.purchaseMode" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options.purchaseModeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="申请状态:">
        <el-select v-model="form.reviewStatus" clearable placeholder="请选择" style="width: 120px">
          <el-option
            v-for="item in options.reviewStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item style='float:right;'>
        <el-button type="primary" @click="search()">立即查询</el-button>
          <el-button @click="downloadRechargeApplyList()">导 出</el-button>
      </el-form-item>
    </el-form>
    <div class="page-content">
      <el-table
        :data="tableData"
        stripe
        header-align="center"
        style="width: 100%;border:1px solid #EBEEF5;"
        v-loading="loading">
        <el-table-column
          label="序号"
          type="index"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="申请时间"
          align="center"
          width="160">
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.submitTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="merchantCompanyName"
          label="商户名称"
          align="center"
          width="200">
        </el-table-column>
        <el-table-column
          prop="rechargeMoney"
          label="申请金额(元）"
          align="center"
          width="130">
        </el-table-column>
        <el-table-column
          label="充值渠道"
          align="center"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.payType == 'BankTransfer'">银行卡</span>
            <span v-else>支付宝</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="收款方信息"
          align="center"
          width="240">
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
        <el-table-column
          label="采购模式"
          align="center"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.purchaseMode == 'HouFuKuan'">后付款</span>
            <span v-else>预付款</span>
          </template>
        </el-table-column>
        <el-table-column
          label="查看凭证"
          align="center"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.purchaseMode == 'HouFuKuan'">--</span>
            <el-button type="text" v-else @click="goLook(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="状态"
          align="center"
          width="130">
          <template slot-scope="scope">
            <div v-if="scope.row.reviewStatus == 'WAIT'">
              <el-button @click="handleClick(scope.row.id,1,scope.$index)" type="text" size="small">通过</el-button>
              <el-button @click="handleClick(scope.row.id,2,scope.$index)" type="text" size="small">拒绝</el-button>
            </div>
            <div v-else-if="scope.row.reviewStatus == 'SUCCESS'">
              <span>已通过</span>
            </div>
            <div v-else>
              <span>已拒绝</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="pageTotal>10" class="pagination-box">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="10"
          layout="sizes, prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </div>
    </div>

    <el-dialog
      title="操作提示"
      :visible.sync="dialogVisible"
      width="422px"
      @close="dialogClose()" center>
      <div style="margin:20px auto;text-align:center;font-size:16px;">
        {{ hintText }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取  消</el-button>
        <el-button type="primary" @click="subChange">确  定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="查看凭证"
      :visible.sync="dialogImgVisible"
      width="422px"
      @close="dialogClose()" center>
      <div style="margin:20px auto;text-align:center;font-size:16px;text-align:center;">
        <img v-for="item in imgList"  :src="item.voucherPictureUrl" :key="item.id" style="display: block;margin: 0 auto;margin-bottom:5px;max-width:390px;height:auto;">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogImgVisible = false">取  消</el-button>
        <el-button type="primary" @click="dialogImgVisible = false">确  定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as core from '../../api/recharge'
import tool from '../../utils/common'

export default {
  name: 'userManagement',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      loading: true,
      dialogVisible: false,
      dialogImgVisible: false,
      form: {
        startTime: null,
        merchantName: null,
        rechargeType: null,
        purchaseMode: null,
        reviewStatus: null,
      },
      hintText: '确认审批通过？',
      hintStatus: 1, //1为通过 2为拒绝
      editId: null,
      editIndex: null,
      options:{
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
        purchaseModeOptions: [
          {
            value: 'HouFuKuan',
            label: '后付款'
          },
          {
            value: 'YuFuKuan',
            label: '预付款'
          }
        ],
        reviewStatusOptions: [
          {
            value: 'WAIT',
            label: '未审核'
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
      imgList: []
    }
  },
  created(){
    this.getRechargeOrderList({pageSize: this.pageSize,currentPage: this.currentPage})
  },
  methods: {
    getRechargeOrderList(opts){
      core.getRechargeOrderList(opts).then(res => {
        //console.log(res)
        if(res.code && res.code == '00'){
          this.pageTotal = res.data.amount
          this.tableData = res.data.data
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
    formatDate(val){
      return tool.formatDate(val)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.loading = true
      let data = {
        currentPage: 1,
        pageSize: val
      }
      this.search(data)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      let data = {
        currentPage: val,
        pageSize: this.pageSize
      }
      this.search(data)
    },
    search(opts){
      this.loading = true
      let data = null
      if(opts){
        data = opts
      }else{
        this.currentPage = 1
        data = {currentPage:1, pageSize:this.pageSize}
      }
      if(this.form.startTime){
        data.startTime = Number(this.form.startTime);
      }
      if(this.form.merchantName){
        data.merchantName = this.form.merchantName;
      }
      if(this.form.rechargeType){
        data.rechargeType = this.form.rechargeType;
      }
      if(this.form.purchaseMode){
        data.purchaseMode = this.form.purchaseMode;
      }
      if(this.form.reviewStatus){
        data.reviewStatus = this.form.reviewStatus;
      }
      this.getRechargeOrderList(data)
    },
    handleClick(id,status,index) {
      this.dialogVisible = true
      this.editId = id
      this.hintStatus = status
      this.editIndex = index
      if(status == 1){
        this.hintText = '确认审批通过？'
      }else {
        this.hintText = '确认拒绝该笔充值申请？'
      }
    },
    dialogClose(){
      this.dialogVisible = false
      this.dialogImgVisible = false
      this.imgList = []
    },
    subChange() {
      if(this.hintStatus == '1'){ //通过
        core.successRechargeApply({rechargeMoneyOrderId: this.editId}).then(res => {
          //console.log(res)
          if(res.code && res.code == '00'){
            this.$message.success("操作成功");
            this.dialogVisible = false
            this.tableData[this.editIndex].reviewStatus = "SUCCESS"
          }else{
            this.$message.closeAll();
            this.$message.info(res.message);
          }
        }).catch(err => {
          this.$message.closeAll();
          this.$message.info(err);
        })
      }else{ //拒绝
        core.failedRechargeApply({rechargeMoneyOrderId: this.editId}).then(res => {
          //console.log(res)
          if(res.code && res.code == '00'){
            this.$message.success("操作成功");
            this.dialogVisible = false
            this.tableData[this.editIndex].reviewStatus = "FAIL"
          }else{
            this.$message.closeAll();
            this.$message.info(res.message);
          }
        }).catch(err => {
          this.$message.closeAll();
          this.$message.info(err);
        })
      }
    },
    goLook(id){
      core.getRechargeVouchers({rechargeMoneyOrderId: id}).then(res => {
        if(res.code && res.code == '00'){
          this.dialogImgVisible = true
          this.imgList = res.data
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    downloadRechargeApplyList(){
      let data = {}
      if(this.form.startTime){
        data.startTime = Number(this.form.startTime);
      }
      if(this.form.merchantName){
        data.merchantName = this.form.merchantName;
      }
      if(this.form.rechargeType){
        data.rechargeType = this.form.rechargeType;
      }
      if(this.form.purchaseMode){
        data.purchaseMode = this.form.purchaseMode;
      }
      if(this.form.reviewStatus){
        data.reviewStatus = this.form.reviewStatus;
      }
      core.downloadRechargeApplyList(data).then(res => {
        //console.log(res)
        if(res.code){ //错误提示
          this.$message.closeAll();
          this.$message.info(res.message);
        }else{
          const blob = new Blob([res],{type: 'application/vnd.ms-excel'});
          const fileName = '充值申请导出列表.xls';
          const linkNode = document.createElement('a');

          linkNode.download = fileName; //a标签的download属性规定下载文件的名称
          linkNode.style.display = 'none';
          linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
          document.body.appendChild(linkNode);
          linkNode.click();  //模拟在按钮上的一次鼠标单击

          URL.revokeObjectURL(linkNode.href); // 释放URL 对象
          document.body.removeChild(linkNode);
        }
      })
    }
  }
}

</script>
<style lang='less' scope>
.user-management{
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
  .el-input--suffix .el-input__inner{
    padding-right: 10px;
  }
}

</style>
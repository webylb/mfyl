<template>
  <div class="invoice-management">
    <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="80px">
      <el-form-item label="创建时间:">
         <el-date-picker
          v-model="form.times"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="企业名称:">
        <el-input style="width: 120px" v-model="form.companyName" clearable></el-input>
      </el-form-item>

      <el-form-item label="开户银行:">
        <el-select v-model="form.openingBank" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options.openingBankOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="邮寄状态:">
        <el-select v-model="form.deliveryStatus" clearable placeholder="请选择" style="width: 120px">
          <el-option
            v-for="item in options.deliveryStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item style='float:right;'>
        <el-button type="primary" @click="search()">立即查询</el-button>
        <el-button @click="downloadInvoiceList()">导 出</el-button>
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
          label="创建时间"
          align="center"
          width="160">
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="invoiceMoneyAmount"
          label="发票金额"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="invoiceCompanyName"
          label="企业名称"
          align="center"
          width="240">
        </el-table-column>
        <el-table-column
          prop="taxIdentificationNumber"
          label="纳税识别号"
          align="center"
          min-width="100"
          >
        </el-table-column>
        <el-table-column
          prop="invoiceCompanyAddress"
          label="地址"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="phoneNumber"
          label="电话号码"
          align="center"
          min-width="120"
          >
        </el-table-column>
        <el-table-column
          prop="bankOpeningBank"
          label="开户银行"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="receiverName"
          label="收票人"
          align="center"
          min-width="100"
          >
        </el-table-column>
        <el-table-column
          prop="deliveryPhoneNumber"
          label="邮寄电话"
          align="center"
          min-width="120"
          >
        </el-table-column>
        <el-table-column
          prop="deliveryAddress"
          label="邮寄地址"
          align="center"
          width="240">
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.deliveryStatus == 'WAIT'">待邮寄</span>
            <span v-else>已邮寄</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          min-width="120"
          >
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row,1,scope.$index)" type="primary" size="small" v-if="scope.row.deliveryStatus  == 'WAIT'">立即邮寄</el-button>
            <el-button @click="handleClick(scope.row,2,scope.$index)" type="text" size="small" v-else>查看物流</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="pageTotal>10" class="pagination-box">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10,20, 30, 40, 50]"
          :page-size="10"
          layout="sizes, prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </div>
    </div>

    <el-dialog
      title="发票邮寄"
      :visible.sync="dialogVisible"
      width="422px"
      @close="dialogClose()" center>
      <el-form ref="dialogform" :model="dialogInfoForm" label-width="80px" v-if="hintStatus == 1">
        <el-form-item label="快递公司:">
          <el-select v-model="dialogInfoForm.expressCompany" filterable clearable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in options.expressCompanyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号:">
          <el-input v-model="dialogInfoForm.logisticsNumber" placeholder="" clearable></el-input>
        </el-form-item>
      </el-form>
      <el-form ref="dialogform" :model="dialogInfoForm" label-width="80px" v-else>
        <el-form-item label="快递公司:">
          {{ expressCompany || '--' }}
        </el-form-item>
        <el-form-item label="物流单号:">
          {{ logisticsNumber || '--' }}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div v-if="hintStatus == 1">
          <el-button @click="dialogVisible = false">取  消</el-button>
          <el-button type="primary" @click="submitForm()">确  定</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click="dialogVisible = false">确  定</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as core from '../../api/invoice'
import tool from '../../utils/common'

export default {
  name: 'invoiceManagement',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() - 3600 * 1000 * 24 * 1 > Date.now();
        }
      },
      loading: true,
      dialogVisible: false,
      form: {
        times: null,
        companyName: null,
        openingBank: null,
        deliveryStatus: null,
      },
      dialogInfoForm:{
        expressCompany: '',
        logisticsNumber: ''
      },
      hintStatus: 1,//1为待邮寄 2为已邮寄
      editIndex: null,
      editId: null,
      options:{
        openingBankOptions:[
          {
            value: '杭州银行',
            label: '杭州银行'
          }
        ],
        deliveryStatusOptions: [
          {
            value: 'WAIT',
            label: '待邮寄'
          },
          {
            value: 'SUCCESS',
            label: '已邮寄'
          }
        ],
        expressCompanyOptions: []
      },
      pageSize: 10,
      currentPage: 1,
      pageTotal: 0,
      tableData: [],
      expressCompany: '',
      logisticsNumber: ''
    }
  },
  created(){
    this.getInvoiceList({currentPage: this.currentPage,pageSize: this.pageSize})
    this.getExpressList()
  },
  methods: {
    getInvoiceList(opts){
      core.getInvoiceList(opts).then(res => {
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
    search(opts){
      this.loading = true
      let data = null
      if(opts){
        data = opts
      }else{
        this.currentPage = 1
        data = {currentPage: 1, pageSize: this.pageSize}
      }
      if(this.form.times){
        data.startTime = this.form.times[0]
        data.endTime = this.form.times[1]
      }
      if(this.form.companyName){
        data.companyName = this.form.companyName;
      }
      if(this.form.openingBank){
        data.openingBank = this.form.openingBank;
      }
      if(this.form.deliveryStatus){
        data.deliveryStatus = this.form.deliveryStatus;
      }
      this.getInvoiceList(data)
    },
    handleClick(row,status,index) {
      this.dialogVisible = true
      this.hintStatus = status
      this.editIndex = index
      this.editId = row.id

      this.expressCompany = row.expressCompany
      this.logisticsNumber = row.logisticsNumber
    },
    dialogClose(){
      this.dialogVisible = false
    },
    submitForm() {
      const data = {}
      if(!this.dialogInfoForm.expressCompany){
        this.$message.closeAll();
        this.$message.warning('请选择快递公司');
        return false
      }
      data.expressCompany = this.dialogInfoForm.expressCompany
      if(!this.dialogInfoForm.logisticsNumber){
        this.$message.closeAll();
        this.$message.warning('请填写物流单号');
        return false
      }
      data.logisticsNumber = this.dialogInfoForm.logisticsNumber
      data.invoiceDetailId = this.editId
      core.changeInvoiceSendStatus(data).then(res => {
        //console.log(res)
        if(res.code && res.code == '00'){
          this.$message.success("操作成功");
          this.dialogVisible = false
          this.tableData[this.editIndex].deliveryStatus = "SUCCESS"
          this.tableData[this.editIndex].expressCompany = data.expressCompany
          this.tableData[this.editIndex].logisticsNumber = data.logisticsNumber
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    downloadInvoiceList(){
      let data = { }
      if(this.form.startTime){
        data.startTime = Number(this.form.startTime);
      }
      if(this.form.companyName){
        data.companyName = this.form.companyName;
      }
      if(this.form.openingBank){
        data.openingBank = this.form.openingBank;
      }
      if(this.form.deliveryStatus){
        data.deliveryStatus = this.form.deliveryStatus;
      }
      core.downloadInvoiceList(data).then(res => {
        //console.log(res)
        if(res.code){ //错误提示
          this.$message.closeAll();
          this.$message.info(res.message);
        }else{
          const blob = new Blob([res],{type: 'application/vnd.ms-excel'});
          const fileName = '发票导出列表.xls';
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
    },
    getExpressList(){
      core.getExpressList().then(res => {
        // console.log(res)
        if(res.code && res.code === '00'){ //错误提示
          let arr = []
          res.data.forEach((item, index) => {
            arr[index] = {}
            arr[index].label = item.com
            arr[index].value = item.no
          })
          this.options.expressCompanyOptions = arr
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      })
    }
  }
}

</script>
<style lang='less' scope>
.invoice-management{
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
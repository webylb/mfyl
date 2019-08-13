<template>
  <div class="pwd-purchase">
    <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="80px">
      <el-form-item label="时间" class="form-date">
         <el-date-picker style="width: 140px" clearable
            v-model="form.startTime"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
            :picker-options="pickerOptions">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="卡密类型">
        <el-select v-model="form.isVirtual" clearable placeholder="请选择" style="width: 140px">
          <el-option
            v-for="item in options.isVirtualOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发货状态">
        <el-select v-model="form.orderStatus" clearable placeholder="请选择" style="width: 140px">
          <el-option
            v-for="item in options.orderStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float:right;">
        <el-button type="primary" @click="search">立即查询</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="24">
        <el-button type="primary" @click="goPwdDetail">卡密采购</el-button>
      </el-col>
    </el-row>
    <div class="page-content">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          type="index"
          label="序号"
          width="50"
          align="center"
          >
        </el-table-column>
        <el-table-column
          label="创建时间"
          align='center'
         >
         <template slot-scope="scope">
            <span v-if="scope.row.createTime">{{ formatDate(scope.row.createTime) }}</span>
            <span v-else>0*0</span>
          </template>
        </el-table-column>
        <el-table-column
          label="采购信息(面值*数量)"
          align='center'
         >
          <template slot-scope="scope">
            <div v-if="scope.row.orderDetails"> 
              <span v-for="(item,index) in scope.row.orderDetails" :key="index" style="display:block;">{{item.camFaceValue}} * {{item.buyAmount}}</span>
            </div>
            <!-- <span v-if="scope.row.orderDetails.length > 0">{{scope.row.orderDetails[0].camFaceValue}} * {{scope.row.orderDetails[0].buyAmount}}</span> -->
            <span v-else>0*0</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderPrice"
          label="实付金额(元)"
          align='center'
         >
        </el-table-column>
        <el-table-column
          label="卡密类型"
          align='center'
         >
          <template slot-scope="scope">
            <span v-if="scope.row.camType == 'VirtualCard'">电子卡</span>
            <span v-else>实体卡</span>
          </template>
        </el-table-column>
        <el-table-column
          label="地址"
          align='center'
         >
          <template slot-scope="scope">
            <span v-if="scope.row.receiveCamEmail">{{ scope.row.receiveCamEmail }}</span>
            <span v-else>{{ scope.row.deliveryAddress }}</span>
          </template>
        </el-table-column>
        
        <el-table-column
          fixed="right"
          label="发货状态"
          align='center'
          width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.orderStatus == 'WAIT'">待发货</span>
            <el-button @click="showLogistics(scope.row.expressCompany,scope.row.logisticsNumber)" type="text" size="small" v-else-if="scope.row.orderStatus == 'SUCCESS' && scope.row.camType == 'PhysicalCard'">查看物流</el-button>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="pageTotal>10" class="pagination-box">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="10"
          layout="sizes, prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </div>
    </div>

    <el-dialog
      title="物流信息"
      :visible.sync="dialogInfoVisible"
      width="420px"
      :before-close="dialogClose"
      center>
      <el-form ref="dialogform" :model="dialogInfoForm" label-width="100px">
        <el-form-item label="快递公司:">
          <span>{{ dialogInfoForm.name }}</span>
        </el-form-item>
        <el-form-item label="物流单号:">
          <span>{{ dialogInfoForm.num }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogInfoVisible = false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as core from '../../api/benefit-cam'
import tool from '../../utils/common'

export default {
  name: 'pwdPurchase',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      loading: true,
      form: {
        startTime: null,
        isVirtual: '',
        orderStatus: ''
      },
      dialogInfoForm: {
        name: '',
        num: ''
      },
      dialogInfoVisible: false,
      options: {
        isVirtualOptions:[
          {
            value: 'Y',
            label: '电子卡密'
          },
          {
            value: 'N',
            label: '实物卡密'
          }
        ],
        orderStatusOptions:[
          {
            value: 'WAIT',
            label: '待发货'
          },
          {
            value: 'SUCCESS',
            label: '已发货'
          }
        ]
      },
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      tableData: []
    }
  },
  created(){
    this.getCamOrderList({currentPage:this.currentPage, pageSize:this.pageSize})
  },
  methods: {
    getCamOrderList(opts){
      core.getCamOrderList(opts).then(res => {
        if(res.code && res.code === "00"){
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
    search(){
      this.loading = true
      let data = { currentPage:1, pageSize:this.pageSize }
      if(this.form.startTime){
        data.startTime = this.form.startTime
      }
      if(this.form.isVirtual){
        data.isVirtual = this.form.isVirtual
      }
      if(this.form.orderStatus){
        data.orderStatus = this.form.orderStatus
      }
      this.getCamOrderList(data)
      
    },
    handleClick(row) {
      this.$router.push("/grant-record/grant-detail")
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.loading = true
      let data = { currentPage:1, pageSize:val }
      if(this.form.startTime){
        data.startTime = this.form.startTime
      }
      if(this.form.isVirtual){
        data.isVirtual = this.form.isVirtual
      }
      if(this.form.orderStatus){
        data.orderStatus = this.form.orderStatus
      }
      this.getCamOrderList(data)
    },
    handleCurrentChange(val) {
      this.currentPage = val,
      this.loading = true
      let data = { currentPage:val, pageSize:this.pageSize }
      if(this.form.startTime){
        data.startTime = this.form.startTime
      }
      if(this.form.isVirtual){
        data.isVirtual = this.form.isVirtual
      }
      if(this.form.orderStatus){
        data.orderStatus = this.form.orderStatus
      }
      this.getCamOrderList(data)
    },
    dialogClose(){
      this.dialogInfoVisible = false
    },
    showLogistics(name,num){
      this.dialogInfoVisible = true
      this.dialogInfoForm.name = name
      this.dialogInfoForm.num = num
    },
    goPwdDetail(){
      this.$router.push("/pwd-purchase/immediately-purchase")
    }
  },
  watch: {
    dialogVisible(newVal){
      if(!newVal){
        this.$refs['dialogForm'].resetFields()
      }
    }
  },
}

</script>
<style lang='less'>
.pwd-purchase {
  .form-date {
    .el-form-item__label {
      width: 50px!important;
    }
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
}

</style>
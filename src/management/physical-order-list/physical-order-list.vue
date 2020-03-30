<template>
  <div class="physical-order-list">
    <!-- <div class="physical-order-list-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>卡密管理</el-breadcrumb-item>
        <el-breadcrumb-item>采购申请</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="80px">
      <el-form-item label="订单号:">
        <el-input v-model="form.orderId" clearable placeholder="" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item label="用户ID:">
        <el-input v-model="form.userId" clearable placeholder="" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item label="订单状态:">
        <el-select v-model="form.orderStatus" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options.orderStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期:">
        <el-date-picker
          v-model="form.times"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>

      <el-form-item style='float:right;'>
        <el-button type="primary" @click="search()">立即查询</el-button>
        <el-button @click="downloadOrderList()">导  出</el-button>
      </el-form-item>
    </el-form>
    <div class="page-content">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%;border:1px solid #EBEEF5;"
        v-loading="loading">
        <el-table-column
          label="序号"
          type="index"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="date"
          label="下单时间"
          align="center"
          min-width="120"
          >
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="订单号"
          align="center"
          min-width="120"
         >
        </el-table-column>
        <el-table-column
          prop="userId"
          label="用户ID"
          align="center"
         >
        </el-table-column>

        <el-table-column
          label="订单状态"
          align="center"
         >
          <template slot-scope="scope">
            <span v-if="scope.row.payStatus == 'WAIT'">待付款</span>
            <div v-else-if="scope.row.payStatus == 'SUCCESS'">
              <span v-if="scope.row.shipStatus == 'WAIT'">待发货</span>
              <div v-else>
                <span v-if="scope.row.confirmReceiptStatus == 'WAIT'">待收货</span>
                <div v-else>
                  <span>已完成</span>
                </div>
              </div>
            </div>
            <div v-else>
              已关闭
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="订单详情"
          align="center"
         >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="orderDetail(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="120"
          align="center"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.payStatus == 'WAIT'">--</span>
            <div v-else-if="scope.row.payStatus == 'SUCCESS'">
              <span v-if="scope.row.shipStatus == 'WAIT'">
                <el-button @click="editLogistics(scope.row,1,scope.$index)" type="text" size="small">发货</el-button>
              </span>
              <div v-else>
                <span>
                  <el-button @click="editLogistics(scope.row,2,scope.$index)" type="text" size="small">查看物流</el-button>
                </span>
              </div>
            </div>
            <span v-else>--</span>
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
          :page-size="pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </div>
    </div>

    <el-dialog
      :title="title"
      :visible.sync="dialogInfoVisible"
      width="420px"
      @close="dialogClose"
      center>
      <el-form v-if="sendStatus == 1" ref="dialogform" :model="dialogInfoForm" label-width="100px">
        <el-form-item label="快递公司:">
          <el-select v-model="dialogInfoForm.expressCompanyNumber" filterable clearable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in options.expressCompanyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号:">
          <el-input v-model="dialogInfoForm.expressOrderId" clearable placeholder="" ></el-input>
        </el-form-item>
      </el-form>
      <el-form v-else label-width="100px">
        <el-form-item label="快递公司:">
          {{ editExpressCompany }}
        </el-form-item>
        <el-form-item label="物流单号:">
          {{ editExpressOrderId }}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="subLogisticsInfo">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="dialogHintVisible"
      width="400px"
      @close="dialogClose"
      center>
      <div style="margin:20px auto;text-align:center;font-size;16px;">
        {{ hintText }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogHintVisible = false">取 消</el-button>
        <el-button type="primary" @click="subHintInfo">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as core from '../../api/order'
import * as merchantCore from '../../api/merchant'
import tool from '../../utils/common'

export default {
  name: 'physicalOrderList',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() - 3600 * 1000 * 24 * 1 > Date.now();
        },
        // shortcuts: [{
        //   text: '最近一周',
        //   onClick(picker) {
        //     const end = new Date();
        //     const start = new Date();
        //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        //     picker.$emit('pick', [start, end]);
        //   }
        // }, {
        //   text: '最近一个月',
        //   onClick(picker) {
        //     const end = new Date();
        //     const start = new Date();
        //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        //     picker.$emit('pick', [start, end]);
        //   }
        // }, {
        //   text: '最近三个月',
        //   onClick(picker) {
        //     const end = new Date();
        //     const start = new Date();
        //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        //     picker.$emit('pick', [start, end]);
        //   }
        // }]
      },
      loading: true,
      sendStatus: '1',//1 发货, 2.查看物流, 3.退款, 4.补发
      editId: null,
      editIndex: null,
      title: '退款提示',
      hintText: '操作退款后，该笔订单支付的积分将原路返回到支付账户，请问您确定要退款吗？',
      dialogInfoForm: {
        expressCompany: '',
        expressCompanyNumber: '',
        expressOrderId: ''
      },
      dialogHintVisible: false,
      dialogInfoVisible: false,
      form: {
        orderId: '',
        userId: '',
        orderStatus: null,
        times: ''
      },
      value: [],
      options:{
        orderStatusOptions:[
          {
            value: 'All',
            label: '所有订单'
          },
          {
            value: 'UnShipped',
            label: '待发货'
          },
          {
            value: 'Shipped',
            label: '待收货'
          },
          {
            value: 'Completed',
            label: '已完成'
          },
          {
            value: 'Closed',
            label: '已关闭'
          }
        ],
        expressCompanyOptions: []
      },
      pageSize: 10,
      currentPage: 1,
      pageTotal: 0,
      tableData: [],
      editExpressOrderId: null,
      editExpressCompanyNumber: null,
      editExpressCompany: null
    }
  },
  created(){
    // this.getUserOrderList({pageSize: this.pageSize,currentPage: this.currentPage,orderStatus: 'All'})
  },
  activated() {
    let data = {currentPage:this.currentPage, pageSize:this.pageSize, orderStatus: 'All'}
    if(this.form.userId){
      data.userId = this.form.userId
    }
    if(this.form.orderId){
      data.orderId = this.form.orderId
    }
    if(this.form.orderStatus){
      data.orderStatus = this.form.orderStatus
    }
    this.getUserOrderList(data)
    setTimeout(()=>{
      document.getElementsByClassName('router-container')[0].scrollIntoView({
        // behavior: 'smooth',    //平滑滚动，爽，其他还有 instant
        block: 'start'  //元素到页面顶部，其他还有 end, center
      })
    },200)
    this.getExpressList()
  },
  methods: {
    getUserOrderList(opts){
      core.getUserOrderList(opts).then(res => {
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
      let data = { currentPage:1, pageSize:val }
      this.search(data)
    },
    handleCurrentChange(val) {
      this.currentPage = val,
      this.loading = true
      let data = { currentPage:val, pageSize:this.pageSize }
      this.search(data)
    },
    search(opts){
      this.loading = true
      let data = null
      if(opts){
        data = opts
      }else{
        this.currentPage = 1
        data = { currentPage:1, pageSize:this.pageSize }
      }
      if(this.form.userId){
        data.userId = this.form.userId
      }
      if(this.form.orderId){
        data.orderId = this.form.orderId
      }
      if(this.form.orderStatus){
        data.orderStatus = this.form.orderStatus
      }
      if(this.form.times){
        data.startTime = this.form.times[0]
        data.endTime = this.form.times[1]
      }
      this.getUserOrderList(data)
    },
    dialogClose(){
      this.dialogHintVisible = false
      this.dialogInfoVisible = false
      this.dialogInfoForm.expressCompany = null
      this.dialogInfoForm.expressCompanyNumber = null
      this.dialogInfoForm.expressOrderId = null
    },
    editLogistics(row, status, index){
      this.dialogInfoVisible = true
      this.sendStatus = 1
      this.editId = row.id
      this.editIndex = index
      if(status == 1){
        this.title = '发货'
      }else{
        this.title = '查看物流'
        this.dialogInfoForm.expressCompany = row.expressCompany
        this.dialogInfoForm.expressCompanyNumber = row.expressCompanyNumber
        this.dialogInfoForm.expressOrderId = row.expressOrderId
        // this.editExpressCompany = row.expressCompany
        // this.editExpressCompanyNumber = row.expressCompanyNumber
        // this.editExpressOrderId = row.expressOrderId
      }
    },
    subLogisticsInfo(){
      if(this.sendStatus == 1){
        //console.log("提交物流信息")
        const data = {
          orderId: this.editId
        }
        if(!this.dialogInfoForm.expressCompanyNumber){
          this.$message.closeAll();
          this.$message.info('请选择快递公司');
          return false
        }
        data.expressCompanyNumber = this.dialogInfoForm.expressCompanyNumber
        this.options.expressCompanyOptions.forEach((item,index) => {
          if(item.value == this.dialogInfoForm.expressCompanyNumber){
             data.expressCompany = item.label
          }
        })
        if(!this.dialogInfoForm.expressOrderId){
          this.$message.closeAll();
          this.$message.info('请填写快递单号');
          return false
        }
        data.expressOrderId =  this.dialogInfoForm.expressOrderId
        core.sendUserOrder(data).then(res => {
          //console.log(res)
          if(res.code && res.code == '00'){
            this.tableData[this.editIndex].expressCompany = data.expressCompany
            this.tableData[this.editIndex].expressCompanyNumber = data.expressCompanyNumber
            this.tableData[this.editIndex].expressOrderId = data.expressOrderId
            this.tableData[this.editIndex].shipStatus = 'SUCCESS'
            this.$message.closeAll();
            this.$message.success("操作成功");
            this.dialogInfoVisible = false
          }else{
            this.$message.closeAll();
            this.$message.info(res.message);
          }
        }).catch(err => {
          this.$message.closeAll();
          this.$message.info(err);
        })

      }else{
        //console.log("查看物流信息")
        const data = {
          orderId: this.editId
        }
        if(!this.dialogInfoForm.expressCompanyNumber){
          this.$message.closeAll();
          this.$message.info('请选择快递公司');
          return false
        }
        data.expressCompanyNumber = this.dialogInfoForm.expressCompanyNumber
        this.options.expressCompanyOptions.forEach((item,index) => {
          if(item.value == this.dialogInfoForm.expressCompanyNumber){
             data.expressCompany = item.label
          }
        })
        if(!this.dialogInfoForm.expressOrderId){
          this.$message.closeAll();
          this.$message.info('请填写快递单号');
          return false
        }
        data.expressOrderId =  this.dialogInfoForm.expressOrderId
        core.changeOrderDelivery(data).then(res => {
          //console.log(res)
          if(res.code && res.code == '00'){
            this.tableData[this.editIndex].expressCompany = data.expressCompany
            this.tableData[this.editIndex].expressCompanyNumber = data.expressCompanyNumber
            this.tableData[this.editIndex].expressOrderId = data.expressOrderId
            this.tableData[this.editIndex].shipStatus = 'SUCCESS'
            this.$message.closeAll();
            this.$message.success("操作成功");
            this.dialogInfoVisible = false
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
    refund(row){
      this.dialogHintVisible = true
      this.title = '退款提示'
      this.hintText = '操作退款后，该笔订单支付的积分将原路返回到支付账户，请问您确定要退款吗？'
    },
    subHintInfo(){
      console.log("退款")
    },
    orderDetail(id){
      this.$router.push({path:'/physical-order-list/order-detail',query:{id: id}})
    },
    downloadOrderList(){
      let data = { }
      if(this.form.userId){
        data.userId = this.form.userId
      }
      if(this.form.orderId){
        data.orderId = this.form.orderId
      }
      if(this.form.orderStatus){
        data.orderStatus = this.form.orderStatus
      }
      if(this.form.times){
        data.startTime = this.form.times[0]
        data.endTime = this.form.times[1]
      }
      core.downloadOrderList(data).then(res => {
        //console.log(res)
        if(res.code){ //错误提示
          this.$message.closeAll();
          this.$message.info(res.message);
        }else{
          const blob = new Blob([res],{type: 'application/vnd.ms-excel'});
          const fileName = '订单导出列表.xls';
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
.physical-order-list {

   .physical-order-list-title {
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
    margin-bottom: 15px;
  }
  .el-checkbox {
    line-height: 25Px;
    display: block;
  }
}

</style>
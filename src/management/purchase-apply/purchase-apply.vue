<template>
  <div class="purchase-apply">
    <div class="purchase-apply-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>卡密管理</el-breadcrumb-item>
        <el-breadcrumb-item>采购申请</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="80px">
      <el-form-item label="创建时间:" class="form-date">
         <el-date-picker
          v-model="form.times"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="卡密类型:">
        <el-select v-model="form.isVirtual" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options.isVirtualOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发货状态:">
        <el-select v-model="form.orderStatus" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options.orderStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商户名称:">
        <!-- <el-input style="width: 120px" v-model="form.merchantName" placeholder="请输入" clearable></el-input> -->
        <el-autocomplete
          class="inline-input"
          style="width: 180px"
          v-model="form.merchantName"
          :fetch-suggestions="querySearch"
          placeholder="请输入商户名称"
          :trigger-on-focus="false"
          @select="handleSelect"
          clearable
        ></el-autocomplete>
      </el-form-item>

      <el-form-item style='float:right;'>
        <el-button type="primary" @click="search()">立即查询</el-button>
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
          width="140"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.createTime" style="font-size:12px;">{{ formatDate(scope.row.createTime) }}</span>
            <span v-else>0*0</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="merchantCompanyName"
          label="商户名称"
          align="center"
          width="200">
        </el-table-column>
        <el-table-column
          label="卡密类型"
          align="center"
         >
          <template slot-scope="scope">
            <span v-if="scope.row.camType == 'VirtualCard'">电子卡</span>
            <span v-else>实体卡</span>
          </template>
        </el-table-column>
        <el-table-column
          label="采购信息（面值X数量）"
          align="center"
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
          label="地址"
          align="center"
         >
          <template slot-scope="scope">
            <span v-if="scope.row.receiveCamEmail">{{ scope.row.receiveCamEmail }}</span>
            <span v-else>{{ scope.row.deliveryAddress }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="生成卡密"
          align="center"
         >
          <template slot-scope="scope">
            <el-button @click="createdCam(scope.row.id,scope.row.camType,scope.$index)" type="text" size="small" v-if="scope.row.isGenerateCam == 'N'">立即生成</el-button>
            <el-button @click="dowloadCam(scope.row.id)" type="text" size="small" v-else>下载</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="发货状态"
          align="center"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.orderStatus == 'WAIT'">待发货</span>
            <span v-else>已发货</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          >
          <template slot-scope="scope">
            <el-button @click="immediateDelivery(scope.row.id,scope.row.camType,scope.$index)" type="primary" size="small" v-if="scope.row.orderStatus == 'WAIT'">立即发货</el-button>
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
          :current-page.sync="currentPage"
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
      <el-form ref="dialogform" :model="dialogInfoForm" label-width="100px" v-if="!showLogisticsPop">
        <el-form-item label="快递公司:">
          <el-select v-model="dialogInfoForm.name" filterable clearable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in options.logisticalOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号:">
          <el-input v-model="dialogInfoForm.num" clearable placeholder="" ></el-input>
        </el-form-item>
      </el-form>
      <el-form ref="dialogform" :model="dialogInfoForm" label-width="100px" v-else>
        <el-form-item label="快递公司:">
          <span>{{ dialogInfoForm.name}}</span>
        </el-form-item>
        <el-form-item label="物流单号:">
          <span>{{ dialogInfoForm.num}}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="subLogisticsInfo" v-if="!showLogisticsPop">确认</el-button>
        <el-button type="primary" @click="dialogInfoVisible = false" v-else>确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="dialogHintVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <div style="margin:20px auto;text-align:center;font-size;16px;">
        {{ hintText }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="subHintInfo">{{ subText }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as core from '../../api/cam'
import * as merchantCore from '../../api/merchant'
import tool from '../../utils/common'

export default {
  name: 'purchaseApplys',
  data() {
    var validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入员工名'));
      } else {
        callback();
      }
    }
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() - 3600 * 1000 * 24 * 1 > Date.now();
        }
      },
      loading: true,
      title: '发货提示',
      hintText: '确认已邮件发送电子卡？',
      subText: '确认',
      sendEmail: false,
      options:{
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
        ],
        logisticalOptions:[

        ]
      },
      form: {
        times: null,
        isVirtual: '',
        orderStatus: '',
        merchantName: ''
      },
      isVirtual: '',
      editIndex: null,
      editId:'',
      dialogInfoForm: {
        name: '',
        num: ''
      },
      dialogInfoVisible: false,
      dialogHintVisible: false,
      showLogisticsPop: false,
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      tableData: [],
      restaurants: []
    }
  },
  created(){
    this.getCamOrderList({currentPage:this.currentPage, pageSize:this.pageSize})
    this.getExpressList()
    this.getMerchantList()
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
    search(opts){
      this.loading = true
      let data = null
      if(opts){
        data = opts
      }else{
        this.currentPage = 1
        data = { currentPage:1, pageSize:this.pageSize }
      }
      if(this.form.times){
        data.startTime = this.form.times[0]
        data.endTime = this.form.times[1]
      }
      if(this.form.isVirtual){
        data.isVirtual = this.form.isVirtual;
      }
      if(this.form.orderStatus){
        data.orderStatus = this.form.orderStatus;
      }
      if(this.form.merchantName){
        data.merchantCompanyName = this.form.merchantName;
      }
      this.getCamOrderList(data)
    },
    handleSizeChange(val) {
      this.pageSize = val
      let data = {
        currentPage:1,
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
    createdCam(id,camType,index){
      this.editIndex = index
      this.editId = id
      if(camType == 'VirtualCard'){
        this.isVirtual = 'Y'
      }else{
        this.isVirtual = 'N'
      }
      this.title = "操作提示"
      this.hintText = "确定要生成该笔卡密？"
      this.dialogHintVisible = true
    },
    immediateDelivery(id,camType,index){
      this.editIndex = index
      this.editId = id
      if(camType == 'VirtualCard'){
        this.isVirtual = 'Y'

        this.title = "发货提示"
        this.hintText = "确认已邮件发送电子卡？"
        this.dialogHintVisible = true
        this.sendEmail = true
      }else{
        this.isVirtual = 'N'
        this.dialogInfoVisible = true
        this.showLogisticsPop = false
      }

    },
    subHintInfo(){
      if(this.sendEmail){ //改变收获状态
        this.changeSendStatus({buyCamOrderId: this.editId, isVirtual: this.isVirtual})
      }else if(this.stockStatus == false){
        this.stockStatus = null
        this.$router.push('/create-pwd')
      }else{
        this.requestCreatedCam()
      }
    },
    changeSendStatus(opts){
      core.changeSendStatus(opts).then(res => {
        if(res.code && res.code === "00"){
          this.$message.success("操作成功");
          this.tableData[this.editIndex].orderStatus = 'SUCCESS'
          this.dialogHintVisible = false
          this.dialogInfoVisible = false
          this.sendEmail = false
        }else{
          this.sendEmail = false
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.sendEmail = false
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    subLogisticsInfo(){ //实体卡发货
      if(!this.dialogInfoForm.name){
        this.$message.warning("请选择快递公司")
        return false
      }
      if(!this.dialogInfoForm.num){
        this.$message.warning("请选择物流单号")
        return false
      }
      core.changeSendStatus({buyCamOrderId: this.editId, isVirtual: this.isVirtual,expressCompany: this.dialogInfoForm.name,logisticsNumber: this.dialogInfoForm.num}).then(res => {
        if(res.code && res.code === "00"){
          this.$message.success("操作成功");
          this.tableData[this.editIndex].orderStatus = 'SUCCESS'
          this.dialogInfoVisible = false
          this.dialogHintVisible = false
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    requestCreatedCam(){
      core.createOrderCam({buyCamOrderId:this.editId, isVirtual: this.isVirtual}).then(res => {
        if(res.code && res.code === "00"){
          this.$message.success('卡密生成成功！请到列表中下载')
          this.dialogHintVisible = false
          this.tableData[this.editIndex].isGenerateCam = 'Y'
        }else if(res.code == "err_cam_stock"){
          this.title = "操作提示"
          this.hintText = res.message + "，请立即增加库存"
          this.stockStatus = false
          this.subText = "立即前往"
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    dowloadCam(id){
      core.downloadOrderCam({buyCamOrderId:id}).then(res => {
        if(res.code){
          this.$message.warning(res.message);
        }else{
          const blob = new Blob([res],{type: 'application/vnd.ms-excel'});
          const fileName = '卡密列表.xls';
          const linkNode = document.createElement('a');

          linkNode.download = fileName; //a标签的download属性规定下载文件的名称
          linkNode.style.display = 'none';
          linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
          document.body.appendChild(linkNode);
          linkNode.click();  //模拟在按钮上的一次鼠标单击

          URL.revokeObjectURL(linkNode.href); // 释放URL 对象
          document.body.removeChild(linkNode);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    dialogClose(){
      this.dialogInfoVisible = false
      this.dialogHintVisible = false;
      this.subText = "确认"

      this.dialogInfoForm = {
        name: '',
        num: ''
      }
    },
    showLogistics(name,num){
      this.dialogInfoForm.name = name
      this.dialogInfoForm.num = num
      this.dialogInfoVisible = true
      this.showLogisticsPop = true
    },
    changeHint(row,status){
      if(status == 1){
        this.title = '发货提示'
        this.hintText = '确认已邮件发送电子卡？'
      }else if(status == 2){
        this.title = '操作提示'
        this.hintText = '确定要生成该笔卡密？'
      }
      this.dialogHintVisible = true
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
          this.options.logisticalOptions = arr
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      })
    },
    getMerchantList(){
      merchantCore.getMerchantList({currentPage:1, pageSize:99999}).then(res => {
        console.log(res)
        if(res.code && res.code === '00'){ //错误提示
          if(res.data.data && res.data.data.length > 0){
            let arr = []
            res.data.data.forEach((item, index) => {
              arr[index] = {}
              arr[index].label = item.companyName
              arr[index].value = item.companyName
            })
            this.restaurants = arr
          }
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      })
    },
    querySearch(queryString, cb) {
      let restaurants = this.restaurants;
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    }
  }
}

</script>
<style lang='less' scope>
.purchase-apply {

   .purchase-apply-title {
    margin:20px 0;
    width: 100%;
    font-size: 24px;
    padding-bottom: 15px;
    box-sizing: border-box;
    border-bottom: 1PX solid #EBEEF5;
  }

  .form-date {
    .el-form-item__label {
      width: 60px;
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

}

</style>
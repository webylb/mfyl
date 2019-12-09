<template>
  <div class="grant-detail">
    <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="80px">
      <el-form-item label="时间">
         <el-date-picker style="width: 140px" clearable
            v-model="form.startGrantTime"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
            :picker-options="pickerOptions">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="员工姓名">
        <el-input style="width: 140px" v-model="form.staffName" clearable></el-input>
      </el-form-item>

      <el-form-item label="工号">
        <el-input style="width: 140px" v-model="form.staffJobNumber" clearable></el-input>
      </el-form-item>

      <el-form-item label="手机号">
        <el-input style="width: 140px" v-model="form.staffMobile" clearable></el-input>
      </el-form-item>
      <el-form-item label="生日">
         <el-date-picker style="width: 140px" clearable
            v-model="form.startStaffBirthday"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
            :picker-options="pickerOptions">
          </el-date-picker>
      </el-form-item>

      <el-form-item label="入职时间">
         <el-date-picker style="width: 140px" clearable
            v-model="form.startStaffEmploymentDate"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
            :picker-options="pickerOptions">
          </el-date-picker>
      </el-form-item>

      <el-form-item label="部门">
        <el-select v-model="form.staffDepartmentName" placeholder="请选择部门" clearable style="width: 140px;">
          <el-option
            v-for="item in options.departmentsOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="职务">
        <el-select v-model="form.staffJob" placeholder="请选择职务" clearable style="width: 140px">
          <el-option
            v-for="item in options.jobsOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item style="float:right;">
          <el-button type="primary" @click="search()">立即查询</el-button>
          <el-button @click="downloadGrantRecordDetail()">导 出</el-button>
      </el-form-item>


    </el-form>
    <div class="page-content">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%;border:1px solid #EBEEF5;"
        v-loading="loading">
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="date"
          label="发放时间"
          min-width="120"
          align="center">
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.grantTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="userId"
          label="用户ID"
          align="center">
        </el-table-column>
        <el-table-column
          prop="staffName"
          label="员工姓名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="staffJobNumber"
          label="工号"
          min-width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="staffMobile"
          label="手机号"
          min-width="120"
          align="center">
        </el-table-column>
        <el-table-column
          label="生日"
          min-width="120"
          align="center">
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.staffBirthday) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="入职日期"
          align="center"
          min-width="120"
          >
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.staffEmploymentDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="staffDepartmentName"
          label="部门"
          align="center"
          min-width="120"
          >
        </el-table-column>
        <el-table-column
          prop="staffJob"
          label="职务"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="grantMoneyAmount"
          label="发放金额(元)"
          align="center"
          min-width="120"
          >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="发放状态"
          align="center"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.grantStatus == 'SUCCESS'">发放成功</span>
            <span v-else>发放中</span>
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

  </div>
</template>
<script>
import * as core from '../../api/benefit-grant'
import * as staffCore from '../../api/benefit-staff'
import tool from '../../utils/common'

export default {
  name: 'grantDetail',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      loading: true,
      form: {
        startGrantTime: null,
        staffName:'', //姓名
        staffJobNumber: '',//工号
        staffMobile:'',//手机号
        startStaffBirthday: null,//生日
        startStaffEmploymentDate: null,//入职日期
        staffDepartmentName: '',//部门名称
        staffJob: ''//职位
      },
      dialogForm: {
        name:'',
        userName:''
      },
      value: [],
      options: {
        departmentsOptions: [],
        jobsOptions: []
      },
      pageSize: 10,
      currentPage: 1,
      pageTotal: 0,
      tableData: [],
      grantScoreRecordId: ''
    }
  },
  created(){
    if(this.$route.query.id){
      this.grantScoreRecordId = this.$route.query.id
      this.getGrantRecordDetailList({pageSize: this.pageSize,currentPage: this.currentPage,grantScoreRecordId: this.grantScoreRecordId})
    }
    this.getStaffJobInfo()
  },
  methods: {
    getGrantRecordDetailList(opts){
      core.getGrantRecordDetail(opts).then(res => {
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
      return tool.formatDate(val,'YYYY-MM-DD')
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.loading = true
      let data = { currentPage:1, pageSize:val, grantScoreRecordId: this.grantScoreRecordId}
      this.search(data)
    },
    handleCurrentChange(val) {
      this.currentPage = val,
      this.loading = true
      let data = { currentPage:val, pageSize:this.pageSize, grantScoreRecordId: this.grantScoreRecordId}
      this.search(data)
    },
    search(opts){
      this.loading = true
      let data = null
      if(opts){
        data = opts
      }else{
        this.currentPage = 1
        data = { currentPage:1, pageSize:this.pageSize, grantScoreRecordId: this.grantScoreRecordId}
      }
      if(this.form.startGrantTime){
        data.startGrantTime = this.form.startGrantTime
      }
      if(this.form.staffName){
        data.staffName = this.form.staffName
      }
      if(this.form.staffJobNumber){
        data.staffJobNumber = this.form.staffJobNumber
      }
      if(this.form.staffMobile){
        data.staffMobile = this.form.staffMobile
      }
      if(this.form.startStaffBirthday){
        data.startStaffBirthday = this.form.startStaffBirthday
      }
      if(this.form.startStaffEmploymentDate){
        data.startStaffEmploymentDate = this.form.startStaffEmploymentDate
      }
      if(this.form.staffDepartmentName){
        data.staffDepartmentName = this.form.staffDepartmentName
      }
      if(this.form.staffJob){
        data.staffJob = this.form.staffJob
      }
      this.getGrantRecordDetailList(data)
    },
    downloadGrantRecordDetail(){
      let data = { grantScoreRecordId: this.grantScoreRecordId }
      if(this.form.startGrantTime){
        data.startGrantTime = this.form.startGrantTime
      }
      if(this.form.staffName){
        data.staffName = this.form.staffName
      }
      if(this.form.staffJobNumber){
        data.staffJobNumber = this.form.staffJobNumber
      }
      if(this.form.staffMobile){
        data.staffMobile = this.form.staffMobile
      }
      if(this.form.startStaffBirthday){
        data.startStaffBirthday = this.form.startStaffBirthday
      }
      if(this.form.startStaffEmploymentDate){
        data.startStaffEmploymentDate = this.form.startStaffEmploymentDate
      }
      if(this.form.staffDepartmentName){
        data.staffDepartmentName = this.form.staffDepartmentName
      }
      if(this.form.staffJob){
        data.staffJob = this.form.staffJob
      }
      core.downloadGrantRecordDetail(data).then(res => {
        //console.log(res)
        if(res.code){ //错误提示
          this.$message.closeAll();
          this.$message.info(res.message);
        }else{
          const blob = new Blob([res],{type: 'application/vnd.ms-excel'});
          const fileName = '发放明细导出列表.xls';
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
    //获取部门信息
    getStaffJobInfo(){
      staffCore.getStaffJobInfo().then(res => {
        //console.log(res)
        if(res.code && res.code == '00'){
          if(res.data.departments){
            this.options.departmentsOptions = res.data.departments
          }
          if(res.data.jobs){
            this.options.jobsOptions = res.data.jobs
          }
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    }
  }
}

</script>
<style lang='less' scope>
.grant-detail {
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
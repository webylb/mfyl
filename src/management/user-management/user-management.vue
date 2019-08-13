<template>
  <div class="user-management">
    <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="100px">
     
      <el-form-item label="用户ID:">
        <el-input style="width: 120px" v-model="form.userId" clearable></el-input>
      </el-form-item>
    
      <el-form-item label="绑定手机号:">
        <el-input style="width: 120px" v-model="form.userMobilePhone" clearable></el-input>
      </el-form-item>
    
      <el-form-item label="是否绑定公司:">
        <el-select v-model="form.isBindMerchant" clearable placeholder="请选择" style="width: 150px;margin-right:10px">
          <el-option
            v-for="item in options.isBindMerchantOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="公司:">
        <el-select v-model="form.staffCompanyName" clearable @change="getStaffJobInfo" placeholder="请选择公司" style="width: 150px;margin-right:10px">
          <el-option
            v-for="item in options.staffCompanyNameOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    
      <el-form-item label="部门:">
        <el-select v-model="form.staffDepartment" clearable @focus="getDepartments" placeholder="请选择部门" style="width: 150px;margin-right:10px">
          <el-option
            v-for="item in options.staffDepartmentOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
    
      <el-form-item label="职务:">
        <el-select v-model="form.staffJob" clearable @focus="getJobs" placeholder="请选择职务" style="width: 150px">
          <el-option
            v-for="item in options.staffJobOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="员工姓名:">
        <el-input style="width: 120px" v-model="form.staffName" clearable></el-input>
      </el-form-item>

      <el-form-item label="员工工号:">
        <el-input style="width: 120px" v-model="form.staffJobNumber" clearable></el-input>
      </el-form-item>

      <el-form-item style='float:right;'>
        <el-button type="primary" @click="search()">查 询</el-button>
          <el-button @click="downloadUserList()">导 出</el-button>
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
          label="创建时间"
          min-width="220"
          align="center">
          <template slot-scope="scope">
           {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="用户ID"
          max-width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="绑定手机号"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          label="是否绑定公司"
          width="120"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.bindMerchantId">已绑定</span>
            <span v-else>未绑定</span>
          </template>
        </el-table-column>
        <el-table-column
          label="绑定时间"
          width="200"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.staffs && scope.row.staffs.length > 0">
              <div v-for="item in scope.row.staffs" :key="item.id" style="height:35px;">
                 {{ formatDate(item.bindTime) }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="企业名称"
          min-width="200"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.staffs && scope.row.staffs.length > 0">
              <div v-for="item in scope.row.staffs" :key="item.id" style="height:35px;">
                {{ item.merchantCompanyName }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="部门"
          min-width="120"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.staffs && scope.row.staffs.length > 0">
              <div v-for="item in scope.row.staffs" :key="item.id" style="height:35px;">
                {{ item.staffDepartmentName }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="职务"
          min-width="120"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.staffs && scope.row.staffs.length > 0">
              <div v-for="item in scope.row.staffs" :key="item.id" style="height:35px;">
                {{ item.staffJob }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="员工姓名"
          min-width="120"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.staffs && scope.row.staffs.length > 0">
              <div v-for="item in scope.row.staffs" :key="item.id" style="height:35px;">
                {{ item.staffName }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="工号"
          width="120"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.staffs && scope.row.staffs.length > 0">
              <div v-for="item in scope.row.staffs" :key="item.id" style="height:35px;">
                {{ item.staffJobNumber }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="生日"
          width="200"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.staffs && scope.row.staffs.length > 0">
              <div v-for="item in scope.row.staffs" :key="item.id" style="height:35px;">
                {{ formatDate(item.staffBirthday) }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="入职日期"
          width="200"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.staffs && scope.row.staffs.length > 0">
              <div v-for="item in scope.row.staffs" :key="item.id" style="height:35px;">
                {{ formatDate(item.staffEmploymentDate) }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="in"
          label="累计充值金额"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="out"
          label="累计消耗金额"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          label="账户余额"
          min-width="120"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.balance">{{ scope.row.balance}}</span>
            <span v-else>0</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-button @click="lockUser(scope.row,1,scope.$index)" type="text" size="small" v-if="scope.row.isLock === 'N'">冻结</el-button>
            <el-button @click="lockUser(scope.row,2,scope.$index)" type="text" size="small" v-else>取消冻结</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="pageTotal > 10" class="pagination-box">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
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
import * as core from '../../api/user'
import * as merchantCore from '../../api/merchant'
import tool from '../../utils/common'

export default {
  name: 'userManagement',
  data() {
    return {
      loading: true,
      form: {
        userId: '',
        userMobilePhone: '',
        isBindMerchant: '',
        staffCompanyName: '',
        staffDepartment: '',
        staffJob: '',
        staffName: '',
        staffJobNumber: ''
      },
      options: {
        isBindMerchantOptions: [
          {
            value: 'Y',
            label: '已绑定'
          },
          {
            value: 'N',
            label: '未绑定'
          }
        ],
        staffCompanyNameOptions: [],
        staffDepartmentOptions: [],
        staffJobOptions: []
      },
      pageSize: 10,
      currentPage: 1,
      pageTotal: 0,
      tableData: []
    }
  },
  created(){
    this.getAllUserList({pageSize: this.pageSize,currentPage: this.currentPage})
    this.getMerchantList({currentPage: this.currentPage,pageSize:999})
  },
  methods: {
    getAllUserList(opts){
      core.getAllUserList(opts).then(res => {
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
    getMerchantList(opts){
      merchantCore.getMerchantList(opts).then(res => {
        if(res.code && res.code == '00'){
          //console.log(res)
          if(res.data.data.length > 0){
            let arr = []
            res.data.data.map((item,index) => {
              arr[index] = { value: item.id, label: item.companyName }    
            })
            this.options.staffCompanyNameOptions = arr
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
    getDepartments(){
      if(!this.form.staffCompanyName){
        this.$message.closeAll();
        this.$message.info("请先选择公司");
        return false
      }
    },
    getJobs(){
      if(!this.form.staffDepartment){
        this.$message.closeAll();
        this.$message.info("请先选择部门");
        return false
      }
    },
    //获取部门信息
    getStaffJobInfo(){
      this.form.staffDepartment = null
      this.form.staffJob = null
      if(!this.form.staffCompanyName){
        return false
      }
      core.getStaffJobInfo({merchantId: this.form.staffCompanyName}).then(res => {
        //console.log(res)
        if(res.code && res.code == '00'){
          if(res.data.departments){
            this.options.staffDepartmentOptions = res.data.departments
          }
          if(res.data.jobs){
            this.options.staffJobOptions = res.data.jobs
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
    search(opts){
      this.loading = true
      let data = null 
      if(opts){
        data = opts
      }else{
        data = { currentPage:1, pageSize:this.pageSize }
      }
      if(this.form.userId){
        data.userId = this.form.userId
      }
      if(this.form.userMobilePhone){
        data.userMobilePhone = this.form.userMobilePhone
      }
      if(this.form.isBindMerchant){
        data.isBindMerchant = this.form.isBindMerchant
      }
      if(this.form.staffCompanyName){
        this.options.staffCompanyNameOptions.forEach((item,index) => {
          if(item.value == this.form.staffCompanyName){
            data.staffCompanyName = item.label
          }
        })
      }
      if(this.form.staffDepartment){
        data.staffDepartment = this.form.staffDepartment
      }
      if(this.form.staffJob){
        data.staffJob = this.form.staffJob
      }
      if(this.form.staffName){
        data.staffName = this.form.staffName
      }
      if(this.form.staffJobNumber){
        data.staffJobNumber = this.form.staffJobNumber
      }
      this.getAllUserList(data)
    },
    lockUser(row,status,index) {
      //console.log(row);
      if(status == '1'){
        core.lockUser({userId: row.id}).then(res => {
          //console.log(res)
          if(res.code && res.code == '00'){
            this.$message.closeAll();
        this.$message.success("操作成功");
            this.tableData[index].isLock = 'Y'
          }else{
            this.$message.closeAll();
            this.$message.info(res.message);
          }
        }).catch(err => {
          this.$message.closeAll();
          this.$message.info(err);
        })
      }else{
        core.unlockUser({userId: row.id}).then(res => {
          //console.log(res)
          if(res.code && res.code == '00'){
            this.$message.closeAll();
        this.$message.success("操作成功");
            this.tableData[index].isLock = 'N'
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
    downloadUserList(){
      let data = { }
      if(this.form.userId){
        data.userId = this.form.userId
      }
      if(this.form.userMobilePhone){
        data.userMobilePhone = this.form.userMobilePhone
      }
      if(this.form.isBindMerchant){
        data.isBindMerchant = this.form.isBindMerchant
      }
      if(this.form.staffCompanyName){
        this.options.staffCompanyNameOptions.forEach((item,index) => {
          if(item.value == this.form.staffCompanyName){
            data.staffCompanyName = item.label
          }
        })
      }
      if(this.form.staffDepartment){
        data.staffDepartment = this.form.staffDepartment
      }
      if(this.form.staffJob){
        data.staffJob = this.form.staffJob
      }
      if(this.form.staffName){
        data.staffName = this.form.staffName
      }
      if(this.form.staffJobNumber){
        data.staffJobNumber = this.form.staffJobNumber
      }
      core.downloadUserList(data).then(res => {
        //console.log(res)
        if(res.code){ //错误提示
          this.$message.closeAll();
          this.$message.info(res.message);
        }else{
          const blob = new Blob([res],{type: 'application/vnd.ms-excel'}); 
          const fileName = '用户导出列表.xls';
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
<style lang='less'>
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
}

</style>
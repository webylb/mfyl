<template>
  <div class="grant-record">
    <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="60px">
      <el-form-item label="时间">
         <el-date-picker style="width: 150px"
            v-model="form.startGrantTime"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
            :picker-options="pickerOptions">
          </el-date-picker>
      </el-form-item>
      <el-form-item style="float:right;">
        <el-button type="primary" @click="search">立即查询</el-button>
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
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="name"
          label="创建时间"
          align="center"
         >
         <template slot-scope="scope">
            <span>{{ formatDate(scope.row.grantTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="grantTotalCount"
          label="发放人数"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="grantTotalMoneyBefore"
          label="应发(元)"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="grantTotalMoneyAfter"
          label="实发(元)"
          align="center"
         >
        </el-table-column>
        
        <el-table-column
          label="发放状态"
          align="center"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.orderStatus == 'SUCCESS'">发放成功</span>
            <span v-else>发放中</span>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看明细</el-button>
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
import tool from '../../utils/common'

export default {
  name: 'grantRecord',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      loading: true,
      form:{
        startGrantTime: ''
      },
      pageSize: 10,
      currentPage: 1,
      pageTotal: 0,
      tableData: []
    }
  },
  created(){
    this.getGrantRecordList({pageSize: this.pageSize,currentPage: this.currentPage})
  },
  methods: {
    getGrantRecordList(opts){
      core.getGrantRecord(opts).then(res => {
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
      let data = { currentPage:1, pageSize:val }
      if(this.form.startGrantTime){
        data.startGrantTime = this.form.startGrantTime
      }
      this.getGrantRecordList(data)
    },
    handleCurrentChange(val) {
      this.currentPage = val,
      this.loading = true
      let data = { currentPage:val, pageSize:this.pageSize }
      if(this.form.startGrantTime){
        data.startGrantTime = this.form.startGrantTime
      }
      this.getGrantRecordList(data)
    },
    search(){
      this.loading = true
      let data = { currentPage:1, pageSize:this.pageSize }
      if(this.form.startGrantTime){
        data.startGrantTime = this.form.startGrantTime
      }
      this.getGrantRecordList(data)
    },
    handleClick(row) {
      //console.log(row);
      this.$router.push({path:"/grant-record/grant-detail",query:{id: row.id}})
    },
    dialogClose(){
      this.dialogVisible = false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //this.$router.push('/UserManagement')
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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
.grant-record {
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
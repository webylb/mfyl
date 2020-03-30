<template>
  <div class="recharge-record">
    <!-- <div class="purchase-apply-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>卡密管理</el-breadcrumb-item>
        <el-breadcrumb-item>采购申请</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="80px">
      <el-form-item label="创建时间:">
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

      <el-form-item label="用户ID:">
        <el-input style="width: 120px" v-model="form.userId" clearable></el-input>
      </el-form-item>

      <el-form-item label="手机号:">
        <el-input style="width: 140px" v-model="form.userMobile" clearable></el-input>
      </el-form-item>

      <el-form-item label="企业名称:">
        <el-select v-model="form.merchantCompanyName" clearable placeholder="请选择" style="width: 140px;">
          <el-option
            v-for="item in options.staffCompanyNameOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="充值类型:">
        <el-select v-model="form.rechargeType" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options.rechargeTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
          >
          <template slot-scope="scope">
           {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="userId"
          label="用户ID"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="userMobile"
          label="手机号"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="merchantCompanyName"
          label="企业名称"
          align="center"
         >
        </el-table-column>
        <el-table-column
          label="充值类型"
          align="center"
         >
          <template slot-scope="scope">
            <span v-if="scope.row.rechargeType == 'MerchantGrantScore'">企业发放</span>
            <span v-else-if="scope.row.rechargeType == 'CamRecharge'">卡密兑换</span>
            <span v-else-if="scope.row.rechargeType == 'ScoreRecharge'">积分兑换</span>
            <span v-else>现金充值</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="rechargeMoneyAmount"
          label="充值金额"
          align="center"
          >
        </el-table-column>
      </el-table>

      <div v-show="pageTotal>10" class="pagination-box">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10,20, 30, 40, 50]"
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
  name: 'rechargeRecord',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() - 3600 * 1000 * 24 * 1 > Date.now();
        }
      },
      loading: true,
      title: '发货提示',
      hintText: '确认已邮件发送电子卡？',
      readonly: true,
      form: {
        userId: '',
        times: '',
        userMobile: '',
        merchantCompanyName: '',
        rechargeType: ''
      },
      options: {
        staffCompanyNameOptions: [],
        rechargeTypeOptions: [
          {
            value: 'MerchantGrantScore',
            label: '企业发放'
          },
          {
            value: 'CamRecharge',
            label: '卡密兑换'
          },
          {
            value: 'ScoreRecharge',
            label: '积分兑换'
          },
          {
            value: 'CashRecharge',
            label: '现金充值'
          }
        ]
      },
      pageSize: 10,
      currentPage: 1,
      pageTotal: 0,
      tableData: []
    }
  },
  created(){
    this.getUserRechargeRcord({pageSize: this.pageSize,currentPage: this.currentPage});
    this.getMerchantList({currentPage: this.currentPage,pageSize:999})
  },
  methods: {
    getUserRechargeRcord(opts){
      core.getUserRechargeRcord(opts).then(res => {
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
      let data = { currentPage:1, pageSize:val }
      this.search(data)
    },
    handleCurrentChange(val) {
      this.currentPage = val
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
        data = {currentPage: 1, pageSize: this.pageSize}
      }
      if(this.form.userId){
        data.userId = this.form.userId
      }
      if(this.form.userMobile){
        data.userMobile = this.form.userMobile
      }
      if(this.form.times){
        data.startTime = this.form.times[0]
        data.endTime = this.form.times[1]
      }
      if(this.form.merchantCompanyName){
        this.options.staffCompanyNameOptions.forEach((item,index) => {
          if(item.value == this.form.merchantCompanyName){
            data.merchantCompanyName = item.label
          }
        })
      }
      if(this.form.rechargeType){
        data.rechargeType = this.form.rechargeType
      }
      this.getUserRechargeRcord(data)
    },
  }
}

</script>
<style lang='less' scope>
.recharge-record {

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
<template>
  <div class="single-grant">

    <div class="bulk-option-single">
      <div class="bulk-option-single-wrap">
        <span class="bulk-option-text">选择发放对象*:</span>

        <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="80px" class="bulk-option-form">

          <el-form-item label="员工姓名">
            <el-input style="width: 120px" v-model="form.staffName" clearable></el-input>
          </el-form-item>

          <el-form-item label="工号">
            <el-input style="width: 120px" v-model="form.staffJobNumber" clearable></el-input>
          </el-form-item>

          <el-form-item label="手机号">
            <el-input style="width: 120px" v-model="form.staffMobile" clearable></el-input>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker style="width: 140px" v-model="form.startStaffBirthday" clearable
              type="date"
              placeholder="选择时间"
              value-format="timestamp"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="入职时间">
            <el-date-picker style="width: 140px" v-model="form.startStaffEmploymentDate" clearable
              type="date"
              placeholder="选择时间"
              value-format="timestamp"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="部门">
            <el-select v-model="form.staffDepartmentName" clearable placeholder="请选择部门" style="width: 120px">
              <el-option
                v-for="item in options.departmentsOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="职务">
            <el-select v-model="form.staffJob" clearable placeholder="请选择职务" style="width: 120px">
              <el-option
                v-for="item in options.jobsOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="float:right;">
            <el-button type="primary" @click="search">立即查询</el-button>
          </el-form-item>

        </el-form>
      </div>
      <div class="page-content">
        <el-table
          :data="tableData"
          max-height="400"
          stripe
          style="width: 100%;border:1px solid #EBEEF5;"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          :row-key="getRowKeys"
          ref="singleTable"
          >
          <el-table-column
            type="selection"
            :reserve-selection="true"
            width="55"
            align="center">
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column
            prop="id"
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
            align="center">
          </el-table-column>
          <el-table-column
            prop="staffMobile"
            label="手机号"
            align="center"
            min-width="120">
          </el-table-column>
          <el-table-column
            label="生日"
            align="center"
            min-width="120">
            <template slot-scope="scope">
              <span>{{ formatDate(scope.row.staffBirthday) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="入职日期"
            align="center"
            min-width="120">
            <template slot-scope="scope">
              <span>{{ formatDate(scope.row.staffEmploymentDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="merchantCompanyName"
            label="公司名"
            align="center"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop="staffDepartmentName"
            label="部门"
            align="center"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop="staffJob"
            label="职务"
            align="center"
            min-width="80">
          </el-table-column>
        </el-table>
      </div>
      <div class="bulk-option-single-wrap" style="margin-top:20px;">
        <span class="bulk-option-text">发放面值*:</span>
        <el-form ref="grantForm" :model="grantForm" :inline="true" label-position="center" label-width="80px" class="bulk-option-form">
          <el-form-item>
            <el-input style="width: 120px" v-model="grantForm.grantMoney" @input="grantMoneyInput" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-row>
        <el-col :span="24" style="text-align: center">
          <el-button type="primary" @click="saveSelection">添加到发送列表</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="bulk-content">
      <div class="bulk-tab-title">发送列表</div>
      <el-table
        :data="tableData2"
        max-height="400"
        stripe
        style="width: 100%;border:1px solid #EBEEF5;"
        v-loading="loading2">
        <el-table-column
          type="index"
          prop="date"
          label="序号"
          width="80"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="staffName"
          label="员工姓名"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="staffJobNumber"
          label="工号"
          align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="staffMobile"
          label="手机号"
          align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          label="生日"
          align="center"
          min-width="120">
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.staffBirthday) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="入职日期"
          align="center"
          min-width="120">
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.staffEmploymentDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="staffDepartmentName"
          label="部门"
          align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="staffJob"
          label="职务"
          align="center"
          min-width="80">
        </el-table-column>
        <el-table-column
          prop="grantMoney"
          label="发放金额(元)"
          align="center"
          min-width="80">
        </el-table-column>
      </el-table>
      <div class="tabs-last">
        <div>发放人数: {{ grantStaffCount }}</div>
        <div>累积消耗金额(元): {{ totalGrantMoney }}</div>
        <div>付款账户: {{ username }}</div>
      </div>
      <el-row>
        <el-col :span="24" style="text-align:center;margin-top:10px;">
          <el-button type="primary" @click="grantClick">立即发放</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 确认信息弹窗 -->
    <el-dialog
      title="确认发放信息"
      :visible.sync="dialogHintVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <div style="text-align: center;margin: 20px 0;">
        本次积分共发送{{ grantStaffCount }}人，累计需扣除{{ totalGrantMoney }}元
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogHintVisible = false">取 消</el-button>
        <el-button type="primary" @click="subSure">确认</el-button>
      </span>
    </el-dialog>
    <!-- 弹出密码框 -->
    <el-dialog
      title="支付密码"
      :visible.sync="dialogPwdVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <div>
        <div class="pwd-box">
          <el-input v-model="dialogform.payPassword" maxlength="6" type="tel" placeholder="" class="pwd-input" @input.native="inputPwd($event)"></el-input>
          <div class="fake-box">
            <input type="password" v-model="pwd1" readonly="">
            <input type="password" v-model="pwd2" readonly="">
            <input type="password" v-model="pwd3" readonly="">
            <input type="password" v-model="pwd4" readonly="">
            <input type="password" v-model="pwd5" readonly="">
            <input type="password" v-model="pwd6" readonly="">
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="subOrder">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="支付密码"
      :visible.sync="dialogPwdNoVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <div style="margin: 10px auto;text-align: center;">
        您还未设置支付密码
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="setPwd">设 置</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogPwdHintVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <div style="margin: 10px auto;text-align: center;">
        您的企业账户积余额不足，请立即进行积分充值
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="subRecharge">立即充值</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title=""
      :visible.sync="dialogPwdSuccessVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <div class="margin:20px auto;text-align:center;font-size;16px;">
        <div style="text-align:center;">
          <i class="el-icon-success" style="color: #67c23a;fontSize: 80px"></i>
        </div>
        <div style="text-align:center;margin:10px 25px;font-size:16px;">
          积分发放成功！
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import * as merchantCore from '../../../api/benefit-merchant'
import * as staffCore from '../../../api/benefit-staff'
import * as core from '../../../api/benefit-grant'
import tool from '../../../utils/common'
export default {
  name:"singleGrant",
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      loading: false,
      loading2: false,
      form: {
        staffName:'', //姓名
        staffJobNumber: '',//工号
        staffMobile:'',//手机号
        startStaffBirthday: '',//生日
        startStaffEmploymentDate:'',//入职日期
        staffDepartmentName: '',//部门名称
        staffJob: ''//职位
      },
      value: [],
      options: {
        departmentsOptions: [],
        jobsOptions: []
      },
      dialogform: {
        payPassword: ''
      },
      grantForm: {
        grantMoney: null
      },
      tableData: [],
      rows: [],
      tableData2:[],
      dialogVisible: false,
      grantStaffCount: null,//总人数
      totalGrantMoney: null,//总钱数
      accountBalance: null,
      havePayPassword: null,
      merchantId: null,
      username: null,
      dialogHintVisible: false, //支付确认
      dialogPwdNoVisible: false, //没设密码
      dialogPwdVisible: false, //密码
      dialogPwdHintVisible: false, //积分不足
      dialogPwdSuccessVisible: false, //充值成功
      pwd: '',
      pwd1: '',
      pwd2: '',
      pwd3: '',
      pwd4: '',
      pwd5: '',
      pwd6: ''
    }
  },
  created(){
    this.getStaffJobInfo()
  },
  methods:{
    ...mapMutations([
      'UPDATA_ACCOUNT_BALANCE'
    ]),
    grantMoneyInput (val) {
      let reg = /^\d{1,}$/
      if(!reg.test(val)){
        this.$message.closeAll();
        this.$message.info('请输入正整数');
        this.grantForm.grantMoney = null
        return false
      }
    },
    getMerchantDetail(){
      merchantCore.getMerchantDetail().then(res => {
        if(res.code && res.code == '00'){
          this.username = res.data.username
          this.merchantId = res.data.merchantId
          this.accountBalance = res.data.accountBalance
          this.havePayPassword = res.data.havePayPassword
          this.UPDATA_ACCOUNT_BALANCE(res.data.accountBalance || 0)
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    updateBalance(){
      merchantCore.getMerchantDetail().then(res => {
        if(res.code && res.code == '00'){
          this.UPDATA_ACCOUNT_BALANCE(res.data.accountBalance || 0)
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    getGrantInfo(opts){
      core.getGrantInfo(opts).then(res => {
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
    search(){
      this.loading = true
      let data = { currentPage:1, pageSize:999}
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
      this.getGrantInfo(data)
    },
    handleSelectionChange(val) {
      //console.log(val);
      this.rows = val;
    },
    saveSelection(){
      if(this.rows.length > 0){
        if(this.grantForm.grantMoney){
          this.loading2 = true
          this.rows.forEach((item,index) => {
            item.grantMoney = this.grantForm.grantMoney
          })
          this.addData = JSON.parse(JSON.stringify(this.rows))
          if(this.tableData2.length > 0){
            for(let j=0,length2=this.addData.length; j<length2; j++){
              for(let i=this.tableData2.length-1; i>=0; i--){
                //console.log(this.tableData2,this.addData[j])
                if(this.tableData2[i].id == this.addData[j].id){
                  this.tableData2.splice(i,1)
                  continue;
                }
              }
            }
          }
          this.tableData2 = this.tableData2.concat(this.addData)
          this.totalGrantMoney = 0
          this.tableData2.forEach((item,index) => {
            this.totalGrantMoney += Number(item.grantMoney)
          })

          this.grantStaffCount = this.tableData2.length,//总钱数
          this.getMerchantDetail()
          this.loading2 = false
        }else{
          this.$message.closeAll();
          this.$message.warning('请输入发放面值');
        }
      }else{
        this.$message.closeAll();
        this.$message.warning('请先勾选添加员工');
      }
    },
    getRowKeys(row){
      return row.id;
    },
    inputPwd(e){
      console.log(e)
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
    },
    grantClick(){
      if(this.totalGrantMoney){
        this.dialogHintVisible = true
      }else{
        this.$message.warning(`请导入员工信息`);
      }
    },
    subSure(){
      this.dialogHintVisible = false
      if(this.accountBalance > this.totalGrantMoney){//余额充足
        if(!this.havePayPassword){
          this.dialogPwdNoVisible = true
        }else{
          this.dialogPwdVisible = true
        }
      }else{//余额不足
        this.dialogPwdHintVisible = true
      }
    },
    dialogClose(){
      this.dialogHintVisible = false
      this.dialogPwdNoVisible = false
      this.dialogPwdVisible = false
      this.dialogPwdHintVisible = false
      this.dialogPwdSuccessVisible = false
      this.pwd1 = ''
      this.pwd2 = ''
      this.pwd3 = ''
      this.pwd4 = ''
      this.pwd5 = ''
      this.pwd6 = ''
      this.dialogform.payPassword = ''
    },
    setPwd(){
      this.$router.push('/account-settings')
    },
    subRecharge(){
      this.$router.push('/account-recharge/immediately-recharge')
    },
    inputPwd(event){
      console.log(event)
    },
    subOrder(){
      if(this.dialogform.payPassword.length < 1){
        this.$message.warning("请输入支付密码");
        return false;
      }
      let data = {}
      data.grantInfoList = []
      this.tableData2.forEach((item,index) => {
        data.grantInfoList[index] = {grantMoney: item.grantMoney,staffId: item.id}
      })
      data.payPassword = this.dialogform.payPassword
      core.sendToStaff(data).then(res => {
        if(res.code && res.code == '00'){
          this.pwd1 = ''
          this.pwd2 = ''
          this.pwd3 = ''
          this.pwd4 = ''
          this.pwd5 = ''
          this.pwd6 = ''
          this.dialogform.payPassword = ''

          this.dialogPwdVisible = false
          this.dialogPwdSuccessVisible = true
          let timer = null
          clearTimeout(timer)
          timer = setTimeout(res => {
            this.dialogPwdSuccessVisible = false
          },2000)
          this.updateBalance()
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
  watch:{
    'dialogform.payPassword':function(newVal){
      let arr = []
      for(let i=0,legth=newVal.length;i<legth;i++){
        arr.push(newVal[i])
      }
      //console.log(arr)
      this.pwd1 = arr[0]
      this.pwd2 = arr[1]
      this.pwd3 = arr[2]
      this.pwd4 = arr[3]
      this.pwd5 = arr[4]
      this.pwd6 = arr[5]
    }
  }
}
</script>
<style lang="less">
.single-grant {

  .bulk-option-single {
    padding: 15px 10px;
    border: 1px solid #EBEEF5;/*px*/
    border-radius: 5px;/*px*/

    .bulk-option-single-wrap{
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;

      .bulk-option-text{
        font-size: 16px;/*px*/
        display: inline-block;
        position: relative;
        padding-left: 10px;
        width: 120Px;
        height: 40Px;
        line-height: 40Px;

        &::before{
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          height: 20px;
          transform: translateY(-50%);
          width: 1px;/*px*/
          border-left: 2px solid #333;/*px*/
        }
      }

      .bulk-option-form{
        flex: 1;

        .el-input--suffix .el-input__inner {
          padding-right: inherit;
        }
      }
    }


  }
  .bulk-content {
    margin-top: 15px;

    .bulk-tab-title {
      font-size: 18px;
      margin-bottom: 10px;
      color: #8B98AB;
    }

    .tabs-last {
      width: 100%;
      height: 70px;
      border-left: 1px solid #EBEEF5;/*px*/
      border-right: 1px solid #EBEEF5;/*px*/
      border-bottom: 1px solid #EBEEF5;/*px*/
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      div {
        flex: 1;
        height: 100%;
        line-height: 70px;
        text-align: center;
        font-size: 16px;
        border-right: 1px solid #EBEEF5;/*px*/
        color: #606266;
      }
    }

  }

  .pwd-box{
      width:270Px;
      height: 45Px;
	    position: relative;
	    border: 1Px solid #e5e5e5;
	    border-radius: 3Px;
      overflow:hidden;
      margin: 0 auto;
  }

	.pwd-box .el-input {
		  width: 100%;
	    height: 45Px;
	    color: transparent;
	    position: absolute;
	    top: 0;
	    left: 0;
	    border: none;
	    font-size: 18Px;
	    opacity: 0;
	    z-index: 1;
      letter-spacing: 35Px;

      input {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
      }
  }

  .fake-box {
    width: 270px;
    display: flex;
    justify-content: flex-start;

    input{
        flex-grow: 1;
        width: 0;
        height: 45Px;
        border: none;
        border-right: 1px solid #e5e5e5;
        box-sizing: border-box;
        text-align: center;
        font-size: 30Px;
        background: #fff;
        &:nth-last-child(1){
          border:none;
        }
    }

  }

  .el-message-box {
    width: 400PX;
  }
}

</style>

<template>
  <div class="batch-grant">

    <div class="bulk-option">
      <span class="bulk-option-text">导入发放信息*:</span>
      <el-button size="small" type="primary" @click="uploadClick" style="margin-left:20px;">上传excel</el-button>
      <el-button type="text" class="bulk-text-btn" @click="importExamples">导入格式示例</el-button>
    </div>
    <div class="bulk-content">
      <div class="bulk-tab-title">发送列表</div>
      <el-table
        :data="tableData"
        max-height="400"
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
          prop="staffName"
          label="员工姓名"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="staffJobNumber"
          label="工号"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="staffMobile"
          label="手机号"
          align="center"
          >
        </el-table-column>
        <el-table-column
          label="生日"
          align="center"
          min-width="120px">
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.staffBirthday) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="入职日期"
          align="center"
          min-width="120px">
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.staffEmploymentDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="staffDepartmentName"
          label="部门"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="staffJob"
          label="职务"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="grantMoney"
          label="发放金额(元)"
          align="center"
          >
        </el-table-column>
      </el-table>
      <div class="tabs-last">
        <div>发放人数: {{ grantStaffCount }}</div>
        <div>累积消耗金额(元): {{ totalGrantMoney }}</div>
        <div>付款账户: {{ username }}</div>
      </div>
      <div v-show="pageTotal>10" class="pagination-box" style="text-align:right;">
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
      <el-row>
        <el-col :span="24" style="text-align:center;margin-top:10px;">
          <el-button type="primary" @click="grantClick">立即发放</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 上传提示框 -->
    <el-dialog
      title="操作"
      :visible.sync="dialogInfoVisible"
      width="420px"
      :before-close="dialogClose"
      center>
      <el-form ref="dialogform" :model="dialogInfoForm" >
        <el-form-item style="margin-bottom:0;text-align:center;">
          <el-upload
            ref='upload'
            class="upload-demo"
            style="text-align:center;"
            action=""
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :before-upload="beforeAvatarUpload"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :http-request="uploadFile">
            <el-button type="text">导入员工信息Excel</el-button>
          </el-upload>
          <el-link :underline="false" type="warning">*号列为必填项，请正确填写！</el-link>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subExcelInfo">立即导入</el-button>
      </span>
    </el-dialog>
    <!-- 确认信息弹窗 -->
    <el-dialog
      title="确认发放信息"
      :visible.sync="dialogHintVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <div style="text-align: center;margin: 20px 0;">
        本次共发送{{ grantStaffCount }}人，累计需扣除{{ totalGrantMoney }}元
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
          <el-input v-model="form.payPassword"  maxlength="6" type="tel" placeholder="" class="pwd-input" @input.native="inputPwd($event)"></el-input>
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
          发放成功！
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
import * as core from '../../../api/benefit-grant'
import tool from '../../../utils/common'
import { clearTimeout } from 'timers';
export default {
  name:"batchGrant",
  data(){
    return {
      loading: false,
      pageSize: 10,
      currentPage: 1,
      pageTotal: 0,
      dialogInfoVisible: false, //上传
      dialogHintVisible: false, //支付确认
      dialogPwdNoVisible: false, //没设密码
      dialogPwdVisible: false, //密码
      dialogPwdHintVisible: false, //积分不足
      dialogPwdSuccessVisible: false, //充值成功
      form: {
        payPassword: ''
      },
      dialogInfoForm: {
        excelFile: null
      },
      fileList:[],
      tableData: [],
      grantStaffCount: null,//总人数
      totalGrantMoney: null,//总钱数
      accountBalance: null,
      havePayPassword: null,
      merchantId: null,
      username: null,
      pwd1: '',
      pwd2: '',
      pwd3: '',
      pwd4: '',
      pwd5: '',
      pwd6: ''
    }
  },
  created(){

  },
  methods:{
    ...mapMutations([
      'UPDATA_ACCOUNT_BALANCE'
    ]),
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
    formatDate(val){
      return tool.formatDate(val,'YYYY-MM-DD')
    },
    handleSizeChange(val) {
      this.pageSize = val
      //this.loading = true
      //this.getGrantInfo({currentPage:this.currentPage, pageSize:val})
    },
    handleCurrentChange(val) {
      this.currentPage = val
      //this.loading = true
      //this.getGrantInfo({currentPage:val, pageSize:this.pageSize})
    },
    uploadClick(){
      this.dialogInfoVisible = true
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
      this.dialogInfoVisible = false
      this.dialogHintVisible = false
      this.dialogPwdNoVisible = false
      this.dialogPwdVisible = false
      this.dialogPwdHintVisible = false
      this.dialogPwdSuccessVisible = false
      this.fileList = []
      this.pwd1 = ''
      this.pwd2 = ''
      this.pwd3 = ''
      this.pwd4 = ''
      this.pwd5 = ''
      this.pwd6 = ''
      this.form.payPassword = ''
      this.$refs.upload.clearFiles()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请删除后继续上传`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    beforeAvatarUpload(file){
      // console.log('beforeUpload')
      // console.log(file.type)
      const isText = file.type === 'application/vnd.ms-excel'
      const isTextComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      return (isText | isTextComputer)
    },
    // 上传文件
    uploadFile (item) {
      //console.log(item)
      const fileObj = item.file
      // FormData 对象
      const form = new FormData()
      // 文件对象
      form.append('excelFile', fileObj)
      this.dialogInfoForm.excelFile = form
    },
    //导入员工
    subExcelInfo(){
      if(!this.dialogInfoForm.excelFile){
        this.$message.warning("请导入Excel文件")
        return false
      }
      const form = this.dialogInfoForm.excelFile
      this.loading = true
      core.uploadGrantInfo(form).then(res => {
        if(res.code && res.code === "00"){
          this.dialogInfoVisible = false
          this.$refs.upload.clearFiles()
          this.dialogInfoForm = {
            excelFile: null
          }
          this.$message.closeAll();
          this.$message.success("导入成功");
          this.$refs.upload.clearFiles()
          //this.pageTotal = res.data.amount
          this.tableData = res.data.grantScoreInfoList
          this.grantStaffCount = res.data.grantStaffCount
          this.totalGrantMoney = res.data.totalGrantMoney
          this.getMerchantDetail()
          this.loading = false
        } else if(res.code && res.code === "90"){

          this.$confirm('部分发放员工未绑定手机号，请先绑定手机号再发放魔豆。', '提示', {
            confirmButtonText: '继续导入',
            cancelButtonText: '取消导入',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '符合发放条件的员工导入成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });

        }else{
          this.dialogInfoVisible = false
          this.$refs.upload.clearFiles()
          this.$message.closeAll();
          this.$message.warning(res.message);
          this.loading = false
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
        this.loading = false
      })
    },
    //下载模板
    importExamples(){
      core.dowloadGrantTemplate().then(res => {
        //console.log(res)
        if(res.code){ //错误提示
          this.$message.closeAll();
          this.$message.info(res.message);
        }else{
          const blob = new Blob([res],{type: 'application/vnd.ms-excel'});
          const fileName = '导入格式示例.xls';
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
    setPwd(){
      this.$router.push('/account-settings')
    },
    subRecharge(){
      this.$router.push('/account-recharge/immediately-recharge')
    },
    inputPwd(event){
      // console.log(event)
    },
    subOrder(){
      if(this.form.payPassword.length < 1){
        this.$message.warning("请输入支付密码");
        return false;
      }
      let data = {}
      data.grantInfoList = []
      this.tableData.forEach((item,index) => {
        data.grantInfoList[index] = {grantMoney: item.grantMoney,staffId: item.staffId}
      })
      data.payPassword = this.form.payPassword
      core.sendToStaff(data).then(res => {
        if(res.code && res.code == '00'){
          this.pwd1 = ''
          this.pwd2 = ''
          this.pwd3 = ''
          this.pwd4 = ''
          this.pwd5 = ''
          this.pwd6 = ''
          this.form.payPassword = ''
          this.dialogPwdVisible = false
          this.dialogPwdSuccessVisible = true
          let timer = null
          clearTimeout(timer)
          timer = setTimeout(() => {
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
  watch: {
    'form.payPassword':function(newVal){
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
  },
}
</script>
<style lang="less">
.batch-grant {

  .bulk-option {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 15px 10px;
    border: 1px solid #EBEEF5;/*px*/
    border-radius: 5px;/*px*/
    .bulk-option-text{
      font-size: 16px;
      display: inline-block;
      position: relative;
      padding-left: 10px;

      &::before{
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 1px;/*px*/
        border-left: 2px solid #333;/*px*/
      }
    }

    .el-upload {
      margin:0 20px;
    }

    .bulk-text-btn{
      span{
        border-bottom: 1px solid #409EFF;/*px*/
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
}

</style>

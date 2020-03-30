<template>
  <div class="merchant-management">
    <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="120px">

      <el-form-item label="商户名称:">
        <el-input style="width: 120px" v-model="form.merchantName" clearable></el-input>
      </el-form-item>

      <el-form-item label="与员工绑定字段:">
        <el-select v-model="form.bindStrategyCode" clearable placeholder="请选择" style="width: 145px;margin-right:10px">
          <el-option
            v-for="item in options.bindStrategyCodeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="采购模式:">
        <el-select v-model="form.purchaseMode" clearable placeholder="请选择" style="width: 120px;margin-right:10px">
          <el-option
            v-for="item in options.purchaseModeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商户状态:">
        <el-select v-model="form.isLock" clearable placeholder="请选择" style="width: 120px">
          <el-option
            v-for="item in options.isLockOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item style='float:right;'>
        <el-button type="primary" @click="search()">立即查询</el-button>
          <el-button @click="downloadMerchantList()">导 出</el-button>
      </el-form-item>

      <el-row type="flex">
        <el-col :span="24">
          <el-button type="primary" icon="el-icon-plus" @click="addMerchant()" >添加企业</el-button>
        </el-col>
      </el-row>
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
          prop="companyName"
          label="商户名称"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="username"
          label="账户"
          align="center"
           width="120">
        </el-table-column>
        <el-table-column
          prop="bandStrategyName"
          label="与员工绑定字段"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="boundStaffCount"
          label="已绑定员工数"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="purchaseMode"
          label="采购模式"
          align="center"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.purchaseMode == 'YuFuKuan'">预付款</span>
            <span v-else-if="scope.row.purchaseMode == 'HouFuKuan'">后付款</span>
            <span v-else>{{ scope.row.purchaseMode }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="zip"
          label="商城配置"
          align="center"
          >
          <template slot-scope="scope">
            <el-button @click="goSettings(scope.row.id)" type="text" size="small">配置</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="zip"
          label="开票信息"
          align="center"
          >
          <template slot-scope="scope">
            <el-button @click="goDetails(scope.row.id)" type="text" size="small">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="rechargeMoneyAmount"
          label="累计充值金额（元）"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="grantScoreMoneyAmount"
          label="累计发放金额（元）"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="accountBalance"
          label="账户余额（元）"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-button @click="changePwd(scope.row.id,scope.$index)" type="text" size="small">修改密码</el-button> <br/>
            <el-button @click="editMerchant(scope.row,scope.$index)" type="text" size="small">编辑</el-button><br/>
            <el-button @click="lockMerchant(scope.row.id,scope.$index)" v-if="scope.row.isLock == 'N'" type="text" size="small">冻结</el-button>
            <el-button @click="unlockMerchant(scope.row.id,scope.$index)" v-else type="text" size="small">取消冻结</el-button>
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
      title="添加企业信息"
      :visible.sync="dialogVisible"
      width="450px"
      @close="dialogClose()" center>
      <el-form :model="dialogForm" label-position="right" label-width="125px" :rules="rules" ref="dialogForm">
        <el-form-item label="商户名称*:" prop="companyName">
          <el-input style="width: 270px" v-model="dialogForm.companyName"
                    auto-complete="off"
                    placeholder="请输入商户名称"></el-input>
        </el-form-item>
        <el-form-item label="后台账户*:" prop="username">
          <el-input style="width: 270px" v-model="dialogForm.username"
                    auto-complete="off"
                    placeholder="请输入后台账户"></el-input>
        </el-form-item>
        <el-form-item label="后台密码*:" prop="password">
          <el-input style="width: 270px" v-model="dialogForm.password" show-password
                    auto-complete="off"
                    placeholder="请输入后台登录密码"></el-input>
        </el-form-item>
        <el-form-item label="与员工绑定依据*:" prop="bandStrategy">
          <el-select v-model="dialogForm.bandStrategy" placeholder="请选择" style="width: 270px">
            <el-option
              v-for="item in options.bindStrategyCodeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购模式*:" prop="purchaseMode">
          <el-select v-model="dialogForm.purchaseMode" placeholder="请选择" style="width: 270px">
            <el-option
              v-for="item in options.purchaseModeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取  消</el-button>
        <el-button type="primary" @click="submitForm('dialogForm')">确  认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改商户密码"
      :visible.sync="dialogVisible2"
      width="422px"
      @close="dialogClose()" center>
      <el-form :model="dialogForm2" label-position="right" label-width="120px" ref="dialogForm">
        <el-form-item label="新密码*:" prop="password">
          <el-input style="width: 270px" v-model="dialogForm2.password"
                    auto-complete="off"
                    placeholder="请输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取  消</el-button>
        <el-button type="primary" @click="submitPwd()">确  认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑企业信息"
      :visible.sync="dialogVisible3"
      width="450px"
      @close="dialogClose()" center>
      <el-form :model="dialogEditForm" label-position="right" label-width="125px" :rules="rules" ref="dialogEditForm">
        <!-- <el-form-item label="商户名称*:" prop="companyName">
          <el-input style="width: 270px" v-model="dialogEditForm.companyName"
                    auto-complete="off"
                    placeholder="请输入商户名称"></el-input>
        </el-form-item>
        <el-form-item label="后台账户*:" prop="username">
          <el-input style="width: 270px" v-model="dialogEditForm.username"
                    auto-complete="off"
                    placeholder="请输入后台账户"></el-input>
        </el-form-item> -->
        <el-form-item label="与员工绑定依据*:" prop="bandStrategy">
          <el-select v-model="dialogEditForm.bandStrategy" placeholder="请选择" style="width: 270px">
            <el-option
              v-for="item in options.bindStrategyCodeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购模式*:" prop="purchaseMode">
          <el-select v-model="dialogEditForm.purchaseMode" placeholder="请选择" style="width: 270px">
            <el-option
              v-for="item in options.purchaseModeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取  消</el-button>
        <el-button type="primary" @click="submitEdit('dialogForm')">确  认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as core from '../../api/merchant'
import tool from '../../utils/common'

export default {
  name: 'merchantManagement',
  data() {
    let validateCompanyName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入商户名称'));
      } else {
        callback();
      }
    }
    let validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入后台账户名称'));
      } else {
        callback();
      }
    }
    let validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入后台密码'));
      } else {
        callback();
      }
    }
    let validatePurchaseMode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择采购模式'));
      } else {
        callback();
      }
    }
    let validateBandStrategy = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择与员工绑定依据'));
      } else {
        callback();
      }
    }
    return {
      loading: true,
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      form: {
        merchantName: null,
        bindStrategyCode: null,
        purchaseMode: null,
        isLock: null
      },
      editForm: false,
      dialogForm: {
        companyName: null,
        username: null,
        password: null,
        purchaseMode: null,
        bandStrategy: null
      },
      dialogForm2: {
        password: null
      },
      dialogEditForm: {
        userName: null,
        purchaseMode: null,
        bandStrategy: null
      },
      rules: {
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        companyName: [
          { validator: validateCompanyName, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        purchaseMode: [
          { validator: validatePurchaseMode, trigger: 'blur' }
        ],
        bandStrategy: [
          { validator: validateBandStrategy, trigger: 'blur' }
        ]
      },
      options: {
        bindStrategyCodeOptions: [
          {
            value: 'BindForStaffName',
            label: '姓名'
          },
          {
            value: 'BindForStaffNameAndJobNumber',
            label: '姓名-工号'
          },
          {
            value: 'BindForStaffNameAndDepartment',
            label: '姓名-部门'
          },
          {
            value: 'BindForStaffNameAndDepartmentAndJob',
            label: '姓名-部门-职务'
          }
        ],
        purchaseModeOptions: [
          {
            value: 'YuFuKuan',
            label: '预付款'
          },
          {
            value: 'HouFuKuan',
            label: '后付款'
          }
        ],
        isLockOptions: [
          {
            value: 'N',
            label: '使用中'
          },
          {
            value: 'Y',
            label: '已冻结'
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
    // this.getMerchantList({currentPage: this.currentPage,pageSize: this.pageSize})
  },
  activated() {
    let data = {currentPage:this.currentPage, pageSize:this.pageSize}
    if(this.form.merchantName){
      data.merchantName = this.form.merchantName
    }
    if(this.form.bindStrategyCode){
      data.bindStrategyCode = this.form.bindStrategyCode
    }
    if(this.form.purchaseMode){
      data.purchaseMode = this.form.purchaseMode
    }
    if(this.form.isLock){
      data.isLock = this.form.isLock
    }
    this.getMerchantList(data)
    setTimeout(()=>{
      document.getElementsByClassName('router-container')[0].scrollIntoView({
        // behavior: 'smooth',    //平滑滚动，爽，其他还有 instant
        block: 'start'  //元素到页面顶部，其他还有 end, center
      })
    },200)
  },
  methods: {
    getMerchantList(opts){
      core.getMerchantList(opts).then(res => {
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
      let data = {
        currentPage: 1,
        pageSize: val
      }
      this.search(data)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
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
      if(this.form.merchantName){
        data.merchantName = this.form.merchantName
      }
      if(this.form.bindStrategyCode){
        data.bindStrategyCode = this.form.bindStrategyCode
      }
      if(this.form.purchaseMode){
        data.purchaseMode = this.form.purchaseMode
      }
      if(this.form.isLock){
        data.isLock = this.form.isLock
      }
      this.getMerchantList(data)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.editForm){//编辑

          }else{//添加
            this.registerMerchant(this.dialogForm)
          }
        } else {
          this.$message.warning('请补充完整信息');
          return false;
        }
      });
    },
    changePwd(id){
      this.editId = id
      this.dialogVisible2 = true
    },
    submitPwd() {
      if(this.dialogForm2.password && this.dialogForm2.password.length > 5) {
        this.changeMerchantPassword({merchantId: this.editId, newPasswd: this.dialogForm2.password})
      }else{
        this.$message.closeAll();
        this.$message.info('密码长度最小为6位');
      }
    },
    registerMerchant(opts){
      core.registerMerchant(opts).then(res => {
        if(res.code && res.code == '00'){
          this.dialogVisible = false
          this.$message.success("操作成功");
          this.getMerchantList({currentPage: this.currentPage,pageSize: this.pageSize})
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
    addMerchant() {
      this.editForm = false
      this.dialogVisible = true
    },
    lockMerchant(id,index){
      this.editId = id
      this.editIndex = index
      core.lockMerchant({merchantId: id}).then(res => {
        if(res.code && res.code == '00'){
          this.tableData[index].isLock = 'Y'
          this.$message.closeAll();
          this.$message.success("操作成功");
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    unlockMerchant(id,index){
      this.editId = id
      this.editIndex = index
      core.unlockMerchant({merchantId: id}).then(res => {
        if(res.code && res.code == '00'){
          this.tableData[index].isLock = 'N'
          this.$message.closeAll();
          this.$message.success("操作成功");
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    editMerchant(row,index){
      this.activeId = row.id
      this.activeIndex = index
      this.dialogEditForm.userName = row.username
      this.dialogEditForm.purchaseMode = row.purchaseMode
      this.dialogEditForm.bandStrategy = row.bandStrategy
      this.dialogVisible3 = true
    },
    submitEdit(){
      this.editId = this.activeId
      this.editIndex = this.activeIndex
      let data = {}
      data.merchantId = this.editId
      data.userName = this.dialogEditForm.userName
      if(!this.dialogEditForm.bandStrategy){
        this.$message.closeAll();
        this.$message.info('请选择绑定依据');
        return false
      }
      data.bindStrategy = this.dialogEditForm.bandStrategy
      if(!this.dialogEditForm.purchaseMode){
        this.$message.closeAll();
        this.$message.info('请选择采购模式');
        return false
      }
      data.purchaseMode = this.dialogEditForm.purchaseMode
      core.editMerchant(data).then(res => {
        if(res.code && res.code == '00'){
          this.dialogVisible3 = false
          this.$message.closeAll();
          this.$message.success("操作成功");
          let opst = {
            currentPage: this.currentPage,
            pageSize: this.pageSize
          }
          this.search(opst)
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    changeMerchantPassword(opts) {
      core.changeMerchantPassword(opts).then(res => {
        if(res.code && res.code == '00'){
          this.dialogClose()
          this.$message.closeAll();
          this.$message.success("密码修改成功");
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    goSettings(id){
      this.$router.push({path:'/merchant-management/shop-settings',query:{id: id}})
    },
    goDetails(id){
      this.$router.push({path:'/merchant-management/shop-invoice',query:{id: id}})
    },
    dialogClose(){
      this.dialogVisible = false
      this.dialogVisible2 = false
      this.dialogForm2.password = null
      this.editId = null
    },
    downloadMerchantList(){
      let data = { }
      if(this.form.merchantName){
        data.merchantName = this.form.merchantName
      }
      if(this.form.bindStrategyCode){
        data.bindStrategyCode = this.form.bindStrategyCode
      }
      if(this.form.purchaseMode){
        data.purchaseMode = this.form.purchaseMode
      }
      if(this.form.isLock){
        data.isLock = this.form.isLock
      }
      core.downloadMerchantList(data).then(res => {
        //console.log(res)
        if(res.code){ //错误提示
          this.$message.closeAll();
          this.$message.info(res.message);
        }else{
          const blob = new Blob([res],{type: 'application/vnd.ms-excel'});
          const fileName = '商户导出列表.xls';
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
<style lang='less' scope>
.merchant-management {
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
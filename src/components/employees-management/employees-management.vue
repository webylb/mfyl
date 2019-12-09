<template>
  <div class="employees-management">
    <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="80px">

      <el-form-item label="员工姓名">
        <el-input style="width: 120px" v-model="form.staffName" clearable></el-input>
      </el-form-item>

      <el-form-item label="工号">
        <el-input style="width: 120px" v-model="form.staffJobNumber" clearable></el-input>
      </el-form-item>

      <el-form-item label="手机号">
        <el-input style="width: 120px" v-model="form.staffMobile" clearable></el-input>
      </el-form-item>

      <el-form-item label="部门">
        <el-select v-model="form.staffDepartmentName" clearable placeholder="请选择部门" style="width: 120px;margin-right:10px">
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

      <el-form-item style='float:right;'>
        <el-button type="primary" @click="search()">立即查询</el-button>
          <el-button @click="dowloadStaffList()">导 出</el-button>
      </el-form-item>

      <el-row type="flex">
        <el-col :span="24">
          <el-button type="primary" icon="el-icon-plus" @click="addEmployees('1')">添加员工</el-button>
          <el-button type="primary" @click="addEmployeesByExcel">批量导入</el-button>
          <el-button type="text" @click="importExamples">批量导入示例</el-button>
        </el-col>
      </el-row>
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
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          label="生日"
          width="120"
          align="center">
          <template slot-scope="scope">
            <span>{{  formatDate(scope.row.staffBirthday) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="入职日期"
          width="120"
          align="center">
          <template slot-scope="scope">
            <span>{{  formatDate(scope.row.staffEmploymentDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="merchantCompanyName"
          label="公司名"
          width="140"
          align="center">
        </el-table-column>
        <el-table-column
          prop="staffDepartmentName"
          label="部门"
          align="center">
        </el-table-column>
        <el-table-column
          prop="staffJob"
          label="职务"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          label="绑定状态"
          width="120"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isBind == 'Y'">已绑定</span>
            <span v-else>未绑定</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="bindUserId"
          label="用户ID"
          align="center">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="120"
          align="center">
          <template slot-scope="scope">
            <el-button @click="addEmployees('2',scope.row,scope.$index)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteStaffInfo(scope.row.id,scope.$index)" type="text" size="small">删除</el-button>
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
      :title="title"
      :visible.sync="dialogVisible"
      width="422px"
      @close="dialogClose()" center>
      <el-form :model="dialogForm" label-position="right" label-width="80px" :rules="rules" ref="dialogForm">
        <el-form-item label="姓名*:" prop="staffName">
          <el-input style="width: 300px" v-model="dialogForm.staffName" clearable
                    auto-complete="off"
                    placeholder="请输入员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="工号:">
          <el-input style="width: 300px" v-model="dialogForm.staffJobNumber" clearable
                    auto-complete="off"
                    placeholder="请输入工号"></el-input>
        </el-form-item>
        <el-form-item label="手机号:">
          <el-input style="width: 300px" v-model="dialogForm.staffMobile" clearable
                    auto-complete="off"
                    placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="生日*:">
          <el-date-picker style="width: 300px"
            v-model="dialogForm.staffBirthday"
            type="date"
            placeholder="请选择生日日期"
            value-format="timestamp"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入职时间*:">
          <el-date-picker style="width: 300px"
            v-model="dialogForm.staffEmploymentDate"
            type="date"
            placeholder="请选择入职时间"
            value-format="timestamp"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="部门*:">
          <!-- <el-select v-model="dialogForm.staffDepartmentName" placeholder="请选择部门" style="width: 300px">
            <el-option
              v-for="item in options.departmentsOptions"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select> -->
          <el-input style="width: 300px" v-model="dialogForm.staffDepartmentName" clearable
                    auto-complete="off"
                    placeholder="请输入部门"></el-input>
        </el-form-item>
        <el-form-item label="职务*:">
          <!-- <el-select v-model="dialogForm.staffJob" placeholder="请选择职务" style="width: 300px">
            <el-option
              v-for="item in options.jobsOptions"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select> -->
          <el-input style="width: 300px" v-model="dialogForm.staffJob" clearable
                    auto-complete="off"
                    placeholder="请选择职务"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="addStatus == '1'" type="primary" @click="submitForm('dialogForm')">立即添加</el-button>
        <el-button v-else type="primary" @click="submitForm('dialogForm')">保  存</el-button>
        <!-- <p style="color:red;">姓名为必填项!</p> -->
      </span>
    </el-dialog>
    <el-dialog
      title="操作"
      :visible.sync="dialogInfoVisible"
      width="420px"
      :before-close="dialogClose"
      center>
      <el-form ref="dialogform" :model="dialogInfoForm"  label-width="130px">
        <el-form-item label="员工信息Excel:">
          <el-upload
            ref="upload"
            class="upload-demo"
            action=""
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :before-upload="beforeAvatarUpload"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :http-request="uploadFile">
            <el-button size="small" type="text">导入员工信息</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subExcelInfo">立即导入</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import * as core from '../../api/benefit-staff'
import * as merchantCore from '../../api/benefit-merchant'
import tool from '../../utils/common'

export default {
  name: 'employeesManagement',
  props: {
    id: {// 商户id
      type: Number,
      default: 0
    }
  },
  data() {
    var validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入员工姓名'));
      } else {
        callback();
      }
    }
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      loading: true,
      title: "添加员工信息",
      dialogVisible: false, //员工信息弹窗
      dialogInfoVisible: false, //导入弹窗
      fileList:[],
      form: {
        staffName: '',
        staffJobNumber: '',
        staffMobile: '',
        staffDepartmentName: '',
        staffJob: ''
      },
      dialogForm: {
        staffName:'', //姓名
        staffJobNumber: '',//工号
        staffMobile:'',//手机号
        staffBirthday: '',//生日
        staffEmploymentDate:'',//入职日期
        staffDepartmentName: '',//部门名称
        staffJob: ''//职位
      },
      rules: {
        staffName: [
          { validator: validateUserName, trigger: 'blur' }
        ]
      },
      dialogInfoForm: {
        excelFile: null
      },
      options: {
        departmentsOptions: [],
        jobsOptions: []
      },
      pageSize: 10,
      currentPage: 1,
      pageTotal: 0,
      tableData: [],
      addStatus: '1',//1为添加,2为编辑
      editIndex: null,
      editId: null
    }
  },
  computed: {
    merchantId: {
      get(){
        return this.$store.state.merchantId
      },
      set(val){
        this.$store.state.merchantId = val
      }
    },
  },
  created(){
    this.getStaffList({pageSize: this.pageSize,currentPage: this.currentPage})
  },
  mounted(){
    this.getStaffJobInfo()
  },
  methods: {
    getStaffList(opts){
      core.getStaffList(opts).then(res => {
        //console.log(res)
        if(res.code && res.code == '00'){
          this.pageTotal = res.data.amount
          this.tableData = res.data.data
          this.loading = false
          if(res.data.data.length < 1 && this.currentPage > 1){
            this.getStaffList({pageSize: this.pageSize, currentPage: this.currentPage - 1 })
          }
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
      if(this.form.staffName){
        data.staffName = this.form.staffName
      }
      if(this.form.staffJobNumber){
        data.staffJobNumber = this.form.staffJobNumber
      }
      if(this.form.staffMobile){
        data.staffMobile = this.form.staffMobile
      }
      if(this.form.staffDepartmentName){
        data.staffDepartmentName = this.form.staffDepartmentName
      }
      if(this.form.staffJob){
        data.staffJob = this.form.staffJob
      }
      this.getStaffList(data)
    },
    dialogClose(){
      this.dialogVisible = false
      this.dialogInfoVisible = false
      this.$refs.upload.clearFiles()
      this.fileList = []
    },
    addEmployees(status,row,index){
      this.addStatus = status
      if(status == '1'){
        this.title = '添加员工信息'
        this.dialogForm = {
          staffName:'', //姓名
          staffJobNumber: '',//工号
          staffMobile:'',//手机号
          staffBirthday: '',//生日
          staffEmploymentDate:'',//入职日期
          staffDepartmentName: '',//部门名称
          staffJob: ''//职位
        }
      }else{
        this.title = '编辑员工信息'
        this.editIndex = index
        this.editId = row.id
        this.dialogForm = {
          staffName: row.staffName, //姓名
          staffJobNumber: row.staffJobNumber,//工号
          staffMobile: row.staffMobile,//手机号
          staffBirthday: row.staffBirthday,//生日
          staffEmploymentDate: row.staffEmploymentDate,//入职日期
          staffDepartmentName: row.staffDepartmentName,//部门名称
          staffJob: row.staffJob//职位
        }
      }
      this.dialogVisible = true
    },
    addEmployeesByExcel(){
      this.dialogInfoVisible = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            merchantId: this.merchantId ,
          }
          if(this.addStatus != '1'){
            data.staffId = this.editId
          }
          if(this.dialogForm.staffName){
            data.staffName = this.dialogForm.staffName
          }
          if(this.dialogForm.staffJobNumber){
            data.staffJobNumber = this.dialogForm.staffJobNumber
          }
          if(this.dialogForm.staffMobile){
            data.staffMobile = this.dialogForm.staffMobile
          }
          if(this.dialogForm.staffBirthday){
            data.staffBirthday = this.dialogForm.staffBirthday
          }
          if(this.dialogForm.staffEmploymentDate){
            data.staffEmploymentDate = this.dialogForm.staffEmploymentDate
          }
          if(this.dialogForm.staffDepartmentName){
            data.staffDepartmentName = this.dialogForm.staffDepartmentName
          }
          if(this.dialogForm.staffJob){
            data.staffJob = this.dialogForm.staffJob
          }
          if(this.addStatus == '1'){ //新增
            //console.log('新增')
            core.addStaff(data).then(res => {
              if(res.code && res.code == '00'){
                this.$message.success("操作成功");
                this.getStaffList({currentPage:this.currentPage, pageSize:this.pageSize})
                this.dialogVisible = false
              }else{
                this.$message.closeAll();
                this.$message.info(res.message);
              }
            }).catch(err => {
              this.$message.closeAll();
              this.$message.info(err);
            })
          }else{//编辑
            //console.log('编辑')
            core.editStaff(data).then(res => {
              if(res.code && res.code == '00'){
                this.$message.success("操作成功");
                this.getStaffList({currentPage:this.currentPage, pageSize:this.pageSize})
                this.dialogVisible = false
              }else{
                this.$message.closeAll();
                this.$message.info(res.message);
              }
            }).catch(err => {
              this.$message.closeAll();
              this.$message.info(err);
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //删除员工信息
    deleteStaffInfo(id,index){
      if(id){
        this.$confirm('此操作将永久删除该员工信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          core.deleteStaff({staffId: id}).then(res => {
            if(res.code && res.code === "00"){
              // this.tableData.splice(index,1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.search({pageSize: this.pageSize,currentPage: this.currentPage})
            }else{
              this.$message.info(res.message)
            }
          }).catch(err => {
            this.$message.info(err)
          })
        }).catch(() => {
          // this.$message.info('已取消删除');
        });
      }
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
      core.addStaffByExcel(form).then(res => {
        if(res.code && res.code === "00"){
          this.dialogInfoVisible = false
          this.$refs.upload.clearFiles()
          this.dialogInfoForm = {
            excelFile: null
          }
          this.$message.closeAll();
          this.$message.success("操作成功");
          this.$refs.upload.clearFiles()
          this.getStaffList({currentPage:1, pageSize:this.pageSize})
          this.getStaffJobInfo()
        }else{
          this.dialogInfoVisible = false
          this.$refs.upload.clearFiles()
          this.$message.closeAll();
          this.$message.warning(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    //导出
    dowloadStaffList(){
      let data = {}
      if(this.form.staffName){
        data.staffName = this.form.staffName
      }
      if(this.form.staffJobNumber){
        data.staffJobNumber = this.form.staffJobNumber
      }
      if(this.form.staffMobile){
        data.staffMobile = this.form.staffMobile
      }
      if(this.form.staffDepartmentName){
        data.staffDepartmentName = this.form.staffDepartmentName
      }
      if(this.form.staffJob){
        data.staffJob = this.form.staffJob
      }
      core.dowloadStaffList(data).then(res => {
        if(res.code){ //错误提示
          this.$message.closeAll();
          this.$message.info(res.message);
        }else{
          const blob = new Blob([res],{type: 'application/vnd.ms-excel'});
          const fileName = '员工导出列表.xls';
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
    //下载模板
    importExamples(){
      core.dowloadStaffTemplate().then(res => {
        //console.log(res)
        if(res.code){ //错误提示
          this.$message.closeAll();
          this.$message.info(res.message);
        }else{
          const blob = new Blob([res],{type: 'application/vnd.ms-excel'});
          const fileName = '员工信息模板.xls';
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
      core.getStaffJobInfo().then(res => {
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
.employees-management{
  .page-content {
    margin-top: 16px;

    .pagination-box {
      text-align: right;
      margin-top: 10px;
    }

  }
  .el-button+.el-button {
    margin-left: 20px;
  }
  .el-dialog__body {
    padding: 0px 16px;
  }
  .el-form-item {
    margin-bottom: 18px;
  }
}

</style>
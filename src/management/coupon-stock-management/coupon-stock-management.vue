<template>
  <div class="coupon-stock-management">
    <div class="virtual-market-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>卡券管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path:'/coupon-market-management' }">卡券商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>卡券库存管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="100px">
      <el-form-item label="卡号:">
        <el-input v-model="form.name" clearable placeholder="" style="width: 120px;"></el-input>
      </el-form-item>

      <el-form-item label="卡密:">
        <el-input v-model="form.name" clearable placeholder="" style="width: 120px;"></el-input>
      </el-form-item>

      <el-form-item label="用户ID:">
        <el-input v-model="form.name" clearable placeholder="" style="width: 120px;"></el-input>
      </el-form-item>

      <el-form-item label="卡密状态:">
        <el-select v-model="value" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="有效期:">
        <el-date-picker
          v-model="form.times"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>

      <el-form-item style='float:right;'>
        <el-button type="primary">立即查询</el-button>
        <el-button type="primary">导  出</el-button>
      </el-form-item>
    </el-form>
    <div>
        <el-button type="primary" icon="el-icon-plus" @click="addPwd('1')">添加卡密</el-button>
        <el-button type="primary" @click="addPwdByExcel">批量导入</el-button>
        <el-button type="text" @click="importExamples">批量导入示例</el-button>
    </div>
    <div class="page-content">
      <el-table
        :data="tableData"
        stripe
        header-align="center"
        style="width: 100%;border:1px solid #EBEEF5;">
        <el-table-column
          label="序号"
          type="index"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名称"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="供应商"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="卡号"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="卡密"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="创建时间"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="有效期"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="发放时间"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="发放用户ID"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="备注"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="province"
          label="卡密状态"
          align="center"
          width="100"
          >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100px"
          align="center"
          >
          <template slot-scope="scope">
            <el-button @click="addPwd(scope.row, 2)" type="text" size="small" >编辑状态</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="pageTotal>0" class="pagination-box">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[20, 30, 40, 50]"
          :page-size="10"
          layout="sizes, prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="操作"
      :visible.sync="dialogInfoVisible"
      width="420px"
      :before-close="dialogClose"
      center>
      <el-form ref="dialogform" :model="dialogInfoForm" label-position="right" label-width="80px">
        <el-form-item label="有效期*:">
          <el-date-picker
            style="width: 100%"
            v-model="dialogHintForm.date"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <div style="text-align:center;">
          <el-upload
            ref="upload"
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
            <el-button type="text">导入卡密信息Excel</el-button>
          </el-upload>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subExcelInfo">立即导入</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="dialogHintVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <el-form :model="dialogHintForm" label-position="right" label-width="100px" ref="dialogHintForm">
        <el-form-item label="商品名称:">
          <div>
            天猫50元券
          </div>
        </el-form-item>
        <el-form-item label="卡号:">
          <div v-if="addStatus === '1'">
            <el-input v-model="dialogHintForm.value" clearable></el-input>
          </div>
          <div v-else>
            202003051010210
          </div>
        </el-form-item>
        <el-form-item label="外部订单号*:">
          <div v-if="addStatus === '1'">
            <el-input v-model="dialogHintForm.value" clearable></el-input>
          </div>
          <div v-else>
            202003051010210
          </div>
        </el-form-item>
        <el-form-item label="有效期*:">
          <div v-if="addStatus === '1'">
            <el-date-picker
              style="width: 100%"
              v-model="dialogHintForm.date"
              value-format="timestamp"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </div>
          <div v-else>
            202003051010210
          </div>
        </el-form-item>
        <el-form-item label="备注:" v-if="addStatus === '1'">
          <el-input v-model="dialogHintForm.value" clearable></el-input>
        </el-form-item>
        <el-form-item label="卡密状态*:" v-else>
          <el-select v-model="dialogHintForm.value" clearable placeholder="请选择卡密状态" style="width: 100%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogHintVisible = false">取 消</el-button>
        <el-button type="primary" @click="subHintInfo">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as core from '../../api/benefit-staff'
import * as merchantCore from '../../api/benefit-merchant'
import tool from '../../utils/common'

export default {
  name: 'couponStockManagement',
  data() {
    var validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入员工名'));
      } else {
        callback();
      }
    }
    return {
      pickerOptions: {},
      dialogInfoVisible: false,
      dialogHintVisible: false,
      title: '新增卡密',
      addStatus: 1,//1.新增 2.编辑
      form: {
        name: '',
        date: '',
        times:''
      },
      dialogInfoForm: {
        excelFile: null
      },
      dialogHintForm: {
        value: null,
        date: null
      },
      fileList: [],
      value: [],
      options: [
        {
          value: 'zhinan',
          label: '指南'
        },
        {
          value: 'daohang',
          label: '导航'
        }
      ],
      editIndex: null,
      editId: null,
      currentPage: 1,
      pageTotal: 0,
      tableData: []
    }
  },
  created(){

  },
  methods: {
    getData(){

    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    edit(row){
      this.$router.push('/virtual-market/edit')
    },
    putaway(row,status){
      if(status == 1){
        console.log("上架")
      }else{
        console.log("下架")
      }
    },
    deleted(row){
      console.log("删除")
    },
    addPwd(status,row,index){
      this.addStatus = status
      if(status == '1'){
        this.title = '添加卡密信息'
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
        this.title = '编辑卡密信息'
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
      this.dialogHintVisible = true
    },
    subHintInfo(){

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
        core.addStaffCheck({staffs: [data]}).then(res => {
          if(res.code && res.code === '00'){
            this.$message.success("操作成功");
            this.getStaffList({currentPage:this.currentPage, pageSize:this.pageSize})
            this.dialogVisible = false
          }else if(res.code && res.code === "90"){
            this.dialogVisible = false
            this.dialogTableVisible = true
            this.dialogTableData = res.data
            this.getStaffList({currentPage:1, pageSize:this.pageSize})
            this.getStaffJobInfo()
          } else{
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

    },
    addPwdByExcel(){
      this.dialogInfoVisible = true
    },
    dialogClose(){
      this.dialogInfoVisible = false
      this.dialogHintVisible = false
      if(this.$refs.upload){
        this.$refs.upload.clearFiles()
      }
      this.fileList = []
    },
    deleteBatchStaffInfo(){
      if(this.batchStaffList){
        let arr = []
        this.batchStaffList.forEach((item) => {
          arr.push(item.id)
        })
        this.$confirm('此操作将永久删除该员工信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          core.deleteBatchStaff({ids: arr.join()}).then(res => {
            if(res.code && res.code === "00"){
              this.$message.closeAll();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.search({pageSize: this.pageSize,currentPage: this.currentPage})
            }else{
              this.$message.closeAll();
              this.$message.info(res.message)
            }
          }).catch(err => {
            this.$message.closeAll();
            this.$message.info(err)
          })
        }).catch(() => {
          // this.$message.info('已取消删除');
        });
      }else{
        this.$message.closeAll();
        this.$message.info("请先勾选员工信息")
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
        }else if(res.code && res.code === "90"){
          this.dialogInfoVisible = false
          this.$refs.upload.clearFiles()
          this.dialogInfoForm = {
            excelFile: null
          }
          this.dialogTableVisible = true
          this.dialogTableData = res.data
          this.getStaffList({currentPage:1, pageSize:this.pageSize})
          this.getStaffJobInfo()
        } else{
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
  }
}

</script>
<style lang='less' scope>
.coupon-stock-management {

   .virtual-market-title {
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
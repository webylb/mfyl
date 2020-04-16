<template>
  <div class="virtual-market">
    <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="100px">
      <el-form-item label="商品名称:">
        <el-input v-model="form.name" clearable placeholder="" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item label="商品ID:">
        <el-input v-model="form.name" clearable placeholder="" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item label="供应商ID:">
        <el-input v-model="form.name" clearable placeholder="" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item label="供应商:">
        <el-select v-model="value" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="品牌:">
        <el-select v-model="value" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="采购模式:">
        <el-select v-model="value" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权益类型:">
        <el-select v-model="value" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否上架:">
        <el-select v-model="value" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="上下架状态:">
        <el-select v-model="value" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item style='float:right;'>
        <el-button type="primary">立即查询</el-button>
        <el-button type="primary" @click="dowloadStaffList">导  出</el-button>
      </el-form-item>
    </el-form>
    <div>
        <el-button type="primary" icon="el-icon-plus" @click="addCouponGoods()">添加卡券商品</el-button>
        <el-button type="primary" @click="addCouponByExcel">批量导入</el-button>
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
          label="商品ID"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="供应商商品ID"
          align="center"
          width="90"
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
          label="品牌"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名称"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品icon"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="采购模式"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="权益类型"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="库存"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="售价"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="成本价"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="province"
          label="排序"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="province"
          label="是否上首页"
          align="center"
          width="100"
          >
        </el-table-column>
        <el-table-column
          prop="name"
          label="创建时间"
          align="center"
         >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150px"
          align="center"
          >
          <template slot-scope="scope">
            <el-button @click="editStock(scope.row)" type="text" size="small" >库存管理</el-button>
            <el-button @click="edit(scope.row)" type="text" size="small" >编辑</el-button>
            <el-button @click="putaway(scope.row,1)" type="text" size="small" v-if="scope.row.zip">上架</el-button>
            <el-button @click="putaway(scope.row,2)" type="text" size="small" v-else>下架</el-button>
            <el-button @click="deleted(scope.row)" type="text" size="small">删除</el-button>
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
      <el-form ref="dialogform" :model="dialogInfoForm">
        <el-form-item style="text-align:center;">
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
            <el-button type="text">导入商品信息Excel</el-button>
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
import * as core from '../../api/benefit-staff'
import * as merchantCore from '../../api/benefit-merchant'
import tool from '../../utils/common'

export default {
  name: 'couponMarketManagement',
  data() {
    var validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入员工名'));
      } else {
        callback();
      }
    }
    return {
      status: 1,//1.上架 2.下架
      dialogInfoVisible: false,
      form: {
        name: '',
        date: ''
      },
      dialogInfoForm: {
        excelFile: null
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
    addCouponGoods(){
      this.$router.push('/coupon-market-edit')
    },
    edit(row){
      this.$router.push({path:'/coupon-market-edit',query:{itemId: row.id}})
    },
    editStock(row){
      this.$router.push({path:'/coupon-stock-management',query:{itemId: row.id}})
    },
    deleted(row){
      console.log("删除")
    },
    addCouponByExcel(){
      this.dialogInfoVisible = true
    },
    dialogClose(){
      this.dialogInfoVisible = false
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
.virtual-market {

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
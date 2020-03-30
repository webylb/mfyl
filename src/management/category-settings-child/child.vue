<template>
  <div class="category-setttings-child">
    <div class="category-setttings-child-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城配置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/category-settings' }">商品类目配置</el-breadcrumb-item>
        <el-breadcrumb-item>{{ firstCategoryName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" :inline="true" label-position="center" label-width="80px">
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="addCategory(1)">添加分类</el-button>
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
          prop="categoryName"
          label="分类名称"
          align="center"
          >
        </el-table-column>
        <el-table-column
          label="分类图片"
          align="center"
         >
          <template slot-scope="scope">
            <img :src="scope.row.icon" alt="" style="max-height:100px;width:auto;">
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="页面排序"
          align="center"
          sortable
         >
        </el-table-column>
        <el-table-column
          prop="isShow"
          label="在手机端展示"
          align="center"
         >
          <template slot-scope="scope">
            <span>{{ scope.row.isShow === 'Y' ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          >
          <template slot-scope="scope">
            <el-button @click="addCategory(2,scope.row,scope.$index)" type="text" size="small">编辑</el-button>
            <el-button @click="deletedCategory(scope.row,scope.row.id,scope.$index)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="pageTotal>0" class="pagination-box">
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
      :visible.sync="dialogInfoVisible"
      width="450px"
      :before-close="dialogClose"
      center>
      <el-form ref="dialogform" :model="dialogInfoForm" label-width="150px">
        <el-form-item label="分类名称:">
          <el-input v-model="dialogInfoForm.categoryName" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item label="icon:">
          <el-upload
            class=""
            :action="action"
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
            :limit="limit"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="跳转链接:" prop="jumpUrl">
          <el-input v-model="dialogInfoForm.jumpUrl" placeholder="" clearable></el-input>
        </el-form-item> -->
        <el-form-item label="排序:" prop="sort">
          <el-input v-model="dialogInfoForm.sort" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否在手机端展示:">
          <el-switch v-model="dialogInfoForm.isShow"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="subCategoryInfo">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import CONGIF from "../../api/config"
import * as core from "../../api/mall"
export default {
  name: 'categorySettingsChild',
  data() {
    var validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入员工名'));
      } else {
        callback();
      }
    }
    return {
      loading: true,
      action: CONGIF.UPLOAD_IMAGE,
      firstCategoryId: "",
      firstCategoryName: "",
      categoryItemStatus: 1,//1是添加.2是编辑
      editCategoryId: null,
      editIndex: null,
      title: "添加分类",
      dialogInfoForm: {
        categoryName: '',
        icon: '',
        jumpUrl: '',
        sort: '',
        isShow: true
      },
      limit: 1,
      fileList: [],
      dialogInfoVisible: false,
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      tableData: []
    }
  },
  created(){
    this.firstCategoryId = this.$route.query.firstCategoryId
    this.firstCategoryName = this.$route.query.firstCategoryName
    this.getSecondCategoryList(this.firstCategoryId)
  },
  methods: {
    getSecondCategoryList(id){
      core.getSecondCategoryList({firstCategoryId: id}).then(res => {
        if(res.code && res.code === "00"){
          this.loading = false
          this.tableData = res.data
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
    addCategory(status,row,index){
      this.fileList = []
      this.categoryItemStatus = status
      if(status == 1){
        this.isShowBanner = true
        this.title = '添加分类'
        this.dialogInfoForm.categoryName = ''
        this.dialogInfoForm.sort = '',
        // this.dialogInfoForm.jumpUrl= ''
        this.dialogInfoForm.isShow = true
      }else if(status == 2){
        this.title = '编辑分类'
        this.editCategoryId = row.id
        this.editIndex = index
        this.dialogInfoForm.categoryName = row.categoryName
        this.dialogInfoForm.icon = row.icon
        this.fileList = [{name:row.icon,url:row.icon}]
        // this.dialogInfoForm.jumpUrl = row.jumpUrl
        this.dialogInfoForm.sort = row.sort
        this.dialogInfoForm.isShow = row.isShow === 'Y' ? true : false
      }
      this.dialogInfoVisible = true
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.loading = false
      this.getSecondCategoryList({currentPage:this.currentPage, pageSize:val,firstCategoryId: this.firstCategoryId})
    },
    handleCurrentChange(val) {
      this.currentPage = val,
      this.loading = false
      this.getSecondCategoryList({currentPage:val, pageSize:this.pageSize,firstCategoryId: this.firstCategoryId})
    },
    dialogClose(){
      this.fileList = []
      this.dialogInfoVisible = false
    },
    subCategoryInfo(){
      if(this.dialogInfoForm.categoryName && this.dialogInfoForm.icon){
        if(this.categoryItemStatus === 1){
          core.createSecondCategory({firstCategoryId: this.firstCategoryId,categoryName: this.dialogInfoForm.categoryName,icon:this.dialogInfoForm.icon,sort: this.dialogInfoForm.sort, isShow: this.dialogInfoForm.isShow ? 'Y' : 'N'}).then(res => {
            if(res.code && res.code === "00"){
              // this.tableData.unshift({
              //   categoryName: this.dialogInfoForm.categoryName,
              //   sort: this.dialogInfoForm.sort,
              //   icon: this.dialogInfoForm.icon,
              //   jumpUrl: this.dialogInfoForm.jumpUrl
              // })
              this.getSecondCategoryList(this.firstCategoryId)
              this.dialogClose()
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
        }else{
          core.editSecondCategory({secondCategoryId: this.editCategoryId,categoryName: this.dialogInfoForm.categoryName,sort:this.dialogInfoForm.sort,icon:this.dialogInfoForm.icon,isShow: this.dialogInfoForm.isShow ? 'Y' : 'N'}).then(res => {
            if(res.code && res.code === "00"){
              this.tableData[this.editIndex].categoryName = this.dialogInfoForm.categoryName
              this.tableData[this.editIndex].sort = this.dialogInfoForm.sort
              this.tableData[this.editIndex].icon = this.dialogInfoForm.icon
              this.tableData[this.editIndex].isShow = this.dialogInfoForm.isShow ? 'Y' : 'N'
              // this.tableData[this.editIndex].jumpUrl = this.dialogInfoForm.jumpUrl
              this.dialogClose()
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
        }
      }else{
        this.$message.closeAll();
        this.$message.info("请确认填写信息完整");
      }
    },
    deletedCategory(row,id,index){
      if(id){
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          core.deleteSecondCategory({secondCategoryId: id}).then(res => {
            if(res.code && res.code === "00"){
              this.tableData.splice(index,1)
              this.$message.closeAll();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
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
    handleSuccess(file, fileList) {
      console.log(file,fileList)
      // this.fileList = fileList.slice(-1)
      this.dialogInfoForm.icon = fileList.response.data
    },
    handleExceed(){
      this.$message.closeAll();
      this.$message({
        message: '最大上传文件数为1!',
        type: 'warning'
      });
    }
  }
}

</script>
<style lang='less' scope>
.category-setttings-child {

   .category-setttings-child-title {
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
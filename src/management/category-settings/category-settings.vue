<template>
  <div class="category-settings">
    <div class="category-settings-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城配置</el-breadcrumb-item>
        <el-breadcrumb-item>首页类目配置</el-breadcrumb-item>
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
          label="一级类目"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          align="center"
          sortable
         >
        </el-table-column>
        <el-table-column
          label="详情"
          align="center"
          >
          <template slot-scope="scope">
            <el-button @click="goDetail(scope.row)" type="text" size="small">查看</el-button>
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
          :current-page="1"
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
      width="420px"
      :before-close="dialogClose"
      center>
      <el-form ref="dialogform" :model="dialogInfoForm" label-width="100px">
        <el-form-item label="分类名称:">
          <el-input v-model="dialogInfoForm.categoryName" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <el-input v-model="dialogInfoForm.sort" placeholder="" clearable></el-input>
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
import * as core from "../../api/mall"

export default {
  name: 'categorySettings',
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
      title: '添加一级分类',
      categoryItemStatus: 1,//1为新增,2为编辑
      dialogInfoForm: {
        categoryName: '',
        sort: ''
      },
      dialogInfoVisible: false,
      editCategoryId: null,
      editIndex: null,
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      tableData: []
    }
  },
  created(){
    this.getFirstCategoryList()
  },
  methods: {
    getFirstCategoryList(){
      core.getFirstCategoryList().then(res => {
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
      this.categoryItemStatus = status
      if(status == 1){
        this.isShowBanner = true
        this.title = '添加一级分类'
        this.dialogInfoForm.categoryName = ''
        this.dialogInfoForm.sort = ''
      }else if(status == 2){
        this.title = '编辑一级分类'
        this.editCategoryId = row.id
        this.editIndex = index
        this.dialogInfoForm.categoryName = row.categoryName
        this.dialogInfoForm.sort = row.sort
      }
      this.dialogInfoVisible = true
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.loading = false
      this.getFirstCategoryList({currentPage:this.currentPage, pageSize:val})
    },
    handleCurrentChange(val) {
      this.currentPage = val,
      this.loading = false
      this.getFirstCategoryList({currentPage:val, pageSize:this.pageSize})
    },
    dialogClose(){
      this.dialogInfoVisible = false
    },
    subCategoryInfo(){
      if(this.dialogInfoForm.categoryName){
        if(this.categoryItemStatus === 1){
          core.createFirstCategory({categoryName: this.dialogInfoForm.categoryName,sort: this.dialogInfoForm.sort}).then(res => {
            if(res.code && res.code === "00"){
              this.tableData.unshift({
                categoryName: this.dialogInfoForm.categoryName,
                sort: this.dialogInfoForm.sort
              })
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
          core.editFirstCategory({firstCategoryId: this.editCategoryId,categoryName: this.dialogInfoForm.categoryName,sort:this.dialogInfoForm.sort}).then(res => {
            if(res.code && res.code === "00"){
              this.tableData[this.editIndex].categoryName = this.dialogInfoForm.categoryName
              this.tableData[this.editIndex].sort = this.dialogInfoForm.sort
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
          core.deleteFirstCategory({firstCategoryId: id}).then(res => {
            if(res.code && res.code === "00"){
              this.tableData.splice(index,1)
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
    goDetail(row){
      //console.log(row)
      this.$router.push({path:'/category-settings/child', query:{firstCategoryId: row.id, firstCategoryName: row.categoryName}})
    }
  }
}

</script>
<style lang='less'>
.category-settings {

   .category-settings-title {
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
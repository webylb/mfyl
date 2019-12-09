<template>
  <div class="category-recommend">
    <div class="category-recommend-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城配置</el-breadcrumb-item>
        <el-breadcrumb-item>首页品类推荐</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" :inline="true" label-position="center" label-width="80px">
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="addGoods(1)">添加商品</el-button>
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
          prop="name"
          label="名称"
          align="center"
          >
        </el-table-column>
        <el-table-column
          label="icon"
          align="center"
          width="100">
          <template slot-scope="scope">
            <img :src="scope.row.icon" alt="" style="height:auto;width:100%;">
          </template>
        </el-table-column>
        <el-table-column
          prop="jumpUrl"
          label="跳转链接"
          align="center"
          min-width="200">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="页面排序"
          align="center"
          sortable
         >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          >
          <template slot-scope="scope">
            <el-button @click="addGoods(2,scope.row,scope.$index)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteIcon(scope.row,scope.row.id,scope.$index)" type="text" size="small">删除</el-button>
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
      :visible.sync="dialogInfoVisible"
      width="420px"
      :before-close="dialogClose"
      center>
      <el-form ref="dialogform" :model="dialogInfoForm" label-width="100px">
        <el-form-item label="名称:">
          <el-input v-model="dialogInfoForm.name" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item label="icon:" v-show="isShowIcon">
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
        <el-form-item label="跳转链接:">
          <el-input v-model="dialogInfoForm.link" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序:">
          <el-input v-model="dialogInfoForm.sort" placeholder="" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="subGoodsInfo">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import CONGIF from "../../api/config"
import * as core from "../../api/mall.js"

export default {
  name: 'categoryRecommendSecond',
  data() {
    return {
      loading: true,
      action: CONGIF.UPLOAD_IMAGE,
      categoryItemStatus: null,
      title: '添加商品',
      dialogInfoForm: {
        name: '',
        icon: '',
        link: '',
        sort: ''
      },
      limit: 1,
      fileList: [],
      editIndex: null,
      editCategoryId: '',
      isShowIcon: true,
      dialogInfoVisible: false,
      currentPage: 1,
      pageTotal: 0,
      tableData: []
    }
  },
  created(){
    this.getHomeSecondIcon()
  },
  methods: {
    getHomeSecondIcon(){
      core.getHomeSecondIcon().then(res => {
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
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    dialogClose(){
      this.fileList = []
      this.dialogInfoVisible = false
    },
    addGoods(status,row,index){
      this.categoryItemStatus = status
      if(status == 1){
        this.isShowIcon = true
        this.title = '添加商品'
        this.dialogInfoForm.name = ''
        this.dialogInfoForm.icon = ''
        this.dialogInfoForm.link = ''
        this.dialogInfoForm.sort = ''
        this.fileList = []
      }else if(status == 2){
        this.title = '编辑商品'
        this.editCategoryId = row.id
        this.editIndex = index
        this.isShowIcon = true
        this.fileList = [{link: row.icon, name: 'icon' }]
        this.dialogInfoForm.icon = row.icon
        this.dialogInfoForm.name = row.name
        this.dialogInfoForm.link = row.jumpUrl
        this.dialogInfoForm.sort = row.sort
      }
      this.dialogInfoVisible = true
    },
    subGoodsInfo(){
      if(!this.dialogInfoForm.name){
        this.$message.closeAll();
        this.$message.info("请确认填写品类名称");
        return false
      }
      if(!this.dialogInfoForm.icon){
        this.$message.closeAll();
        this.$message.info("请确认上传品类icon");
        return false
      }
      if(!this.dialogInfoForm.link){
        this.$message.closeAll();
        this.$message.info("请确认填写品类链接");
        return false
      }
      if(this.categoryItemStatus === 1){
        core.createHomeSecondIcon({
          name:this.dialogInfoForm.name,
          iconImageUrl: this.dialogInfoForm.icon,
          jumpUrl: this.dialogInfoForm.link,
          sort: this.dialogInfoForm.sort
        }).then(res => {
          if(res.code && res.code === "00"){
            // this.tableData.unshift({
            //   name: this.dialogInfoForm.name,
            //   icon: this.dialogInfoForm.icon,
            //   jumpUrl: this.dialogInfoForm.link,
            //   sort: this.dialogInfoForm.sort
            // })
            this.dialogClose()
            this.$message.closeAll();
            this.$message.success("操作成功");
            this.getHomeSecondIcon()
          }else{
            this.$message.closeAll();
            this.$message.info(res.message);
          }
        }).catch(err => {
          this.$message.closeAll();
          this.$message.info(err);
        })
      }else{
        core.editHomeSecondIcon({
          iconId: this.editCategoryId,
          iconImageUrl:this.dialogInfoForm.icon,
          name:this.dialogInfoForm.name,
          jumpUrl: this.dialogInfoForm.link,
          sort: this.dialogInfoForm.sort
        }).then(res => {
          if(res.code && res.code === "00"){
            this.tableData[this.editIndex].name = this.dialogInfoForm.name
            this.tableData[this.editIndex].icon = this.dialogInfoForm.icon
            this.tableData[this.editIndex].jumpUrl = this.dialogInfoForm.link
            this.tableData[this.editIndex].sort =  this.dialogInfoForm.sort
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
    },
    deleteIcon(row,id,index){
      if(id){
        this.$confirm('此操作将删除该品类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          core.deleteHomeIcon({iconId: id}).then(res => {
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
    addSecondGoods(){
      this.$router.push('/category-recommend/second')
    },
    handleSuccess(file, fileList) {
      console.log(file,fileList)
      this.dialogInfoForm.icon = fileList.response.data
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请删除后继续上传`);
    }
  }
}

</script>
<style lang='less' scope>
.category-recommend {

   .category-recommend-title {
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
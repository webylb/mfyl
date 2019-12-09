<template>
  <div class="banner-settings">
    <div class="banner-settings-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城配置</el-breadcrumb-item>
        <el-breadcrumb-item>banner配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" :inline="true" label-position="center" label-width="80px">
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="addBanner(1)">添加banner</el-button>
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
          label="Banner"
          align="center"
          max-width="200">
          <template slot-scope="scope">
            <img :src="scope.row.pictureUrl" alt="" style="height:auto;width:100%;">
          </template>
        </el-table-column>
        <el-table-column
          prop="jumpUrl"
          label="跳转链接"
          align="center"
          >
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
            <el-button @click="addBanner(2,scope.row,scope.$index)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteBanner(scope.row,scope.row.id,scope.$index)" type="text" size="small">删除</el-button>
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
          :page-size="pageSize"
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
        <el-form-item label="icon:" prop="icon" v-show="isShowBanner">
          <el-upload
            class=""
            :action="action"
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
            :limit="limit"
            :file-list="fileList"
            accept="image/jpeg,image/gif,image/png,image/bmp">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转链接:" prop="link">
          <el-input v-model="dialogInfoForm.link" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <el-input v-model="dialogInfoForm.sort" placeholder="" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="subBannerInfo">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import CONGIF from "../../api/config"
import * as core from "../../api/mall.js"
export default {
  name: 'purchaseApplys',
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
      bannerItemStatus: 1, //1为新增 2为编辑
      title: '添加商品',
      dialogInfoForm: {
        icon: '',
        link: '',
        sort: ''
      },
      limit: 1,
      fileList: [],
      editIndex: null,
      editBannerId: '',
      isShowBanner: true,
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogInfoVisible: false,
      tableData: []
    }
  },
  created(){
    this.getBannerList({currentPage: this.currentPage,pageSize:this.pageSize})
  },
  methods: {
    getBannerList(opts){
      core.getBannerList(opts).then(res => {
        if(res.code && res.code === "00"){
          this.loading = false
          this.tableData = res.data.data
          this.pageTotal = res.data.amount
          if(res.data.data.length < 1 && this.currentPage > 1){
            this.getBannerList({pageSize: this.pageSize, currentPage: this.currentPage - 1 })
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
    dialogClose(){
      this.fileList = []
      this.dialogInfoVisible = false
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.loading = true
      let data = { currentPage:1, pageSize:val }
      this.getBannerList(data)
    },
    handleCurrentChange(val) {
      this.currentPage = val,
      this.loading = true
      let data = { currentPage:val, pageSize:this.pageSize }

      this.getBannerList(data)
    },
    subBannerInfo(){
      if(this.dialogInfoForm.link && this.dialogInfoForm.sort){
        if(this.bannerItemStatus === 1 && this.dialogInfoForm.icon){
          core.createBanner({
            pictureUrl: this.dialogInfoForm.icon,
            jumpUrl: this.dialogInfoForm.link,
            sort: this.dialogInfoForm.sort
          }).then(res => {
            if(res.code && res.code === "00"){
              this.tableData.unshift({
                pictureUrl: this.dialogInfoForm.icon,
                jumpUrl: this.dialogInfoForm.link,
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
          core.editBanner({
            bannerId: this.editBannerId,
            jumpUrl: this.dialogInfoForm.link,
            sort: this.dialogInfoForm.sort
          }).then(res => {
            if(res.code && res.code === "00"){
              //this.tableData[this.editIndex].pictureUrl = this.dialogInfoForm.icon
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
      }else{
        this.$message.closeAll();
        this.$message.info("请确认填写信息完整");
      }
    },
    addBanner(status,row,index){
      this.bannerItemStatus = status
      if(status == 1){
        this.isShowBanner = true
        this.title = '添加Banner'
        this.dialogInfoForm.icon = ''
        this.dialogInfoForm.link = ''
        this.dialogInfoForm.sort = ''
      }else if(status == 2){
        this.title = '编辑Banner'
        this.editBannerId = row.id
        this.editIndex = index
        this.isShowBanner = false
        this.dialogInfoForm.link = row.jumpUrl
        this.dialogInfoForm.sort = row.sort
      }
      this.dialogInfoVisible = true
    },
    deleteBanner(row,id,index){
      if(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          core.deleteBanner({bannerId: id}).then(res => {
            if(res.code && res.code === "00"){
              // this.tableData.splice(index,1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getBannerList({currentPage: this.currentPage,pageSize:this.pageSize})
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
      // this.fileList = [{
      //   name: fileList.name,
      //   url: fileList.response.data
      // }],
      this.dialogInfoForm.icon = fileList.response.data
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请删除后继续上传`);
    }
  }
}

</script>
<style lang='less' scope>
.banner-settings {

   .banner-settings-title {
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
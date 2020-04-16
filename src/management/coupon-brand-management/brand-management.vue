<template>
  <div class="merchant-management">
    <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="80px">
      <el-form-item label="品牌名称:">
        <el-input style="width: 120px" v-model="form.merchantName" clearable></el-input>
      </el-form-item>

      <el-form-item label="供应商:">
        <el-select v-model="form.purchaseMode" clearable placeholder="请选择" style="width: 150px;margin-right:10px">
          <el-option
            v-for="item in options.purchaseModeOptions"
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
          <el-button type="primary" icon="el-icon-plus" @click="addBrand(1)" >添加品牌</el-button>
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
          label="品牌名称"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="username"
          label="品牌icon"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="bandStrategyName"
          label="供应商"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="purchaseMode"
          label="创建时间"
          align="center"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.purchaseMode == 'YuFuKuan'">预付款</span>
            <span v-else-if="scope.row.purchaseMode == 'HouFuKuan'">后付款</span>
            <span v-else>{{ scope.row.purchaseMode }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="accountBalance"
          label="品牌链接"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="bandStrategyName"
          label="商品数量"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="bandStrategyName"
          label="商品管理"
          align="center"
          >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="120">
          <template slot-scope="scope">
            <el-button @click="addBrand(2,scope.row.id,scope.$index)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteBrand(scope.row,scope.row.id,scope.$index)" type="text" size="small">删除</el-button>
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
      width="400px"
      @close="dialogClose()" center>
      <el-form :model="dialogInfoForm" label-position="right" label-width="80px" ref="dialogInfoForm">
        <el-form-item label="品牌名称*:" prop="title">
          <el-input v-model="dialogInfoForm.title" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item label="品牌icon*:" prop="icon">
          <div style="display:flex;">
            <el-upload
              class="avatar-uploader"
              :action="action"
              :show-file-list="false"
              :on-success="handleSuccess"
              :on-exceed="handleExceed"
              :limit="limit"
              accept="image/jpeg,image/gif,image/png,image/bmp">
              <img v-if="dialogInfoForm.icon" :src="dialogInfoForm.icon" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div style="line-height: 1.5;margin-left: 10px;">
              上传尺寸:<br>
              尺寸100*100,图片大小不要超过500K,以png或jpg的格式
            </div>
          </div>
        </el-form-item>
        <el-form-item label="供应商*:" prop="sort">
          <el-select v-model="dialogInfoForm.purchaseMode" placeholder="请选择" style="width:100%;">
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
        <el-button type="primary" @click="subBrandInfo()">确  认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import CONGIF from "../../api/config"
import * as core from '../../api/merchant'
import tool from '../../utils/common'

export default {
  name: 'brandManagement',
  data() {
    return {
      loading: true,
      action: CONGIF.UPLOAD_IMAGE,
      form: {
        merchantName: null,
        bindStrategyCode: null,
        purchaseMode: null,
        isLock: null
      },
      dialogVisible: false,
      brandItemStatus: 1, //1为新增 2为编辑
      dialogInfoForm: {
        icon: '',
        title: '',
        purchaseMode: ''
      },
      title: '添加品牌',
      limit: 1,
      fileList: [],
      isShowBrand: true,
      options: {
        purchaseModeOptions: [
          {
            value: 'YuFuKuan',
            label: '预付款'
          },
          {
            value: 'HouFuKuan',
            label: '后付款'
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
    this.getMerchantList({currentPage: this.currentPage,pageSize: this.pageSize})
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
    goDetails(id){
      this.$router.push({path:'/merchant-management/shop-invoice',query:{id: id}})
    },
    dialogClose(){
      this.fileList = []
      this.dialogVisible = false
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
    },
    subBrandInfo(){
      if(this.dialogInfoForm.link && this.dialogInfoForm.sort){
        if(this.brandItemStatus === 1 && this.dialogInfoForm.icon){
          // core.createBanner({
          //   pictureUrl: this.dialogInfoForm.icon,
          //   jumpUrl: this.dialogInfoForm.link,
          //   sort: this.dialogInfoForm.sort
          // }).then(res => {
          //   if(res.code && res.code === "00"){
          //     this.dialogClose()
          //     this.$message.closeAll();
          //     this.$message.success("操作成功");
          //     this.getBannerList({currentPage:this.currentPage, pageSize:this.pageSize})
          //   }else{
          //     this.$message.closeAll();
          //     this.$message.info(res.message);
          //   }
          // }).catch(err => {
          //   this.$message.closeAll();
          //   this.$message.info(err);
          // })
        }else{
          // core.editBanner({
          //   bannerId: this.editBannerId,
          //   jumpUrl: this.dialogInfoForm.link,
          //   sort: this.dialogInfoForm.sort
          // }).then(res => {
          //   if(res.code && res.code === "00"){
          //     this.tableData[this.editIndex].jumpUrl = this.dialogInfoForm.link
          //     this.tableData[this.editIndex].sort =  this.dialogInfoForm.sort
          //     this.dialogClose()
          //     this.$message.closeAll();
          //     this.$message.success("操作成功");
          //   }else{
          //     this.$message.closeAll();
          //     this.$message.info(res.message);
          //   }
          // }).catch(err => {
          //   this.$message.closeAll();
          //   this.$message.info(err);
          // })
        }
      }else{
        this.$message.closeAll();
        this.$message.info("请确认填写信息完整");
      }
    },
    addBrand(status,row,index){
      this.brandItemStatus = status
      if(status == 1){
        this.isShowBrand = true
        this.title = '添加品牌'
        this.dialogInfoForm.icon = ''
        this.dialogInfoForm.link = ''
        this.dialogInfoForm.sort = ''
      }else if(status == 2){
        this.title = '编辑品牌'
        this.editBannerId = row.id
        this.editIndex = index
        this.isShowBrand = false
        this.dialogInfoForm.link = row.jumpUrl
        this.dialogInfoForm.sort = row.sort
      }
      this.dialogVisible = true
    },
    deleteBrand(row,id,index){
      if(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // core.deleteBanner({bannerId: id}).then(res => {
          //   if(res.code && res.code === "00"){
          //     this.tableData.splice(index,1)
          //     this.$message({
          //       type: 'success',
          //       message: '删除成功!'
          //     });
          //     this.getBannerList({currentPage: this.currentPage,pageSize:this.pageSize})
          //   }else{
          //     this.$message.info(res.message)
          //   }
          // }).catch(err => {
          //   this.$message.info(err)
          // })
        }).catch(() => {
          // this.$message.info('已取消删除');
        });
      }
    },
    handleSuccess(file, fileList) {
      // console.log(file,fileList)
      this.dialogInfoForm.icon = fileList.response.data
      this.dialogInfoForm.icon = URL.createObjectURL(file.raw);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请删除后继续上传`);
    }
  },
  watch: {
    dialogVisible(newVal){
      if(!newVal){
        this.$refs['dialogInfoForm'].resetFields()
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

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
}
</style>
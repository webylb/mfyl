<template>
  <div class="router-management">
    <div class="router-management-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>路由管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
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
          prop="menuName"
          label="路由名称"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="linkUrl"
          label="路由地址"
          align="center"
          >
        </el-table-column>
        <el-table-column
          label="Icon"
          align="center"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.iconUrl">{{ scope.row.iconUrl }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          >
          <template slot-scope="scope">
            <el-button @click="editRouter(scope.row,scope.$index)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="title"
      :visible.sync="dialogInfoVisible"
      width="420px"
      :before-close="dialogClose"
      center>
      <el-form ref="dialogform" :model="dialogInfoForm" label-width="100px">
        <el-form-item label="路由名称:">
          {{ dialogInfoForm.menuName }}
        </el-form-item>
        <el-form-item label="跳转链接:" prop="link">
          <el-input v-model="dialogInfoForm.linkUrl" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item label="icon:" prop="icon">
          <el-input v-model="dialogInfoForm.iconUrl" placeholder="" clearable></el-input>
        </el-form-item>
       
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="subRouterInfo">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as core from "../../api/account"

export default {
  name: 'routerManagement',
  data() {
    return {
      loading: true,
      title: '编辑路由',
      dialogInfoForm: {
        iconUrl: '',
        linkUrl: '',
        menuName: ''
      },
      editIndex: null,
      editRouterId: '',
      currentPage: 1,
      pageSize: 20,
      dialogInfoVisible: false,
      tableData: []
    }
  },
  created(){
    this.getAllMenu()
  },
  methods: {
    getAllMenu(){
      core.getAllMenu().then(res => {
        console.log(res)
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
    dialogClose(){
      this.dialogInfoVisible = false
    },
    subRouterInfo(){
      if(this.dialogInfoForm.linkUrl){
        
        core.editMenu({menuId: this.editRouterId,linkUrl: this.dialogInfoForm.linkUrl,iconUrl: this.dialogInfoForm.iconUrl}).then(res => {
          if(res.code && res.code === "00"){
            //this.tableData[this.editIndex].pictureUrl = this.dialogInfoForm.icon
            this.tableData[this.editIndex].linkUrl = this.dialogInfoForm.linkUrl
            this.tableData[this.editIndex].iconUrl =  this.dialogInfoForm.iconUrl
            this.dialogClose()
          }else{
            this.$message.closeAll();
            this.$message.info(res.message);
          }
        }).catch(err => {
          this.$message.closeAll();
          this.$message.info(err);
        })
        
      }else{
        this.$message.closeAll();
        this.$message.info("请确认填写信息完整");
      }
    },
    editRouter(row,index){
      this.title = '编辑路由'
      this.editRouterId = row.id
      this.editIndex = index
      this.dialogInfoForm.linkUrl = row.linkUrl
      this.dialogInfoForm.iconUrl = row.iconUrl
      this.dialogInfoForm.menuName = row.menuName
     
      this.dialogInfoVisible = true
    }
  }
}

</script>
<style lang='less'>
.router-management {

   .router-management-title {
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
<template>
  <div class="create-account">
    <el-row type="flex">
      <el-col :span="12">
        <el-button type="primary" icon="el-icon-plus" @click="editAdmin('1')" >添加管理员账户</el-button>
      </el-col>
    </el-row>

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
          align="center">
        </el-table-column>
        <el-table-column
          prop="username"
          label="账户名称"
          align="center"
          >
        </el-table-column>
        <!-- <el-table-column
          prop="name"
          label="密码"
          align="center"
          >
        </el-table-column> -->
        <el-table-column
          label="角色"
          align="center"
          >
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.rules" :key="index">{{ item.roleName }}</div>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          >
          <template slot-scope="scope">
            <!-- <el-button @click="editAdmin('2',scope.row.id,scope.$index)" type="text" size="small">编辑</el-button> -->
            <span v-for="(item, index) in scope.row.rules" :key="index">
              <span v-if="item.roleAlias !== 'admin'">
                <el-button @click="deleteClick(scope.row.id,scope.$index)"  type="text" size="small">删除</el-button>
              </span>
            </span>
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
      title="添加账户"
      :visible.sync="dialogVisible"
      width="422px"
      @close="dialogClose()" center>
      <el-form :model="dialogForm" label-position="right" label-width="100px" ref="dialogForm">
        <el-form-item label="账户名*:" prop="userName">
          <el-input style="width: 270px" v-model="dialogForm.username" clearable
                    auto-complete="off"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="密码*:">
          <el-input style="width: 270px" v-model="dialogForm.password" clearable
                    auto-complete="off"
                    placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="角色*:">
          <el-select v-model="dialogForm.roleId" multiple placeholder="请选择" style="width: 270px">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取  消</el-button>
        <el-button type="primary" @click="subAdmin">确  定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as core from '../../api/account'
import tool from '../../utils/common'

export default {
  name: 'createAccount',
  data() {
    return {
      loading: true,
      dialogVisible: false,
      form: {
        name: ''
      },
      dialogForm: {
        username:'',
        password:'',
        roleId: null
      },
      options: [],
      currentPage: 1,
      pageTotal: 0,
      tableData: []
    }
  },
  created(){
    this.getAllAdminUserList()
  },
  methods: {
    getAllAdminUserList(){
      core.getAllAdminUserList().then(res => {
       //console.log(res)
        if(res.code && res.code == '00'){
          this.pageTotal = 0
          this.tableData = res.data
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
    getAllRoleList(){
      core.getAllRoleListForCreate().then(res => {
        //console.log(res)
        if(res.code && res.code == '00'){
          this.options = res.data
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    deleteClick(id,index){
      if(id){
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          core.deleteAdminUser({adminId: id}).then(res => {
            //console.log(res)
            if(res.code && res.code == '00'){
          this.$message.success("操作成功");
              this.tableData.splice(index,1)
            }else{
              this.$message.closeAll();
              this.$message.info(res.message);
            }
          }).catch(err => {
            this.$message.closeAll();
            this.$message.info(err);
          })
        }).catch(() => {
          // this.$message.info('已取消删除');
        });
      }
    },
    editAdmin(status,id,row){
      this.getAllRoleList()
      this.editStatus = status
      this.editId = id
      if(status == '1'){//添加
        this.dialogForm = {
          username:'',
          password:'',
          roleId: null
        }
      }else{//编辑
        this.dialogForm = {
          username:'',
          password:'',
          roleId: null
        }
      }
      this.dialogVisible = true
    },
    subAdmin(){
      const data = {}
      if(!this.dialogForm.username){
        this.$message.closeAll();
        this.$message.warning("请输入账户名称");
        return false
      }
      data.username = this.dialogForm.username
      if(!this.dialogForm.password){
        this.$message.closeAll();
        this.$message.warning("请输入账户密码");
        return false
      }
      data.password = this.dialogForm.password
      if(!this.dialogForm.roleId){
        this.$message.closeAll();
        this.$message.warning("请选择账户角色");
        return false
      }
      let roleId = ''
      for(let j=0,length = this.dialogForm.roleId.length; j < length; j++){
        roleId += this.dialogForm.roleId[j] + ","
      }
      //console.log(roleId)
      data.roleId = roleId.substring(0,roleId.length - 1)
      if(this.editStatus == '1'){
        core.createAdminUser(data).then(res => {
          //console.log(res)
          if(res.code && res.code == '00'){
            this.dialogVisible = false
        this.$message.success("操作成功");
            this.loading = true
            this.getAllAdminUserList()
          }else{
            this.$message.closeAll();
            this.$message.info(res.message);
          }
        }).catch(err => {
          this.$message.closeAll();
          this.$message.info(err);
        })
      }else{
        // core.createRole(this.dialogForm).then(res => {
        //   //console.log(res)
        //   if(res.code && res.code == '00'){
        //     this.dialogVisible = false
        //     this.$message.success("操作成功");
        //     this.loading = true
        //     this.getAllRoleList()
        //   }else{
        //     this.$message.closeAll();
        //     this.$message.info(res.message);
        //   }
        // }).catch(err => {
        //   this.$message.closeAll();
        //   this.$message.info(err);
        // })
      }

    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    dialogClose(){
      this.dialogVisible = false
    }
  }

}

</script>
<style lang='less' scope>
.create-account {
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
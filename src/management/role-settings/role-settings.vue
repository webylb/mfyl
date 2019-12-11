<template>
  <div class="role-settings">
    <el-row type="flex">
      <el-col :span="12">
        <el-button type="primary" icon="el-icon-plus" @click="editName('1')" >添加角色</el-button>
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
          prop="roleName"
          label="角色名称"
          align="center"
          >
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          width="200">
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.createTime)  }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
         >
          <template slot-scope="scope">
            <!-- <el-button @click="editName('2',scope.row.id,scope.row)" type="text" size="small">编辑角色名称</el-button> -->
            <span v-if="scope.row.roleAlias !== 'admin'">
              <el-button @click="editRule(scope.row.id)" type="text" size="small">编辑角色权限</el-button>
              <el-button @click="deleteClick(scope.row.id,scope.$index)"  type="text" size="small">删除</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>

      <!-- <div v-show="pageTotal>10" class="pagination-box">
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
      </div> -->
    </div>
    <el-dialog
      title="添加角色"
      :visible.sync="dialogVisible"
      width="422px"
      @close="dialogClose()" center>
      <el-form :model="dialogForm" label-position="right" label-width="100px" ref="dialogForm">
        <el-form-item label="角色名称*:" prop="userName">
          <el-input style="width: 270px" v-model="dialogForm.roleName" clearable
                    auto-complete="off"
                    placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色别名*:">
          <el-input style="width: 270px" v-model="dialogForm.roleAlias" clearable
                    auto-complete="off"
                    placeholder="请输入角色别名"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取  消</el-button>
        <el-button type="primary" @click="subName">确  定</el-button>
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
      editStatus: null,
      editId: null,
      dialogForm: {
        roleName:'',
        roleAlias:''
      },
      pageSize: 10,
      currentPage: 1,
      pageTotal: 0,
      tableData: []
    }
  },
  created(){
    this.getAllRoleList()
  },
  methods: {
    getAllRoleList(){
      core.getAllRoleList().then(res => {
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
    deleteClick(id,index){
      if(id){
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          core.deleteRole({roleId: id}).then(res => {
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
    dialogClose(){
      this.dialogVisible = false
    },
    editName(status,id,row){
      this.editStatus = status
      this.editId = id
      if(status == '1'){//添加
        this.dialogForm = {
          roleName:'',
          roleAlias:''
        }
      }else{//编辑
        this.dialogForm = {
          roleName: row.roleName,
          roleAlias: row.roleAlias
        }
      }
      this.dialogVisible = true
    },
    subName(){
      if(!this.dialogForm.roleName){
        this.$message.closeAll();
        this.$message.warning("请输入角色名称");
        return false
      }
      if(!this.dialogForm.roleAlias){
        this.$message.closeAll();
        this.$message.warning("请输入角色别名");
        return false
      }
      if(this.editStatus == '1'){
        core.createRole(this.dialogForm).then(res => {
          //console.log(res)
          if(res.code && res.code == '00'){
            this.dialogVisible = false
        this.$message.success("操作成功");
            this.loading = true
            this.getAllRoleList()
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
    editRule(id) {
      // console.log(id);
      this.$router.push({path: "/role-settings/edit-authority",query: {id: id}})
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  },
  watch: {

  },
}

</script>
<style lang='less' scope>
.role-settings {
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
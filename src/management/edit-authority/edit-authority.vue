<template>
  <div class="edit-authority">
    <div class="edit-authority-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/role-settings' }">角色配置</el-breadcrumb-item>
        <el-breadcrumb-item>编辑权限</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" :inline="false" label-position="top" label-width="100px">
      <el-form-item v-for="(item,index) in allPermissionData" :key="index" :label="item.categoryName +':'">
        <el-checkbox-group v-model="item.checkId" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="li in item.categoryList" :label="li.id" :key="li.id">{{ li.permissionName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent="submitForm()" type="primary">提 交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import * as core from '../../api/account'

export default {
  name: 'editAuthority',
  data() {
    return {
      allPermission: [],
      allPermissionData: [],
      rulePermission: []
    }
  },
  created(){
    if(this.$route.query.id){
      this.roleId = this.$route.query.id
      this.getRolePermission({roleId: this.$route.query.id})
    }else{
      this.getRolePermission()
    }
  },
  methods: {
    getRolePermission(opts){
      core.getRolePermission(opts).then(res => {
        console.log(res)
        if(res.code && res.code == '00'){
          this.allPermission = res.data.allPermission
          this.allPermissionData = []
          for (let [k, v] of Object.entries(this.allPermission)) {
            this.allPermissionData.push({categoryName:k, categoryList: v, checkId: []});
          }

          if(res.data.rulePermission){
            this.rulePermission = res.data.rulePermission.permissions
          }

          for(let i=0,length = this.allPermissionData.length; i < length; i++){

            for(let j=0,list= this.allPermissionData[i].categoryList,length2 = list.length; j < length2; j++){
              
              for(let k=0,length3 = this.rulePermission.length; k < length3; k++){

                if(this.rulePermission[k].id == list[j].id){

                  this.allPermissionData[i].checkId.push(list[j].id)

                }

              }

            }

          }
          
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
    },
    submitForm(){
      let permissionIds = ''
      for(let i=0,length = this.allPermissionData.length; i < length; i++){

        for(let j=0,list= this.allPermissionData[i].checkId, length2 = list.length; j < length2; j++){
          
          permissionIds += list[j] + ","

        }

      }
      //console.log(permissionIds)
      permissionIds = permissionIds.substring(0,permissionIds.length - 1)
      //console.log(permissionIds)
      core.editRolePermission({roleId: this.roleId,permissionIds: permissionIds}).then(res => {
        //console.log(res)
        if(res.code && res.code == '00'){
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
  watch: {
    
  }
}

</script>
<style lang='less'>
.edit-authority {

   .edit-authority-title{
    margin:20px 0;
    width: 100%;
    font-size: 24px;
    padding-bottom: 15px;
    box-sizing: border-box;
    border-bottom: 1PX solid #EBEEF5;
  }

  .toRecharge {
    color: #409EFF;
    text-decoration: underline;
    margin-left: 10px;
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
    margin-bottom: 18px;
  }

  .el-form--label-top .el-form-item__label {
    font-size: 18px;
    font-weight: 600;
    border-bottom: 1px dashed #ccc;
    width: 100%;
    padding: 0;
    margin-bottom: 10px;
  }

  .el-message-box { 
    width: 400PX;
  }
}

</style>
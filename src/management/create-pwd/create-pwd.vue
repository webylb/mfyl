<template>
  <div class="creat-pwd">
    <div class="creat-pwd-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>卡密管理</el-breadcrumb-item>
        <el-breadcrumb-item>生成卡密</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="80px">
      <el-form-item label="创建时间:">
        <el-date-picker
          v-model="form.times"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>

      <el-form-item style='float:right;'>
        <el-button type="primary" @click="search()">立即查询</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="24">
        <el-button type="primary" @click="creatPwd" icon="el-icon-plus">生成卡密</el-button>
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
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.createTime">{{ formatDate(scope.row.createTime) }}</span>
            <span v-else>0*0</span>
          </template>
        </el-table-column>
        <el-table-column
          label="面值X数量"
          align="center"
          >
          <template slot-scope="scope">
            <div v-if="scope.row.details">
              <span v-for="(item,index) in scope.row.details" :key="index" style="display:block;">{{item.faceValue}} * {{item.amount}}</span>
            </div>
            <span v-else>0*0</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="明细"
          align="center"
          >
          <template slot-scope="scope">
            <el-button @click="dowloadCam(scope.row.details[0].generateRecordId)" type="text" size="small">下载</el-button>
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
      title="卡密生成"
      :visible.sync="dialogInfoVisible"
      width="420px"
      :before-close="dialogClose"
      center>
      <el-form ref="dialogform" :model="dialogInfoForm" label-position="top">
        <el-form-item label="采购面值以及数量:">
          <div v-for="(item, index) in dialogInfoForm.listValue"
          :key="index" style="margin-bottom: 10px;display:flex;" >
            <el-select v-model="item.faceValue" clearable placeholder="请选择采购类型" style="width: 150px;">
              <el-option
                v-for="item in optionsListValue"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input clearable  placeholder="请填写采购数量" style="width: 150px;margin:0 10px;" v-model="item.amount"></el-input>
            <el-button v-if="index == dialogInfoForm.listValue.length - 1" @click.prevent="addItemValue()">添加</el-button>
            <el-button v-else @click.prevent="removeItemValue(item)" icon="el-icon-delete"></el-button>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="subInfo">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as core from '../../api/cam'
import tool from '../../utils/common'

export default {
  name: 'creatPwd',
  data() {
    var validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入员工名'));
      } else {
        callback();
      }
    }
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() - 3600 * 1000 * 24 * 1 > Date.now();
        }
      },
      loading: true,
      dialogInfoForm: {
        listValue: [{
          amount: '',
          faceValue: ''
        }],
      },
      dialogInfoVisible: false,
      form: {
        times: null
      },
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      tableData: [],
      optionsListValue: [
        {
          value: '10',
          label: '10元'
        },
        {
          value: '20',
          label: '20元'
        },
        {
          value: '50',
          label: '50元'
        },
        {
          value: '100',
          label: '100元'
        },
        {
          value: '200',
          label: '200元'
        },
        {
          value: '500',
          label: '500元'
        },
        {
          value: '1000',
          label: '1000元'
        },
        {
          value: '5000',
          label: '5000元'
        }
      ],
    }
  },
  created(){
    this.getCreateCamList({currentPage: this.currentPage,pageSize: this.pageSize})
  },
  methods: {
    getCreateCamList(opts){
      core.getCreateCamList(opts).then(res => {
        // console.log(res)
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
      let data = {
        currentPage: 1,
        pageSize: val
      }
      this.search(data)
    },
    handleCurrentChange(val) {
      this.currentPage = val
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
        data = { currentPage:1, pageSize:this.pageSize }
      }
      if(this.form.times){
        data.startTime = this.form.times[0]
        data.endTime = this.form.times[1]
      }
      this.getCreateCamList(data)
    },
    dialogClose(){
      this.dialogInfoVisible = false
    },
    creatPwd(){
      this.dialogInfoVisible = true
    },
    subInfo(){

      this.dialogInfoForm.listValue.forEach((item,index) => {
        if(item.faceValue == ""){
          this.dialogInfoForm.listValue.splice(index,1)
        }
      })
      if(this.dialogInfoForm.listValue && this.dialogInfoForm.listValue.length < 1){
        this.dialogInfoForm = {
          listValue: [{
            amount: '',
            faceValue: ''
          }]
        }
        this.$message.closeAll();
        this.$message.warning('请选择生成面额');
        return false
      }
      core.createCommonCam({camInfo: this.dialogInfoForm.listValue}).then(res => {
        //console.log(res)
        if(res.code && res.code == '00'){
          this.$message.success("卡密生成成功！请到明细中下载");
          this.dialogInfoVisible = false
          this.dialogInfoForm = {
            listValue: [{
              amount: '',
              faceValue: ''
            }]
          }
          this.loading = false
          this.getCreateCamList({currentPage: this.currentPage,pageSize: this.pageSize})
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    dowloadCam(id){
      core.dowloadCommonCam({generateRecordId:id}).then(res => {
        if(res.code){
          this.$message.warning(res.message);
        }else{
          const blob = new Blob([res],{type: 'application/vnd.ms-excel'});
          const fileName = '生成卡密列表.xls';
          const linkNode = document.createElement('a');

          linkNode.download = fileName; //a标签的download属性规定下载文件的名称
          linkNode.style.display = 'none';
          linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
          document.body.appendChild(linkNode);
          linkNode.click();  //模拟在按钮上的一次鼠标单击

          URL.revokeObjectURL(linkNode.href); // 释放URL 对象
          document.body.removeChild(linkNode);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    removeItemValue(val){
      var index = this.dialogInfoForm.listValue.indexOf(val)
      if (index !== -1) {
        this.dialogInfoForm.listValue.splice(index, 1)
      }
    },
    addItemValue(){
      this.dialogInfoForm.listValue.push({
        amount: '',
        faceValue: ''
      });
    },
  }
}

</script>
<style lang='less' scope>
.creat-pwd {

   .creat-pwd-title {
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
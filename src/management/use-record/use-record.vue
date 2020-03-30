<template>
  <div class="use-record">
    <div class="use-record-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>卡密管理</el-breadcrumb-item>
        <el-breadcrumb-item>使用记录</el-breadcrumb-item>
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
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="渠道:">
        <el-select v-model="form.channel" clearable placeholder="请选择" style="width: 140px;">
          <el-option
            v-for="item in options.channelOptions"
            :key="item.channelCode"
            :label="item.channelName"
            :value="item.channelCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡号:">
        <el-input v-model="form.cardNumber" clearable placeholder="请输入" style="width: 140px;"></el-input>
      </el-form-item>

      <el-form-item label="使用状态:">
        <el-select v-model="form.isUsed" clearable placeholder="请选择" style="width: 140px;">
          <el-option
            v-for="item in options.isUsedOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item style='float:right;'>
        <el-button type="primary" @click="search()">立即查询</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="ChangeChannelBind">渠道标识</el-button>
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
          label="创建时间"
          align="center"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.createTime">{{ formatDate(scope.row.createTime) }}</span>
            <span v-else>0*0</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="channel"
          label="渠道"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="camFaceValue"
          label="卡密面值（元）"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="cardNumber"
          label="卡号"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="camNumber"
          label="卡密"
          align="center"
         >
        </el-table-column>
        <el-table-column
          label="使用状态"
          align="center"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.isUsed == 'N'">未使用</span>
            <span v-else>已使用</span>
          </template>
        </el-table-column>
        <el-table-column
          label="使用时间"
          align="center"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.isUsed == 'N'">--</span>
            <span v-else>{{ formatDate(scope.row.useTime) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="pageTotal>0" class="pagination-box">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10,20, 30, 40, 50]"
          :page-size="10"
          layout="sizes, prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </div>
    </div>

    <el-dialog
      title="渠道信息"
      :visible.sync="dialogInfoVisible"
      width="420px"
      :before-close="dialogClose"
      center>
      <el-form ref="dialogform" :model="dialogInfoForm" label-width="100px">
        <el-form-item label="卡号:">
          <el-upload
            ref="upload"
            class="upload-demo"
            action=""
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :before-upload="beforeAvatarUpload"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :http-request="uploadFile">
            <el-button size="small" type="text">导入卡号</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="渠道:">
          <el-select v-model="dialogInfoForm.channel" clearable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in options.dialogOptions"
              :key="item.channelCode"
              :label="item.channelName"
              :value="item.channelCode">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subChannelInfo">立即标识</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title=""
      :visible.sync="dialogHintVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <div class="margin:20px auto;text-align:center;font-size;16px;">
        <div style="text-align:center;">
          <i :class="hintIcon" :style="{color: hintIcon=='el-icon-success' ? '#67c23a' : '#f56c6c',fontSize: '80px'}"></i>
        </div>
        <div style="text-align:center;font-size: 18px;margin: 10px 0;">{{ hintTitle }}</div>
        <div style="text-align:center;margin:0 25px;">
          {{ hintText }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogHintVisible = false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as core from '../../api/cam'
import tool from '../../utils/common'

export default {
  name: 'useRecord',
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
      fileList:[],
      readonly: true,
      form: {
        times: '',
        channel: '',
        cardNumber:'',
        isUsed: ''
      },
      dialogInfoForm: {
        excelFile: null,
        channel: ''
      },
      dialogInfoVisible: false,
      dialogHintVisible: false,
      options: {
        channelOptions: [],
        isUsedOptions: [
          {
            value: 'Y',
            label: '已使用'
          },
          {
            value: 'N',
            label: '未使用'
          }
        ],
        dialogOptions: [

        ]
      },
      pageSize: 10,
      currentPage: 1,
      pageTotal: 0,
      tableData: [],
      hintText: '',
      hintIcon: '',
      hintTitle: ''
    }
  },
  created(){
    this.getCamUseList({currentPage:this.currentPage, pageSize:this.pageSize})
    this.getCommonChannel()
    // core.dowloadCamTemplate().then(res => {
    //   console.log(res)
    //   const blob = new Blob([res],{type: 'application/vnd.ms-excel'});
    //   const fileName = '卡密模板.xls';
    //   const linkNode = document.createElement('a');

    //   linkNode.download = fileName; //a标签的download属性规定下载文件的名称
    //   linkNode.style.display = 'none';
    //   linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
    //   document.body.appendChild(linkNode);
    //   linkNode.click();  //模拟在按钮上的一次鼠标单击

    //   URL.revokeObjectURL(linkNode.href); // 释放URL 对象
    //   document.body.removeChild(linkNode);
    // })
  },
  methods: {
    getCamUseList(opts){
      core.getCamUseList(opts).then(res => {
        if(res.code && res.code === "00"){
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
    getCommonChannel(){
      core.getCommonChannel().then(res => {
        if(res.code && res.code === "00"){
          //console.log(res)
          if(res.data){
            this.options.channelOptions = res.data
            res.data.forEach((item,index) => {
              if(item.channelCode != 'COMMON'){
                this.options.dialogOptions.push(item)
              }
            })
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
    search(opts){
      this.loading = true
      let data = null
      if(opts){
        data = opts
      }else{
        this.currentPage = 1
        data = {currentPage: 1, pageSize: this.pageSize}
      }
      if(this.form.times){
        data.startTime = this.form.times[0]
        data.endTime = this.form.times[1]
      }
      if(this.form.channel){
        data.channel = this.form.channel
      }
      if(this.form.cardNumber){
        data.cardNumber = this.form.cardNumber
      }
      if(this.form.isUsed){
        data.isUsed = this.form.isUsed
      }
      this.getCamUseList(data)
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
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请删除后继续上传`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    beforeAvatarUpload(file){
      // console.log('beforeUpload')
      // console.log(file.type)
      const isText = file.type === 'application/vnd.ms-excel'
      const isTextComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      return (isText | isTextComputer)
    },
     // 上传文件
    uploadFile (item) {
      //console.log(item)
      const fileObj = item.file
      // FormData 对象
      const form = new FormData()
      // 文件对象
      form.append('excelFile', fileObj)
      this.dialogInfoForm.excelFile = form
    },
    subChannelInfo(){
      if(!this.dialogInfoForm.excelFile){
        this.$message.warning("请导入Excel文件")
        return false
      }
      if(!this.dialogInfoForm.channel){
        this.$message.warning("请选择渠道")
        return false
      }
      const form = this.dialogInfoForm.excelFile
      form.set('channel', this.dialogInfoForm.channel)
      core.changeChannelBind(form).then(res => {
        if(res.code && res.code === "00"){
          this.dialogInfoVisible = false
          this.dialogInfoForm = {
            excelFile: null,
            channel: ''
          }
          this.dialogHintVisible = true
          this.hintTitle = "渠道修改成功！"
          this.hintIcon = "el-icon-success"
          this.hintText = ""
          this.$refs.upload.clearFiles()
          this.getCamUseList({currentPage:this.currentPage, pageSize:this.pageSize})
        }else{
          this.dialogInfoVisible = false
          this.dialogHintVisible = true
          this.hintTitle = "渠道修改失败！"
          this.hintIcon = "el-icon-error"
          this.hintText = res.message
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    dialogClose(){
      this.dialogInfoVisible = false
      this.dialogHintVisible = false
      this.fileList = []
    },
    subHintInfo(){

    },
    subCompanyInfo(){

    },
    ChangeChannelBind(){
      this.dialogInfoVisible = true
    }
  }
}

</script>
<style lang='less' scope>
.use-record {

   .use-record-title {
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
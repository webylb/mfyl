<template>
  <div class="coupon-recommend">
    <div class="coupon-recommend-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城配置</el-breadcrumb-item>
        <el-breadcrumb-item>首页卡券推荐</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" :inline="true" label-position="center" label-width="80px">
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="addGoods(1)">添加卡券</el-button>
      </el-form-item>
    </el-form>
    <div class="page-content">
      <el-table
        :data="tableData"
        stripe
        header-align="center"
        style="width: 100%;border:1px solid #EBEEF5;">
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
          prop="name"
          label="icon"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="province"
          label="跳转链接"
          align="center"
          >
        </el-table-column>
        <el-table-column
          label="页面排序"
          align="center"
          :key="Math.random()"
         >
         <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="scope.$index!==0"
              @click="moveUp(scope.$index,scope.row)"><i class="el-icon-top"></i></el-button>
            <el-button
              size="mini"
              :disabled="scope.$index===(tableData.length-1)"
              @click="moveDown(scope.$index,scope.row)"><i class="el-icon-bottom"></i></el-button>
            <!-- <el-button type="info" size="mini" round v-if="scope.$index===0">默认</el-button> -->
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          >
          <template slot-scope="scope">
            <el-button @click="addGoods(2,scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="pageTotal>0" class="pagination-box">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[20, 30, 40, 50]"
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
        <el-form-item label="icon:">
          <el-upload
            class=""
            action="https://jsonplaceholder.typicode.com/posts/"
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="subGoodsInfo">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
''

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
      title: '添加商品',
      dialogInfoForm: {
        name: '杭州聚积宝网络科技有限公司',
        icon: '',
        link: '1321454121245'
      },
      limit: 1,
      fileList: [{
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }],
      dialogInfoVisible: false,
      currentPage: 5,
      pageTotal: 400,
      tableData: [{
          index: '1',
          date: '2016-05-02',
          name: '王小虎1',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: ''
        }, {
          index: '2',
          date: '2016-05-04',
          name: '王小虎2',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1517 弄',
          zip: 200333
        }, {
          index: '3',
          date: '2016-05-01',
          name: '王小虎3',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1519 弄',
          zip: ''
        }, {
          index: '4',
          date: '2016-05-03',
          name: '王小虎4',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1516 弄',
          zip: 200333
        }]
    }
  },
  created(){
    
  },
  methods: {
    getData(){
      core.getServiceCenter({pageKey: 'servce_center'}).then(res => {
        console.log(res)
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    dialogClose(){
      this.dialogInfoVisible = false
    },
    subGoodsInfo(){
      this.$message({
        message: '积分发放成功!',
        type: 'success'
      });
    },
    handleClick(){
      this.dialogInfoVisible = true
    },
    addGoods(status,row){
      if(status == 1){
        this.title = '添加卡券'
      }else if(status == 2){
        this.title = '编辑卡券'
      }
      this.dialogInfoVisible = true
    },
    handleSuccess(file, fileList) {
      console.log(file,fileList)
      this.fileList = fileList.slice(-1)
    },
    handleExceed(){
      this.$message.closeAll();
      this.$message({
        message: '最大上传文件数为1!',
        type: 'warning'
      });
    },
    //上移
    moveUp(index,row){
      var that = this;
      console.log('上移',index,row);
      console.log(that.tableData[index]);
      if (index > 0) {
        let upDate = that.tableData[index - 1];
        that.tableData.splice(index - 1, 1);
        that.tableData.splice(index,0, upDate);
      } else {
        alert('已经是第一条，不可上移');
      }
    },
  
    //下移
    moveDown(index,row){
      var that = this;
      console.log('下移',index,row);
      if ((index + 1) === that.tableData.length){
        alert('已经是最后一条，不可下移');
      } else {
        console.log(index);
        let downDate = that.tableData[index + 1];
        that.tableData.splice(index + 1, 1);
        that.tableData.splice(index,0, downDate);
      }
    }
  }
}

</script>
<style lang='less'>
.coupon-recommend {

   .coupon-recommend-title {
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
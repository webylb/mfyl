<template>
  <div class="virtual-order-list">
    <!-- <div class="virtual-order-list-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>卡密管理</el-breadcrumb-item>
        <el-breadcrumb-item>采购申请</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="80px">
      <el-form-item label="订单号:">
        <el-input v-model="form.name" clearable placeholder="" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item label="用户ID:">
        <el-input v-model="form.name" clearable placeholder="" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item label="商品名称:">
        <el-input v-model="form.name" clearable placeholder="" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item label="二级分类:">
        <el-select v-model="value" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="充值类型:">
        <el-select v-model="value" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品来源:">
        <el-select v-model="value" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品ID:">
        <el-input v-model="form.name" clearable placeholder="" style="width: 120px;"></el-input>
      </el-form-item>

      <el-form-item label="SkuID:">
        <el-input v-model="form.name" clearable placeholder="" style="width: 120px;"></el-input>
      </el-form-item>

      <el-form-item label="订单状态:">
        <el-select v-model="value" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item style='float:right;'>
        <el-button type="primary">立即查询</el-button>
        <el-button type="primary">导  出</el-button>
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
          prop="date"
          label="下单时间"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="name"
          label="订单号"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="用户ID"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品ID"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名称"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品SKU"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="SkuID"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="二级分类"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="充值类型"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="province"
          label="充值账号"
          align="center"
          >
        </el-table-column>

        <el-table-column
          label="订单状态"
          align="center"
         >
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if="scope.row.zip">已发货</el-button>
            <el-button type="text" size="small" v-else>待发货</el-button>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="150px"
          align="center"
          >
          <template slot-scope="scope">
            <el-button @click="reissue(scope.row)" type="text" size="small" v-if="scope.row.zip">补发</el-button>
            <el-button @click="refund(scope.row)" type="text" size="small" v-else>退款</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="pageTotal>0" class="pagination-box">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[20, 30, 40, 50]"
          :page-size="10"
          layout="sizes, prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </div>
    </div>

    <el-dialog
      :title="title"
      :visible.sync="dialogHintVisible"
      width="400px"
      :before-close="dialogClose"
      center>
      <div style="margin:20px auto;text-align:center;font-size;16px;">
        {{ hintText }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogHintVisible = false">取 消</el-button>
        <el-button type="primary" @click="subHintInfo">确认</el-button>
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
      sendStatus: '3',//1 发货, 2.查看物流, 3.退款, 4.补发
      title: '退款提示',
      hintText: '操作退款后，该笔订单支付的积分将原路返回到支付账户，请问您确定要退款吗？',
      dialogHintVisible: false,
      form: {
        name: '',
        date: ''
      },
      value: [],
      options: [
        {
          value: 'zhinan',
          label: '指南'
        },
        {
          value: 'daohang',
          label: '导航'
        }
      ],
      currentPage: 5,
      pageTotal: 400,
      tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: ''
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1517 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1519 弄',
          zip: ''
        }, {
          date: '2016-05-03',
          name: '王小虎',
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
      this.dialogHintVisible = false;
    },
    reissue(row){
      this.dialogHintVisible = true
      this.sendStatus = 4,
      this.title = '操作提示'
      this.hintText = '确定进行补单操作？'
    },
    refund(row){
      this.dialogHintVisible = true
      this.sendStatus = 3,
      this.title = '退款提示'
      this.hintText = '操作退款后，该笔订单支付的积分将原路返回到支付账户，请问您确定要退款吗？'
    },
    subHintInfo(){
      if(this.sendStatus == 4){
        //补发
        console.log("补发")
      }else{
        //只有3,退款
        console.log("退款")
      }
    }
  }
}

</script>
<style lang='less' scope>
.virtual-order-list {

   .virtual-order-list-title {
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
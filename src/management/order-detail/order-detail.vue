<template>
  <div class="order-dertail">
    <div class="order-dertail-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/physical-order-list' }">订单列表</el-breadcrumb-item>
        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form"  label-position="top" label-width="80px" v-loading="loading">
      <el-form-item label="订单信息">
        <div class="flex-box">
          <div>订单号：<span>{{ tableData.id }}</span></div>
          <div>下单时间：<span>{{ formatDate(tableData.createTime) }}</span></div>
          <div>用户id：<span>{{ tableData.userId }}</span></div>
          <div>订单状态：

            <span v-if="tableData.payStatus == 'WAIT'">待付款</span>
            <span v-else-if="tableData.payStatus == 'SUCCESS'">
              <span v-if="tableData.shipStatus == 'WAIT'">待发货</span>
              <span v-else>
                <span v-if="tableData.confirmReceiptStatus == 'WAIT'">
                  <span>待收货</span>
                  <el-button type="text" @click="dialogClick" style="margin-left:20px;">查看物流</el-button>
                </span>
                <span v-else>
                  <span>已完成</span>
                </span>
              </span>
            </span>
            <span v-else>
              已关闭
            </span>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="收货信息">
        <div class="flex-box">
          <div>姓名：<span>{{ tableData.realname }}</span></div>
          <div>联系电话：<span>{{ tableData.mobile }}</span></div>
          <div>收货地址：<span>{{ tableData.province }} {{ tableData.city }} {{ tableData.district || ''  }} {{ tableData.town || '' }}</span></div>
        </div>
      </el-form-item>
      <el-form-item label="商品信息">
        <div class="page-content">
          <el-table
            :data="tableData2"
            stripe
            header-align="center"
            style="width: 100%;border:1px solid #EBEEF5;"
            >
            <el-table-column
              label="序号"
              type="index"
              width="80"
              align="center">
            </el-table-column>
            <el-table-column
              prop="id"
              label="商品id"
              align="center"
              min-width="120"
              >
            </el-table-column>
            <el-table-column
              label="商品图片"
              align="center"
              max-width="200"
              >
              <template slot-scope="scope">
                <img :src="scope.row.itemCover" alt="" style="width:100%;height:auto">
              </template>
            </el-table-column>
            <el-table-column
              prop="itemTitle"
              label="商品名称"
              align="center"
            >
            </el-table-column>

            <el-table-column
              prop="orderChannel"
              label="商品渠道"
              align="center"
            >
              <!-- <template slot-scope="scope">
                <span v-if="scope.row.orderChannel == 'ZiYing'">自营</span>
                <span v-else-if="scope.row.shipStatus == 'WangYiKaoLao'">网易考拉</span>
                <span v-else-if="scope.row.shipStatus == 'WangYIYanXuan'">网易严选</span>
              </template> -->
            </el-table-column>

            <el-table-column
              prop="skuId"
              label="skuid"
              align="center"
              >
            </el-table-column>
            <el-table-column
              label="商品sku"
              align="center"
              min-width="300"
            >
              <template slot-scope="scope">
                <div v-for="(item,index) in formatStr(scope.row.specNameValueJson)" :key="index">
                  {{ item.key }}: {{item.value}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="单价（元）"
              prop="skuPrice"
              align="center"
              >
            </el-table-column>
            <el-table-column
              prop="num"
              label="数量"
              align="center"
            >
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
    </el-form>


    <el-dialog
      title="物流信息"
      :visible.sync="dialogInfoVisible"
      width="420px"
      :before-close="dialogClose"
      center>
      <el-form label-width="100px">
        <el-form-item label="快递公司:">
          {{ tableData.expressCompany }}
        </el-form-item>
        <el-form-item label="物流单号:">
          {{ tableData.expressOrderId }}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogInfoVisible = false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as core from '../../api/order'
import * as merchantCore from '../../api/merchant'
import tool from '../../utils/common'

export default {
  name: 'physicalOrderList',
  data() {
    return {
      loading: true,
      dialogInfoVisible: false,
      pageSize: 10,
      currentPage: 1,
      pageTotal: 0,
      tableData: {},
      tableData2: []
    }
  },
  created(){
    if(this.$route.query.id){
      this.getUserOrderList({pageSize: this.pageSize,currentPage: this.currentPage,orderId: this.$route.query.id,orderStatus: 'All'})
    }
  },
  methods: {
    getUserOrderList(opts){
      core.getUserOrderList(opts).then(res => {
        //console.log(res)
        if(res.code && res.code == '00'){
          this.pageTotal = res.data.amount
          this.tableData = res.data.data[0]
          this.tableData.orderDetails.forEach((item,index) => {
            item.orderChannel = res.data.data[0].orderChannel
          })
          this.tableData2 = this.tableData.orderDetails
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
    formatStr(val){
      const sku = JSON.parse(val)
      const data = []
      for (let [k, v] of Object.entries(sku)) {
          data.push({key: k ,value: v});
      }
      return data
    },
    dialogClick(){
      this.dialogInfoVisible = true
    },
    dialogClose(){
      this.dialogInfoVisible = false
    }
  }
}

</script>
<style lang='less' scope>
.order-dertail {

   .order-dertail-title {
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

  .flex-box {
    display: flex;
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
    div {
      min-width: 20%;
      padding-left: 10px;
    }
  }
  .page-content {

    .pagination-box {
      text-align: right;
      margin-top: 10px;
    }

  }
  .el-form--label-top .el-form-item__label {
    font-size: 18px;
    font-weight: 600;
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
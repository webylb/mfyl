<template>
  <div class="physical-market-sku">
    <div class="physical-market-sku-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城配置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path:'/physical-market' }">实物商品集市</el-breadcrumb-item>
        <el-breadcrumb-item>sku管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" label-position="center" label-width="0px" class="sku-form" v-loading="loading">
      <el-form-item v-for="(item,index) in listValue" :key="item.sort" class="sku-item">
        <div class="sku-item-wrap">
          <div class="sku-item-specName">
            <div class="sku-title">规格:</div>
            <el-input clearable placeholder="请填写规格名称" style="width: 150px;margin-right: 20px;" v-model="item.specName" v-on:blur="changeContent()"></el-input>
            <el-button type="text" @click.prevent="removeItemValue(item)" class="delete-sku-item">删除规格</el-button>
          </div>
          <div class="sku-item-specVals">
            <div class="sku-title">规格值:</div>
            <div class="list">
              <el-input v-for="(specVal, i) in item.specValues" :key="i" v-model="item.specValues[i]" clearable v-on:blur="changeContent()" style="width: 150px;margin-right: 20px;"></el-input>
              <el-button @click.prevent="addItemDetailValue(index)" icon="el-icon-plus" style="margin-bottom:10px;"></el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="sku-info">
          <div>
            <el-button type="primary" icon="el-icon-plus" @click.prevent="addItemValue()">添加规格</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-show="skuData.specInfo.length > 0">
        <el-table :data="skuData.specInfo" border stripe>
         <el-table-column
          v-for="(item, index) in skuData.specHeaderInfo" :key="index"
          :property="item.val"
          :label="item.label"
          align="center"
         >
            <template slot-scope="scope">
              <div v-if="item.val == 'price'">
                <el-input clearable v-model="scope.row[scope.column.property]" @focus="checkFocusVal(scope.row,scope.$index,scope.row[scope.column.property],'p')" @blur="checkBlurVal(scope.row,scope.$index,scope.row[scope.column.property],'p')" @input="print('price',scope.$index,$event)" placeholder="" style="text-align:center;"></el-input>
              </div>
              <div v-else-if="item.val == 'marketPrice'">
                <el-input clearable v-model="scope.row[scope.column.property]" @focus="checkFocusVal(scope.row,scope.$index,scope.row[scope.column.property],'mp')" @blur="checkBlurVal(scope.row,scope.$index,scope.row[scope.column.property],'mp')" @input="print('marketPrice',scope.$index,$event)" placeholder="" style="text-align:center;"></el-input>
              </div>
              <div v-else-if="item.val == 'operate'">
                <el-button @click="addStock(scope.row,scope.$index)" type="text" size="small">添加库存</el-button>
                <el-button v-if="scope.row[scope.column.property].isEnable == 'N'" @click="upStatus(scope.row,scope.$index,'Y')" type="text" size="small">上架</el-button>
                <el-button v-else @click="upStatus(scope.row,scope.$index,'N')" type="text" size="small">下架</el-button>
              </div>
              <div v-else>
                {{scope.row[scope.column.property]}}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSku">立即保存</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="添加库存"
      :visible.sync="dialogInfoVisible"
      width="420px"
      :before-close="dialogClose"
      center>
      <el-form ref="dialogform" :model="dialogInfoForm" label-position="top">
        <el-form-item style="margin: 20px 0 0 0;">
          <el-input clearable v-model="dialogInfoForm.stock" placeholder="请输入要添加的库存数量" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="subAddStock">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as core from "../../api/mall"
export default {
  name: 'physicalMarketSku',
  data() {
    return {
      loading: true,
      itemId: null,
      editSku: false,
      isCreate: null,
      listValue: [],
      skuData: {
        specInfo:[], //用于表格内容数据组装
        specHeaderInfo: [] //用于表格头部数据组装
      },
      specNameValueJson:[], //用于提交数据组装
      itemSkus: [],
      editIndex: null,
      dialogInfoVisible: false,
      dialogInfoForm: {
        stock: ""
      }
    }
  },
  created(){
    if(this.$route.query.itemId){
      this.itemId = this.$route.query.itemId
      this.searchGoodsDetail(this.itemId)
    }
  },
  methods: {
    searchGoodsDetail(id){
      core.searchGoodsDetail({itemId: id}).then(res => {
        if(res.code && res.code === "00"){
          //console.log(res)
          if(res.data.itemSkus.length > 0){
            this.editSku = true
          }
          //组装from表单数据
          const spec1 = res.data.itemSpecNames
          const spec2 = res.data.itemSpecValues
          const arr = []
          for(let i=0, length1 = spec1.length; i<length1; i++){
            arr[i] = {}
            arr[i].specName = spec1[i].specName
            arr[i].sort = i
            arr[i].specValues = []
            for(let j=0, length2 = spec2.length; j<length2; j++){
              if(spec2[j].specId == spec1[i].id){
                arr[i].specValues.push(spec2[j].specValue)
              }
            }
          }
          this.listValue = JSON.parse(JSON.stringify(arr))
          //组装table表格数据
          this.itemSkus = JSON.parse(JSON.stringify(res.data.itemSkus))
          if(this.itemSkus.length < 1){
            //console.log('creat')
            this.createPreviewSku()
          }else{
            //console.log('edit')
            this.editPreviewSku()
          }
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
    changeContent(){
      this.createPreviewSku()
    },
    removeItemValue(val){
      var index = this.listValue.indexOf(val)
      if (index !== -1) {
        this.listValue.splice(index, 1)
      }
      this.createPreviewSku()
    },
    addItemValue(){
      this.listValue.push({
        specName: '',
        specValues: [],
        sort: ''
      });
    },
    addItemDetailValue(index){
      this.listValue[index].specValues = this.listValue[index].specValues.filter(item => item)
      this.listValue[index].specValues.push("")
    },
    print(type,index,val) {
      console.log(type,index,val);
    },
    checkFocusVal(row,index,val,type){
      //console.log(row,index,val)
      if(val == 0){
        if(type == 'p'){
          this.skuData.specInfo[index].price = null
        }else{
          this.skuData.specInfo[index].marketPrice = null
        }
      }
    },
    checkBlurVal(row,index,val,type){
      //console.log(row,index,val)
      if(!val || val < 1){
        if(type == 'p'){
          this.skuData.specInfo[index].price = 0
        }else{
          this.skuData.specInfo[index].marketPrice = 0
        }
      }
    },
    editPreviewSku(){
      this.skuData.specInfo = []
      this.skuData.specHeaderInfo = []
      this.specNameValueJson = []
      this.itemSkus.forEach((item,index) =>{
        this.specNameValueJson[index] = item.specNameValueJson
        this.skuData.specInfo[index] = JSON.parse(item.specNameValueJson)
        this.skuData.specInfo[index].price = this.itemSkus[index].price
        this.skuData.specInfo[index].marketPrice = this.itemSkus[index].marketPrice
        this.skuData.specInfo[index].stock = this.itemSkus[index].stock
        this.skuData.specInfo[index].operate = {isEnable: this.itemSkus[index].isEnable}
      })
      this.skuData.specInfo = JSON.parse(JSON.stringify(this.skuData.specInfo))
      let arr = []
      arr = Object.keys(this.skuData.specInfo[0])
      arr.forEach((item,index)=>{
        arr[index] = {}
        if(item == 'price'){
          arr[index] = {label: '价格',val: item}
        }else if(item == 'marketPrice'){
          arr[index] = {label: '市场价',val: item}
        }else if(item == 'stock'){
          arr[index] = {label: '库存',val: item}
        }else if(item == 'operate'){
          arr[index] = {label: '操作',val: item}
        }else{
          arr[index] = {label: item,val: item}
        }
      })
      this.skuData.specHeaderInfo = arr

      this.loading = false
    },
    createPreviewSku(){
      this.loading = true
      let data = {};
      data.itemId = this.itemId
      data.specNameAndValues = this.listValue

      core.createPreviewSku(data).then(res => {
        if(res.code && res.code == "00"){
          //console.log(res,"create")
          this.loading = false
          this.skuData.specInfo = []
          this.skuData.specHeaderInfo = []
          this.specNameValueJson = []
          res.data.forEach((item,index) =>{
            this.specNameValueJson[index] = item.specNameValueJson
            this.skuData.specInfo[index] = JSON.parse(item.specNameValueJson)
            this.skuData.specInfo[index].price = '0'
            this.skuData.specInfo[index].marketPrice = '0'
            this.skuData.specInfo[index].stock = '0'
            this.skuData.specInfo[index].operate = {isEnable: 'N'}
          })

          this.skuData.specInfo = JSON.parse(JSON.stringify(this.skuData.specInfo))
          //this.skuData.specHeaderInfo = Object.keys(this.skuData.specInfo[0])
          let arr = []
          arr = Object.keys(this.skuData.specInfo[0])
          arr.forEach((item,index)=>{
            arr[index] = {}
            if(item == 'price'){
              arr[index] = {label: '价格',val: item}
            }else if(item == 'marketPrice'){
              arr[index] = {label: '市场价',val: item}
            }else if(item == 'stock'){
              arr[index] = {label: '库存',val: item}
            }else if(item == 'operate'){
              arr[index] = {label: '操作',val: item}
            }else{
              arr[index] = {label: item,val: item}
            }
          })
          this.skuData.specHeaderInfo = arr
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
    addStock(row,index){
      this.editIndex = index
      this.dialogInfoVisible = true
    },
    subAddStock(){
      let index = this.editIndex
      this.skuData.specInfo[index].stock = this.dialogInfoForm.stock
      this.dialogInfoVisible = false
      this.dialogInfoForm.stock = null
    },
    upStatus(row,index,type){
      this.skuData.specInfo[index].operate = {isEnable: type}
    },
    saveSku(){
      let itemId = this.itemId

      //组合sku
      let specInfo = { itemId: itemId }
      specInfo.specNameAndValues = this.listValue

      //组合表格数据
      let candidateSkus = []

      this.skuData.specInfo.forEach((item,index) => {
        candidateSkus[index] = {}
        candidateSkus[index].price = item.price
        candidateSkus[index].marketPrice = item.marketPrice
        candidateSkus[index].stock = item.stock
        candidateSkus[index].isEnable = item.operate.isEnable
      })

      this.specNameValueJson.forEach((item,index) => {
        candidateSkus[index].specNameValueJson = item
        candidateSkus[index].itemId = itemId
      })

      let data = {
        specInfo,
        candidateSkus
      }
      core.saveSku(data).then(res => {
        if(res.code && res.code === "00"){
          this.$message.success("操作成功");
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    dialogClose(){
      this.dialogInfoVisible = false
      this.dialogInfoForm.stock = null
    }
  }
}

</script>
<style lang='less' scope>
.physical-market-sku {

   .physical-market-sku-title {
    margin:20px 0;
    width: 100%;
    font-size: 24px;
    padding-bottom: 15px;
    box-sizing: border-box;
    border-bottom: 1PX solid #EBEEF5;
  }

  .sku-form{
    border:1PX solid #DCDFE6;
    min-height:100px;
    min-width: 500px;
    border-radius: 5px;
    padding: 0 20px;
    padding-top: 30px;

    .sku-item {
      padding: 25px 0;
      margin: 0;
      border-top:1PX solid #DCDFE6;
    }
    .sku-item:first-child {
      border-top:1PX solid transparent;
    }

    .sku-item-wrap{
      .sku-item-specName {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 10px;
      }
      .sku-item-specVals {
        display: flex;
        justify-content: flex-start;

        .list {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;

          .el-input {
            margin-bottom: 10px;
          }
        }

      }
      .sku-title {
        height: 40px;
        display: inline-block;
        width: 80px;
        text-align: left;
        margin-right: 20px;
        line-height: 40px;
        font-weight: 600;
        font-size: 16px;
      }
      .delete-sku-item{
        float: right;
      }
    }
  }


}

</style>
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

            <span v-if="index === 0" style="margin-right:20px;">
              <el-checkbox v-model="useImg" label="添加规格图片"></el-checkbox>
            </span>

            <el-button type="text" @click.prevent="removeItemValue(item)" class="delete-sku-item">删除规格</el-button>
          </div>
          <div class="sku-item-specVals">
            <div class="sku-title">规格值:</div>
            <div class="list" v-if="index === 0">
              <div class="item_sku" v-for="(specVal, i) in item.specValues" :key="i">
                <el-input v-model="item.specValues[i]" @input="changeSpecValues(item, index, i)" v-on:blur="changeContent()" style="width: 150px;margin-right: 20px;">
                  <el-button slot="append" icon="el-icon-delete" @click="delateSpecValues(item, index, i)"></el-button>
                </el-input>
                <el-upload
                  v-show="useImg"
                  class="avatar-uploader"
                  :action="action"
                  :show-file-list="false"
                  :on-success="function (res,file){return handleAvatarSuccess(res,file,item.specValues[i],item,i)}"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="item.specValueAndImage && item.specValueAndImage.length > 0 && item.specValueAndImage[i]" :src="splitImg(item.specValueAndImage[i])" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
              <el-button @click.prevent="addItemDetailValue(index)" icon="el-icon-plus" style="margin-bottom:10px;"></el-button>
            </div>
            <div class="list" v-else>
              <div class="item_sku" v-for="(specVal, i) in item.specValues" :key="i">
                <el-input v-model="item.specValues[i]" @input="changeDefSpecValues(item, index, i)" v-on:blur="changeContent()" style="width: 150px;margin-right: 20px;">
                  <el-button slot="append" icon="el-icon-delete" @click="delateSpecValues(item, index, i)"></el-button>
                </el-input>
              </div>
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
              <div v-else-if="item.val == 'costPrice'">
                <el-input clearable v-model="scope.row[scope.column.property]" @focus="checkFocusVal(scope.row,scope.$index,scope.row[scope.column.property],'cp')" @blur="checkBlurVal(scope.row,scope.$index,scope.row[scope.column.property],'cp')" @input="print('costPrice',scope.$index,$event)" placeholder="" style="text-align:center;"></el-input>
              </div>
              <div v-else-if="item.val == 'stock'">
                <el-input clearable v-model="scope.row[scope.column.property]" @focus="checkFocusVal(scope.row,scope.$index,scope.row[scope.column.property],'st')" @blur="checkBlurVal(scope.row,scope.$index,scope.row[scope.column.property],'st')" @input="print('stock',scope.$index,$event)" placeholder="" style="text-align:center;"></el-input>
              </div>
              <div v-else-if="item.val == 'barCode'">
                <el-input clearable v-model="scope.row[scope.column.property]" @focus="checkFocusVal(scope.row,scope.$index,scope.row[scope.column.property],'bc')" @blur="checkBlurVal(scope.row,scope.$index,scope.row[scope.column.property],'bc')" @input="print('barCode',scope.$index,$event)" placeholder="" style="text-align:center;"></el-input>
              </div>
              <div v-else-if="item.val == 'goodSku'">
                <el-input clearable v-model="scope.row[scope.column.property]" @focus="checkFocusVal(scope.row,scope.$index,scope.row[scope.column.property],'gs')" @blur="checkBlurVal(scope.row,scope.$index,scope.row[scope.column.property],'gs')" @input="print('goodSku',scope.$index,$event)" placeholder="" style="text-align:center;"></el-input>
              </div>
              <div v-else-if="item.val == 'operate'">
                <!-- <el-button @click="addStock(scope.row,scope.$index)" type="text" size="small">添加库存</el-button> -->
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
import CONGIF from "../../api/config"
import * as core from "../../api/mall"
export default {
  name: 'physicalMarketSku',
  data() {
    return {
      action: CONGIF.UPLOAD_IMAGE,
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
      },
      useImg: false,
      imageUrl: '',
      editAoLinPiKe: false,
      editZiYing: false
    }
  },
  watch: {
    listValue(newVal){
      // console.log("watch----" + newVal)
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
          // console.log(res)
          if(res.data.itemSkus.length > 0){
            this.editSku = true
          }
          if(res.data.itemChannel === "AoLinPiKe"){
            this.editAoLinPiKe = true
          }else if(res.data.itemChannel === "ZiYing"){
            this.editZiYing = true
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
            arr[i].specValueAndImage = []
            for(let j=0, length2 = spec2.length; j<length2; j++){
              if(spec2[j].specId == spec1[i].id){
                arr[i].specValues.push(spec2[j].specValue)
                if(spec2[j].skuImage){
                  this.useImg = true
                  arr[i].specValueAndImage[j] = spec2[j].specValue + spec2[j].skuImage || ''
                }
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
        sort: '',
        specValueAndImage: []
      });
    },
    addItemDetailValue(index){
      this.listValue[index].specValues = this.listValue[index].specValues.filter(item => item)
      this.listValue[index].specValues.push("")
    },
    splitImg(val){
      if(val){
        return 'https' + val.split('https')[1]
      }
    },
    checkStrLength(str) {
       return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
    },
    subStringEllipsis(str, len){
      // eslint-disable-next-line no-control-regex
      var regexp = /[^\x00-\xff]/g // 正在表达式匹配中文
      // 当字符串字节长度小于指定的字节长度时
      if (str.replace(regexp, "aa").length <= len) {
        return str;
      }
      // 假设指定长度内都是中文
      var m = Math.floor(len/2);
      for (var i = m, j = str.length; i < j; i++) {
        // 当截取字符串字节长度满足指定的字节长度
        if (str.substring(0, i).replace(regexp, "aa").length >= len) {
          return str.substring(0, i);
        }
      }
      return str;
    },
    changeSpecValues(data, index, i){
      // console.log(data, index)
      if(this.checkStrLength(data.specValues[i]) > 46){
        let val = data.specValues[i]
        data.specValues[i] = this.subStringEllipsis(data.specValues[i], 46)
        // console.log(data.specValues[i])
        this.$message.closeAll();
        this.$message.info('字符长度已达上限');
      }
      this.$set(this.listValue, data, index);
      for(let i=0, length1 = this.listValue[0].specValues.length; i<length1; i++){
        if(this.splitImg(this.listValue[0].specValueAndImage[i])){
          this.listValue[0].specValueAndImage[i] = this.listValue[0].specValues[i] + this.splitImg(this.listValue[0].specValueAndImage[i])
        }else{
          this.listValue[0].specValueAndImage[i] = null
        }
      }
    },
    changeDefSpecValues(data, index, i){
      if(this.checkStrLength(data.specValues[i]) > 46){
        let val = data.specValues[i]
        data.specValues[i] = this.subStringEllipsis(data.specValues[i], 46)
        // console.log(data.specValues[i])
        this.$message.closeAll();
        this.$message.info('字符长度已达上限');
      }
    },
    delateSpecValues(item, index, i){
      this.listValue[index].specValues.splice(i, 1)
      this.listValue[index].specValueAndImage.splice(i, 1)
      this.createPreviewSku()
    },
    print(type,index,val) {
      console.log(type,index,val);
    },
    checkFocusVal(row,index,val,type){
      //console.log(row,index,val)
      if(val == 0){
        if(type == 'p'){
          this.skuData.specInfo[index].price = null
        }else if(type == 'mp'){
          this.skuData.specInfo[index].marketPrice = null
        }else if(type == 'cp'){
          this.skuData.specInfo[index].costPrice = null
        }else if(type == 'st'){
          this.skuData.specInfo[index].stock = null
        }
      }
    },
    checkBlurVal(row,index,val,type){
      //console.log(row,index,val)
      if(!val || val < 1){
        if(type == 'p'){
          this.skuData.specInfo[index].price = 0
        }else if(type == 'mp'){
          this.skuData.specInfo[index].marketPrice = 0
        }else if(type == 'cp'){
          this.skuData.specInfo[index].costPrice = 0
        }else if(type == 'st'){
          this.skuData.specInfo[index].stock = 0
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
        this.skuData.specInfo[index].costPrice = this.itemSkus[index].costPrice
        this.skuData.specInfo[index].stock = this.itemSkus[index].stock
        if(this.editAoLinPiKe){
          this.skuData.specInfo[index].barCode = this.itemSkus[index].barCode || ''
          this.skuData.specInfo[index].goodSku = this.itemSkus[index].goodSku || ''
        }
        if(this.editZiYing){
          this.skuData.specInfo[index].goodSku = this.itemSkus[index].goodSku || ''
        }
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
        }else if(item == 'costPrice'){
          arr[index] = {label: '成本价',val: item}
        }else if(item == 'stock'){
          arr[index] = {label: '库存',val: item}
        }else if(item == 'barCode'){
          arr[index] = {label: '产品编号',val: item}
        }else if(item == 'goodSku'){
          arr[index] = {label: '型号',val: item}
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
          // console.log(res,"create")
          this.loading = false
          this.skuData.specInfo = []
          this.skuData.specHeaderInfo = []
          this.specNameValueJson = []
          res.data.forEach((item,index) =>{
            this.specNameValueJson[index] = item.specNameValueJson
            this.skuData.specInfo[index] = JSON.parse(item.specNameValueJson)
            this.skuData.specInfo[index].price = item.price || '0'
            this.skuData.specInfo[index].marketPrice = item.marketPrice || '0'
            this.skuData.specInfo[index].costPrice = item.costPrice || '0'
            this.skuData.specInfo[index].stock = item.stock || '0'
            if(this.editAoLinPiKe){
              this.skuData.specInfo[index].barCode = item.barCode || ''
              this.skuData.specInfo[index].goodSku = item.goodSku || ''
            }
            if(this.editZiYing){
              this.skuData.specInfo[index].goodSku = item.goodSku || ''
            }
            this.skuData.specInfo[index].operate = {isEnable: item.isEnable || 'N'}
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
            }else if(item == 'costPrice'){
              arr[index] = {label: '成本价',val: item}
            }else if(item == 'stock'){
              arr[index] = {label: '库存',val: item}
            }else if(item == 'barCode'){
              arr[index] = {label: '产品编号',val: item}
            }else if(item == 'goodSku'){
              arr[index] = {label: '型号',val: item}
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
      if(!this.useImg){
        let list = []
        this.listValue.forEach((item, index) => {
          // console.log(item,index)
          list[index] = {}
          list[index].specName = item.specName,
          list[index].sort = item.sort,
          list[index].specValues = item.specValues
        })
        // console.log(list)
        specInfo.specNameAndValues = list
      }else{
        if(this.listValue && this.listValue[0].specValueAndImage && this.listValue[0].specValues){
          if(this.listValue[0].specValueAndImage.length != this.listValue[0].specValues.length){
            this.$message.closeAll();
            this.$message.info('请检查对应规格值下是否存在图片');
            return
          }else{
            specInfo.specNameAndValues = this.listValue
          }
        }
      }

      //组合表格数据
      let candidateSkus = []

      this.skuData.specInfo.forEach((item,index) => {
        candidateSkus[index] = {}
        candidateSkus[index].price = item.price
        candidateSkus[index].marketPrice = item.marketPrice
        candidateSkus[index].costPrice = item.costPrice
        if(this.editAoLinPiKe){
          candidateSkus[index].barCode = item.barCode
          candidateSkus[index].goodSku = item.goodSku
        }
        if(this.editZiYing){
          candidateSkus[index].goodSku = item.goodSku
        }
        // candidateSkus[index].barCode = item.barCode
        // candidateSkus[index].goodSku = item.goodSku
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
    },
    handleAvatarSuccess(res, file, skuName, data, i) {
      // console.log(res, file, skuName, data, i)
      if(data.specValueAndImage){
        data.specValueAndImage[i] = skuName + res.data
        this.$forceUpdate()
      }else{
        data.specValueAndImage = []
        data.specValueAndImage[i] = skuName + res.data;
        this.$forceUpdate()
      }
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isLt3M = file.size / 1024 / 1024 < 3;

      if (!isLt3M) {
        this.$message.error('上传头像图片大小不能超过 3MB!');
      }
      return isLt3M;
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
          align-items: flex-start;
          .item_sku {
            display: inline-block;
          }
          .el-input {
            display: table;
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

.el-input-group__append {
  padding: 2px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}

</style>
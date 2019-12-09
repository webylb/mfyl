<template>
  <div class="virtual-market-edit">
    <div class="virtual-market-edit-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城配置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path:'/physical-market' }">虚拟商品集市</el-breadcrumb-item>
        <el-breadcrumb-item>{{ pageName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" v-model="form" label-position="center" label-width="120px">
      <el-form-item label="商品来源*:">
        <el-select v-model="form.value" clearable placeholder="请选择渠道来源" style="width: 200px;">
          <el-option
            v-for="item in form.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品ID:">
        <el-input v-model="form.name" clearable placeholder="请输入商品id" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="商品名称:">
        <el-input v-model="form.name" clearable placeholder="最多允许输入30个汉字" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="商品icon:">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="form.dialogVisible">
          <img width="100%" :src="form.dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="充值类型*:">
        <el-select v-model="form.value" clearable placeholder="请选择充值类型" style="width: 200px;margin-right:10px;">
          <el-option
            v-for="item in form.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品分类*:">
        <el-select v-model="form.value" clearable placeholder="请选择一级类目" style="width: 200px;margin-right:10px;">
          <el-option
            v-for="item in form.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <el-select v-model="form.value" clearable placeholder="请选择二级类目" style="width: 200px;">
          <el-option
            v-for="item in form.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品SKU:">
        <div class="page-content">
          <el-table
            :data="form.tableData"
            stripe
            header-align="center"
            style="width: 100%;border:1px solid #EBEEF5;">
            <el-table-column
              label="图片*"
              align="center"
              >
              <template slot-scope="scope">
                <el-upload
                  class="pic-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handlePicSuccess(scope.row)"
                  >
                  <img v-if="scope.row.imageUrl" :src="scope.row.imageUrl" class="pic">
                  <i v-else class="el-icon-plus pic-uploader-icon"></i>
                </el-upload>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="商品名称*"
              align="center"
              width="120"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" clearable placeholder="" :value="scope.row.name" ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="价格(元)"
              align="center"
              width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.price" clearable placeholder="" :value="scope.row.price"></el-input>
              </template>
            >
            </el-table-column>
            <el-table-column
              prop="stock"
              label="库存*"
              align="center"
              width="120"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.stock" clearable placeholder="" :value="scope.row.stock" v-if="scope.row.stock" readonly="readonly"></el-input>
                <el-input v-model="scope.row.stock" clearable placeholder="" :value="scope.row.stock" v-else ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="skuid"
              align="center"
              width="120"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.skuId" clearable placeholder="" :value="scope.row.skuId" readonly="readonly" ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              align="center"
              >
              <template slot-scope="scope">
                <el-button @click="addInventory(scope.row,1)" type="text" size="small">添加库存</el-button>

                <el-button @click="soldOut(scope.row)" type="text" size="small" >下架</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-button type="primary" icon="el-icon-plus" style="margin-top:10px;" @click="addItemValue">添加sku</el-button>
      </el-form-item>
      <el-form-item label="是否上首页*:">
        <el-select v-model="form.value" clearable placeholder="请选择" style="width: 200px;margin-right:10px;">
          <el-option
            v-for="item in form.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="form.name" clearable placeholder="首页排序" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="商品详情*:" class="ueditor-wrap">
        <vue-ueditor-wrap @ready="ready" v-model="defaultMsg" :config="myConfig" :destroy="true"></vue-ueditor-wrap>
      </el-form-item>
      <el-form-item>
        <el-button>清空</el-button>
        <el-button type="primary">立即上架</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
''
import VueUeditorWrap from 'vue-ueditor-wrap'

export default {
  name: 'physicalMarketEdit',
  components: {
    VueUeditorWrap
  },
  data() {
    return {
      pageName: '添加商品',
      title: '添加商品',
      readonly: true,
      form: {
        name: '',
        date: '',
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
        tableData: [{
          imageUrl: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          name: '王小虎',
          price: '10',
          stock: '999',
          skuId: 1,
        }, {
          imageUrl: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          name: '王小虎2',
          price: '100',
          stock: '999',
          skuId: 1,
        }, {
          imageUrl: '',
          name: '王小虎3',
          price: '1000',
          stock: '',
          skuId: 1,
        }, {
          imageUrl: '',
          name: '王小虎4',
          price: '10000',
          stock: '',
          skuId: 1,
        }]
      },
      defaultMsg: '这里是UE测试',
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 600,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: 'http://35.201.165.105:8000/controller.php',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/UEditor/'
      }

    }
  },
  created(){

  },
  methods: {
    ready (editorInstance) {
      console.log(`编辑器实例${editorInstance.key}: `, editorInstance)
    },
    getData(){
      core.getServiceCenter({pageKey: 'servce_center'}).then(res => {
        console.log(res)
      })
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.form.dialogImageUrl = file.url;
      this.form.dialogVisible = true;
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
    handlePicSuccess(){

    },
    //添加库存
    addInventory(row){

    },
    //下架
    soldOut(row){

    },
    //删除sku
    removeItemValue(val){
      var index = this.form.tableData.indexOf(val)
      if (index !== -1) {
        this.form.tableData.splice(index, 1)
      }
    },
    //添加sku
    addItemValue(){
      this.form.tableData.push({
        imageUrl: '',
        name: '',
        price: '',
        stock: '',
        skuId: ''
      });
    },
  }
}

</script>
<style lang='less' scope>
.virtual-market-edit {

   .virtual-market-edit-title {
    margin:20px 0;
    width: 100%;
    font-size: 24px;
    padding-bottom: 15px;
    box-sizing: border-box;
    border-bottom: 1PX solid #EBEEF5;
  }

  .sales-info{
    border:1PX solid #DCDFE6;
    min-height:100px;
    width:500px;
    border-radius: 5px;
    position: relative;

    .no-classes {
      position: absolute;
      font-size: 20px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: #DCDFE6;
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
  .ueditor-wrap {
    .el-form-item__content{
      line-height: inherit;
    }
  }

  .pic-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .pic-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .pic-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
  .pic {
    width: 178px;
    height: 30px;
    display: block;
  }
}

</style>
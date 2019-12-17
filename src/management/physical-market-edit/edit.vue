<template>
  <div class="physical-market-edit">
    <div class="physical-market-edit-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城配置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path:'/physical-market' }">实物商品集市</el-breadcrumb-item>
        <el-breadcrumb-item>{{ pageName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" v-model="form" label-position="center" label-width="120px" v-loading="loading">
      <el-form-item label="商品来源*:">
        <el-select v-model="form.itemChannel" clearable placeholder="请选择渠道来源" style="width: 200px;">
          <el-option
            v-for="item in options.channelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发货渠道:">
        <el-input v-model="form.itemDeliveryChannel" clearable placeholder="请输入发货渠道" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="商品名称*:">
        <el-input v-model="form.title" clearable placeholder="最多允许输入30个汉字" maxlength="60" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item label="商品价格*:">
        <el-input v-model="form.price" clearable placeholder="请输入商品价格" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="市场指导价*:">
        <el-input v-model="form.marketPrice" clearable placeholder="请输入商品价格" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="商品图片*:" class="pic-list">
        <div style="">
          <div style="display:flex;flex-wrap:wrap;">
            <el-upload
              class="avatar-uploader"
              :action="action"
              :show-file-list="false"
              :on-success="handleCoverSuccess">
              <img v-if="form.itemCover" :src="form.itemCover" class="avatar" style="width:100%;height:auto;">
              <i v-else>主图</i>
            </el-upload>
            <draggable class="list-group" tag="div" v-model="editImageList" v-bind="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false">
              <transition-group type="transition" :name="'flip-list'">
                <div class="list-group-item picture-item" v-for="element in editImageList"
                  :key="element.url">
                  <img width="100%" :src="element.url" alt="">
                  <i class="el-icon-circle-close picture-remove" @click="removePic(element.url)"></i>
                </div>
                <el-upload
                  key="999"
                  style="display:inherit;"
                  class="pic-uploader"
                  :action="action"
                  list-type="picture-card"
                  :show-file-list=false
                  :on-success="handlePictureCardSuccess"
                  :on-remove="handlePictureCardRemove"
                  multiple>
                  <i class="el-icon-plus"></i>
                </el-upload>
              </transition-group>
            </draggable>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="商品类目*:">
        <el-select v-model="form.firstCategoryId" clearable @change="changefirstCategory" placeholder="请选择一级类目" style="width: 200px;margin-right:10px;">
          <el-option
            v-for="item in firstCategoryOptions"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id">
          </el-option>
        </el-select>

        <el-select v-model="form.secondCategoryId" clearable placeholder="请选择二级类目" style="width: 200px;">
          <el-option
            v-for="item in secondCategoryOptions"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否上首页*:">
        <el-select v-model="form.isHot" clearable placeholder="请选择" style="width: 200px;margin-right:10px;">
          <el-option
            v-for="item in options.isHotOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="form.sort" clearable placeholder="首页排序" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="商品详情*:" class="ueditor-wrap">
        <vue-editor id="editor" :useCustomImageHandler=true @image-added="handleImageAdded" v-model="form.itemContent" :editor-toolbar="customToolbar"/>
      </el-form-item>
      <el-form-item>
        <!-- <el-button>清空</el-button> -->
        <el-button type="primary" @click="subGoodsInfo">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import CONGIF from "../../api/config"
import * as core from "../../api/mall"
import { VueEditor } from "vue2-editor"
import draggable from 'vuedraggable'
import axios from "axios"

export default {
  name: 'physicalMarketEdit',
  components: {
    VueEditor,
    draggable
  },
  data() {
    return {
      loading: true,
      action: CONGIF.UPLOAD_IMAGE,
      pageName: '添加商品',
      imageList:[],
      editImageList:[],
      form: {
        itemChannel: '',//商品渠道
        itemDeliveryChannel: '',//商品发货渠道
        title: '', //商品名称
        subTitle: '二级标题',
        isVirtualItem: 'N',
        price: null, //商品价格
        marketPrice: null, //市场指导价
        itemCover: '', //封面
        itemImages: [], //商品图片
        firstCategoryId: '', //一级分类id
        secondCategoryId: '', //二级分类id
        isHot: '', //是否上首页
        sort: null, //排序
        itemContent: ''
      },
      options: {
        channelOptions: [
          {
            value: 'ZiYing',
            label: '自营'
          },
          {
            value: 'WangYiKaoLa',
            label: '网易考拉'
          },
          {
            value: 'WangYiYanXuan',
            label: '网易严选'
          }
        ],
        isHotOptions: [
          {
            value: 'Y',
            label: '是'
          },
          {
            value: 'N',
            label: '否'
          },
        ]
      },
      firstCategoryOptions:[],
      secondCategoryOptions:[],
      customToolbar: [
        // [{ 'font': [] }],
        [{ 'header': [false, 1, 2, 3, 4, 5, 6, ] }],
        // [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{'align': ''}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
        // [{ 'header': 1 }, { 'header': 2 }],
        ['blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        // [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'image'],
        [{ 'direction': 'rtl' }],
        ['clean']
      ],
      dialogImageUrl: '', //图片预览
      dialogVisible: false, //图片预览
      initData: null,
      isDragging: false,
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  created(){
    if(this.$route.query.itemId){
      this.searchGoodsDetail(this.$route.query.itemId)
      this.getFirstCategoryList()
    }else{
      this.getFirstCategoryList()
      if(window.localStorage && localStorage.getItem('itemDeliveryChannel')){
        this.form.itemDeliveryChannel = localStorage.getItem('itemDeliveryChannel')
      }
    }
  },
  mounted(){

  },
  methods: {
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      );
    },
    removePic(url){
      if(this.editImageList && this.editImageList.length > 0){
        for(let i = this.editImageList.length - 1; i >= 0; i--) {
          if(this.editImageList[i].url === url) {
            this.editImageList.splice(i, 1)
          }
        }
      }
    },
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData();
      formData.append("image", file);
      axios({
        url: "/admin/picture/uploadImage",
        method: "POST",
        data: formData
      })
      .then(result => {
        let url = result.data.data; // Get url from response
        Editor.insertEmbed(cursorLocation, "image", url);
        resetUploader();
        var range = Editor.getSelection();
        Editor.setSelection(cursorLocation + 1, range.length)
      })
      .catch(err => {
        console.log(err);
      });
    },
    searchGoodsDetail(id){
      core.searchGoodsDetail({itemId: id}).then(res => {
        if(res.code && res.code === "00"){
          //console.log(res)
          this.form.firstCategoryId = res.data.firstCategoryId
          this.getSecondCategoryList(res.data.firstCategoryId)
          this.form.isEnable = res.data.isEnable
          this.form.isHot = res.data.isHot
          this.form.itemChannel = res.data.itemChannel
          this.form.itemContent = res.data.itemContent.content
          this.form.itemCover = res.data.itemCover
          this.form.itemDeliveryChannel = res.data.itemDeliveryChannel
          this.form.marketPrice = res.data.marketPrice
          this.form.price = res.data.cashPrice
          this.form.secondCategoryId = res.data.secondCategoryId
          this.form.title = res.data.title
          this.form.sort = res.data.sort
          res.data.itemImages.forEach((item,index) => {
            this.imageList.push({url: item.imageUrl})
            this.form.itemImages.push(item.imageUrl)
            this.editImageList.push({url: item.imageUrl})
          })

          this.initData = JSON.parse(JSON.stringify(this.form)) //根据组装数据判断两次数据是否一样
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
    getFirstCategoryList(){
      core.getFirstCategoryList().then(res => {
        if(res.code && res.code === "00"){
          this.loading = false
          this.firstCategoryOptions = res.data
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
    changefirstCategory(){
      this.getSecondCategoryList(this.form.firstCategoryId)
    },
    getSecondCategoryList(id){
      core.getSecondCategoryList({firstCategoryId: id}).then(res => {
        if(res.code && res.code === "00"){
          this.secondCategoryOptions = res.data
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    handleCoverSuccess(file, fileList) {
      //console.log(file,fileList)
      this.form.itemCover = file.data;
    },
    handlePictureCardRemove(file, fileList) {
      //console.log(file, fileList);
      this.editImageList.forEach((item,index) => {
        if(file.response && item.url == file.response.data){
          this.editImageList.splice(index,1)
        }else if(item.url == file.url){
          this.editImageList.splice(index,1)
        }
      })
    },
    handlePictureCardSuccess(file, fileList) {
      if(fileList.response.code === "00"){
        this.editImageList.push({url: fileList.response.data})
      }
    },
    subGoodsInfo(){
      this.form.itemImages=[]
      this.editImageList.forEach((item,index) => {
        this.form.itemImages.push(item.url)
      })
      if(this.$route.query.itemId){
        if(this.diff(this.form,this.initData)){
          this.$message.info('数据未改动');
          return false;
        }
        this.form.itemId = this.$route.query.itemId
        this.loading = true
        core.editGoods(this.form).then(res => {
          if(res.code && res.code === "00"){
            this.loading = false
            this.$message.success("操作成功");
            this.$router.go(-1)
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
      }else{
        this.loading = true
        core.createGoods(this.form).then(res => {
          if(res.code && res.code === "00"){
            this.loading = false
            this.$message.success("操作成功")
            window.localStorage && localStorage.setItem('itemDeliveryChannel', this.form.itemDeliveryChannel)
            this.$router.go(-1)
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
      }
    },
    diff(a, b) {
      //获取对象key值数组
      var aProps = Object.getOwnPropertyNames(a);
      aProps = aProps.filter(function(item) {
          return item != "__ob__"
      });
      var bProps = Object.getOwnPropertyNames(b);
      bProps = bProps.filter(function(item) {
          return item != "__ob__"
      });
      if (aProps.length != bProps.length) {
          return false;
      }
      for (let i = 0,length1 = aProps.length; i < length1; i++) {
        var propName = aProps[i]
        var propA = a[propName]
        var propB = b[propName]
        //console.log(typeof(propA),propB)
        if(typeof(propA) == "object"){
          for (let j = 0,length2 = propA.length; j < length2; j++){
            //console.log(propA[j],propB[j])
            if(propA[j] != propB[j] ){
              console.log(propA[j],propB[j])
              return false
            }
          }
        }else{
          if (propA != propB) {
            return false;
          }
        }
      }
      return true;
    }
  }
}

</script>
<style lang='less' scope>
.physical-market-edit {
  .physical-market-edit-title {
    margin:20px 0;
    width: 100%;
    font-size: 24px;
    padding-bottom: 15px;
    box-sizing: border-box;
    border-bottom: 1PX solid #EBEEF5;
  }

  .el-dialog__body {
    padding: 0px 16px;
  }

  .el-form-item {
    margin-bottom: 15px;
  }
  #editor {
    height: 600px;
  }
  .ueditor-wrap {
    overflow: hidden;
    .el-form-item__content{
      line-height: inherit;
    }
  }

  .pic-list .el-form-item__content {
    display: flex;
  }

  .avatar-uploader{
    margin-right: 10px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    line-height: 146px;
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .edui-editor-toolbarbox {
    position: relative!important;
  }
  .picture-item {
    width: 148px;
    height: 148px;
    margin: 0 8px 8px 0;
    display: inline-block;
    border-radius: 6px;
    background-color: #fff;
    border: 1px solid #c0ccda;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .picture-remove {
      position: absolute;
      width: 25px;
      height: 25px;
      right: -10px;
      top: -8px;
      font-size: 20px;
      color: #409EFF;
    }
  }
  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
  .list-group {
    min-height: 20px;
  }
  .list-group-item {
    cursor: pointer;
  }
}

</style>
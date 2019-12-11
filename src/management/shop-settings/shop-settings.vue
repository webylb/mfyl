<template>
  <div class="shop-settings">
    <div class="shop-settings-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/merchant-management' }">商户管理</el-breadcrumb-item>
        <el-breadcrumb-item>商城配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="shop-title">首页Banner</div>
    <div class="shop-banner">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="addBanner(1)">添加banner</el-button>
        </el-form-item>
      </el-form>
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
            label="Banner"
            align="center"
            max-width="200">
            <template slot-scope="scope">
              <img :src="scope.row.pictureUrl" alt="" style="height:auto;width:120px;">
            </template>
          </el-table-column>
          <el-table-column
            prop="jumpUrl"
            label="跳转链接"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="sort"
            label="排序"
            align="center"
            sortable
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            >
            <template slot-scope="scope">
              <el-button @click="addBanner(2,scope.row,scope.$index)" type="text" size="small">编辑</el-button>
              <el-button @click="deleteBanner(scope.row,scope.row.id,scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="pageTotal>10" class="pagination-box">
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
        :title="title"
        :visible.sync="dialogInfoVisible"
        width="420px"
        :before-close="dialogClose"
        center>
        <el-form ref="dialogform" :model="dialogInfoForm" label-width="100px">
          <el-form-item label="icon:" v-show="isShowBanner">
            <el-upload
              class=""
              :action="action"
              :on-success="handleSuccess"
              :on-exceed="handleExceed"
              :limit="limit"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="跳转链接:">
            <el-input v-model="dialogInfoForm.link" clearable placeholder="" ></el-input>
          </el-form-item>
          <el-form-item label="排序:">
            <el-input v-model="dialogInfoForm.sort" clearable placeholder="" ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogInfoVisible = false">取 消</el-button>
          <el-button type="primary" @click="subBannerInfo">确 认</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="shop-title">商城屏蔽商品</div>
    <div class="shop-banner">
      <div class="" style="margin-bottom:20px">
        <el-table
          :data="tableBlackData"
          stripe
          header-align="center"
          style="width: 100%;border:1px solid #EBEEF5;"
          v-loading="loading2"
          max-height="400">
          <el-table-column
            label="序号"
            type="index"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column
            label="一级分类"
            align="center"
           >
            <template slot-scope="scope">
              {{ scope.row.firstCategoryName }}
            </template>
          </el-table-column>
          <el-table-column
            label="二级分类"
            align="center"
            >
            <template slot-scope="scope">
              <span v-if="scope.row.secondCategoryName">{{ scope.row.secondCategoryName }}</span>
              <span v-else>all</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品"
            align="center"
            >
            <template slot-scope="scope">
              <span v-if="scope.row.goodsName">{{ scope.row.goodsName }}</span>
              <span v-else>all</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            >
            <template slot-scope="scope">
              <el-button @click="removeBlackItem(scope.row,scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-form ref="form" :model="form" :inline="false" label-position="center">
        <el-form-item>
          <div style="margin-bottom: 10px;">
            <el-select v-model="form.listValue.firstCategoryId" clearable @focus="setFisrstCategory()" @change="getALlSecondByFisrstCategory()" placeholder="请选择一级分类" style="width: 150px;margin-bottom: 10px">
              <el-option
                v-for="firstCategoryItem in form.listValue.firstCategory"
                :key="firstCategoryItem.id"
                :label="firstCategoryItem.categoryName"
                :value="firstCategoryItem.id">
              </el-option>
            </el-select>
            <el-select v-model="form.listValue.secondCategoryId" clearable @change="getALlGoodsByCategory()"  placeholder="请选择二级分类" style="width: 150px;margin:0 20px;margin-bottom: 10px">
              <el-option
                v-for="secondCategoryItem in form.listValue.secondCategory"
                :key="secondCategoryItem.id"
                :label="secondCategoryItem.categoryName"
                :value="secondCategoryItem.id">
              </el-option>
            </el-select>
            <el-select v-model="form.listValue.goodsId" clearable placeholder="请选择商品" style="width: 150px;margin-right:20px;margin-bottom: 10px">
              <el-option
                v-for="goodsItem in form.listValue.goodsList"
                :key="goodsItem.id"
                :label="goodsItem.title"
                :value="goodsItem.id">
              </el-option>
            </el-select>

            <el-button @click.prevent="addBlackData()" type="primary">添加到屏蔽列表</el-button>
          </div>
        </el-form-item>

        <!-- <el-form-item>
          <el-button @click.prevent="submitForm()" type="primary">加入屏蔽</el-button>
        </el-form-item> -->
      </el-form>
    </div>
  </div>
</template>
<script>
import CONGIF from "../../api/config"
import * as core from '../../api/merchant'
import tool from '../../utils/common'

export default {
  name: 'shopSettings',
  data() {
    return {
      loading: true,
      loading2: true,
      merchantId: null,
      action: CONGIF.UPLOAD_IMAGE,
      bannerItemStatus: 1, //1为新增 2为编辑
      isShowBanner: false,
      form: {
        listValue: {
          firstCategory: [],
          firstCategoryId: '',
          secondCategory: [],
          secondCategoryId: '',
          goodsList: [],
          goodsId: ''
        }
      },
      optionsListValue: [
        {
          value: '1',
          label: '10元',
          num: ''
        },
        {
          value: '2',
          label: '20元',
          num: ''
        },
        {
          value: '3',
          label: '50元',
          num: ''
        },
        {
          value: '4',
          label: '100元',
          num: ''
        },
        {
          value: '5',
          label: '200元',
          num: ''
        },
        {
          value: '6',
          label: '500元',
          num: ''
        },
        {
          value: '7',
          label: '1000元',
          num: ''
        },
        {
          value: '8',
          label: '5000元',
          num: ''
        }
      ],
      title: '添加Banner',
      dialogInfoForm: {
        icon: '',
        link: '',
        sort: null
      },
      limit: 1,
      fileList: [],
      firstCategory: [],
      secondCategory: [],
      goodsList: [],
      dialogInfoVisible: false,
      pageSize: 10,
      currentPage: 1,
      pageTotal: 0,
      tableData: [],
      tableBlackData: []
    }
  },
  created(){
    if(this.$route.query.id){
      this.merchantId = this.$route.query.id
    }
    this.getMerchantBannerList({merchantId: this.merchantId,currentPage: this.currentPage,pageSize: this.pageSize})

    this.getMerchantBlackList({merchantId: this.merchantId})

    this.getALlFisrstCategory()
  },
  methods: {
    getMerchantBannerList(opts){
      core.getMerchantBannerList(opts).then(res => {
        //console.log(res)
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
    handleSizeChange(val) {
      this.pageSize = val
      this.loading = true
      this.getMerchantBannerList({merchantId: this.merchantId,currentPage:this.currentPage, pageSize:val})
    },
    handleCurrentChange(val) {
      this.currentPage = val,
      this.loading = true
      this.getMerchantBannerList({merchantId: this.merchantId,currentPage:val, pageSize:this.pageSize})
    },
    dialogClose(){
      this.dialogInfoVisible = false
      this.fileList = []
    },
    addBanner(status,row,index){
      this.bannerItemStatus = status
      if(status == 1){
        this.isShowBanner = true
        this.title = '添加Banner'
        this.dialogInfoForm.icon = ''
        this.dialogInfoForm.link = ''
        this.dialogInfoForm.sort = ''
      }else if(status == 2){
        this.title = '编辑Banner'
        this.editBannerId = row.id
        this.editIndex = index
        this.isShowBanner = false
        this.dialogInfoForm.link = row.jumpUrl
        this.dialogInfoForm.sort = row.sort
      }
      this.dialogInfoVisible = true
    },
    subBannerInfo(){
      if(this.dialogInfoForm.link && this.dialogInfoForm.sort){
        if(this.bannerItemStatus === 1 && this.dialogInfoForm.icon){
          core.createMerchantBanner({pictureUrl: this.dialogInfoForm.icon,jumpUrl: this.dialogInfoForm.link,sort: this.dialogInfoForm.sort,merchantId: this.merchantId}).then(res => {
            if(res.code && res.code === "00"){
              this.tableData.unshift({
                pictureUrl: this.dialogInfoForm.icon,
                jumpUrl: this.dialogInfoForm.link,
                sort: this.dialogInfoForm.sort
              })
              this.dialogClose()
            }else{
              this.$message.closeAll();
              this.$message.info(res.message);
            }
          }).catch(err => {
            this.$message.closeAll();
            this.$message.info(err);
          })
        }else{
          core.editMerchantBanner({bannerId: this.editBannerId,jumpUrl: this.dialogInfoForm.link,sort: this.dialogInfoForm.sort}).then(res => {
            if(res.code && res.code === "00"){
              //this.tableData[this.editIndex].pictureUrl = this.dialogInfoForm.icon
              this.tableData[this.editIndex].jumpUrl = this.dialogInfoForm.link
              this.tableData[this.editIndex].sort =  this.dialogInfoForm.sort
              this.dialogClose()
            }else{
              this.$message.closeAll();
              this.$message.info(res.message);
            }
          }).catch(err => {
            this.$message.closeAll();
            this.$message.info(err);
          })
        }
      }else{
        this.$message.closeAll();
        this.$message.info("请确认填写信息完整");
      }
    },
    deleteBanner(row,id,index){
      if(id){
        this.$confirm('此操作将永久删除该Banner, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          core.deleteMerchantBanner({bannerId: id}).then(res => {
            if(res.code && res.code === "00"){
              this.tableData.splice(index,1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }else{
              this.$message.info(res.message)
            }
          }).catch(err => {
            this.$message.info(err)
          })
        }).catch(() => {
          // this.$message.info('已取消删除');
        });
      }
    },
    handleSuccess(file, fileList) {
      console.log(file,fileList)
      //this.fileList = fileList.slice(-1)
      this.dialogInfoForm.icon = fileList.response.data
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请删除后继续上传`);
    },
    getMerchantBlackList(opts){
      core.getMerchantBlackList(opts).then(res => {
        console.log(res)
        if(res.code && res.code == '00'){
          let data = []
          if(res.data.firstCategoryBlackList && res.data.firstCategoryBlackList.length > 0){
            res.data.firstCategoryBlackList.forEach(element => {
              data.push({
                firstCategoryName: element.categoryName,
                firstCategoryId: element.id,
                secondCategoryName: null,
                secondCategoryId: null,
                goodsName: null,
                goodsId: null
              })
            });
          }
          if(res.data.secondCategoryBlackList && res.data.secondCategoryBlackList.length > 0){
            res.data.secondCategoryBlackList.forEach(element => {
              data.push({
                firstCategoryName: element.firstCategoryName,
                firstCategoryId: element.firstCategoryId,
                secondCategoryName: element.categoryName,
                secondCategoryId: element.id,
                goodsName: null,
                goodsId: null
              })
            });
          }
          if(res.data.itemBlackList && res.data.itemBlackList.length > 0){
            res.data.itemBlackList.forEach(element => {
              data.push({
                firstCategoryName: element.firstCategoryName,
                firstCategoryId: element.firstCategoryId,
                secondCategoryName: element.secondCategoryName,
                secondCategoryId: element.secondCategoryId,
                goodsName: element.title,
                goodsId: element.id
              })
            });
          }
          this.tableBlackData = data
          this.loading2 = false
        }else{
          this.loading2 = false
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.loading2 = false
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    getALlFisrstCategory(){
      core.getALlFisrstCategory().then(res => {
        //console.log(res)
        if(res.code && res.code == '00'){
          this.firstCategory = res.data
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    setFisrstCategory(){
      this.form.listValue.firstCategory = JSON.parse(JSON.stringify(this.firstCategory))
    },
    getALlSecondByFisrstCategory(){
      let id = this.form.listValue.firstCategoryId
      this.form.listValue.secondCategoryId = null
      this.form.listValue.goodsId = null
      core.getALlSecondByFisrstCategory({firstCategoryId: id}).then(res => {
        //console.log(res)
        if(res.code && res.code == '00'){
          this.form.listValue.secondCategory = res.data
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    getALlGoodsByCategory(){
      let fId = this.form.listValue.firstCategoryId
      let sId = this.form.listValue.secondCategoryId
      this.form.listValue.goodsId = null
      core.getALlGoodsByCategory({firstCategoryId: fId,secondCategoryId: sId}).then(res => {
        console.log(res)
        if(res.code && res.code == '00'){
          this.form.listValue.goodsList = res.data
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    },
    addBlackData(){
      this.loading2 = true
      if(this.form.listValue.firstCategoryId && this.form.listValue.secondCategoryId && this.form.listValue.goodsId){
        core.addGoodsBlack({merchantId: this.merchantId, itemId: this.form.listValue.goodsId}).then(res => {
          //console.log(res)
          if(res.code && res.code == '00'){
            this.$message.closeAll();
            this.$message.success("添加成功");
            this.getMerchantBlackList({merchantId: this.merchantId})
          }else{
            this.loading2 = false
            this.$message.closeAll();
            this.$message.info(res.message);
          }
        }).catch(err => {
          this.loading2 = false
          this.$message.closeAll();
          this.$message.info(err);
        })
      }else if(this.form.listValue.secondCategoryId && this.form.listValue.firstCategoryId){
        core.addSecondCategoryBlack({merchantId: this.merchantId, secondCategoryId: this.form.listValue.secondCategoryId}).then(res => {
          //console.log(res)
          if(res.code && res.code == '00'){
            this.$message.closeAll();
            this.$message.success("添加成功");
            this.getMerchantBlackList({merchantId: this.merchantId})
          }else{
            this.loading2 = false
            this.$message.closeAll();
            this.$message.info(res.message);
          }
        }).catch(err => {
          this.loading2 = false
          this.$message.closeAll();
          this.$message.info(err);
        })
      }else if(this.form.listValue.firstCategoryId){
        core.addFirstCategoryBlack({merchantId: this.merchantId,firstCategoryId: this.form.listValue.firstCategoryId}).then(res => {
          //console.log(res)
          if(res.code && res.code == '00'){
            this.$message.closeAll();
            this.$message.success("添加成功");
            this.getMerchantBlackList({merchantId: this.merchantId})
          }else{
            this.loading2 = false
            this.$message.closeAll();
            this.$message.info(res.message);
          }
        }).catch(err => {
          this.loading2 = false
          this.$message.closeAll();
          this.$message.info(err);
        })
      }else{
        this.loading2 = false
        this.$message.closeAll();
        this.$message.info("请先选择分类");
      }
    },
    removeBlackItem(row,index){
      if(row){
        this.$confirm('此操作将移除此条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(row.firstCategoryId && row.secondCategoryId && row.goodsId){
            core.deleteGoodsBlack({merchantId: this.merchantId, itemId: row.goodsId}).then(res => {
              //console.log(res)
              if(res.code && res.code == '00'){
                this.$message.closeAll();
                this.$message.success("删除成功");
                this.tableBlackData.splice(index, 1)
              }else{
                this.$message.closeAll();
                this.$message.info(res.message);
              }
            }).catch(err => {
              this.$message.closeAll();
              this.$message.info(err);
            })
          }else if(row.secondCategoryId && row.firstCategoryId){
            core.deleteSecondCategoryBlack({merchantId: this.merchantId, secondCategoryId:row.secondCategoryId}).then(res => {
              //console.log(res)
              if(res.code && res.code == '00'){
                this.$message.closeAll();
                this.$message.success("删除成功");
                this.tableBlackData.splice(index, 1)
              }else{
                this.$message.closeAll();
                this.$message.info(res.message);
              }
            }).catch(err => {
              this.$message.closeAll();
              this.$message.info(err);
            })
          }else if(row.firstCategoryId){
            core.deleteFirstCategoryBlack({merchantId: this.merchantId,firstCategoryId: row.firstCategoryId}).then(res => {
              //console.log(res)
              if(res.code && res.code == '00'){
                this.$message.closeAll();
                this.$message.success("删除成功");
                this.tableBlackData.splice(index, 1)
              }else{
                this.$message.closeAll();
                this.$message.info(res.message);
              }
            }).catch(err => {
              this.$message.closeAll();
              this.$message.info(err);
            })
          }
        }).catch(() => {})
      }
    }
  },
}

</script>
<style lang='less' scope>
.shop-settings {

   .shop-settings-title{
    margin:20px 0;
    width: 100%;
    font-size: 24px;
    padding-bottom: 15px;
    box-sizing: border-box;
    border-bottom: 1PX solid #EBEEF5;
  }

  .shop-banner {
    margin-bottom: 20px;
    border: 1PX solid #EBEEF5;
    padding: 10px;

    .el-form-item {
      margin-bottom: 5px;
    }
  }

  .shop-title {
    font-size: 18px;
    margin-bottom: 10px;
    font-weight: bold;
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
  .el-message-box {
    width: 400PX;
  }
}

</style>
<template>
  <div class="physical-market">
    <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="100px">
      <el-form-item label="商品ID:">
        <el-input v-model="form.itemId" clearable placeholder="" style="width: 120px;"></el-input>
      </el-form-item>

      <el-form-item label="商品名称:">
        <el-input v-model="form.itemName" clearable placeholder="" style="width: 120px;"></el-input>
      </el-form-item>

      <el-form-item label="一级分类:">
        <el-select v-model="form.firstCategoryId" clearable @change="changefirstCategory" placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in firstCategoryOptions"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类:">
        <el-select v-model="form.secondCategoryId" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in secondCategoryOptions"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="是否上首页:">
        <el-select v-model="form.isHot" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options.isHotOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="上下架状态:">
        <el-select v-model="form.isEnable" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options.isEnableOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品来源:">
        <el-select v-model="form.itemChannel" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options.channelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发货渠道:">
        <el-input v-model="form.itemDeliveryChannel" clearable placeholder="" style="width: 120px;"></el-input>
      </el-form-item>



      <el-form-item style='float:right;'>
        <el-button type="primary" @click="search()">立即查询</el-button>
        <el-button @click="downloadGoodsList()">导  出</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" icon="el-icon-plus" @click="addGoods">添加实物商品</el-button>
    </div>
    <div class="page-content">
      <el-table
        :data="tableData"
        stripe
        header-align="center"
        style="width: 100%;border:1px solid #EBEEF5;"
        v-loading="loading"
        @sort-change="sortChange">
        <el-table-column
          label="序号"
          type="index"
          width="80"
          sortable
          align="center">
        </el-table-column>
        <el-table-column
          prop="id"
          label="商品ID"
          align="center"
         >
        </el-table-column>
        <el-table-column
          label="商品主图"
          align="center"
          width="200"
         >
          <template slot-scope="scope">
            <img :src="scope.row.itemCover" alt="" style="width:120px;height:auto;">
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="商品名称"
          min-width="200"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="itemChannel"
          label="商品来源"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="itemDeliveryChannel"
          label="发货渠道"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="cashPrice"
          label="商品价格(元)"
          sortable
          align="center"
          min-width="130"
         >
        </el-table-column>
        <el-table-column
          prop="marketPrice"
          label="市场指导价(元)"
          sortable
          align="center"
          min-width="140"
         >
        </el-table-column>
        <el-table-column
          prop="firstCategoryName"
          label="一级分类"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="secondCategoryName"
          label="二级分类"
          align="center"
         >
        </el-table-column>
        <el-table-column
          label="是否上首页"
          align="center"
          min-width="110"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.isHot === 'Y'">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="首页排序"
          sortable
          min-width="110"
          align="center"
         >
        </el-table-column>
        <el-table-column
          label="sku管理"
          align="center"
          >
          <template slot-scope="scope">
            <el-button @click="goDetail(scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150px"
          align="center"
          >
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="small" >编辑</el-button>
            <el-button @click="shelfGoods(scope.row,scope.row.id,1,scope.$index)" type="text" size="small" v-if="scope.row.isEnable === 'N'">上架</el-button>
            <el-button @click="shelfGoods(scope.row,scope.row.id,2,scope.$index)" type="text" size="small" v-else>下架</el-button>
            <el-button @click="deleteGoods(scope.row,scope.row.id,scope.$index)" type="text" size="small">删除</el-button>
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
  </div>
</template>
<script>
import * as core from '../../api/mall'
export default {
  name: 'physicalMarket',
  data() {
    return {
      loading: true,
      status: 1,//1.上架 2.下架
      form: {
        itemId: '',
        itemName: '',
        firstCategoryId: '',
        secondCategoryId: '',
        isHot: '',
        isEnable: '',
        itemChannel: null,
        itemDeliveryChannel: null
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
          }
        ],
        isEnableOptions: [
          {
            value: 'Y',
            label: '是'
          },
          {
            value: 'N',
            label: '否'
          }
        ]
      },
      firstCategoryOptions:[],
      secondCategoryOptions:[],
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      tableData: [],
      sortByProp: 'id',
      sortByOrder: 'DESC'
    }
  },
  created(){
    // this.getGoodsList({currentPage:this.currentPage,pageSize:this.pageSize})
  },
  activated() {
    this.getFirstCategoryList()
    this.getGoodsChannel()
    let data = {
      currentPage:this.currentPage,
      pageSize:this.pageSize,
      sortparam: this.sortByProp + ' ' + this.sortByOrder
    }
    if(this.form.itemId){
      data.itemId = this.form.itemId
    }
    if(this.form.itemName){
      data.itemName = this.form.itemName
    }
    if(this.form.firstCategoryId){
      data.firstCategoryId = this.form.firstCategoryId
    }
    if(this.form.secondCategoryId){
      data.secondCategoryId = this.form.secondCategoryId
    }
    if(this.form.isHot){
      data.isHot = this.form.isHot
    }
    if(this.form.isEnable){
      data.isEnable = this.form.isEnable
    }
    if(this.form.itemChannel){
      data.itemChannel = this.form.itemChannel
    }
    if(this.form.itemDeliveryChannel){
      data.itemDeliveryChannel = this.form.itemDeliveryChannel
    }
    this.getGoodsList(data)
    setTimeout(()=>{
      document.getElementsByClassName('router-container')[0].scrollIntoView({
        // behavior: 'smooth',    //平滑滚动，爽，其他还有 instant
        block: 'start'  //元素到页面顶部，其他还有 end, center
      })
    },200)
  },
  methods: {
    getGoodsList(opts){
      core.getGoodsList(opts).then(res => {
        //console.log(res)
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
    getFirstCategoryList(){
      core.getFirstCategoryList().then(res => {
        if(res.code && res.code === "00"){
          this.firstCategoryOptions = res.data
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
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
    getGoodsChannel(){
      core.getGoodsChannel().then(res => {
        if(res.code && res.code === "00"){
          // console.log(res)
          let channelObj = []
          Object.keys(res.data).forEach(function(key,i){
              channelObj[i] = {}
              channelObj[i].label = res.data[key]
              channelObj[i].value = key
          })
          this.options.channelOptions = channelObj
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
        data = { currentPage:1, pageSize:this.pageSize, sortparam: this.sortByProp + ' ' + this.sortByOrder }
      }
      if(this.form.itemId){
        data.itemId = this.form.itemId
      }
      if(this.form.itemName){
        data.itemName = this.form.itemName
      }
      if(this.form.firstCategoryId){
        data.firstCategoryId = this.form.firstCategoryId
      }
      if(this.form.secondCategoryId){
        data.secondCategoryId = this.form.secondCategoryId
      }
      if(this.form.isHot){
        data.isHot = this.form.isHot
      }
      if(this.form.isEnable){
        data.isEnable = this.form.isEnable
      }
      if(this.form.itemChannel){
        data.itemChannel = this.form.itemChannel
      }
      if(this.form.itemDeliveryChannel){
        data.itemDeliveryChannel = this.form.itemDeliveryChannel
      }
      this.getGoodsList(data)
    },
    sortChange(data){
      // console.log(data)
      if(data.order){
        if(data.prop == 'cashPrice'){
          this.sortByProp = 'price'
        }else if(data.prop == 'marketPrice'){
          this.sortByProp = 'market_price'
        }else{
          this.sortByProp = data.prop
        }
        this.sortByOrder = data.order == 'ascending' ? 'ASC' : 'DESC'
      }else{
        this.sortByProp = 'id'
        this.sortByOrder = 'DESC'
      }
      let data2 = { currentPage:this.currentPage, pageSize:this.pageSize, sortparam: this.sortByProp + ' ' + this.sortByOrder }
      this.search(data2)
    },
    addGoods(){
      this.$router.push({path:'/physical-market/edit'})
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.loading = true
      let data = { currentPage:1, pageSize:val, sortparam: this.sortByProp + ' ' + this.sortByOrder }
      this.search(data)
    },
    handleCurrentChange(val) {
      this.currentPage = val,
      this.loading = true
      let data = { currentPage:val, pageSize:this.pageSize, sortparam: this.sortByProp + ' ' + this.sortByOrder }
      this.search(data)
      setTimeout(()=>{
        document.getElementsByClassName('router-container')[0].scrollIntoView({
          // behavior: 'smooth',    //平滑滚动，爽，其他还有 instant
          block: 'start'  //元素到页面顶部，其他还有 end, center
        })
      },200)
    },
    edit(row){
      this.$router.push({path:'/physical-market/edit',query:{itemId: row.id}})
    },
    shelfGoods(row,id,status,index){
      if(status == 1){
        core.shelfGoods({itemId: id}).then(res => {
          if(res.code && res.code === "00"){
            this.tableData[index].isEnable = 'Y'
            this.$message.closeAll();
            this.$message.success("上架成功");
          }else{
            this.$message.closeAll();
            this.$message.info(res.message);
          }
        }).catch(err => {
          this.$message.closeAll();
          this.$message.info(err);
        })
      }else{
        core.unshelfGoods({itemId: id}).then(res => {
          if(res.code && res.code === "00"){
            this.tableData[index].isEnable = 'N'
            this.$message.closeAll();
            this.$message.success("下架成功");
          }else{
            this.$message.closeAll();
            this.$message.info(res.message);
          }
        }).catch(err => {
          this.$message.closeAll();
          this.$message.info(err);
        })
      }
    },
    deleteGoods(row,id,index){
      if(id){
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          core.deleteGoods({itemId: id}).then(res => {
            if(res.code && res.code === "00"){
              //this.tableData.splice(index,1)
              this.$message.closeAll();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.search({currentPage:this.currentPage, pageSize:this.pageSize, sortparam: this.sortByProp + ' ' + this.sortByOrder })
            }else{
              this.$message.closeAll();
              this.$message.info(res.message)
            }
          }).catch(err => {
            this.$message.closeAll();
            this.$message.info(err)
          })
        }).catch(() => {
          // this.$message.info('已取消删除');
        });
      }
    },
    goDetail(row){
      //console.log(row)
      this.$router.push({path:'/physical-market/sku', query:{itemId: row.id}})
    },
    downloadGoodsList(){
      let data = { }
      if(this.form.itemId){
        data.itemId = this.form.itemId
      }
      if(this.form.itemName){
        data.itemName = this.form.itemName
      }
      if(this.form.firstCategoryId){
        data.firstCategoryId = this.form.firstCategoryId
      }
      if(this.form.secondCategoryId){
        data.secondCategoryId = this.form.secondCategoryId
      }
      if(this.form.isHot){
        data.isHot = this.form.isHot
      }
      if(this.form.isEnable){
        data.isEnable = this.form.isEnable
      }
      if(this.form.itemChannel){
        data.itemChannel = this.form.itemChannel
      }
      if(this.form.itemDeliveryChannel){
        data.itemDeliveryChannel = this.form.itemDeliveryChannel
      }
      core.downloadGoodsList(data).then(res => {
        //console.log(res)
        if(res.code){ //错误提示
          this.$message.closeAll();
          this.$message.info(res.message);
        }else{
          const blob = new Blob([res],{type: 'application/vnd.ms-excel'});
          const fileName = '商品导出列表.xls';
          const linkNode = document.createElement('a');

          linkNode.download = fileName; //a标签的download属性规定下载文件的名称
          linkNode.style.display = 'none';
          linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
          document.body.appendChild(linkNode);
          linkNode.click();  //模拟在按钮上的一次鼠标单击

          URL.revokeObjectURL(linkNode.href); // 释放URL 对象
          document.body.removeChild(linkNode);
        }
      })
    }
  }
}

</script>
<style lang='less' scope>
.physical-market {

   .physical-market-title {
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
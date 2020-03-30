<template>
  <div class="virtual-market">
    <!-- <div class="virtual-market-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>卡密管理</el-breadcrumb-item>
        <el-breadcrumb-item>采购申请</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <el-form ref="form" :model="form" :inline="true" label-position="center" label-width="100px">
      <el-form-item label="商品名称:">
        <el-input v-model="form.name" clearable placeholder="" style="width: 120px;"></el-input>
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

      <el-form-item label="是否上首页:">
        <el-select v-model="value" clearable placeholder="请选择" style="width: 120px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="上下架状态:">
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
    <div>
        <el-button type="primary" icon="el-icon-plus">添加虚拟商品</el-button>
    </div>
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
          label="商品ID"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品Icon"
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
          label="商品来源"
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
          prop="name"
          label="二级分类"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="province"
          label="顺序"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="province"
          label="是否上首页"
          align="center"
          >
        </el-table-column>

        <el-table-column
          prop="province"
          label="首页排序"
          align="center"
         >

        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="150px"
          align="center"
          >
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="small" >编辑</el-button>
            <el-button @click="putaway(scope.row,1)" type="text" size="small" v-if="scope.row.zip">上架</el-button>
            <el-button @click="putaway(scope.row,2)" type="text" size="small" v-else>下架</el-button>
            <el-button @click="deleted(scope.row)" type="text" size="small">删除</el-button>
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
      status: 1,//1.上架 2.下架
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
      currentPage: 1,
      pageTotal: 0,
      tableData: []
    }
  },
  created(){

  },
  methods: {
    getData(){

    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    edit(row){
      this.$router.push('/virtual-market/edit')
    },
    putaway(row,status){
      if(status == 1){
        console.log("上架")
      }else{
        console.log("下架")
      }
    },
    deleted(row){
      console.log("删除")
    }
  }
}

</script>
<style lang='less' scope>
.virtual-market {

   .virtual-market-title {
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
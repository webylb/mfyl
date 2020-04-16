<template>
  <div class="banner-settings">
    <div class="banner-settings-title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城配置</el-breadcrumb-item>
        <el-breadcrumb-item>商品信息同步</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" label-position="center">
      <el-form-item>
        <el-button type="primary" icon="el-icon-refresh" @click="sync(1)" class="sync-btn">同步天猫</el-button>
        <span>最后一次同步成功时间:  <em>{{ formatDate(timer1) }}</em></span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-refresh" @click="sync(2)" class="sync-btn">同步中台</el-button>
        <span>最后一次同步成功时间:  <em>{{ formatDate(timer2) }}</em></span>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import * as core from "../../api/mall.js"
import tool from "../../utils/common";
export default {
  name: "syncGoodsDetail",
  data() {
    return {
      timer1: null,
      timer2: null
    };
  },
  created() {
    this.getSyncTime()
  },
  methods: {
    getSyncTime() {
      core
        .syncTime()
        .then(res => {
          if (res.code && res.code === "00") {
            // console.log(res)
            if(res.data && res.data.length > 0){
              res.data.forEach((item, index) => {
                if(item.type === 1){
                  this.timer1 = item.endTime
                }else if(item.type === 2){
                  this.timer2 = item.endTime
                }
              })
            }
          } else {
            this.$message.closeAll();
            this.$message.info(res.message);
          }
        })
        .catch(err => {
          this.$message.closeAll();
          this.$message.info(err);
        });
    },
    formatDate(val){
      return tool.formatDate(val)
    },
    sync(opts) {
      if (opts === 1) {
        //同步天猫
        this.$confirm("是否请求中台同步天猫商品信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.subInfo(1)
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消同步"
            });
          });
      } else {
        this.$confirm("是否请求同步中台商品信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.subInfo(2)
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消同步"
            });
          });
      }
    },
    subInfo(opts) {
      if (opts === 1) {
        this.$message.closeAll();
        this.$message.info("正在同步中...");
        core
          .syncTM()
          .then(res => {
            if (res.code && res.code === "00") {
              this.timer1 = res.date
              this.$message.closeAll();
              this.$message.success("同步成功");
            } else {
              this.$message.closeAll();
              this.$message.info(res.message);
            }
          })
          .catch(err => {
            this.$message.closeAll();
            this.$message.info(err);
          });
      } else {
        this.$message.closeAll();
        this.$message.info("正在同步中...");
        core
          .syncZT()
          .then(res => {
            if (res.code && res.code === "00") {
              this.timer2 = res.date
            } else {
              this.$message.info(res.message);
            }
          })
          .catch(err => {
            this.$message.closeAll();
            this.$message.info(err);
          });
      }
    }
  }
};
</script>
<style lang='less' scope>
.banner-settings {
  min-height: 300px;

  .banner-settings-title {
    margin: 20px 0;
    width: 100%;
    font-size: 24px;
    padding-bottom: 15px;
    box-sizing: border-box;
    border-bottom: 1px solid #ebeef5;
  }

  .sync-btn {
    margin-right: 20px;
  }

  .el-form-item {
    margin-bottom: 25px;
  }
}
</style>
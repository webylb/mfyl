<template>
  <div class="home">
    <el-container>
      <el-aside style="width:auto" v-loading="loading">
        <div class="logo" @click="getMenu">
          <span v-show="!isCollapse" class="fadeIn">魔方优礼</span>
          <span v-show="isCollapse" class="el-icon-s-home fadeIn"></span>
        </div>
        <el-menu
          @open="handleOpen" @close="handleClose"
          :default-active="onRoutes"
          class="el-menu-vertical"
          background-color="#001529"
          text-color="#c2c4c6"
          active-text-color="#fff"
          :unique-opened=true
          :collapse="isCollapse"
          >
          <div v-for="(item, index) in menu" :key="index">
            <el-submenu v-if="item.subMenus && item.subMenus.length!==0" :index="item.menuName">
              <template slot="title">
                <i v-if="item.iconUrl" :class="item.iconUrl"></i>
                <i v-else class="el-icon-"></i>
                <span slot="title">{{item.menuName}}</span>
              </template>
              <el-menu-item v-for="(son,i) in item.subMenus" :key="i" :index="son.linkUrl" @click="menuJump(son.linkUrl)">
                <span slot="title">{{son.menuName}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else :index="item.linkUrl" @click="menuJump(item.linkUrl)">
              <i v-if="item.iconUrl" :class="item.iconUrl"></i>
              <i v-else class="el-icon-"></i>
              <span slot="title">{{item.menuName}}</span>
            </el-menu-item>
          </div>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="collapse-btn-groups">
            <el-button type="primary" icon="el-icon-s-unfold" v-if="isCollapse" @click="isCollapse = !isCollapse"></el-button>
            <el-button type="primary" icon="el-icon-s-fold" v-else @click="isCollapse = !isCollapse"></el-button>
          </div>
          <span class="out-login" @click="loginOut">退出登录</span>
          <span class="user-name">{{ companyName }} &nbsp;&nbsp;&nbsp;&nbsp; 账户余额：{{ accountBalance }}元</span>
          <!-- <el-dropdown  class="out-login" trigger="click">
           <span class="el-dropdown-link">
             <i class="iconfont icon-yonghu" style="color: #fa8c16;"></i>
             666
             <i class="el-icon-arrow-down el-icon--right"></i>
           </span>
           <el-dropdown-menu slot="dropdown">
             <el-dropdown-item  @click.native="accountInfo">账号信息</el-dropdown-item>
             <el-dropdown-item  @click.native="changePsw">修改密码</el-dropdown-item>
             <el-dropdown-item  @click.native="outLogin">退出登录</el-dropdown-item>
           </el-dropdown-menu>
          </el-dropdown> -->
        </el-header>
        <el-main>
          <div class="router-container">
            <keep-alive>
              <router-view v-if="$route.meta.keepAlive" />
            </keep-alive>
              <router-view v-if="!$route.meta.keepAlive" />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import * as core from "../../api/home"
import * as merchantCore from '../../api/benefit-merchant'
export default {
  name: 'Home',
  data() {
    return {
      loading: false,
      menu: [],
      companyName: '--',
      isCollapse: false,
      isUpdataMenu: false,
    }
  },
  beforeRouteEnter(to, from, next){
    next(vm => {
      if(from.name === 'Login'){
        vm.isUpdataMenu = true
      }
    });
  },
  created(){
    this.getMerchantDetail()

    this.getMenu();
  },
  computed: {
    // ...mapState({
    //   accountBalance: state => state.accountBalance,
    //   merchantId: state => state.merchantId,
    // }),
    accountBalance: {
      get(){
        return this.$store.state.accountBalance
      },
      set(val){
        this.$store.state.accountBalance = val
      }
    },
    onRoutes() {
      let replaceKey = this.$route.path.replace('/', '')
      if(replaceKey.indexOf("/") > 0){
        let index = replaceKey.indexOf("/")
        replaceKey = replaceKey.substring(0,index)
      }
      return replaceKey
    }
  },
  methods: {
    ...mapMutations([
      'SAVE_USER_NAME',
      'UPDATA_ACCOUNT_BALANCE',
      'SAVE_MERCHANT_ID',
      'UPDATA_PAY_PASSWORD_STATUS',
      'SAVE_BIND_PHONE'
    ]),
    handleOpen(key, keyPath) {
      //console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      //console.log(key, keyPath);
    },
    menuJump(url){
      this.$router.push("/"+ url);
    },
    loginOut(){
      core.loginOut().then(res => {
        if (res.code && res.code === '00'){
          this.$router.push({ path:'/login' })
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getMenu(){
      core.getMeun().then(res => {
        if (res.code && res.code === '00'){
          this.menu = res.data
          if(this.isUpdataMenu){
            this.$router.push("/"+ res.data[0].linkUrl);
          }
          this.loading = false
        } else {
          this.loading = false
          this.$message.error(res.message)
        }
      })
    },
    getMerchantDetail(){
      merchantCore.getMerchantDetail().then(res => {
        if(res.code && res.code == '00'){
          this.companyName = res.data.companyName
          this.SAVE_USER_NAME(res.data.username)
          this.UPDATA_ACCOUNT_BALANCE(res.data.accountBalance || 0)
          this.SAVE_MERCHANT_ID(res.data.merchantId)
          this.UPDATA_PAY_PASSWORD_STATUS(res.data.havePayPassword)
          this.SAVE_BIND_PHONE(res.data.bindPhone || '--')
        }else{
          this.$message.closeAll();
          this.$message.info(res.message);
        }
      }).catch(err => {
        this.$message.closeAll();
        this.$message.info(err);
      })
    }
  }
}

</script>
<style lang='less' scope>
.home {
  width: 100%;
  height: 100%;

  .click {
    .extend-click()
  }

  .iconfont {
      font-family: "iconfont" !important;
  }
  .collapse-btn-groups {
    display: inline-block;
    line-height: 64Px;
  }

  .out-login {
    float: right;
    line-height: 64Px;
    margin-right: 52px;
    font-size: 14Px;
    color: #000;
    cursor: pointer;
    position: relative;
    color: #409EFF;
    text-decoration: underline;
  }
  .out-login:before {
    content: '';
    position: absolute;
    left: -5px;
    right: -5px;
  }
  .user-name {
    float: right;
    line-height: 64Px;
    font-size: 16Px;
    margin-right: 52px;
  }
  .el-menu-item.is-active {
    background-color: #1890ff !important;

  }
  .el-submenu {
    .el-menu-item {
      padding-left: 60Px!important;
      span {
        line-height: 40px;
        display: block;
      }
    }
    .el-submenu__icon-arrow {
      margin-top: -3px;
      right: 10px;
      font-weight: bold;
    }
  }

  .el-menu {
    border: 0;
  }

  .el-container {
    width: 100%;
    height: 100%;
  }

  .logo {
    width: 100%;
    height: 64Px;
    line-height: 64Px;
    text-align: center;
    color: #fffefe;
    font-size: 24Px;
    cursor: pointer;
  }

  .el-aside {
    background-color: #001529;
    box-shadow: 1px 1px 6px 0px rgba(0, 21, 41, 0.35);
    z-index: 2;
  }

  .el-submenu__title {
    font-size: 16Px;
  }

  .el-menu-item {
    font-size: 16Px;
    height: 40Px;
    line-height: 40Px;
    margin: 4px 0;
  }

  .el-main {
    width: 100%;
    height: 100%;
    padding: 12px 24px;
    box-sizing: border-box;
    background-color: #f0f2f5;
    overflow: scroll;

    .router-container {
      padding: 24px;
      box-sizing: border-box;
      background-color: #fff;
      height:auto;
    }

  }

  .el-header {
    height: 64Px !important;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.08);
    z-index: 1;
  }


  .el-menu-vertical:not(.el-menu--collapse) {
    width: 225Px;
    min-height: 400px;
  }

  .el-menu--collapse .el-submenu>.el-submenu__title span {
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
    display: inline-block;
  }
  .fadeIn {
    animation: fadeIn 0.5s;
    -webkit-animation: fadeIn 0.5s;
  }
  @keyframes fadeIn {
    from {
      //width: 100px;
      opacity: 0.3;
      transform: scale(0.3,0.3)
    }
    to {
      //width: 225px;
      opacity: 1;
      transform: scale(1,1)
    }
  }
  @-webkit-keyframes fadeIn {
    from {
      //width: 100px;
      opacity: 0.3;
      transform: scale(0.3,0.3)
    }
    to {
      //width: 225px;
      opacity: 1;
      transform: scale(1,1)
    }
  }
}
</style>
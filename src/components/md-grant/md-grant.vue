<template>
  <div class="md-grant">
    <div class="md-grant-title">
      账户余额: {{ accountBalance }} 元
    </div>
    <div class="md-grant-menu">
      <router-link to="/md-grant/batch-grant">批量导入</router-link>
      <router-link to="/md-grant/single-grant">单个发放</router-link>
    </div>
    <router-view/>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import * as merchantCore from '../../api/benefit-merchant'
export default {
  name:"mdGrant",
  props: {
    id: {// 商户id
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      
    }
  },
  computed: {
    ...mapState({
      accountBalance: state => state.accountBalance
    }),
  },
  created(){
    this.$router.push("/md-grant/batch-grant")
  },
  methods:{
    
  }
}
</script>
<style lang="less">
.md-grant{

  .md-grant-title{
    margin-bottom:20px;
    width: 100%;
    font-size: 24px;
    padding-bottom: 5px;
    box-sizing: border-box;
    border-bottom: 1PX solid #EBEEF5;
  }

  .md-grant-menu{
    width: 100%;
    height: 40PX;
    border: 1PX solid #EBEEF5;
    line-height: 40PX;
    font-size: 0;
    margin-bottom: 10px;

    a {
      display: inline-block;
      padding: 0 20px;
      font-size: 18px;
      color: #333;
      text-decoration: none;
      border-right: 1PX solid #EBEEF5;
    }
    .router-link-active {
      color: #409EFF;
    }
  }
}

</style>

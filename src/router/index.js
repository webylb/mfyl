import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      meta: {title: "登录"},
      component: () => import(/* webpackChunkName: "login" */ '@/components/Login/Login.vue'),
    },
    {
      path: '/',
      name: 'Home',
      meta: {keepAlive: true},
      component: () => import(/* webpackChunkName: "home" */ '../components/Home/Home.vue'),
      children: [{ //用户后台
        path: '/employees-management',
        name: 'employeesManagement',
        meta: {title: "员工管理"},
        component: () => import(/* webpackChunkName: "home" */ '../components/employees-management/employees-management.vue')
      },
      {
        path: '/md-grant',
        name: 'mdGrant',
        meta: {title: "魔豆发放"},
        component: () => import(/* webpackChunkName: "mdGrant" */ '../components/md-grant/md-grant.vue'),
        redirect:'/md-grant/batch-grant',
        children: [{
          path: 'batch-grant',
          name: 'batchGrant',
          meta: {title: "批量发放"},
          component: () => import(/* webpackChunkName: "mdGrant" */ '../components/md-grant/batch-grant/batch-grant.vue')
        },
        {
          path: 'single-grant',
          name: 'singleGrant',
          meta: {title: "单个发放"},
          component: () => import(/* webpackChunkName: "mdGrant" */ '../components/md-grant/single-grant/single-grant.vue')
        }]
      },
      {
        path: '/grant-record',
        name: 'grantRecord',
        meta: {title: "发放记录"},
        component: () => import(/* webpackChunkName: "grantRecord" */ '../components/grant-record/grant-record.vue')
      },
      {
        path: '/grant-record/grant-detail',
        name: 'grantDetail',
        meta: {title: "查看明细"},
        component: () => import(/* webpackChunkName: "grantRecord" */ '../components/grant-detail/grant-detail.vue'),
      },
      {
        path: '/pwd-purchase',
        name: 'pwdPurchase',
        meta: {title: "卡密采购"},
        component: () => import(/* webpackChunkName: "grantRecord" */ '../components/pwd-purchase/pwd-purchase.vue')
      },
      {
        path: '/pwd-purchase/immediately-purchase',
        name: 'immediatelyPurchase',
        meta: {title: "卡密采购"},
        component: () => import(/* webpackChunkName: "grantRecord" */ '../components/immediately-purchase/immediately-purchase.vue')
      },
      {
        path: '/account-recharge',
        name: 'accountRecharge',
        meta: {title: "账户充值"},
        component: () => import(/* webpackChunkName: "grantRecord" */ '../components/account-recharge/account-recharge.vue')
      },
      {
        path: '/account-recharge/immediately-recharge',
        name: 'immediatelyRecharge',
        meta: {title: "账户充值"},
        component: () => import(/* webpackChunkName: "grantRecord" */ '../components/immediately-recharge/immediately-recharge.vue')
      },
      {
        path: '/company-info',
        name: 'companyInfo',
        meta: {title: "企业信息", keepAlive: true},
        component: () => import(/* webpackChunkName: "accountSettings" */ '../components/company-info/company-info.vue')
      },
      {
        path: '/account-settings',
        name: 'accountSettings',
        meta: {title: "账户设置",keepAlive: true},
        component: () => import(/* webpackChunkName: "accountSettings" */ '../components/account-settings/account-settings.vue')
      },
      {
        path: '/account-settings/bind-phonenum',
        name: 'bindPhonenum',
        meta: {title: "绑定手机号"},
        component: () => import(/* webpackChunkName: "accountSettings" */ '../components/bind-phonenum/bind-phonenum.vue')
      },
      {
        path: '/account-settings/change-phonenum',
        name: 'changePhonenum',
        meta: {title: "修改手机号"},
        component: () => import(/* webpackChunkName: "accountSettings" */ '../components/change-phonenum/change-phonenum.vue')
      },
      {
        path: '/account-settings/change-loginpwd',
        name: 'changeLoginpwd',
        meta: {title: "修改支付密码"},
        component: () => import(/* webpackChunkName: "accountSettings" */ '../components/change-loginpwd/change-loginpwd.vue')
      },
      {
        path: '/account-settings/change-paypwd',
        name: 'changePaypwd',
        meta: {title: "修改支付密码"},
        component: () => import(/* webpackChunkName: "accountSettings" */ '../components/change-paypwd/change-paypwd.vue')
      },
      //商户管理后台
      {
        path: '/merchant-management',
        name: 'merchantManagement',
        meta: {title: "商户管理"},
        component: () => import(/* webpackChunkName: "merchantManagement" */ '../management/merchant-management/merchant-management.vue')
      },
      {
        path: '/merchant-management/shop-settings',
        name: 'shopSettings',
        meta: {title: "商城配置"},
        component: () => import(/* webpackChunkName: "merchantManagement" */ '../management/shop-settings/shop-settings.vue')
      },
      {
        path: '/merchant-management/shop-invoice',
        name: 'shopInvoice',
        meta: {title: "开票信息"},
        component: () => import(/* webpackChunkName: "merchantManagement" */ '../management/shop-invoice/shop-invoice.vue')
      },
      {
        path: '/recharge-apply',
        name: 'rechargeApply',
        meta: {title: "充值申请"},
        component: () => import(/* webpackChunkName: "rechargeApply" */ '../management/recharge-apply/recharge-apply.vue')
      },
      {
        path: '/invoice-management',
        name: 'invoiceManagement',
        meta: {title: "发票管理"},
        component: () => import(/* webpackChunkName: "invoiceManagement" */ '../management/invoice-management/invoice-management.vue')
      },
      {
        path: '/purchase-apply',
        name: 'purchaseApply',
        meta: {title: "采购申请"},
        component: () => import(/* webpackChunkName: "purchaseApply" */ '../management/purchase-apply/purchase-apply.vue')
      },
      {
        path: '/create-pwd',
        name: 'createPwd',
        meta: {title: "生成卡密"},
        component: () => import(/* webpackChunkName: "purchaseApply" */ '../management/create-pwd/create-pwd.vue')
      },
      {
        path: '/use-record',
        name: 'useRecord',
        meta: {title: "使用记录"},
        component: () => import(/* webpackChunkName: "purchaseApply" */ '../management/use-record/use-record.vue')
      },
      {
        path: '/user-management',
        name: 'userManagement',
        meta: {title: "用户管理"},
        component: () => import(/* webpackChunkName: "userManagement" */ '../management/user-management/user-management.vue')
      },
      {
        path: '/recharge-record',
        name: 'rechargeRecord',
        meta: {title: "充值记录"},
        component: () => import(/* webpackChunkName: "userManagement" */ '../management/recharge-record/recharge-record.vue')
      },
      {
        path: '/create-account',
        name: 'createAccount',
        meta: {title: "开通账号"},
        component: () => import(/* webpackChunkName: "authorityManagement" */ '../management/create-account/create-account.vue')
      },
      {
        path: '/role-settings',
        name: 'roleSettings',
        meta: {title: "角色配置"},
        component: () => import(/* webpackChunkName: "authorityManagement" */ '../management/role-settings/role-settings.vue')
      },
      {
        path: '/role-settings/edit-authority',
        name: 'editAuthority',
        meta: {title: "编辑权限"},
        component: () => import(/* webpackChunkName: "authorityManagement" */ '../management/edit-authority/edit-authority.vue')
      },
      {
        path: '/router-management',
        name: 'routerManagement',
        meta: {title: "路由管理"},
        component: () => import(/* webpackChunkName: "authorityManagement" */ '../management/router-management/router-management.vue')
      },
      {
        path: '/banner-settings',
        name: 'bannerSettings',
        meta: {title: "banner配置"},
        component: () => import(/* webpackChunkName: "mallManagement" */ '../management/banner-settings/banner-settings.vue')
      },
      {
        path: '/category-recommend',
        name: 'categoryRecommend',
        meta: {title: "首页品类推荐"},
        component: () => import(/* webpackChunkName: "mallManagement" */ '../management/category-recommend/category-recommend.vue')
      },
      {
        path: '/category-recommend/second',
        name: 'categoryRecommendSecond',
        meta: {title: "首页二级品类推荐"},
        component: () => import(/* webpackChunkName: "mallManagement" */ '../management/category-recommend-second/second.vue')
      },
      {
        path: '/coupon-recommend',
        name: 'couponRecommend',
        meta: {title: "首页卡券推荐"},
        component: () => import(/* webpackChunkName: "mallManagement" */ '../management/coupon-recommend/coupon-recommend.vue')
      },
      {
        path: '/category-settings',
        name: 'categorySettings',
        meta: {title: "商品类目配置"},
        component: () => import(/* webpackChunkName: "mallManagement" */ '../management/category-settings/category-settings.vue')
      },
      {
        path: '/category-settings/child',
        name: 'categorySettingsChild',
        meta: {title: "商品类目配置二级类目"},
        component: () => import(/* webpackChunkName: "mallManagement" */ '../management/category-settings-child/child.vue')
      },
      {
        path: '/physical-market',
        name: 'physicalMarket',
        meta: {title: "实物商品集市",keepAlive: true},
        component: () => import(/* webpackChunkName: "mallManagement" */ '../management/physical-market/physical-market.vue')
      },
      {
        path: '/virtual-market',
        name: 'virtualMarket',
        meta: {title: "虚拟商品集市"},
        component: () => import(/* webpackChunkName: "mallManagement" */ '../management/virtual-market/virtual-market.vue')
      },
      {
        path: '/physical-order-list',
        name: 'physicalOrderList',
        meta: {title: "实物订单列表"},
        component: () => import(/* webpackChunkName: "mallManagement" */ '../management/physical-order-list/physical-order-list.vue')
      },
      {
        path: '/physical-order-list/order-detail',
        name: 'orderDetail',
        meta: {title: "订单详情"},
        component: () => import(/* webpackChunkName: "mallManagement" */ '../management/order-detail/order-detail.vue')
      },
      {
        path: '/virtual-order-list',
        name: 'virtualOrderList',
        meta: {title: "虚拟订单列表"},
        component: () => import(/* webpackChunkName: "mallManagement" */ '../management/virtual-order-list/virtual-order-list.vue')
      },
      {
        path: '/physical-market/edit',
        name: 'physicalMarketEdit',
        meta: {title: "实物商品集市编辑"},
        component: () => import(/* webpackChunkName: "mallManagement" */ '../management/physical-market-edit/edit.vue')
      },
      {
        path: '/physical-market/sku',
        name: 'physicalMarketSku',
        meta: {title: "实物商品集市sku编辑"},
        component: () => import(/* webpackChunkName: "mallManagement" */ '../management/physical-market-edit/sku.vue')
      },
      {
        path: '/virtual-market/edit',
        name: 'virtualMarketEdit',
        meta: {title: "虚拟商品集市编辑"},
        component: () => import(/* webpackChunkName: "mallManagement" */ '../management/virtual-market-edit/edit.vue')
      },
      ]
    }
  ]
})

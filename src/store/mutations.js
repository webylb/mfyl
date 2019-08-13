export default {
  //保存账户名称
  SAVE_USER_NAME(state,data){
    state.username = data
  },
  //更新账户余额
  UPDATA_ACCOUNT_BALANCE(state,data){
    state.accountBalance = data
  },
  //保存当前登录商户ID
  SAVE_MERCHANT_ID(state,data){
    state.merchantId = data
  },
  //商户是否设置支付密码
  UPDATA_PAY_PASSWORD_STATUS(state,data){
    state.havePayPassword = data
  },
  SAVE_BIND_PHONE(state,data){
    state.bindPhone = data
  },
}
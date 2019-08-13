/**
 * 日期格式化函数
 * @param {} date
 */

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDate = function(date, type) {
  var date = new Date(date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  if (type == 'YYYY-MM-DD') {
      return [year, month, day].map(formatNumber).join('-')
  }
  if (type == 'MM-DD') {
    return [month, day].map(formatNumber).join('-')+' '+[hour,minute].map(formatNumber).join(':')
  }
  else {
      return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
}

/**
 * email验证函数
 * @param {} email
 */

const isEmail = function(email){
  if (email !== '') {
    let reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if(!reg.test(email)){
      return false
    }else{
      return true
    }
  }else{
    return false
  }
}

/**
 * 手机号验证函数
 * @param {} phone
 */

const isPhone = function(phone){
  if (phone !== '') {
    let reg=/^1\d{10}$/;
    if(!reg.test(phone)){
      return false
    }else{
      return true
    }
  }else{
    return false
  }
}

/**
 * 纯中文名称验证函数
 * @param {} text
 */

const isBankName = function(text){
  if (text !== '') {
    let reg=/^[\u4E00-\u9FA5]+$/;
    if(!reg.test(text)){
      return false
    }else{
      return true
    }
  }else{
    return false
  }
}

/**
 * 纯数字验证函数
 * @param {} num
 */

const isNum = function(num){
  if (num !== '') {
    let reg=/^\d{1,}$/;
    if(!reg.test(num)){
      return false
    }else{
      return true
    }
  }else{
    return false
  }
}

/**
 * 座机验证函数
 * @param {} tel
 */

const isTel = function(tel){
  if (tel !== '') {
    let reg=/^[0-9-]{4,}$/;
    if(!reg.test(tel)){
      return false
    }else{
      return true
    }
  }else{
    return false
  }
}



export default {
  formatDate, isEmail, isPhone, isBankName, isNum, isTel
}

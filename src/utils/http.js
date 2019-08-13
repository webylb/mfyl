import Vue from 'vue'
import router from '../router'
import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
})

// 正在请求的url数组
let pending = []

// 是否正在请求
let isPending = url => pending.includes(url)

// 移除完成的请求
let removePending = url => {
  let index = pending.findIndex(item => item === url)
  pending.splice(index, 1)
}

// 请求拦截
http.interceptors.request.use(config => {
  if(!config.headers.noIntercept && isPending(config.url)){
    //终止多次请求
    //console.log(config.url)
    Message.closeAll()
    Message.info('拼命请求中...')
    return
    //return Promise.reject(new Error("重复请求已被拦截!"))
  }
  if(config.data){
    if(config.headers['Content-Type']){
      if(config.headers['Content-Type'] == 'multipart/form-data'){
        config.data = config.data
      }else{
        config.data = JSON.stringify(config.data)
      }
    }else{
      config.data = qs.stringify(config.data)
    }
  }
  pending.push(config.url)
  return config
}, error => {
  console.log(error)
  return Promise.reject(error)
})

// 响应拦截
http.interceptors.response.use(response => {
  removePending(response.config.url)
  // 处理统一事件
  if(response.data && response.data.code == "unLogin"){
    Message.closeAll()
    Message.info(response.data.message)
    let timer = null
    clearTimeout(timer)
    timer = setTimeout(function(){
      router.push("/login")
    },1200)
    return 
  }
  return response
}, error => {
  pending = []
  return Promise.reject(error)
})

// 返回在vue模板中的调用接口
export default {
  get: function (url, data) {
    return http({method:'GET', url, data})
  },
  post: function (url, data, config) {
    if(config && config.contentType){
      return http({method:'POST', url, data, headers: {'Content-Type':'application/json; charset=utf-8'}}) //转为json串
    }else if(config && config.formData){
      return http({method:'POST', url, data, headers: {'Content-Type':'multipart/form-data'}}) //上传excel
    }else if(config && config.responseType){
      return http({method:'POST', url, data, responseType: 'blob'}) //下载excel文件流
    }else{
      return http({method:'POST', url, data}) //正常qs
    }
  }
}

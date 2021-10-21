import Vue from 'vue'
import axios from 'axios'
// import store from '@/store'
import { VueAxios } from './axios'
import { Message,MessageBox } from 'element-ui'
import { ACCESS_TOKEN , USER_ACCESS_CODE} from "@/store/mutation-types"
import { ERCODE } from "@/ercode"

//自动设置后台服务 baseURL (也可以手工指定写死项目名字)
let baseDomain = process.env.NODE_ENV==='production'?'http://gdbbc.pension.taikang.com':'' //服务器地址
// let baseDomain = window._CONFIG['domianURL'];
let baseProject = baseDomain.substring(baseDomain.lastIndexOf('/'));
console.log('baseDomain= ',baseDomain)
console.log('baseProject= ',baseProject)

// 创建 axios 实例
const service = axios.create({
  baseURL: baseDomain, // api base_url   baseProject
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 9000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    let data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    console.log('------异常响应------',token)
    console.log('------异常响应------',error.response.status)
    switch (error.response.status) {
      case 403:
        Message.error({ message: '系统提示：拒绝访问', description: '拒绝访问',duration: 5000,offset: 200})
        break
      case 500:
        //notification.error({ message: '系统提示', description:'Token失效，请重新登录!',duration: 4})
        if(token && data.message=="Token失效，请重新登录"){
          MessageBox.confirm('很抱歉，登录已过期，请重新登录?', '登录已过期', {
            confirmButtonText: '确定',
            type: 'warning',
            showClose: false,
            offset: 200,
            showCancelButton: false,
            distinguishCancelAndClose: true,
          }).then(() => {
            Vue.ls.remove(ACCESS_TOKEN)
            Vue.ls.remove(USER_ACCESS_CODE)
            location.href = ERCODE
          }).catch(() => {
                    
          });
          // update-end- --- author:scott ------ date:20190225 ---- for:Token失效采用弹框模式，不直接跳转----
        }
        break
      case 404:
        Message.error({ message: '系统提示：系统开小差，请稍后再试！', description:'很抱歉，资源未找到！',duration: 5000,offset: 200})
        break
      case 504:
        Message.error({ message: '系统提示：您的网络不好，连接超时，请重试！', description: '网络超时',duration: 5000,offset: 200})
        break
      case 401:
        Message.error({
          message: '系统提示：用户连接超时！请重新登录',
          description: '系统提示：用户连接超时！请重新登录',
          duration: 4000,
          offset: 200
        })
        Vue.ls.remove(ACCESS_TOKEN)
        Vue.ls.remove(USER_ACCESS_CODE)
        location.href = ERCODE
        break
      case 502:
        Message.error({
          message: '系统提示：用户连接超时或登录失败！请重新登录',
          description: '未授权，请重新登录',
          duration: 4000,
          offset: 200
        })
        Vue.ls.remove(ACCESS_TOKEN)
        Vue.ls.remove(USER_ACCESS_CODE)
        location.href = ERCODE
        // Message.error({ message: '系统提示：系统开小差，请稍后再试！', description:'未授权，请重新登录',duration: 5000,offset: 200})
        break
      default:
        Message.error({
          message: '系统提示：' + data.message,
          description: data.message,
          duration: 4000,
          offset: 200
        })
        break
    }
  }
  return Promise.reject(error)
};

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers[ 'token' ] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  // if(config.url.indexOf("import-crs-info") > 0){
  //   config.headers[ 'Content-Type' ] = 'multipart/form-data'
  // }
  return config
},(error) => {
  return Promise.reject(error)
})

// response interceptor
service.interceptors.response.use((response) => {
    console.log('我是请求体里的')
    console.log(response)
    return response.data
  }, err)

const installer = {
  vm: {},
  install (Vue, router = {}) {
    Vue.use(VueAxios, router, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}

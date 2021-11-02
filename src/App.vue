<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue'
import api from '@/api'
import { putAction,postAction,getAction } from '@/api/manage'
import store from '@/store/'
import { USER_INFO, USER_ACCESS_CODE} from "@/store/mutation-types"
import { mapActions } from "vuex"
import {ERCODE} from "@/ercode"
  export default {
    data () {
      return {
      }
    },
    mounted () {
      this.jumpPage ()
    },
    methods: {
      ...mapActions([ "Login"]),
      // 判断是不是手机
      isMobile () {
        let flag = navigator.userAgent.match(/(phone|pod|iPhone|iPod|ios|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
        return flag;
      },
      // 判断是不是pad
      isPad () {
        let flag = navigator.userAgent.match(/(pad|iPad)/i);
        return flag;
      },
      // 根据不同的设备跳转不同的页面
      jumpPage () {
        if(this.isMobile ()) {
          this.$router.replace('/mobileHome')
        } else {
          console.log('我再这')
          // 获取连接上的code
          let code = window.location.search == ''?window.location.hash.split('?')[1].split('&')[0].split('=')[1]:window.location.search.split('?')[1].split('&')[0].split('=')[1]
          let url = window.location.search == ''?window.location.hash:window.location.search
          let codeState = this.getUrl(url,'state')
          // 1、查看localstroage 是否有code
          console.log('查看code',Vue.ls.get(USER_ACCESS_CODE))
          // 先判断是企业微信还是浏览器
          if (this.is_weixin()) {
            //企业微信
            console.log('我是企业微信')
            if(!Vue.ls.get(USER_ACCESS_CODE)){
              // 没有 code 第一次登陆 登陆  获取token
              this.getLogin(code)
            } else {
              // 已经有code了 判断 已有code和当前连接code的是否一致
              if(Vue.ls.get(USER_ACCESS_CODE) !== code){
                // 不一致 登陆  获取token
                this.getLogin(code)
              }
            }
          } else {
            // 浏览器
            console.log('我是浏览器')
            // 跳转到企业微信二维码页面
            if(codeState == 'ercode'){// 已经扫码了
              if(!Vue.ls.get(USER_ACCESS_CODE)){
              // 没有 code 第一次登陆 登陆  获取token
                this.getLogin(code)
              } else {
                // 已经有code了 判断 已有code和当前连接code的是否一致
                if(Vue.ls.get(USER_ACCESS_CODE) !== code){
                  // 不一致 登陆  获取token
                  this.getLogin(code)
                }
              }
            }else{
              location.href = ERCODE
              //  this.getLogin(code)
            }
          }
        }
      },
      // 分离URL 数值
     getUrl (url,name) {
       let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
       let r = url.substr(1).match(reg);
       if(r != null)  return decodeURI(r[2]);
       return null
     },
      // 判断是企业微信还是浏览器
      is_weixin () {
        return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
      },
      // 登录获取信息
      getLogin (code) {
        let loginParams = {code:code}
        this.Login(loginParams).then((res) => {
          // alert(res)
          if(res.code == 200){
            Vue.ls.set(USER_ACCESS_CODE,code, 30*60*1000)
          } else if(res.code == 401) {
            this.$message({
              message: '系统提示：授权过期，请重新登录',
              type: 'error'
            });
            Vue.ls.remove(ACCESS_TOKEN)
            Vue.ls.remove(USER_ACCESS_CODE)
            location.href = ERCODE
          } else {
            this.$router.replace('/errorPage')
          }
          // this.$router.replace('/')
        }).catch((err) => {
          console.log(err)
        });
      },
    }
  
  }
</script>

<style>
body {
  margin: 0;
  /* background: #f7f7f7; */
  background: #fff;
  min-width: 1200px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.el-message {
  padding: 30px 20px 30px 25px !important;
}
</style>

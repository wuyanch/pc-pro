<template>
  <div class="hello">
    <el-container>
      <el-header>
         <span>用户名：{{userName}}</span>
         <!-- <button @click="outLogin">退出</button> -->
      </el-header>

      <el-container class="whole-container">
        <el-aside class="left-aside" :width="isCollapse?'60px':'170px'">
          <el-menu :default-openeds="['1']" :collapse="isCollapse" :default-active=menu>
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-s-custom"></i><span>线索管理(PC版)</span></template>
              <el-menu-item-group>
                <el-menu-item index="ClueLead" @click="changePage('ClueLead')">客户线索导入</el-menu-item>
                <el-menu-item index="AssignCustomer" @click="changePage('AssignCustomer')">标记服务经理</el-menu-item>
                <el-menu-item index="AddTargetDepartment" @click="changePage('AddTargetDepartment')">批量添加目标部门</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
          <div class=""><div :class="[isCollapse?'shrink-close':'','shrink-normal']" @click="shrink"></div></div>
        </el-aside>

        <el-container>
          <el-main>
            <button :class="[isCollapse?'el-icon-s-unfold':'el-icon-s-fold','fold-button']" @click="shrink"></button>
            <keep-alive>
              <router-view />
            </keep-alive> 
          </el-main>
          <el-footer height="40px">匠心助手企业微信版 copyright © 泰康养老广东分公司版权所有</el-footer>
        </el-container>
      </el-container>

    </el-container>
  </div>
</template>

<script>
import Vue from 'vue'
import store from '@/store/'
import { USER_SALENO, USER_NAME, ACCESS_TOKEN,USER_ACCESS_CODE} from "@/store/mutation-types"
export default {
  name: 'HelloWorld',
  data () {
    return {
      isCollapse: false,
      menu: 'ClueLead',
      userName: ''
    }
  },
  mounted () {
    this.getUserName();
    this.getMenu()
  },
  methods: {
    // 获取用户姓名 
    getUserName () {
      let that = this
      setTimeout(()=>{
        that.userName = Vue.ls.get(USER_NAME)
      },1000)
    },
    // 获取当前连接的后面
    getMenu () {
      const search = window.location.hash // 测试环境 正式环境
      const menuLength = search.split('/')
      this.menu = menuLength[menuLength.length - 1] === '' || menuLength[menuLength.length - 1].indexOf('code') != -1? 'ClueLead' : menuLength[menuLength.length - 1]
    },
    shrink: function () {
      this.isCollapse = !this.isCollapse
    },
    changePage: function (viewpage) {
      this.$router.push({ path: viewpage })
    },
    // 退出登录
    outLogin: function(){
      Vue.ls.remove(ACCESS_TOKEN)
      Vue.ls.remove(USER_ACCESS_CODE)
      window.opener = null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
::-webkit-scrollbar {display: none; /* Chrome Safari */}
.el-header{
  line-height: 60px;
  font-size: 16px;
  color: white;
  background: #346cb4;
  text-align: left;
}
.whole-container{
  position: relative;
  min-width: 1200px;
}
.el-aside{
  .el-menu {
    border-right: none;
  }
  .el-submenu__title span{
    width: 120px;
    display: inline-block;
    text-align: left;
    box-sizing: border-box;
  }
  .el-menu-item.is-active{
    background: #e4f4fc;
  }
  .el-submenu .el-menu-item{
    min-width: 170px;
  }
}
.el-aside.left-aside{
  height: calc(100vh - 60px);
  .shrink-normal{
    position: absolute;
    height: 100%;
    top: 0;
    left: 170px;
    cursor: e-resize;
    border-right: 1px solid #e6e6e6;
    border-left: 1px solid #fff;
    z-index: 9;
    &::before{
      content: "";
      position: absolute;
      left: 1px;
      top: 50%;
      width: 3px;
      height: 30px;
      border-radius: 30px;
      transform: translateY(-50%);
      background: #909399;
    }
  }
  .shrink-close{
    left: 60px;
  }
}
.el-main{
  padding: 5px 50px 10px 50px;
  position: relative;
}
.el-footer{
  line-height: 40px;
  font-size: 14px;
  color: #ccc;
}
.fold-button {
    position: absolute;
    left: 0;
    top: 0;
    border: none;
    background: inherit;
    font-size: 25px;
    color: #8a8988;
    font-weight: 400;
    cursor: pointer;
}
</style>

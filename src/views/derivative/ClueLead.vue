<template>
  <div class="clue-lead">
    <!-- 所处位置 -->
    <div class="current-site">
      <span>当前位置：</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>OTO线索池</el-breadcrumb-item>
        <el-breadcrumb-item>线索导入</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 内容 -->
    <div class="clue-content">
       <p class="page-tip">说明：本页面用于组长或组员，把现有EXCEL表的客户线索导入到5G系统的“客户列表”中。</p>
      <div class="dervative-item-code per-part-before per-part"  data-part='01'>
        <p class="part">
          <span class="part-title">查询项目</span><span class="part-tip"> 说明：“项目编码”在“5G系统-项目概况”页面有，是<i> PM+9位 </i> 数字。</span>
        </p>
        <span><i class="red-i">*</i>项目编码： PM </span>
        <div class="part-input-box">
          <el-input
            v-model="itemCode"
            class="item-code"
            placeholder="请录入9位项目编码数字"
            maxlength="9"
            minlength="9"
            @blur="blurItemCode"
            @focus="focusItemCode"
            @input="changeItemCode"
          ></el-input>
          <el-button type="primary" class="query-code" @click="inquiry" tabIndex=-1 @keyup.enter.native="enterSearch" :loading="searchLoading"><i class="el-icon-search"></i> 查询</el-button>
          <p class="part-input-box-tip">{{itemCodeTip}}</p>
        </div>
      </div>
      <div class="show-function" >
        <div class="per-part-before per-part" data-part='02'>
          <p class="part">
            <span class="part-title">线索导入</span><span class="part-tip">说明： 组长、组员可为自己导入线索。如果客户已在5G系统中，请登陆5G系统进行客户管理。</span>
          </p>
          <div>
              <p class="related-content"><span>服务经理： {{ saleNo }}</span><span>项目名称： {{itemData.projcetName}}</span></p>
              <!-- 有角色，有资格导入 -->
              <div>
                  <el-form :inline="true"  class="demo-form-inline">
                      <el-form-item label="所属小组：" required>
                          <el-select v-model="affiliatedGroup" placeholder="请选择所属小组">
                          <el-option v-for="(groupValue,index) in itemData.saleTeamInfoList" :key="index" :label=groupValue.saleTeamName :value=groupValue.stmCode></el-option>
                          </el-select>
                      </el-form-item>
                      <el-form-item label="选择文件：" required>
                          <el-upload
                              class="upload-demo"
                              ref="upload"
                              drag
                              :multiple="false"
                              :limit=1
                              action="no"
                              :file-list="fileList"
                              :auto-upload="false"
                              :http-request="httpRequest"
                              :before-upload="beforeUpload"
                              :on-exceed="changeFile">
                              <i class="el-icon-upload"></i>
                              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                          </el-upload>
                      </el-form-item>
                      <el-form-item class="part-button">
                        <el-button type="primary" @click.stop="submitUpload" :loading="uploadLoading" class="query-code up-load-button"><i class="el-icon-upload2"></i> 导入名单</el-button>
                        <el-button class="down-template" @click.stop="downTemplateFile" :loading="downloadLoading"><i class="el-icon-download"></i> 下载导入模板</el-button>
                      </el-form-item>
                      <el-form-item>
                          <span :class="[missingInformation == ''?'':(missingFlag == true ? 'missing-information':'no-missing-information')]">
                            <i :class="[missingInformation == ''?'':(missingFlag == true ? 'el-icon-circle-close':'el-icon-circle-check')]"></i>
                            {{missingInformation}}
                          </span>
                      </el-form-item>
                  </el-form>
              </div>
          </div>
        </div>
        <div class="per-part-before per-part" data-part='03'>
          <p class="part"><span class="part-title">导入结果</span><span class="part-tip"> 说明：线索导入后，请在"5G系统-获客概况-客户列表"处管理客户。</span></p>
          <div>
              <div class="inline-block">
                  <span><i class="red-i">*</i>导入日期：</span>
                  <el-date-picker
                      v-model="downrange"
                      type="daterange"
                      align="center"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerOptions"
                  >
                  </el-date-picker>
              </div>
              <el-button type="primary" class="query-code"  @click.stop="downloadFile" :loading="downloadFileLoading"><i class="el-icon-download"></i> 下载导入结果</el-button>
              <span :class="[downloadFileInformation == ''?'':(downloadFlag == true ? 'missing-information':'no-missing-information')]">
                <i :class="[downloadFileInformation == ''?'':(downloadFlag == true ? 'el-icon-circle-close':'el-icon-circle-check')]"></i>
                {{downloadFileInformation}}
              </span>
          </div>
        </div>
        <div :data-tip=note class="tool-per" v-if=!qualifications><i class="el-icon-lock"></i></div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import api from '@/api'
import { putAction,postAction,getAction,downFile,downFilePost } from '@/api/manage'
import store from '@/store/'
import {USER_SALENO} from "@/store/mutation-types"

export default {
  name: 'ClueLead',
  data () {
    return {
      // 加载动态
      searchLoading: false,
      downloadLoading: false,
      uploadLoading: false,
      downloadFileLoading: false,
      fileList: [],
      // 录入的项目编码
      itemCode: '',
      // 录入的项目的日期
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      downrange: '',
      // 录的的小组
      affiliatedGroup: '',
      // 获取的数据
      itemData: {},
      // 查询项目提示语
      itemCodeTip: '',
      // 角色是否符合导入数据
      qualifications: false,
      note: '请先查询项目，才能解锁以下功能',
      // errorMessage错误提示语 errorFlag错误是否显示标识
      errorMessage: '您不在该查询项目任何一个“小组”里，暂不能操作“线索导入”。请联系您的“主攻手”把您加入某个“小组”吧',
      errorFlag: false,
      // 上传文件前的检验
      missingInformation: '',
      missingFlag: null,
      // 下载文件 missingDownloadFile错误提示语 missingDownloadFlag错误是否显示标识
      downloadFileInformation: '',
      downloadFlag: null,
      // 提示
      errorTip: null,
      saleNo: Vue.ls.get(USER_SALENO)
    }
  },
  created () {
    // let that = this
    // document.onkeydown = function(e) {
    //   console.log('回车键')
    //   console.log(e)
    //   var key = window.event.keyCode
    //   if (key == 13) {
    //     that.inquiry()
    //   }
    // }
     this.enterSearch()
  },
  mounted () {
    this.saleNo = Vue.ls.get(USER_SALENO)?Vue.ls.get(USER_SALENO):this.getUserSaleNo()
  },
  methods: {
     // 获取用户sale
    getUserSaleNo () {
      let that = this
      setTimeout(()=>{
        that.saleNo = Vue.ls.get(USER_SALENO)
      },800)
    },
    // iput值发生改变时
    changeItemCode (value) {
      const reg = /\d{9}/gi
      const regD = /\D/gi
      if (Number(this.itemData.code) !== value || regD.test(value) || !reg.test(value)) {
        this.qualifications = false
      }
      // console.log(value, this.itemCode)
    },
    // 失焦状态下的输入框
    blurItemCode () {
      // 正则表达式
      const reg = /\d{9}/gi
      const regD = /\D/gi
      if (this.itemCode.length < 9) {
        this.itemCodeTip = '输入错误：位数不足'
      } else {
        if (regD.test(this.itemCode)) {
          this.itemCodeTip = '输入错误：不能含有非数字字符'
        } else {
          if (reg.test(this.itemCode)) {
            this.itemCodeTip = ''
          }
        }
      }
    },
    // 获取焦点状态下的输入框
    focusItemCode () {
      this.itemCodeTip = ''
      this.errorTip==null?this.errorTip:this.errorTip.close()
    },
    //回车搜索
    enterSearch(){
        document.onkeydown = e =>{
            //13表示回车键，baseURI是当前页面的地址，为了更严谨，也可以加别的，可以打印e看一下&& e.target.baseURI.match(/freshmanage/)
            if (e.keyCode === 13 ) {
            //回车后执行搜索方法
                this.inquiry()
            }
        }
    },
    // 根据项目编码查询该用户的在项目下的身份
    inquiry () {
      // 正则表达式
      const reg = /\d{9}/gi
      if (reg.test(this.itemCode)) {
        this.searchLoading = !this.searchLoading
        this.itemData = {}
        this.fileList = []
        this.affiliatedGroup = ''
        let params = {pmcode: 'PM'+this.itemCode, saleNo: Vue.ls.get(USER_SALENO) }
        // 请求该项目下是否有TA
        getAction('/customer/crs/import-crs/get-project-info',params).then(response => {
          this.searchLoading = !this.searchLoading
          console.log('查询PM',response)
          if(response.code == 200){
            this.itemData = response.data
            this.qualifications = true
          } else {
            // 请求后没通过
            this.errorTip = this.$message({
              message: response.msg,
              type: 'error',
              duration: 0,
              showClose: true,
              offset: 200,
              dangerouslyUseHTMLString: true
            })
          }
        }).catch(error => {
          this.searchLoading = !this.searchLoading
          console.log(error)
        })
      } else {
        this.qualifications = false
      }
    },
    // 导入名单
    submitUpload () {
      const that = this
      this.$refs.upload.submit()
      console.log('导入数据')
      // 检验是否选择组号和上传文件
      if (this.affiliatedGroup === '' || this.fileList.length === 0) {
        // this.$alert('没有选择小组或者上传文件')
        this.missingInformation = '导入失败：没有选择小组或者没有上传文件'
        this.missingFlag = true
        setTimeout(function () {
          that.missingInformation = ''
          that.missingFlag = null
        }, 5000)
      } else {
        // 获取选取的组号
        const checkGroupA = this.itemData.saleTeamInfoList.filter((value) => value.stmCode === this.affiliatedGroup)
        // new formData对象
        const importInfo = new FormData()
        // 上传formData 格式的文件
        importInfo.append('file', this.fileList[0])
        importInfo.append('stmCode', checkGroupA[0].stmCode)
        importInfo.append('pmCode', this.itemData.pmcode)
        importInfo.append('agentNo', this.saleNo)
        this.missingInformation = '后台执行中，请稍后下载导入结果，查看数据'
        this.missingFlag = false
        setTimeout(function () {
          that.missingInformation = ''
          that.missingFlag = null
        }, 3000)
        this.uploadLoading = !this.uploadLoading
        postAction('/customer/crs/import-crs/import-crs-info',importInfo).then(response => {
          console.log(response)
          this.uploadLoading = !this.uploadLoading
          if(response.code == 200){
            this.missingInformation = '恭喜你，名单导入成功'
            this.missingFlag = false
            setTimeout(function () {
              that.missingInformation = ''
              that.missingFlag = null
            }, 3000)
          }else {
            this.$message({
              message: '导入失败! ' + response.msg,
              type: 'error',
              duration: 10000,
              offset: 200
            });
            this.fileList = []
          }
        }).catch(error => {
          this.uploadLoading = !this.uploadLoading
          console.log(error)
        })

        console.log(importInfo.getAll('stmCode'))
        console.log(importInfo.getAll('file'))
      }
    },
    // 改变文件
    changeFile (files) {
      console.log('改变文件')
      this.fileList = []
      this.fileList.push(files[0])
      console.log(files[0])
    },
    beforeUpload: function (file) {
      console.log(file)
      this.fileList = []
      this.fileList.push(file)
    },
    httpRequest () {
      // console.log('请求')
    },
    // 下载导入名单的文件
    downloadFile () {
      console.log('点击导出按钮')
      const that = this
      if (this.downrange === '') {
        this.downloadFileInformation = '请选择导入日期范围'
        this.downloadFlag = true
        setTimeout(() => {
          that.downloadFileInformation = ''
          that.downloadFlag = null
        }, 3000)
      } else {
        this.downloadFileLoading = !this.downloadFileLoading
        let params = {resultDownParam: this.downrange, agentNo: this.saleNo, pmCode: this.itemData.pmcode}
        console.log(params)
        this.downloadFileInformation = '申请导出成功，请耐心等待，名单马上下载'
        this.downloadFlag = false
        setTimeout(() => {
          that.downloadFileInformation = ''
          that.downloadFlag = null
        }, 3000)
        postAction('/customer/crs/import-crs/down/result',params).then(response => {
          this.downloadFileLoading = !this.downloadFileLoading
          console.log(response)
          // 创建一个新的url，此url指向新建的Blob对象
          // let url = window.URL.createObjectURL(new Blob([response]))
          // // 创建a标签，并隐藏改a标签
          // let link = document.createElement('a')
          // link.style.display = 'none'
          // // a标签的href属性指定下载链接
          // link.href = url
          // //setAttribute() 方法添加指定的属性，并为其赋指定的值。
          // let fileName = '导出名单'+ that.downrange +'.xlsx'
          // link.setAttribute('download', fileName )
          // document.body.appendChild(link)
          // link.click()
          if(response.code == 200){
            this.downloadFileByBase64(response.data.base64Code,response.data.fileName)
            this.$message({
              message: '恭喜你，成功导出名单',
              type: 'success',
              duration: 10000,
              offset: 450
            });
          } else {
            this.$message({
              message: '导出名单失败，请重新导',
              type: 'error',
              duration: 10000,
              offset: 450
            });
          }
         
        }).catch(error => {
          this.downloadFileLoading = !this.downloadFileLoading
          console.log(error)
        })
      }
    },
    // 下载导入名单模板
    downTemplateFile () {
      this.downloadLoading = !this.downloadLoading
      postAction('/customer/crs/import-crs/down/template/clue').then(response => {
        console.log(response)
        // // 创建一个新的url，此url指向新建的Blob对象
        // let url = window.URL.createObjectURL(new Blob([response]))
        // // 创建a标签，并隐藏改a标签
        // let link = document.createElement('a')
        // link.style.display = 'none'
        // // a标签的href属性指定下载链接
        // link.href = url
        // //setAttribute() 方法添加指定的属性，并为其赋指定的值。
        // let fileName = '导出模板.xlsx'
        // link.setAttribute('download', fileName )
        // document.body.appendChild(link)
        // link.click()
        this.downloadLoading = !this.downloadLoading
        if(response.code == 200){
          this.downloadFileByBase64(response.data.base64Code,response.data.fileName)
          this.$message({
            message: '恭喜你，成功导出模板',
            type: 'success',
            offset: 200
          });
        } else {
          this.$message({
            message: '导出模板失败，请重新导',
            type: 'error',
            offset: 200
          });
        }
       
      }).catch(error => {
        this.downloadLoading = !this.downloadLoading
        console.log(error)
      })
    },
    dataURLtoBlob(dataurl) {
          let bstr = atob(dataurl),
            n = bstr.length, 
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr],{
          type: 'application/vnd.ms-execl'
        });
    },
    
    downloadFileBase(url,name){
        // 创建a标签，并隐藏改a标签
        let link = document.createElement('a')
        link.style.display = 'none'
        // a标签的href属性指定下载链接
        link.href = url
        //setAttribute() 方法添加指定的属性，并为其赋指定的值。
        let fileName = name
        link.setAttribute('download', fileName )
        document.body.appendChild(link)
        link.click()
    },
    
    downloadFileByBase64(base64,name){
        let myBlob = this.dataURLtoBlob(base64)
        console.log(myBlob)
        let myUrl = window.URL.createObjectURL(myBlob)
        this.downloadFileBase(myUrl,name)
    }


  }
}
</script>

<style lang="scss" scoped>
.current-site {
  text-align: left;
  color: #7c7c7c;
  font-size: 14px;
  height: 20px;
  line-height: 20px;
  padding-bottom: 2px;
  box-sizing: border-box;
  border-bottom: 1px solid #dfdfdf;
  padding-left: 10px;
  span {
    display: inline-block;
    vertical-align: text-bottom;
  }
  .el-breadcrumb {
    display: inline-block;
    .el-breadcrumb__inner {
      color: #7c7c7c;
    }
  }
}
.clue-content{
  padding-left: 30px;
  .page-tip{
    border-left: 4px solid #5daaff;
    color: #232323;
    font-size: 14px;
    padding: 10px 15px;
    text-align: left;
    background: #e9f3fe;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
}
.dervative-item-code {
  text-align: left;
  margin: 30px 0 0;
  .item-code {
    display: inline-block;
    width: 300px;
  }
}
.per-part {
  text-align: left;
  margin-top: 35px;
  position: relative;
  &:nth-child(2){
    margin-top: 20px;
  }
  .part {
    border-bottom: 2px solid #e8f4fc;
  }
  .part-title {
    font-size: 16px;
    font-weight: 800;
    color: #5daaff;
  }
  .part-tip {
    font-size: 13px;
    color: #87c0ff;
    vertical-align: baseline;
    margin-left: 10px;
  }
  .part-input-box{
    display: inline-block;
    padding-bottom: 14px;
    .part-input-box-tip{
      margin: 0;
      color: red;
      font-size: 12px;
      position: absolute;
    }
  }
  .inline-block {
    display: inline-block;
  }
  .related-content{
    color: #959595;
    margin-bottom: 7px;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    padding: 0 12px;
    span{
        display: inline-block;
        width: 450px;
        flex: none;
        white-space: nowrap;
        &:first-child{
          width: 205px;
        }
    }
    
  }
  .el-form-item{
      margin-bottom: 5px;
      label{
        font-size: 20px;
      }
      &:nth-child(1){
        display: block;
      }
  }
}
.per-part-before{
  position: relative;
  min-height: 1px;
  &::before{
    content: attr(data-part);
    position: absolute;
    top: -12px;
    left: -42px;
    font-size: 28px;
    font-style: oblique;
    background-image: linear-gradient(180deg, #5daaff, transparent);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.query-code {
  margin-left: 15px;
  width: 144px;
  background-color: #5daaff;
  border-color: #5daaff;
}
.up-load-button {
  margin-left: 5px;
}
.tip {
  display: block;
  text-align: left;
  color: #7c7c7c;
  padding: 10px;
  font-size: 13px;
  i {
    background: #dfdfdf;
    border-radius: 4px;
  }
}
.el-upload-dragger{
    .el-icon-upload{
        font-size: 44px;
        margin: 0;
        line-height: 60px;
        text-align: left;
        vertical-align: text-bottom;
    }
    .el-upload__text{
        display: inline-block;
        line-height: 60px;
        text-align: left;
        vertical-align: text-bottom;
    }
}
.part-button{
    // display: block;
    .down-template{
      border: 1px solid #5daaff;
      color: #5daaff;
      background: white;
    }
}
.red-i{
  color: red;
  font-style: normal;
}
.show-function{
  position: relative;
  // .per-part {
  //   &:nth-child(2){
  //     margin-top: 50px;
  //   }
  // }
  .tool-per{
    background: rgb(108 108 108 / 80%);
    z-index: 9;
    position: absolute;
    top: -30px;
    bottom: -30px;
    left: -65px;
    right: 0;
    border-radius: 10px;
    &::before{
      content: attr(data-tip);
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      color: #fff;
    }
    .el-icon-lock{
      font-size: 20px;
      font-weight: 700;
      color: #fff;
      position: absolute;
      left: 50%;
      top: 43%;
      transform: translate(-50%, -50%);
    }
  }
}
.missing-information{
  font-size: 12px;
  color: red;
  padding-left: 15px;
}
.no-missing-information{
  font-size: 12px;
  color: #248c48;
  padding-left: 15px;
}
</style>

<style lang="scss">
.clue-content{
  .item-code {
    .el-input__inner{
      font-size: 16px;
      width: 300px;
    }
  }
  .el-upload-dragger{
      height: 60px;
      width: 316px;
  }
  .el-input__inner{
    font-size: 16px;
    width: 316px;
  }
  .el-range-editor.el-input__inner{
    width: 332px;
  }
  // .el-upload-list{
  //     display: inline-block;
  //     .el-upload-list__item-name{
  //         min-width: 300px;
  //     }
  // }
  .el-upload-list__item{
    margin-top: 0;
  }
  .el-form-item__label{
    font-size: 16px;
  }
  .el-alert--error.is-light{
    z-index: 99;
    position: absolute;
    box-sizing: border-box;
    top: 0;
    text-align: left;
    width: 72%;
    left: 300px;
  }
  .el-upload-list__item-name{
    max-width: 272px;
    white-space: normal;
  }
}
</style>

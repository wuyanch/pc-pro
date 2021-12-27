<template>
    <div class="moblie-home">
        <p class="tip"><i class="el-icon-warning-outline"></i><br/>亲，请在电脑上使用这个功能哦~
            <span class="tip-note"><br/>
            【目前版本所有功能都涉及EXCEL表格上传、下载。后续会开放其他手机端的功能。】
            </span>
        </p>
        <div class="mobile-box">
            <div>
                <img :src=imgsrc alt="" srcset="">
            </div>
            <div class="content">
                <p class="content-title"><span>“客户线索导入”功能</span></p>
                <p class="content-detail">组长或组员，可把现有EXCEL表的客户线索导入到5G系统的“客户列表”中。
                    <span><br>说明：支持导入过往没在5G里的客户。
                    <br>如果客户已在5G系统中，请登陆5G系统进行客户管理。</span></p>
            </div>
            <div  class="content">
                <p class="content-title"><span>“标记服务经理”功能</span></p>
                <p class="content-detail">主攻手或助理主攻手，可以给存量三级客户标记服务经理，把客户线索导入到5G系统的“客户列表”中。
                    <span><br>说明：支持导入过往已购买长期重疾或年金产品，但目前没在5G里的客户。
                    <br>如果客户已在5G系统中，请登陆5G系统进行客户管理。</span></p>
            </div>
            
        </div>
    </div>
</template>

<script>
export default {
    name: 'mobileHome',
    data() {
        return {
            imgsrc: require('@assets/mobile.png')
        }
    }
}
</script>

<style lang="scss">
body{
    min-width: 100vw !important;
    -webkit-text-size-adjust: none;
}
.moblie-home {
    font-size: 4vw;
}
.title{
    font-weight: 700;
    padding-top: 15px;
}
.el-icon-warning-outline {
    font-size: 12vw;
    color: red;
    margin-right: 20px;
    vertical-align: middle;
}
.tip {
    font-size: 6vw;
    margin: 20px 0 10px;
    color: red;
    .tip-note{
        font-size: 4vw;
        color: #333;
    }
}
.mobile-box{
    margin: 0 30px 30px 30px;
    padding-bottom: 3px;
    box-shadow: 1px 1px 10px 1px #e7f0fb, -1px -1px 10px 1px #e7f0fb;
    border-radius: 20px;
}
.content {
    padding:0 20px;
    .content-title {
        text-align: left;
        font-weight: 700;
        margin: 50px 0 15px 0;
        span{
            font-size: 2vh;
            border-radius: 50px;
            padding: 20px 40px;
            line-height: 2vh;
            box-shadow: 1px 1px 15px 1px #a8d0ff;
            color: #5daaff;
        }
    }
    .content-detail{
        margin-top: 25px;
        font-size: 2vh;
        text-align: left;
        line-height: 60px;
        font-weight: 700;
        span {
            color: #999;
            font-size: 1.9vh;
            font-weight: normal;
        }
    }
}
img{
    margin-top: 20px;
    object-fit: contain;
    width: 80%;
}
</style>
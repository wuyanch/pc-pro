<template>
    <div class="error-page">
        <img :src=imgsrc alt="" srcset="">
        <p>未知错误，请重新打开页面</p>
    </div>
</template>

<script>
export default {
    name: 'errorPage',
    data() {
        return {
            imgsrc: require('@assets/404.png')
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
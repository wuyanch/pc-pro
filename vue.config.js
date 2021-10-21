const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
  /*
    Vue-cli3:
    Crashed when using Webpack `import()` #2463
    https://github.com/vuejs/vue-cli/issues/2463
   */
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  // 那么将这个值改为 '/my-app/'
    publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',// 构建好的文件输出到哪里--泰康云
  // 打包app时放开该配置
  // publicPath:'./',
  configureWebpack: config => {
    // 生产环境取消 console.log
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))

    // 配置 webpack 识别 markdown 为普通的文件
    config.module
      .rule('markdown')
      .test(/\.md$/)
      .use()
      .loader('file-loader')
      .end()
  },

  css: {
    loaderOptions: {

    }
  },

  devServer: {
    // open: process.platform === "darwin",
    // disableHostCheck: false,
    host: "0.0.0.0",
    https: false,
    port:'9080',
    hotOnly: false, // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
    proxy: {
      '/crm/': {
        target: 'http://gdbbc.pension.taikang.com', // 请求本地 需要jeecg-boot后台项目
        ws: true,
        changeOrigin: true
      }
    },
    disableHostCheck: true 
  },

  lintOnSave: false // 取消eslint格式检查
}

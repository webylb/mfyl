
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css']

module.exports = {

  publicPath: process.env.NODE_ENV === 'production' ?  (process.env.VUE_APP_TITLE==='MFYL_PRODUCTION' ? 'https://c1.51jujibao.com/static/mod/mfylERP' : 'https://prev-c1.51jujibao.com/static/mod/mfylERP') : '/',

  outputDir: process.env.VUE_APP_TITLE==='MFYL_PRODUCTION' ? 'dist' : 'dev',

  assetsDir: 'static',

  lintOnSave: process.env.NODE_ENV == 'production',

  productionSourceMap: false,

  devServer: {
    // disableHostCheck: true, // 禁用webpack热重载检查 解决热更新失效问题
    port: 8087, // 端口号
    host: 'test.cubegift.cn',
    https: false, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    proxy: {
        '/': {
            target: 'http://prev-admin.cubegift.cn',
            ws: false,
            changeOrigin: true
        },
        // '/foo': {
        //     target: '<other_url>'
        // }
    },  // 配置多个代理
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 生产环境

      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true //隐藏console

      config.plugins.push(
          new CompressionWebpackPlugin({
              filename: '[path].gz[query]',
              algorithm: 'gzip',
              test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
              threshold: 10240,
              minRatio: 0.8
          })
      );
    } else {
      // 开发环境
    }
  },
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))

    config.resolve.alias.set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))

    config.module
      .rule('fonts')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options = {
          limit: 300000,
          fallback: {
            loader: 'file-loader',
            options: {
              name: 'static/font/[name].[hash:8].[ext]'
            }
          }
        }
        return options
      })

  }
}

function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, 'src/common/styles/variable.less'), // 需要全局导入的less
        path.resolve(__dirname, 'src/common/styles/mixin.less'),
        path.resolve(__dirname, 'src/common/styles/reset.less'),
      ],
    })
}

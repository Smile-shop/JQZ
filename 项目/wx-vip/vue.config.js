const CompressionWebpackPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  // 配置服务器基本地址
  baseUrl: process.env.publicPath,
  // 端口修改
  devServer: {
    port: '8085'
  },
  productionSourceMap: false,
  css: {
    // 是否提取css生成单独的文件 默认 true
    extract: true,
    // 使用 CSS source maps?
    sourceMap: false,
    // loader配置
    loaderOptions: {},
    // 使用 css Modules
    modules: false
  },
  /* configureWebpack: config => {
    if(isProduction) {
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }));
      config.plugins.push(new UglifyJsPlugin({
        uglifyOptions: {
         compress: {
          warnings: false,
          drop_debugger: true,
          drop_console: true,
         },
        },
        sourceMap: false,
        parallel: true,
      }));
      config.externals = {
        "vue": "Vue",
        "vuex": "Vuex",
        "vue-router": "VueRouter",
        "axios": "axios"
       }
    }
  } */
}

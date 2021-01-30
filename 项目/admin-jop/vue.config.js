const path = require('path');

module.exports = {
  publicPath: './',
  // 端口修改
  devServer: {
    open: true,
    port: 8081
  },
  productionSourceMap: false
}
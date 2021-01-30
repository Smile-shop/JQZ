module.exports = {
  // 配置服务器基本地址
  // publicPath: process.env.NODE_ENV === 'production' ? '/node-wxchat' : '/',
  publicPath: './',
  // 端口修改
  devServer: {
    port: '8086'
  },
  productionSourceMap: true,
  css: {
    // 是否提取css生成单独的文件 默认 true
    extract: true,
    // 使用 CSS source maps?
    sourceMap: false,
    // loader配置
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue: 37.5,
            propList: ['*']
          }),
          require('autoprefixer')({
            overrideBrowserslist: [
              'Android >= 4.0',
              'iOS >= 7',
              'last 2 versions',
              'not ie <= 8',
            ]
          })
        ]
      }
    },
    // 使用 css Modules
    modules: false,
  }
}
const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  devServer: {
    port: '8091'
  },
  chainWebpack: (config) => {
    config.plugins.delete('prefetch')
    config.resolve.alias
      .set('@', resolve('src'))
      .set('dialog', resolve('src/components/dialog'))
      .set('layout', resolve('src/components/layout'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('base', resolve('src/base'))
      .set('static', resolve('src/static'))
  },
}
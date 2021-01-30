module.exports = {
  publicPath: './',
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#0045FF',
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  devServer: {
    port: '8090',
  },
};

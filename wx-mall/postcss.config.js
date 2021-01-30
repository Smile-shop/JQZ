module.exports = {
  plugins: {
    'postcss-preset-env': {
      stage: 0,
    },
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 8,
      propList: ['*']
    }
  }
}

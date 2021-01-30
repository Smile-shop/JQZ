const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const globalStyleFun = (globalStyle, that) => {
  // 设置头部导航栏背景色
  if (globalStyle === '1') {
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 必写项
      backgroundColor: '#DBB051', // 必写项
    })
  }
  that.setData({
    globalStyle: globalStyle
  })
}

const setGlobalGoldStyle = (mark) => {
  const flag = 1
  if (mark == flag) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 必写项
      backgroundColor: '#DBB051', // 必写项
    })
  }
}

module.exports = {
  formatTime: formatTime,
  globalStyleFun: globalStyleFun,
  setGlobalGoldStyle,
}

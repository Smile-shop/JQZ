class HTTP {
  request({ url, data = {}, method = 'GET', header = {},  loading = true }) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method, header, loading)
    })
  }

  _request(url, resolve, reject, data, method, header, loading) {
    if (loading) {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
    }
    const headers = {
      'content-type': 'application/json',
    }
    const appData = getApp().globalData.appData || wx.getStorageSync('appData')
    const globalShare = getApp().globalData.globalShare
    const isVisitor = getApp().globalData.isVisitor
    const { ticket, customerId } = wx.getStorageSync('customerInfo')
    if (appData && appData.companyKey) headers.companyKey = appData.companyKey
    if (appData && appData.openid) headers.openid = appData.openid;
    if (ticket) headers.ticket = ticket;
    if (customerId) headers.customerId = customerId;
    console.log(JSON.stringify(headers), '请求header')
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
        ...headers,
        ...header
      },
      success: (res) => {
        if (loading) {
          wx.hideLoading()
        }
        const { code } = res.data
        if (code == 0) {
          resolve(res.data)
          // && globalShare != '1'
        } else if (code == -15 && !isVisitor) {
          reject(res)
          wx.removeStorageSync('customerInfo')
          wx.reLaunch({
            url: '/pages/login/index'
          })
          this._showToast('您的登录状态失效，请重新登录')
        } else {
          reject(res)
          const msg = res.data.msg
          this._showToast(msg)
        }
      },
      fail: (err) => {
        if (loading) {
          wx.hideLoading()
        }
        reject(err)
        this._showToast('请求出错，请稍后重试')
      }
    })
  }

  _showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2000
    })
  }
}

export { HTTP }
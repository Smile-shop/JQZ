// pages/login/index.js
const app = getApp();
let timer = null
let run = false
import log from '../../utils/log'

import { wxLogin, queryMemberInfo, saveUserInfo } from '../../api/register'
import { 
  saveUserInfoLocal, 
  saveUserInfoAndStore, 
  saveLoginUserInfo, 
  getWxLoginInfo, 
  saveWxToken, 
  saveJqzToken, 
  queryWxToken,
  queryWxLoginCode } from '../../utils/userInfo'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    auth: true, // 微信授权
    phone: false, // 绑定手机号
    FLAG: [
      '/pages/index/index',
      '/pages/goodsCategory/index',
      '/pages/shoppingCart/index',
      '/pages/shop/index',
      '/pages/my/index'
    ], // tabbar
    GOODDETAIL: ['/pages/goodsDetail/index'],
  },

  // 开启绑定手机号并关闭微信授权
  openBindPhone() {
    this.setData({
      phone: true,
      auth: false,
    })
  },

  // 跳转依据
  skipCase(url) {
    let result = false
    const list = this.data.FLAG
    if (list.includes(url)) {
      result = true
    }
    return result
  },

  // 调到商品详情
  skipGoodsDetail(url) {
    let result = false
    const datail = this.data.GOODDETAIL
    if (datail.includes(url)) {
      result = true
    }
    return result
  },

  // 返回上一次进来的页面
  backPrePage() {
    let url = app.globalData.toLoginUrl
    const query = app.globalData.queryGoods
    const list = this.data.FLAG
    log('怎么跳转', url, list.includes(url))
    const result = this.skipCase(url)
    const detail = this.skipGoodsDetail(url)
    log('最后的跳转', detail)
    log('获得存储的参数', query, app.globalData)

    if (result) {
      wx.reLaunch({
        url: url,
      })
    } else if (detail) {
      const spuId = query.spuId || ''
      const skuId = query.skuId || ''
      const login = true
      url = `${url}?spuId=${spuId}&skuId=${skuId}&login=${login}`
      wx.redirectTo({
        url: url,
      })
    } else {
      wx.redirectTo({
        url: url,
      })
    }
  },

  // 存储金千枝 token
  cacheJqzToken(jqzToken) {
    const token = jqzToken
    app.globalData.jqzToken = token
    saveJqzToken(token)
  },

  // 查询是否已绑定手机号
  async queryBindPhone() {
    const body = {
      "appId": "",
      "avatarUrl": "",
      "city": "",
      "country": "",
      "createdTime": "",
      "curPage": 0,
      "customer": {
        "address": "",
        "birthday": "",
        "cateId": "",
        "city": "",
        "deleted": "",
        "district": "",
        "education": 0,
        "email": "",
        "fax": "",
        "id": "",
        "identId": "",
        "identNo": "",
        "name": "",
        "phone": "",
        "profId": "",
        "province": "",
        "remark": "",
        "sex": "",
        "status": "",
        "tel": "",
        "wedding": ""
      },
      "id": "",
      "language": "",
      "lastLoginTime": "",
      "member": {
        "activeDistId": "",
        "activeTime": "",
        "activeUid": "",
        "cardNo": "",
        "cid": "",
        "groupId": "",
        "id": "",
        "lastBuyTime": "",
        "lastRetTime": "",
        "levelId": "",
        "point": 0,
        "remark": "",
        "status": "",
        "totalAmount": 0,
        "totalBuy": 0,
        "totalItem": 0,
        "totalPoint": 0,
        "totalRet": 0,
        "totalRetAmount": 0,
        "totalRetItem": 0
      },
      "mid": "",
      "nickName": "",
      "openId": "",
      "pageSize": 0,
      "province": "",
      "sex": "",
      "store": {
        "address": "",
        "appId": "",
        "city": "",
        "coordTx": "",
        "description": "",
        "distId": "",
        "distName": "",
        "distance": 0,
        "district": "",
        "id": "",
        "imgs": [
          {
            "id": "",
            "seq": 0,
            "storeId": "",
            "url": ""
          }
        ],
        "meNum": 0,
        "name": "",
        "province": "",
        "status": "",
        "tel": ""
      },
      "unionId": "",
      "updateTime": "",
      _showMsg: true,
    }
    const res = await queryMemberInfo(body)
    log('查询手机号结果', res)
    const mark = 0
    const { data, code } = res
    if (code !== mark) {
      this.openBindPhone() // 
    } else {
      const curInfo = app.globalData.userInfoAndStore
      const jqzToken = data.token
      this.cacheJqzToken(jqzToken)
      const info = Object.assign({}, data)
      saveUserInfoAndStore(data, curInfo)
      saveLoginUserInfo(info)
      this.backPrePage()
    }
  },

  // 绑定用户微信信息
  async bindUserWxInfo(params) {
    const userInfo = params.userInfo
    const body = {
      "avatarUrl": userInfo.avatarUrl,
      "city": userInfo.city,
      "country": userInfo.country,
      "encryptedData": params.encryptedData,
      "gender": userInfo.gender,
      "iv": params.iv,
      "language": userInfo.language,
      "nickName": userInfo.nickName,
      "province": userInfo.province
    }
    const res = await saveUserInfo(body)
    saveUserInfoLocal(params) // 存储用户信息到本地
    log('保存用户信息', res)
    const mark = 0
    const { data, code } = res
    if (code === mark) {
      this.queryBindPhone() // 查询有无绑定过手机号
    }
  },

  // 获取微信 login 信息
  async pageGetWxLoginInfo() {
    const mark = false // 此页面无需跳转回来
    const res = await getWxLoginInfo(mark)
    const { data } = res
    return data
  },

  // 用户信息
  async bindgetuserinfo(e) {
    const wxSession = await queryWxLoginCode()
    if (!wxSession) {
      const wxCode = await this.pageGetWxLoginInfo()
      const res = await wxLogin(wxCode)
      const suc = 0
      const { data, code } = res
      if (code === suc) {
        log('token数据', data)
        await this.cacheWxtoken(data)
      }
    }
    log(e.detail)
    const data = e.detail
    const mark = e.detail.errMsg
    const flag = 'getUserInfo:ok'
    if (mark == flag) {
      log('用户信息')
      // 发送给后台
      let toSave = false
      clearInterval(timer)
      timer = setInterval(() => {
        toSave = queryWxToken()
        log('关键字', toSave)
        if (toSave && !run) {
          clearInterval(timer)
          run = true
          this.bindUserWxInfo(data)
        }
      }, 60)
    }
  },

  // 绑定前往门店
  gotoBindShop() {
    wx.navigateTo({
      url: `/pages/login/loginAddress/index`,
    })
  },

  // 暂存用户手机号数据
  cachePhone(data) {
    app.globalData.phone = data
  },

  // 用户手机号
  bindgetphonenumber(e) {
    log(e.detail)
    const phone = e.detail
    const mark = e.detail.errMsg
    const flag = 'getPhoneNumber:ok'
    if (mark == flag) {
      log('手机号')
      // 发送给后台
      this.cachePhone(phone)
      this.gotoBindShop()
    }
  },

  // 暂不注册
  reject() {
    log('暂不注册')
    this.backPrePage()
    // wx.reLaunch({
    //   url: '/pages/my/index',
    // })
  },

  // 存储微信token
  async cacheWxtoken(token) {
    app.globalData.wxToken = token
    await saveWxToken(token)
  },

  // 查询登录
  async queryLogin() {
    const body = await queryWxLoginCode()
    const mark = false
    const wxCode = await getWxLoginInfo(mark)
    log('获取微信实际用户数据', wxCode)
    const res = await wxLogin(wxCode.data)
    const suc = 0
    const { data, code } = res
    if (code === suc) {
      log('token数据', data)
      await this.cacheWxtoken(data)
    }
  },

  // 默认登录返回的情况

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryLogin()
    const flag = 'login'
    const { mark } = options
    log(mark)
    if (mark !== flag) {
      this.setData({
        auth: false,
        phone: true,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(timer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

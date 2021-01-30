// pages/mine/index.js

const app = getApp()
const gs = require('../../utils/utils.js')
import { getCurrentPageUrl, userInfoLocal, getWxLoginInfo, getUserInfoLocal, queryUserInfoAndStore, tourist } from '../../utils/userInfo'
import { getMarketingCount, getOrderCount } from '../../api/my'
import log from '../../utils/log'

Page({
  mixins: [require('../../mixins/setColor.js')],
  /**
   * 页面的初始数据
   */
  data: {
    linkCustomer: null, // 默认无客服
    hasUserInfo: false,
    count: 0, // 进入页面计数
    avatarUrl: '', // 用户头像
    nickName: '', // 昵称
    shop: '',
    editShopmallName: 1,// 1启用 0 禁用
    maxTip: 9, // 可改变角标样式
    maxTipNum: 99, // 最大可实现的角标
    maxText: 99, // 最大字样
    maxUnit: '+', // 超出符号
    bindPhone: false, // 已经绑定手机号
    globalStyle: app.globalData.globalStyle,
    safeArea: app.globalData.safeArea,
    status: {
      all: 'all',
      waiting: 'waiting',
      confirm: 'confirm',
      increase: 'increase',
      cancel: 'cancel',
      finish: 'finish',
    },
    tag: {
      all: {
        status: '0',
        num: 0,
        tip: 0,
        plus: false,
      },
      waiting: {
        status: '1',
        num: 0,
        tip: 0,
        plus: false,
      },
      confirm: {
        status: '2',
        num: 0,
        tip: 0,
        plus: false,
      },
      increase: {
        status: '3',
        num: 0,
        tip: 0,
        plus: false,
      },
      cancel: {
        status: '-1',
        num: 0,
        tip: 0,
        plus: false,
      },
      finish: {
        status: '4',
        num: 0,
        tip: 0,
        plus: false,
      }
    },
    maketCount: {},
    orderCount: {},
  },
  changeColor() {
    app.globalData.globalStyle = app.globalData.globalStyle === '0' ? '1' : '0'
    this.setTabBarStyleAndsetNavigationBarColor(true, 4)
  },
  goCollection: async function () {
    await tourist()
    wx.navigateTo({
      url: '/pages/my/collect/index',
    })
  },
  async handleCoupons() {
    await tourist() 
    wx.navigateTo({
      url: '/pages/my/coupons/index',
    })
  },
  // 存储登录 code
  saveLoginCode(code) {
    app.globalData.loginCode = code
  },
  // 存储登录前的页面路由
  cachePageUrl(url) {
    app.globalData.toLoginUrl = url
  },
  // 登录注册
  async handleLoginRegitser() {
    const login = this.data.hasUserInfo
    const userInfo = app.globalData.userInfoAndStore
    log('这里出现的问题为何不登录', login, userInfo)
    if (login) { // 已经登录则去用户信息页
      return
    }
    const mark = 'login'
    const flag = 0
    const res = await getWxLoginInfo()
    log('登录消息', res)
    const { code } = res
    if (code === flag) {
      // this.saveLoginCode(code)
      // const url = getCurrentPageUrl()
      // this.cachePageUrl(url)
      // wx.navigateTo({
      //   url: `/pages/login/index?mark=${mark}`,
      // })

      wx.login({
      success: (res) => {
        log('登录成功', res)
        const suc = 'login:ok'
        const { errMsg, codes } = res
        if (errMsg === suc) {
          this.saveLoginCode(codes)
          const url = getCurrentPageUrl()
          this.cachePageUrl(url)
          log('现在去缓存页面url', url)
          wx.navigateTo({
            url: `/pages/login/index?mark=${mark}`,
          })
        }
      }
    })
    }
    // wx.login({
    //   success: (res) => {
    //     log('登录成功', res)
    //     const suc = 'login:ok'
    //     const { errMsg, code } = res
    //     if (errMsg === suc) {
    //       this.saveLoginCode(code)
    //       const url = getCurrentPageUrl()
    //       this.cachePageUrl(url)
    //       wx.navigateTo({
    //         url: `/pages/login/index?mark=${mark}`,
    //       })
    //     }
    //   }
    // })
  },
  // 绑定手机
  async handleBindPhone() {
    log('绑定手机')
    const mark = 'phone'
    const flag = 0
    const res = await getWxLoginInfo()
    log('登录消息', res)
    const { code } = res
    if (code === flag) {
      wx.navigateTo({
        url: `/pages/login/index?mark=${mark}`,
      })
    }
  },
  // 查看用户信息
  async queryUserInfo() {
    const mark = this.data.hasUserInfo
    let count = this.data.count
    this.setTabBarStyleAndsetNavigationBarColor(true)
    const _this = this;
    // const { userInfoAndStore } = app.globalData
    const userInfoAndStore  = await queryUserInfoAndStore()
    const userInfo = await getUserInfoLocal()
    log('现在去获取用户信息', userInfo)
    log('店铺和手机号码', userInfoAndStore)
    if (userInfoAndStore && userInfo) {
      this.setData({
        avatarUrl: userInfo.userInfo.avatarUrl,
        nickName: userInfo.userInfo.nickName,
        phone: userInfoAndStore ? userInfoAndStore.member ? userInfoAndStore.member.phone : '' : '',
        shop: userInfoAndStore ? userInfoAndStore.store ? userInfoAndStore.store.name : '' : '',
        hasUserInfo: true,
      })
    } else if (userInfo) {
      this.setData({
        avatarUrl: userInfo.userInfo.avatarUrl,
        nickName: userInfo.userInfo.nickName,
        phone: userInfoAndStore ? userInfoAndStore.member ? userInfoAndStore.member.phone : '' : '',
        shop: userInfoAndStore ? userInfoAndStore.store ? userInfoAndStore.store.name : '' : '',
        hasUserInfo: true,
      })
    } else {
      this.setData({
        hasUserInfo: false
      })
    }
    // 查看是否授权
    // wx.getSetting({
    //   success(res) {
    //     log('授权情况')
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function (res) {
    //           log('用户信息', res)
    //           _this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             nickName: res.userInfo.nickName,
    //             hasUserInfo: true
    //           })
    //         }
    //       })
    //     } else {
    //       _this.setData({
    //         hasUserInfo: false // 开发用 true
    //       })
    //     }
    //   }
    // })
  },

  // 查询用户信息
  async queryInfoLocal() {
    const res = await userInfoLocal()
    log('获取本地用户信息', res)
    const { code } = res
    const mark = 0
    if (code === mark) {
      this.setData({
        linkCustomer: 'contact'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryUserInfo()
    this.queryInfoLocal()
    this.queryMaketingCount()
    this.queryOrderCount()
  },

  bindGetUserInfo(option) {
    this.setData({
      avatarUrl: option.detail.userInfo.avatarUrl,
      nickName: option.detail.userInfo.nickName,
      hasUserInfo: true
    })
  },

  // 匹配订单数据
  matchOrder(arr) {
    const arg = arr
    const tag = this.data.tag
    const mark = this.data.maxTipNum
    const maxText = this.data.maxText
    const maxTip = this.data.maxTip
    const list = Object.keys(tag)
    const result = {}
    arg.map(item => {
      list.map(ite => {
        if (tag[ite].status == item.orderStatus) {
          const options = {}
          options.tip = item.orderCount > maxTip ? true : false
          options.num = item.orderCount > mark ? maxText : item.orderCount
          options.status = tag[ite].status
          options.plus = item.orderCount > mark ? true : false
          let tagKey = ite
          result[tagKey] = options
        }
      })
    })
    this.setData({
      tag: result,
    })
  },

  // 售后或退款
  afterSaleOrRefund() {
    log('售后或退款')
    // wx.navigateTo({
    //   url: '待添加售后或退款页面'
    // })
  },

  // 查看全部
  async handleOrder(e) {
    const unusual = 'cancel'
    log('状态', e.currentTarget.id)
    const mark = e.currentTarget.id
    const status = this.data.tag[mark].status
    const toLogin = await tourist()
    if (toLogin) {
      return 
    }
    if (mark === unusual) {
      this.afterSaleOrRefund()
    } else {
      wx.navigateTo({
        url: `/pages/order/index?status=${status}`,
      })
    }
  },
  async handleRecord(e) {
    const toLogin = await tourist()
    if (toLogin) {
      return 
    }
    wx.navigateTo({
      url: `/pages/my/integralRecord/index`,
    })
  },

  // 查看全部
  handleMyContent(e) {
    const mark = this.data.hasUserInfo
    if (!mark) {
      this.handleLoginRegitser() // 去登录注册页
    } else {
      wx.navigateTo({
        url: `/pages/my/myProfile/index`,
      })
    }
  },

  // 查看地址
  async handleAddress() {
    const toLogin = await tourist()
    if (toLogin) {
      return 
    }
    wx.navigateTo({
      url: '/pages/shoppingAddress/index'
    })
  },

  // 联系客服
  async bindcontact() {
    const toLogin = await tourist()
    if (toLogin) {
      return 
    }
  },

  // 查询订单统一信息
  queryOrderCountInfo() {
    const customerInfo = wx.getStorageSync('customerInfo')
    const customerId = customerInfo.customerId || null
  },

  // 测试生命周期
  showLift() {
    log('test lift')
  },

  // 非首次进入页面
  unFirstEntry() {
    let count = this.data.count
    count += 1
    log('这个时候是几', count)
    if (count > 1) {
      this.queryUserInfo()
    }
    this.setData({
      count: count,
    })
  },

  // 赋值营销统计信息
  empowerMaketingCount(info) {
    const maket = info
    this.setData({
      maketCount: maket,
    })
  },

  // 查询营销统计
  async queryMaketingCount() {
    const { code } = await userInfoLocal()
    const  userInfoAndStore  = await queryUserInfoAndStore()
    log('这里出现的问题', userInfoAndStore)
    const phone = userInfoAndStore ? userInfoAndStore.member ? userInfoAndStore.member.phone : '' : ''
    log('手机号', phone)
    const mark = 0
    if ((code !== mark) || !phone) {
      return
    }
    const body = ''
    const res = await getMarketingCount(body)
    const { data } = res
    log('营销数据', data)
    if (data) {
      this.empowerMaketingCount(data)
    }
  },

  // 赋值订单统计信息
  empowerOrderCount(info) {
    const order = info
    const tags = this.data.tag
    const mark = this.data.maxTipNum
    const maxText = this.data.maxText
    const maxTip = this.data.maxTip
    tags.waiting.num = order.notpaidNum > mark ? maxText : order.notpaidNum
    tags.confirm.num = order.notshippedNum > mark ? maxText : order.notshippedNum
    tags.increase.num = order.shippedNum > mark ? maxText : order.shippedNum
    tags.cancel.num = order.refundOrReturnGoods > mark ? maxText : order.refundOrReturnGoods
    tags.waiting.tip = order.notpaidNum > maxTip ? true : false
    tags.confirm.tip = order.notshippedNum > maxTip ? true : false
    tags.increase.tip = order.shippedNum > maxTip ? true : false
    tags.cancel.tip = order.refundOrReturnGoods > maxTip ? true : false
    tags.waiting.plus = order.notpaidNum > mark ? true : false
    tags.confirm.plus = order.notshippedNum > mark ? true : false
    tags.increase.plus = order.shippedNum > mark ? true : false
    tags.cancel.plus = order.refundOrReturnGoods > mark ? true : false
    this.setData({
      tag: tags,
    })
  },

  // 查询订单统计
  async queryOrderCount() {
    const { code } = await userInfoLocal()
    const  userInfoAndStore  = await queryUserInfoAndStore()
    const phone = userInfoAndStore ? userInfoAndStore.member ? userInfoAndStore.member.phone : '' : ''
    log('手机号', phone)
    const mark = 0
    if ((code !== mark) || !phone) {
      return
    }
    const body = ''
    const res = await getOrderCount(body)
    const { data } = res
    log('订单数据', data)
    if (data) {
      this.empowerOrderCount(data)
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
    this.queryOrderCountInfo()
    this.setTabBarStyleAndsetNavigationBarColor(false, 4)
    this.showLift() // 测试生命周期
    this.unFirstEntry()  // 查看用户信息
    // 需要查询订单数据
    this.queryMaketingCount()
    this.queryOrderCount()
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
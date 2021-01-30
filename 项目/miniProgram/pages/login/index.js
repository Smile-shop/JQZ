// pages/login/index.js
import {
  Server
} from '../../models/server.js'

let server = new Server()

let sendMSMBtnTimer = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    verifyCode: '',
    isSendSMS: false,
    modal: {
      show: false,
      hasCancelBtn: false,
      content: '该账号现无法浏览小程序，请联系相 关人员'
    },
    sendMSMBtnTime: 60,
    isLogin: false,
    hasUserInfo: true,
    globalStyle: getApp().globalData.globalStyle,
    globalShare: getApp().globalData.globalShare
  },

  sendSMS() {
    if (!this.data.phone) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    // 验证手机号
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.phone))) {
      wx.showToast({
        title: '手机号码有误',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    if (this.data.isSendSMS) {
      wx.showToast({
        title: '验证码正在发送，请稍候',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setTimerStart()
      server.sendMSMCode({ phone: this.data.phone }).then(res => {
        wx.showToast({
          title: '验证码已发送，请注意查收',
          icon: 'none',
          duration: 2000
        })
      }).catch(() => {
        this.setTimerEnd()
      })
    }
  },
  // 开始计时
  setTimerStart() {
    this.setData({
      isSendSMS: true,
      sendMSMBtnTime: 60
    })
    sendMSMBtnTimer = setInterval(() => {
      if (this.data.sendMSMBtnTime > 1) {
        this.setData({
          sendMSMBtnTime: --this.data.sendMSMBtnTime
        })
      } else {
        this.setTimerEnd()
      }
    }, 1000)
  },
  // 结束计时
  setTimerEnd() {
    if (sendMSMBtnTimer) {
      clearInterval(sendMSMBtnTimer)
      sendMSMBtnTimer = null
    }
    this.setData({
      isSendSMS: false
    })
  },
  // 输入框
  fieldInput(e) {
    const value = e.detail.value
    const type = e.target.dataset.type
    this.setData({
      [type]: value,
      isLogin: false
    })
  },
  // 清除输入
  clearInput(e) {
    const type = e.target.dataset.type
    this.setData({
      [type]: ''
    })
  },
  // 手机登录
  phoneLogin() {
    this.setData({
      hasUserInfo: false
    })
  },
  computedLoginRes(res) {
    const {
      customerInfo,
      ticket
    } = res.data
    // 判断手机号是否绑定
    if (customerInfo) {
      // 判断客户是否禁用
      if (customerInfo.status == '1') {
        wx.setStorage({
          key: 'customerInfo',
          data: {
            loginTime: Date.now(),
            ticket,
            ...customerInfo
          }
        })
        // 分享登录
        if (this.data.globalShare === '1') {
          this.goShareDetail()
        } else {
          // 跳转首页
          wx.switchTab({
            url: '../home/index'
          })
        }
        getApp().globalData.isVisitor = false
      } else {
        this.setData({
          modal: {
            show: true,
            hasCancelBtn: false,
            content: '该账号已失效，请联系相关人员'
          }
        })
      }
    } else {
      this.setData({
        modal: {
          show: true,
          hasCancelBtn: false,
          content: '该账号现无法浏览小程序，请联系相关人员'
        }
      })
    }
  },
  // 登录
  login() {
    this.setData({
      isLogin: true
    })
    const params ={
      phone: this.data.phone,
      verifyCode: this.data.verifyCode
    }
    server.phoneLogin(params).then(res => {
      this.computedLoginRes(res)
    })
  },
  getPhoneNumber(e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      const params = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
      server.decryptMsg(params).then(res => {
        this.computedLoginRes(res)
      })
    }
  },
  // 取消登录
  cancelLogin() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 游客访问
  visitorGo() {
    getApp().globalData.isVisitor = true
    this.goShareDetail()
  },
  // 分享详情跳转
  goShareDetail() {
    const globalParams = getApp().globalData.globalParams.detail
    const origin = getApp().globalData.globalParams.origin
    wx.navigateTo({
      url: `../goodsDetail/index?detail=${globalParams}&origin=${origin}`
    });
  },
  onLoad() {
    // 游客隐藏home键
    const globalShare = getApp().globalData.globalShare
    if (globalShare === '1') {
      if (wx.canIUse('hideHomeButton')) {
        wx.hideHomeButton()
      }
    }
    this.setData({
      globalStyle: getApp().globalData.globalStyle,
      globalShare: getApp().globalData.globalShare
    })
  },
  onUnload() {
    this.setTimerEnd();
  }
})
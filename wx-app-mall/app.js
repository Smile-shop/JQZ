//app.js
require('./mixins/mixins.js')
App({
  globalData: {
    headerPosi: {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0
    },
    systeminfo: {},
    // 用户信息
    userInfo: {
      avatarUrl: '',
      city: '',
      country: '',
      gender: 1,
      language: 'zh_CN',
      nickName: '',
      province: ''
    },
    // 主题
    theme: {
      '0': { name: '翡翠风', mainColor: '#4BC99B' },
      '1': { name: '红橙风', mainColor: '#FF4646' }
    },
    // 风格
    globalStyle: '1',
    safeArea: null,
    loading: false,
    loginCode: null, // 微信登录临时数据
    appid: '68594CF2-E947-82FA-84D0-01D4556F9F54', // 
    userInfoAndStore: null, // 用户信息及门店信息
    wxToken: null, // 微信 token
    jqzToken: null, // 金千枝 token
    toLoginUrl: null, // 去登录时的页面路径
    phone: null, // 用户手机数据
    queryGoods: null, // 查询商品详情参数去登录存
    goodsInfo: null, // 增加游客操作体验参数
    storeId: null
  },
  getSystemInfo() {
    this.globalData.headerBtnPosi = wx.getMenuButtonBoundingClientRect()
    wx.getSystemInfo({ // iphonex底部适配
      success: res => {
        this.globalData.systeminfo = res
      }
    })
  },
  async init() {
    // 获取用户信息
    const getUserInfo = async () => {
      return new Promise((resolve, reject) => {
        wx.getUserInfo({
          success: (res) => {
            const { userInfo } = res;
            resolve(userInfo);
          },
          fail: (res) => {
            reject(res.errMsg)
          }
        })
      })
    }

    // 登录
    const login = async () => {
      return new Promise((resolve, reject) => {
        wx.login({
          success: (res) => {
            const { code } = res;
            resolve(code);
          },
          fail: (res) => {
            reject(res.errMsg)
          }
        })
      })
    }

    const code = await login();
    const userInfo = await getUserInfo();
    this.globalData.userInfo = userInfo;

    wx.getSystemInfo({
      success(res) {
        console.log('获取系统信息成功', res.safeArea, res.model)
        this.globalData.safeArea = res.safeArea;
      },
      fail() {
        console.log('获取系统信息失败')
      }
    })
  },
  // 获取 appid
  async queryAppid() {
    const appid = wx.getAccountInfoSync().miniProgram.appId
    this.globalData.appid = appid
  },
  getStorageUserInfoAndStore(){
    try { 
      const value = wx.getStorageSync('userInfoAndStore')
      if (value) {
        this.globalData.userInfoAndStore = value
        this.globalData.storeId = value.store.id
      }
    } catch (e) {}
  },
  async onLaunch() {
    // this.init();
    this.getSystemInfo()
    this.getStorageUserInfoAndStore()
    // this.queryAppid()
  },
})
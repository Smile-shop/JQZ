import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    Loading: false,
    themeColor: null,
    pageErrorData: {
      show: false,
      msg: '',
      img: 'not-found'
    },
    urlData: {
      openid: null,
      companyKey: null,
      register_openid: null,
      page: null,
      memberCard: null,
      phone: null,
      headerImg: null,
      localUrl: null,
      isRegister: null
    },
    homeMemberData: {
      isMemberOrNot: 1,
      couponNum: 0,
      cardNum: null,
      phone: null,
      level: null,
      totalScore: 0,
      ableScore: 0,
      qrcodeImg: null,
      inviteCode: null,
      shareImg: null,
      name: null,
      balance: 0,
    },
    pageShowInfo: {
      isTotalScore: '1',
      isAbleScore: '1',
      goldPriceImg: null,
      isForgetpwd: '1',
      isUpdate: '1'
    },
    homePageData: {
      pageStyle: 2,
      themeColor: '#e12f30',
      logoImg: null,
      isRegister: '1',
      headerImg: '',
      viewFunction: [],
      isTotalScore: '1',
      isAbleScore: '1',
      cardNum: '',
      isHaveCard: '1',
      isShare: '1',
      shareContent: '',
      shareTitle: '',
      isOpenService: '0'
    },
    // 优惠券详情
    couponDetails: null,
    isFirstPage: true,
    // 首页完善资料弹窗
    indexPoupShow: false,
    indexPoupScore: 0,
    // 请求参数异常
    requestPoupShow: false,
    appId: ''
  },
  mutations: {
    // 首页请求弹窗
    requestIndexPoup(state, isShow) {
      if (state.indexPoupShow) {
        state.indexPoupShow = false;
      }
      state.requestPoupShow = isShow;
    },
    closeIndexPoup(state, data) {
      state.indexPoupShow = data.isShow;
      state.indexPoupScore = data.score
    },
    // 判断是否为首次进入
    isFirstPage(state, data) {
      state.isFirstPage = data;
    },
    // 优惠券详情
    couponDetails(state, data) {
      state.couponDetails = data;
    },
    // 处理首页信息
    getUrlData(state, data) {
      state.urlData.openid = data.openid || '';
      state.urlData.companyKey = data.companyKey || '';
      state.urlData.register_openid = data.register_openid || '';
      state.homePageData.headerImg = data.headerImg || require('./assets/headImg.png');
      state.urlData.page = data.page || 'index';
      state.urlData.memberCard = data.memberCard || '';
      state.homeMemberData.cardNum = data.memberCard || '';
      state.urlData.phone = data.phone || '';
      state.urlData.headerImg = data.headerImg || '';
      state.urlData.localUrl = data.localUrl || '';
      state.urlData.isRegister = data.isRegister || '';
      window.localStorage.setItem('urlData', JSON.stringify(data));
    },
    // 处理首页会员信息
    homeMemberInfoControl(state, data) {
      state.homeMemberData.isMemberOrNot = data.isMemberOrNot === 0 ? 0 : 1;
      state.homeMemberData.shareImg = data.shareImg || null;
      state.pageShowInfo.goldPriceImg = data.goldPriceImg || null;
      state.pageShowInfo.isForgetpwd = data.isForgetpwd || '1';
      state.pageShowInfo.isUpdate = data.isUpdate || '1';
      if (data.isMemberOrNot) {
        state.homeMemberData.couponNum = data.couponNum || 0;
        state.homeMemberData.cardNum = data.wxMemberInfo.cardNum || null;
        state.homeMemberData.balance = data.wxMemberInfo.balance || 0;
        state.homeMemberData.phone = data.wxMemberInfo.phone || null;
        state.homeMemberData.level = data.wxMemberInfo.level || null;
        state.homeMemberData.totalScore = data.wxMemberInfo.totalScore || 0;
        state.homeMemberData.ableScore = data.wxMemberInfo.ableScore || 0;
        state.homeMemberData.qrcodeImg = data.qrcodeImg || null;
        state.homeMemberData.inviteCode = data.wxMemberInfo.inviteCode || null;
        state.homeMemberData.name = data.wxMemberInfo.name || null;
        // urlData信息
        state.urlData.memberCard = data.wxMemberInfo.cardNum || null;
        state.urlData.phone = data.wxMemberInfo.phone || null;
        window.localStorage.setItem('urlData', JSON.stringify(state.urlData));
      }
      // 累计积分、可用积分是否显示
      state.pageShowInfo.isTotalScore = data.isTotalScore || '1';
      state.pageShowInfo.isAbleScore = data.isAbleScore || '1';
      state.homePageData.isTotalScore = data.isTotalScore || '1';
      state.homePageData.isAbleScore = data.isAbleScore || '1';
      // 分享内容
      state.homePageData.shareContent = data.shareContent || '0';
      state.homePageData.shareTitle = data.shareTitle || '0';
      state.homePageData.isOpenService = data.isOpenService || '0';
    },
    // 首页显示信息处理
    homePageInfoControl(state, data) {
      state.homePageData.pageStyle = data.bgsort || 1;
      state.homePageData.themeColor = data.colorname || '#e12f30';
      state.themeColor = data.colorname || '#e12f30';
      window.localStorage.setItem('themeColor', state.homePageData.themeColor);
      state.homePageData.logoImg = data.logoImg || null;
      state.homePageData.isRegister = data.isRegister || '1';
      let viewFunction = data.viewFunction || '[]';
      const viewFunctionFilter = JSON.parse(viewFunction).filter(p => p.name !== '优惠券' && p.name !== '开心小游戏' && p.name !== '微好礼' && p.name !== '微商城' && p.name !== '我的礼品' && p.name !== '在线预约' && p.name !== '今日金价')
      state.homePageData.viewFunction = data.isFreeMember === 1 ? viewFunctionFilter : JSON.parse(viewFunction).filter(p => p.status === '1');
      state.homePageData.isHaveCard = data.isHaveCard || '0';
      state.homePageData.isShare = data.isShare || '0';
    },
    // app风格
    appThemeColor(state, data) {
      state.themeColor = data || '#e12f30';
    },
    // 问题页面
    pageErrorControl(state, data) {
      // 关闭loading图
      state.Loading = false;
      state.pageErrorData.show = data.show;
      state.pageErrorData.msg = data.msg;
      state.pageErrorData.img = data.img;
    },
    // Loading图  显隐
    changeLoading(state, data) {
      // 关闭错误页面
      state.pageErrorData.show = false;
      state.Loading = data;
    },
    saveAppId(state, data) {
      state.appId = data
    }
  },
  actions: {
    // 激活
    activePackage(context, data) {
      axios.post(`${Vue.prototype.httpUrl}/jop-web/wxBind/activation`, data).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    getHomePageRegisterInfo(context, data) {
      return new Promise(resolve => {
        axios.post(`${Vue.prototype.httpUrl}/jop-web/wxBind/wxMiddle`, data).then(res => {
          resolve(res);
        }).catch(err => {
          console.log(err)
        })
      })
    },
    getWxRegisterType(context, data) {
      return new Promise(resolve => {
        axios.post(`${Vue.prototype.httpUrl}/jop-web/wxBind/wxRegistType`, data).then(res => {
          resolve(res);
        }).catch(err => {
          console.log(err)
        })
      })
    },
    // 获取首页会员信息
    getHomeMemberIndex({ dispatch, commit, state }, params) {
      axios.post(`${Vue.prototype.httpUrl}/jop-web/wxMember/wxMemberIndex`, params).then(res => {
        if (res.data.code === 0) {
          commit('homeMemberInfoControl', res.data.data);
          const isLogin = window.localStorage.getItem(`ticket_${params.companyKey}`);
          if (isLogin) {
            dispatch('getHomePagePoupInfo', res.data.data.wxMemberInfo.cardNum);
          }
          dispatch('getAppid', {
            companyKey: params.companyKey,
            inviteCode: state.homeMemberData.inviteCode,
            isRegister: state.homePageData.isRegister,
            shareImg: state.homeMemberData.shareImg
          });
        } else {
          Vue.prototype.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取首页弹窗是否显示
    getHomePagePoupInfo({ commit, state }, cardNum) {
      axios.post(`${Vue.prototype.httpUrl}/jop-web/wxRemind/searchMeansRemind`, {
        memberCard: state.homeMemberData.cardNum || cardNum
      }, {
        headers: { memberCard: state.homeMemberData.cardNum || cardNum }
      }).then(res => {
        if (res.data.code === 0 && res.data.data) {
          commit('closeIndexPoup', {
            isShow: res.data.data.status === '1',
            score: res.data.data.modifyScore
          });
        } else {
          commit('closeIndexPoup', {
            isShow: false,
            score: 0
          });
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取首页展示信息
    getHomePageInfo(context, data) {
      return new Promise(resolve => {
        axios.post(`${Vue.prototype.httpUrl}/jop-web/wxMember/wxIndex`, data).then(res => {
          resolve(res);
        }).catch(err => {
          console.log(err)
        })
      })
    },
    // 短信验证码
    sendSmsValidate(context, data) {
      return new Promise(resolve => {
        axios.post(`${Vue.prototype.httpUrl}/jop-web/wxCode/sendPhoneMsg`, data).then(res => {
          resolve(res);
        }).catch(err => {
          console.log(err)
        })
      })
    },

    // 获取appid
    getAppid({dispatch, commit}, data) {
      axios.post(`${Vue.prototype.httpUrl}/jop-web/wxMember/wxCompanyExplain`, {companyKey: data.companyKey}).then(res => {
        if (res.data.code === 0) {
          commit('saveAppId', res.data.data.appid)
          dispatch('goShare', {
            appid: res.data.data.appid,
            data: data
          });
        }
      }).catch(err => {
        console.log(err)
      })
    },

    // 文章分享获取 appid
    getArticelAppid({ dispatch }, data) {
      axios.post(`${Vue.prototype.httpUrl}/jop-web/wxMember/wxCompanyExplain`, { companyKey: data.companyKey }).then(res => {
        if (res.data.code === 0) {
          dispatch('goArticleShare', {
            appid: res.data.data.appid,
            data: data
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },

    // 分享
    goShare({ state }, data) {
      let shareData = data.data;
      let params = {
        companyKey: shareData.companyKey,
        url: window.location.href.split('#')[0]
      };

      axios.post(`${Vue.prototype.httpUrl}/jop-web/wxinit/jsapi_ticketSign`, params).then(res => {
        let page = shareData.isRegister === '1' ? '&page=share_register' : '&page=share';
        if (res.data.code == 0) {
          let resData = res.data.data;
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appid, // 必填，公众号的唯一标识
            timestamp: resData.timestamp, // 必填，生成签名的时间戳
            nonceStr: resData.nonceStr, // 必填，生成签名的随机串
            signature: resData.signature, // 必填，签名
            jsApiList: [
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'showOptionMenu',
              'showMenuItems',
              'showAllNonBaseMenuItem',
              'getLocation'
            ]
            // 必填，需要使用的JS接口列表
          });

          wx.ready(function () {
            wx.onMenuShareAppMessage({
              title: state.homePageData.shareTitle || '注册会员',
              desc: state.homePageData.shareContent || '有福同享，注册享好礼！',
              link: `${Vue.prototype.httpUrl}/wx-interface-web/wx/auth?companyKey=${shareData.companyKey}${page}&shareId=${shareData.inviteCode}`,
              imgUrl: shareData.shareImg,
              success: function (res) { }
            });

            wx.onMenuShareTimeline({
              title: state.homePageData.shareTitle || '注册会员',
              link: `${Vue.prototype.httpUrl}/wx-interface-web/wx/auth?companyKey=${shareData.companyKey}${page}&shareId=${shareData.inviteCode}`,
              imgUrl: shareData.shareImg,
              success: function (res) { }
            });

            wx.showMenuItems({
              menuList: [
                'menuItem:share:appMessage'
              ]
            });

            wx.getLocation({
              type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: function (res) {
                // const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                // const longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                const location = {
                  latitude: res.latitude,
                  longitude: res.longitude
                }
                window.sessionStorage.setItem('location', JSON.stringify(location));
              }
            });
          });
        }
      }).catch(err => {
        console.log(err)
      })
    },

    // 文章分享
    goArticleShare({ state }, data) {
      let shareData = data.data;
      let params = {
        companyKey: shareData.companyKey,
        url: window.location.href.split('#')[0]
      };

      axios.post(`${Vue.prototype.httpUrl}/jop-web/wxinit/jsapi_ticketSign`, params).then(res => {
        let page = shareData.isRegister === '1' ? '&page=share_register' : '&page=share';
        if (res.data.code == 0) {
          let resData = res.data.data;
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appid, // 必填，公众号的唯一标识
            timestamp: resData.timestamp, // 必填，生成签名的时间戳
            nonceStr: resData.nonceStr, // 必填，生成签名的随机串
            signature: resData.signature, // 必填，签名
            jsApiList: [
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'showOptionMenu',
              'showMenuItems',
              'showAllNonBaseMenuItem',
              'getLocation'
            ]
            // 必填，需要使用的JS接口列表
          });

          wx.ready(function () {
            wx.onMenuShareAppMessage({
              title: shareData.shareTitle || '注册会员',
              desc: shareData.shareContent || '有福同享，注册享好礼！',
              link: `${Vue.prototype.httpUrl}/wx-interface-web/wx/auth?companyKey=${shareData.companyKey}${page}&shareId=${shareData.inviteCode}&childPage=consult-details&articleId=${shareData.articel}`,
              imgUrl: shareData.shareImg,
              success: function (res) { }
            });

            wx.onMenuShareTimeline({
              title: shareData.shareTitle || '注册会员',
              link: `${Vue.prototype.httpUrl}/wx-interface-web/wx/auth?companyKey=${shareData.companyKey}${page}&shareId=${shareData.inviteCode}&childPage=consult-details&articleId=${shareData.articel}`,
              imgUrl: shareData.shareImg,
              success: function (res) { }
            });

            wx.showMenuItems({
              menuList: [
                'menuItem:share:appMessage'
              ]
            });

            wx.getLocation({
              type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: function (res) {
                // const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                // const longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                const location = {
                  latitude: res.latitude,
                  longitude: res.longitude
                }
                window.sessionStorage.setItem('location', JSON.stringify(location));
              }
            });
          });
        }
      }).catch(err => {
        console.log(err)
      })
    },

    // 文章操作分享
    articleShare({ dispatch, state }, data) {
      dispatch('getArticelAppid', {
        companyKey: data.companyKey,
        inviteCode: state.homeMemberData.inviteCode,
        isRegister: state.homePageData.isRegister,
        shareImg: data.shareImg,
        articel: String(data.id),
        shareTitle: data.title,
        shareContent: data.desc,
      });
    },

    // 连单券禁止分享
    stopShare({state}) {
      let params = {
        companyKey: state.urlData.companyKey,
        url: window.location.href.split('#')[0]
      };

      axios.post(`${Vue.prototype.httpUrl}/jop-web/wxinit/jsapi_ticketSign`, params).then(res => {
        if (res.data.code == 0) {
          let resData = res.data.data;
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: state.appId, // 必填，公众号的唯一标识
            timestamp: resData.timestamp, // 必填，生成签名的时间戳
            nonceStr: resData.nonceStr, // 必填，生成签名的随机串
            signature: resData.signature, // 必填，签名
            jsApiList: ['hideMenuItems', 'hideOptionMenu']
            // 必填，需要使用的JS接口列表
          });
          wx.ready(function () {
            wx.hideOptionMenu()
            wx.hideMenuItems({
              menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:share:qq', 'menuItem:share:QZone', 'menuItem:openWithSafari', 'menuItem:openWithQQBrowser', 'menuItem:favorite',"menuItem:copyUrl","menuItem:editTag","menuItem:delete","menuItem:originPage","menuItem:readMode", "menuItem:share:email","menuItem:share:brand"]
            })
          });
        }
      }).catch(err => {
        console.log(err)
      })
    },

    // 异常处理上传
    goNotFound({ }, params) {
      axios.post(`${Vue.prototype.httpUrl}/jip-web/idx/idxTimeoutLogSave`, params).catch(err => {
        console.log(err)
      });
    }
  }
})


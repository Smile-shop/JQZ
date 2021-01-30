import { login, decodePhoneNumber, checkFunctionalPermission, updateWxUserInfo } from './api/index';
import { getQuery } from './utils/index';

App({
  globalData: {
    isNeedLogin: false,
    wxMemberSummary: {
      activeId: 0,
      memberCard: '',
      memberPhone: '',
      mid: '',
      popularValue: 0,
      ranking: 0,
      wicon: '',
      wmid: '',
      wname: '',
      wmobile: '',
      mname: ''
    },
    activeMainBaseInfo: {
      activitiyId: 0,
      addVirUserNum: 0,
      authentica: 1,
      detail: '',
      endTime: 0,
      isOver: 0,
      isAddVirUserNum: 1,
      isOpenWinRecord: 1,
      isShowCountdown: 1,
      isShowOutShopName: 1,
      isShowRemainStock: 1,
      startTime: 0,
    },
    // 是否重定向过
    isRedirected: false,
  },
  watchInit() {
    const self = this;
    this.globalData = new Proxy(self.globalData, {
      get(target, name) {
        return Reflect.get(target, name);
      },
      set(target, name, value, receiver) {
        let success = Reflect.set(target, name, value, receiver);
        self.watchCallBacks.forEach((value) => {
          value(target);
        })

        return success;
      }
    })
  },
  watchCallBacks: [],
  watchGlobalData(callBack) {
    this.watchCallBacks.push(callBack);
  },
  setStorage() {
    const query = getQuery();
    const wxMemberSummary = wx.getStorageSync('wxMemberSummary');
    const activeMainBaseInfo = wx.getStorageSync('activeMainBaseInfo');

    if (wxMemberSummary) {
      this.globalData.wxMemberSummary = wxMemberSummary;
    }

    if (activeMainBaseInfo) {
      this.globalData.activeMainBaseInfo = activeMainBaseInfo;
    }
    
    if (query) {
      wx.setStorageSync('query', {
        ...query,
        page: '',
      });
    }
  },
  login() {
    wx.login({
      async success(res) {
        const body = {
          rqzplus: 'jqz_rqzqj_app_auth_info_plus',
          js_code: res.code
        }

        await login(body);
      },
      fail(res) {
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  async getPhonenumber(e) {
    const {errMsg, encryptedData, iv} = e.detail;

    if (errMsg === 'getPhoneNumber:ok') {
      const body = {
        encryptedData,
        iv
      }
      
      const res = await decodePhoneNumber(body);
      const {
        phoneNumber
      } = res;

      if (phoneNumber) {
        return phoneNumber;
      } else {
        return Promise.reject('没有获取到手机号');
      }
    } else {
      return Promise.reject(errMsg);
    }
  },
  // 更新手机号
  async updateUserPhoneNumber(phoneNumber) {
    const body = {
      mobile: phoneNumber
    }

    const res = await updateWxUserInfo(body);
    return res;
  },
  async getPermission() {
    const body = {
      functionKey: '人气值千金PLUS'
    };

    try {
      await checkFunctionalPermission(body);
    } catch (error) {
      wx.navigateTo({
        url: '/pages/forbidden/forbidden',
      });
    }
  },
  async onLaunch({ query }) {
    console.log(query);
    const res = await this.getPermission();
    this.login();
    // this.watchInit();
    this.setStorage();
  },
})
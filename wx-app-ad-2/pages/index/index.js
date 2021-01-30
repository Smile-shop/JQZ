import { getMainInfo } from '../../api/index'
import dayjs from 'dayjs';
import computedBehavior from 'miniprogram-computed';
import { getQuery } from '../../utils/index';

Page({
  data: {
    behaviors: [computedBehavior],
    pageData: {
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
        mname: '',
        wmobile: '',
      },
      wxMemberGift: [],
      activeGiftList: [],
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
      bannerList: ['/assets/img/banner.png'],
    },
    isShowLogin: false,
    isNeedLogin: false,
    activityTime: {
      status: -1,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0
    },
    timer: null,
    loopTimer: null
  },
  // 页面重定向
  pageRedirect() {
    const app = getApp();
    const { isRedirected } = app.globalData;
    const { page } = getQuery();

    if (page && isRedirected == false) {
      switch (page) {
        case 'top':
          wx.navigateTo({
            url: '/pages/top/top',
          })
          break;
      }
      app.globalData.isRedirected = true;
    }
  },
  async getPageData() {
    const body = {};
    const app = getApp();
    wx.showNavigationBarLoading();

    try {
      const res = await getMainInfo(body);
      if (res) {
        const {
          wxMemberSummary,
          activeMainBaseInfo,
        } = res;
        // 详情中的图片添加class
        activeMainBaseInfo.detail = this.imgAddClass(activeMainBaseInfo.detail);
        this.setData({
          pageData: res
        });
        this.loop()
        app.globalData.wxMemberSummary = wxMemberSummary;
        app.globalData.activeMainBaseInfo = activeMainBaseInfo;
        wx.setStorageSync('wxMemberSummary', wxMemberSummary);
        wx.setStorageSync('activeMainBaseInfo', activeMainBaseInfo);

        if (activeMainBaseInfo.isOver == 0) {
          // 开始倒计时
          this.countDown();

          const relativeTime = this.relativeTime({
            start: activeMainBaseInfo.startTime,
            end: activeMainBaseInfo.endTime,
          });

          if (relativeTime.status == 0) {
            wx.showToast({
              icon: 'none',
              title: '活动还未开始',
            })
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '活动已经结束',
          })
        }

        // 查看是否需要登录
        if (activeMainBaseInfo.authentica == 1 && !wxMemberSummary.wmobile) {
          app.globalData.isNeedLogin = true;
          this.setData({
            isNeedLogin: true,
          });
        } else {
          app.globalData.isNeedLogin = false;
          this.setData({
            isNeedLogin: false,
          });
        }
      }
    } catch (error) {
      console.warn(error);
    } finally {
      wx.hideNavigationBarLoading()
    }
  },
  loop(){
    const wxMemberGift = this.data.pageData.wxMemberGift
    const wxGiftList = 'pageData.wxMemberGift'
    // 重置从其他页面返回时list的数据
    this.setData({ [wxGiftList]: [] })
    this.setData({ [wxGiftList]: wxMemberGift })
    // 无限循环
    const loopTimer = setInterval(() => {
      this.setData({ [wxGiftList]: [] })
      this.setData({ [wxGiftList]: wxMemberGift })
    }, wxMemberGift.length * 4000)
    this.setData({ loopTimer })
  },
  // 倒计时
  countDown() {
    clearInterval(this.data.timer);
    this.data.timer = setInterval(() => {
      const activityTime = this.relativeTime({
        start: this.data.pageData.activeMainBaseInfo.startTime,
        end: this.data.pageData.activeMainBaseInfo.endTime,
      });

      if (activityTime) {
        // 活动已经结束
        if (activityTime.status == 1) {
          clearInterval(this.data.timer);
        }
  
        // 状态变换重新请求
        if (this.data.activityTime.status != -1 && activityTime.status != this.data.activityTime.status) {
          this.getPageData();
        }

        this.setData({
          activityTime,
        })
      }
    }, 1000);
  },
  // 获取相对时间
  relativeTime({ start, end }) {
    const now = dayjs();
    const startTime = dayjs(start * 1000);
    const endTime = dayjs(end * 1000);
    let tartgetTime = null;
    // 状态
    let result = {
      status: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0
    };


    if (now.isBefore(startTime)) {
      // 活动还没开始
      result.status = 0;
      tartgetTime = startTime;
    } else if (now.isAfter(endTime)) {
      // 活动已经结束
      result.status = 1;
    } else {
      // 活动中
      result.status = 2;
      tartgetTime = endTime;
    }

    if (tartgetTime) {
      const differenceDay = tartgetTime.diff(now, 'day');
      const differenceHour = tartgetTime.diff(now, 'hour');
      const differenceMinute = tartgetTime.diff(now, 'minute');
      const differenceSecond = tartgetTime.diff(now, 'second');
      result.day = differenceDay;
      result.hour = differenceHour - differenceDay * 24;
      result.minute = differenceMinute - differenceHour * 60;
      result.second = differenceSecond - differenceMinute * 60;
    }
    
    return result;
  },
  // 显示登录
  async showLogin() {
    this.setData({
      isShowLogin: true,
    })
  },
  // 隐藏登录
  async hideLogin() {
    this.setData({
      isShowLogin: false,
    })
  },
  // 图片添加class
  imgAddClass(nodeString) {
    return nodeString.replace(/<img/ig, `<img class="image"`);
  },
  // 获取手机号
  async getPhonenumber(e) {
    const app = getApp();
    const phoneNumber = await app.getPhonenumber(e);
    await app.updateUserPhoneNumber(phoneNumber);
    wx.showToast({
      title: '登录成功',
    })
    this.getPageData();
    this.hideLogin();
  },
  toPrizeReceivePage(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/prize-receive/prize-receive?id=${id}`,
    })
  },
  onLoad() {
  },
  test() {
    console.log(123)
  },
  async onShow() {
    await this.getPageData();
    this.pageRedirect();
  },
  onHide() {
    if(this.data.loopTimer) {
      clearInterval(this.data.loopTimer)
    }
  }
})

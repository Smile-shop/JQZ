import { getShopInfo, getActiveGiftByGiftId, addGiftOrder, directRegist } from '../../api/index';
import { getQuery } from '../../utils/env';

Page({
  data: {
    prize: {
      giftId: 0,
      giftName: '',
      icon: '',
      activeStorageNum: 0,
      popularValue: 0,
    },
    form: {
      addGiftExchangeOrderDetail: {
        exchangeCount: 1,
        giftId: '',
      },
      exchangeCount: 1,
      memberCard: '',
      mobile: '',
      shopName: '',
      username: '',
      nameOut: ''
    },
    isShowShops: false,
    shops: [],
    isShowOutShopName: 1,
  },
  onLoad(query) {
    const {
      id
    } = query;
    const app = getApp();
    
    if (id) {
      this.setData({
        'form.mobile': app.globalData.wxMemberSummary.wmobile,
        'form.username': app.globalData.wxMemberSummary.mname,
        isShowOutShopName: app.globalData.activeMainBaseInfo.isShowOutShopName
      })
      
      wx.getLocation({
        type: 'wgs84',
        complete: (callBack) => {
          this.getShops(callBack);
        }
      });
  
      this.getPrize(id);
    } else {
      wx.showToast({
        icon: 'none',
        title: '没有找到产品id',
      })
    }
  },
  async getPrize(giftId) {
    const body = {
      giftId
    }

    const res = await getActiveGiftByGiftId(body);

    if (res) {
      this.setData({
        prize: res,
      })
    }
  },
  async getShops(callBack) {
    const {
      errMsg,
      latitude,
      longitude
    } = callBack;
    const body = {};
    
    if (errMsg == 'getLocation:ok') {
      body.latitude = latitude;
      body.longitude = longitude;
    }

    const res = await getShopInfo(body);
    res.forEach((value) => {
      const {
        distant
      } = value;
      
      if (distant) {
        if (distant > 1000) {
          value.distant = `${(distant / 1000).toFixed(1)}公里`;
        } else {
          value.distant = `${distant.toFixed(1)}米`
        }
      } else {
        value.distant = '未知';
      }
    })
    this.setData({
      shops: res,
    })
  },
  // 显示门店选择
  showSelectShop() {
    this.setData({
      isShowShops: true,
    })
  },
  // 隐藏门店选择
  hideSelectShop() {
    this.setData({
      isShowShops: false,
    })
  },
  selectShop(e) {
    const { index } = e.currentTarget.dataset;

    this.setData({
      'form.shopName': this.data.shops[index].shopName,
      'form.nameOut': this.data.shops[index].nameOut,
    })
    this.hideSelectShop();
  },
  nameInput(e) {
    this.setData({
      'form.username': e.detail.value
    });
  },
  // 获取手机号
  async getPhonenumber(e) {
    const app = getApp();
    const res = await app.getPhonenumber(e);
    this.setData({
      'form.mobile': res
    })
  },
  validateForm() {
    if (!this.data.form.shopName) {
      wx.showToast({
        icon: 'none',
        title: '请选择领取门店',
      })
      return false;
    }
    
    if (!this.data.form.username.trim()) {
      wx.showToast({
        icon: 'none',
        title: '请输入领奖人',
      })
      return false;
    }
    
    if (!this.data.form.mobile) {
      wx.showToast({
        icon: 'none',
        title: '请授权手机号',
      })
      return false;
    }

    return true;
  },
  async directRegist() {
    const {
      companyKey,
      openid
    } = getQuery();
    
    const body = {
      companyKey,
      openid,
      phone: this.data.form.mobile,
      memberNum: this.data.form.mobile,
      cardNum: this.data.form.mobile,
      branchShop: this.data.form.shopName,
      sysRegister: 'Y',
    }

    const res = await directRegist(body);
    return res;
  },
  // 提交
  async submitForm() {
    wx.showToast({
      title: '提交中...',
      icon: 'loading',
      mask: true,
      duration: Infinity
    })

    if (this.validateForm()) {
      const body = {
        ...this.data.form
      }
      const app = getApp();
  
      body.addGiftExchangeOrderDetail.giftId = this.data.prize.giftId;
      body.memberCard = app.globalData.wxMemberSummary.memberCard;
      
      if (!body.memberCard) {
        await this.directRegist();
        app.globalData.wxMemberSummary.memberCard = body.mobile;
        body.memberCard = body.mobile;
      }

      try {
        const res = await addGiftOrder(body);

        wx.showToast({
          title: '提交成功',
          icon: 'success'
        })
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }, 2000);
      } catch (error) {
        wx.showToast({
          title: '提交失败, 请重新提交',
          icon: 'none'
        })
      }
    }
  }
})
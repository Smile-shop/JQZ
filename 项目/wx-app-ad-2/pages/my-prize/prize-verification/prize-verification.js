import { qrcode, barcode, getGiftOrder, updateConfirmOrder } from '../../../api/index';

Page({
  data: {
    timer: null,
    id: 0,
    order: {
      giftIcon: 0,
      giftName: '',
      activeStorageNum: 0,
      offlineStorageNum: 0,
      shopAddress: '',
      shopLinkman: '',
      shopNameOut: '',
      shopPhone: '',
      giftOrder: {
        activityId: 0,
        activityName: '',
        exchangeCount: 1,
        giftId: "",
        memberCard: "",
        mobile: "",
        orderId: "",
        shopName: "",
        status: "",
        username: "",
      }
    },
    qrcode: '',
    barcode: '',
    isShowOutShopName: 1,
  },
  async getPrizeOrder() {
    const body = {
      memberCard: getApp().globalData.wxMemberSummary.memberCard,
      orderId: this.data.id,
    }

    const {
      memberCard,
      orderId,
    } = body;

    const res = await getGiftOrder(body);

    if (res) {
      this.setData({
        order: res,
        barcode: barcode({
          memberCard,
          orderId,
        }),
        qrcode: qrcode({
          memberCard,
          orderId,
        }),
      })

      if (res.giftOrder.status == 'CFD') {
        wx.setNavigationBarTitle({
          title: '已核销'
        })
      }
    }
    
  },
  confirmOrder() {
    wx.showModal({
      title: '确认已经领取礼品了吗？',
      success: async (res) => {
        if (res.confirm) {
          const body = this.data.id
      
          const res = await updateConfirmOrder(body);
          wx.showToast({
            title: '领取成功',
          });
          this.getPrizeOrder();
        }
      }
    })
  },
  onLoad(query) {
    const { id } = query;
    const app = getApp();

    if (id) {
      this.setData({
        isShowOutShopName: app.globalData.activeMainBaseInfo.isShowOutShopName
      })
      
      this.setData({
        id
      })
      
      this.getPrizeOrder();
      this.data.timer = setInterval(() => {
        this.getPrizeOrder();
      }, 5000);
    } else {
      wx.showToast({
        title: '订单id错误，请检查',
        icon: 'none',
      });
    }
  },
  onUnload() {
    clearInterval(this.data.timer);
  }
})
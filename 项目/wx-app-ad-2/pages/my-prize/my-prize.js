import { queryGiftOrder } from '../../api/index';
import dayjs from 'dayjs';

Page({
  data: {
    tabsType: '0',
    awaitGetPrizes: [],
    haveGetPrizes: [],
    isLoading: false,
    isShowOutShopName: 1,
  },
  switchTabsType(event) {
    const type = event.target.dataset.type;
    
    if (type != null) {
      this.setData({
        tabsType: type,
      });
    }
  },
  // 获取我的奖品
  async getPrizes(status) {
    if (this.data.isLoading == false) {
      this.setData({
        isLoading: true,
      })
    }

    const body = {
      memberCard: getApp().globalData.wxMemberSummary.memberCard,
      status
    };

    try {
      const res = await queryGiftOrder(body);
      
      if (res) {
        res.forEach((value) => {
          value.giftOrder.createTime = dayjs(value.giftOrder.createTime).format('YYYY-MM-DD HH:mm:ss')
        })
      }

      switch (body.status) {
        case 'NEW':
          this.setData({
            awaitGetPrizes: res || [],
          });
          break;
        case 'CFD':
          this.setData({
            haveGetPrizes: res || [],
          });
          break;
      }
    } catch (err) {
      console.warn(err);
    } finally {
      this.setData({
        isLoading: false,
      })
    }
  },
  onLoad() {
    const app = getApp();

    this.setData({
      isShowOutShopName: app.globalData.activeMainBaseInfo.isShowOutShopName
    })
  },
  onShow() {
    this.getPrizes('NEW');
    this.getPrizes('CFD');
  },
})
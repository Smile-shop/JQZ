import { addOrderApi, getMainInfo, getUserInfo, getWXPrepayRsp } from "@/api";
import appMessage from "@/utils/app-message";
import { getItem, setItem } from "@/utils/local-storage";
import { createStore } from "vuex";
import router from '@/router';

const store = createStore({
  state: {
    initLocationHref: location.href,
    query: {
      code: '',
      companyKey: '',
      platCompanyKey: '',
      distributionId: '',
      orderNo: '',
      channelId: '',
      userId: ''
    },
    share: {
      desc: '',
      imgUrl: '',
      link: '',
      title: ''
    },
    user: {
      arrivedAmount: 0,
      directSuperior: 0,
      headimgUrl: '',
      inviteNum: 0,
      memberCard: '',
      nickname: '',
      nonwithdrawAmount: 0,
      platCompanyKey: '',
      purchased: 0,
      ranking: 0,
      shopName: '',
      userId: '',
      withdrawedAmount: 0,
      wxOpenId: '',
      openId: '',
      verifier: 0
    },
    home: {
      oneCommission: 0,
      secondTitle: '',
      beginTime: 0,
      buyerCount: 0,
      detail: '',
      distributionMerchantSettingVo: {
        kfName: '',
        kfPhone: '',
        kfQrcode: '',
        tradeNotice: ''
      },
      endTime: '',
      payTime: 0,
      goodsPrice: 0,
      imgUrl: '',
      isDistributionType: 1,
      isAuth: 1,
      isCanBuy: 1,
      isOpenComplaint: 1,
      isOpenRanking: 1,
      isOpenTradeRemark: 1,
      isShowStock: 1,
      level: 0,
      purchased: 0,
      merchantQrcode: '',
      origPrice: 0,
      rankingType: 0,
      status: 1,
      stock: 0,
      title: '',
      wserSummaryDtoList: []
    },
    isShowService: false,
    isShowFollow: false,
    isShowNeedBuy: false,
    isShowPayFail: false,
    isPaying: false,
  },
  getters: {
    canBuy(state) {
      if (
        state.home.purchased != 1
        && state.home.purchased != 2
        && state.home.status != 3
        && state.home.status != 1
        && state.home.isCanBuy == 1
      ) {
        return true;
      }

      return false;
    }
  },
  mutations: {
    setIsShowService(state, value) {
      state.isShowService = value;
    },
    setIsShowFollow(state, value) {
      state.isShowFollow = value;
    },
    setIsShowNeedBuy(state, value) {
      state.isShowNeedBuy = value;
    },
    setIsShowPayFail(state, value) {
      state.isShowPayFail = value;
    },
    setShare(state, value) {
      state.share = value;
    },
    setHome(state, value) {
      state.home = value;
    },
    setUser(state, value) {
      state.user = value;
    },
    setIsPaying(state, value) {
      state.isPaying = value;
    },
    setQuery(state, value) {
      const tempQuery = {
        code: '',
        companyKey: '',
        platCompanyKey: '',
        distributionId: '',
        orderNo: '',
        channelId: '',
        userId: ''
      }

      for (const [key, queryValue] of Object.entries(value)) {
        if (queryValue) {
          (tempQuery as any)[key] = queryValue;
        }
      }

      state.query = tempQuery;
    },
  },
  actions: {
    async getUserInfo({ commit }, params = {}) {
      const body = {
        ...params,
        recommendId: params.userId
      }

      try {
        const res = await getUserInfo(body);

        if (res) {
          commit('setUser', res);
        }

        return res;
      } catch (error) {
        console.warn(error);
        return Promise.reject(error);
      }
    },
    async getMainInfo({ commit }) {
      const body = {};

      try {
        const res = await getMainInfo(body);

        if (res) {
          commit('setHome', res);
        } else {
          return Promise.reject(res);
        }
      } catch (error) {
        console.warn(error);
        return Promise.reject(error);
      }
    },
    // 支付
    async pay({ state, commit, dispatch }) {
      if (state.isPaying == true) {
        appMessage('请稍后再试');
        return Promise.reject();
      }

      if (state.home.stock <= 0) {
        appMessage('库存不足, 无法购买');
        return Promise.reject();
      } else {
        try {
          commit('setIsPaying', true);
          commit('setIsShowNeedBuy', false);
          commit('setIsShowPayFail', false);
          const addOrderBody = {
            recommendId: store.state.query.userId
          };
          const orderNo = await addOrderApi(addOrderBody);
          if (orderNo) {
            const payBody = {
              orderNo,
            };
            const res = await getWXPrepayRsp(payBody);

            if (res) {
              window.wx.chooseWXPay({
                timestamp: res.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: res.nonce_str, // 支付签名随机串，不长于 32 位
                package: res.packageInfo, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: res.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: res.sign, // 支付签名,
                success(res: any) {
                  appMessage('支付成功');
                  dispatch('getMainInfo');
                  setTimeout(() => {
                    router.push({
                      path: '/buy-form'
                    })
                  }, 1000);
                  return Promise.resolve(res);
                },
                cancel() {
                  commit('setIsShowPayFail', true);
                  return Promise.reject(res);
                },
                fail(res: any) {
                  commit('setIsShowPayFail', true);
                  return Promise.reject(res);
                }
              });
            }
          } else {
            console.warn('订单生成失败');
          }
        } catch (error) {
          console.warn(error);
          return Promise.reject(error);
        } finally {
          commit('setIsPaying', false);
        }
      }
    }
  },
  modules: {}
});

function storeInit() {
  window.onpagehide = () => {
    setItem('wxFissionState', store.state);
  };

  const wxFissionState = getItem('wxFissionState');
  if (wxFissionState) {
    store.replaceState({
      ...store.state,
      ...wxFissionState,
      initLocationHref: location.href,
    });
  }
}

storeInit();


export default store;

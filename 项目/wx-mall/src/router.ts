import Vue from 'vue';
import Router, { Route } from 'vue-router';
import store from '@/stores';
import {getLocalStorage} from '@/utils/local-storage';
import {initWeChat} from '@/utils/init-wechat';
import wx from 'wx-jssdk-ts';

// 首页
import Home from '@/views/home/index.vue';
import HomeHome from '@/views/home/home.vue';
import HomeQueryResult from '@/views/home/query-result.vue';
import HomeProductDetail from '@/views/home/product-detail.vue';

// 登录
import Login from '@/views/login/index.vue';
import LoginHome from '@/views/login/home.vue';
import LoginRegister from '@/views/login/register.vue';
import PasswordForget from '@/views/login/password-forget.vue';

// 用户
import User from '@/views/user/index.vue';
import UserHome from '@/views/user/home.vue';
import UserOrder from '@/views/user/order.vue';
import UserInfo from '@/views/user/info.vue';
import UserCollect from '@/views/user/collect.vue';
import UserPasswordEdit from '@/views/user/password-edit.vue';
import UserLocationReceive from '@/views/user/location-receive.vue';
import UserLocationCreate from '@/views/user/location-create.vue';
import UserOrderDetail from '@/views/user/order-detail.vue';
import UserPointHistory from '@/views/user/point-history.vue';
import UserProductRemark from '@/views/user/product-remark.vue';
import TransactionRules from '@/views/user/transaction-rules.vue';

// 购物车
import ShoppingTrolley from '@/views/shopping-trolley/index.vue';
import ShoppingTrolleyHome from '@/views/shopping-trolley/home.vue';
import ShoppingTrolleyOrderConfirm from '@/views/shopping-trolley/order-confirm.vue';
import ShoppingTrolleyPay from '@/views/shopping-trolley/pay.vue';

// 支付
import Pay from '@/views/pay/index.vue';
import PaySuccess from '@/views/pay/pay-success.vue';
import PayFail from '@/views/pay/pay-fail.vue';
import Paying from '@/views/pay/paying.vue';

// 工具
import {exit, forgetPassword} from '@/utils/login-handle';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 0,
      y: 0,
    };
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/iframe',
      component: () => import('@/views/iframe/index.vue'),
      meta: {
        title: '微好礼',
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/home/home',
      beforeEnter(to, from, next) {
        store.commit('setIsLogin');
        next();
      },
      children: [
        {
          path: 'home',
          name: 'HomeHome',
          component: HomeHome,
          meta: {
            servicesPermissionName: '首页',
          },
        },
        {
          path: 'query-result',
          name: 'HomeQueryResult',
          component: HomeQueryResult,
        },
        {
          path: 'product-detail/:id',
          name: 'HomeProductDetail',
          component: HomeProductDetail,
          meta: {
            servicesPermissionName: '商品详情',
          },
        },
      ],
    },
    {
      path: '/shopping-trolley',
      name: 'ShoppingTrolley',
      component: ShoppingTrolley,
      redirect: '/shopping-trolley/home',
      beforeEnter(to, from, next) {
        store.commit('setIsLogin');
        next();
      },
      children: [
        {
          path: 'home',
          name: 'ShoppingTrolleyHome',
          component: ShoppingTrolleyHome,
        },
        {
          path: 'order-confirm',
          name: 'ShoppingTrolleyOrderConfirm',
          component: ShoppingTrolleyOrderConfirm,
          beforeEnter(to, from, next) {
            store.commit('setIsLogin');
            if (store.state.isLogin) {
              next();
            } else {
              exit(from.fullPath);
            }
          },
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      redirect: '/login/home',
      children: [
        {
          path: 'home',
          name: 'LoginHome',
          component: LoginHome,
        },
        {
          path: 'register',
          name: 'LoginRegister',
          component: LoginRegister,
        },
        {
          path: 'password-forget',
          name: 'PasswordForget',
          component: PasswordForget,
        },
      ],
    },
    {
      path: '/user',
      name: 'User',
      component: User,
      redirect: '/user/home',
      beforeEnter(to, from, next) {
        store.commit('setIsLogin');

        if (store.state.isLogin) {
          next();
        } else {
          exit(to.fullPath);
        }
      },
      children: [
        {
          path: 'home',
          name: 'UserHome',
          component: UserHome,
          meta: {
            servicesPermissionName: '用户中心',
          },
        },
        {
          path: 'transaction-rules',
          name: 'TransactionRules',
          component: TransactionRules,
        },
        {
          path: 'point-history',
          name: 'UserPointHistory',
          component: UserPointHistory,
        },
        {
          path: 'product-remark',
          name: 'UserProductRemark',
          component: UserProductRemark,
        },
        {
          path: 'order/:type',
          name: 'UserOrder',
          component: UserOrder,
          meta: {
            servicesPermissionName: '我的订单',
          },
        },
        {
          path: 'order-detail',
          name: 'UserOrderDetail',
          component: UserOrderDetail,
          meta: {
            servicesPermissionName: '订单详情',
          },
        },
        {
          path: 'info',
          name: 'UserInfo',
          component: UserInfo,
        },
        {
          path: 'collect',
          name: 'UserCollect',
          component: UserCollect,
        },
        {
          path: 'password-edit',
          name: 'UserPasswordEdit',
          component: UserPasswordEdit,
        },
        {
          path: 'location-receive',
          name: 'UserLocationReceive',
          component: UserLocationReceive,
        },
        {
          path: 'location-create',
          name: 'UserLocationCreate',
          component: UserLocationCreate,
        },
      ],
    },
    {
      path: '/pay',
      name: 'Pay',
      component: Pay,
      children: [
        {
          path: 'pay-success',
          name: 'PaySuccess',
          component: PaySuccess,
        },
        {
          path: 'pay-fail',
          name: 'PayFail',
          component: PayFail,
        },
        {
          path: 'paying',
          name: 'Paying',
          component: Paying,
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  next();

  store.commit('setWxReady', false);
});

export function setShare(route) {
  const localStorageData = getLocalStorage();
  const {wxUserInfo} = localStorageData;
  const {
    path,
    params
  } = route;

  if (wxUserInfo) {
    const {companyKey, openid, memberCard} = wxUserInfo;
    const urlObject = new URL(`${VUE_APP_BASE_API}/wx-interface-web/wx/auth`);
    urlObject.searchParams.set('companyKey', companyKey);
    urlObject.searchParams.set('page', 'wx_mall');
    urlObject.searchParams.set('p1', 'share');
    urlObject.searchParams.set('p2', memberCard); // 卡号
    urlObject.searchParams.set('p3', openid);
    const isDetail = (path as string).includes('/home/product-detail');

    if (isDetail) {
      urlObject.searchParams.set('childPage', JSON.stringify({
        path: `/home/product-detail/${params.id}`,
      }));
    }

    const pageStyle = store.state.pageStyle;

    wx.updateAppMessageShareData({
      title: pageStyle && pageStyle.title || '微商城',
      desc: isDetail ? '给你分享一款时尚耀眼的首饰，点击查看详情。' : '给你分享一家好店，点击可享受专属优惠哟！',
      link: window.encodeURI(urlObject.href),
      imgUrl: pageStyle && pageStyle.logo || 'http://www.jqzjop.com/ftp_images/01/common/shop-logo.jpg',
      success() {
        // 设置成功
      },
      cancel() {
        // 取消
      },
    });

    store.commit('setWxReady', true);
  }
}

export async function initWeChatSetting(to: Route) {
  const localStorageData = getLocalStorage();
  const {wxUserInfo, ticket, memberCard} = localStorageData;
  const {
    path,
  } = to;
  const omitPaths = ['/'];


  if (!omitPaths.includes(path)) {
    await initWeChat({
      ispay: path == '/pay' ? true : false
    });

    wx.hideMenuItems({
      menuList: [
        'menuItem:copyUrl',
        'menuItem:openWithQQBrowser',
        'menuItem:share:qq',
        'menuItem:share:weiboApp',
        'menuItem:share:facebook',
        'menuItem:share:QZone',
        'menuItem:share:timeline',
        'menuItem:favorite',
        'menuItem:openWithQQBrowser',
        'menuItem:openWithSafari',
        'menuItem:share:email',
        'menuItem:share:brand'
      ]
    });

    setShare(to);
  }
}

router.afterEach((to, from) => {
  initWeChatSetting(to);
});

export default router;

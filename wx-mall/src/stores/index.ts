import Vue from 'vue';
import Vuex from 'vuex';
import {State} from '@/typings/store';
import { userModule } from './modules/user';

// http
import {httpReq} from '@/utils/http-req';
import {

  orderStatusCountReq,
} from '@/serves/order';

import {
  shoppingCartCountReq,
} from '@/serves/shopping-cart';

// 工具
import {getLocalStorage} from '@/utils/local-storage';

Vue.use(Vuex);

export default new Vuex.Store<State>({
  state: {
    wxReady: false,
    // 是否登录
    isLogin: false,
    // 订单数
    orderCount: null,
    // 页面样式
    pageStyle: null,
    // 分享样式
    shareType: null,
    // 配送样式
    postMethod: null,
    // 列表显示参数
    listDisplayParams: null,
    // 购物车数量
    shoppingCartCount: 0,
    // 购物车数量是否点击
    isShoppingCartListClick: false,
    // 购物车列表
    shoppingCartList: [],
    // 高级查询后端数据
    searchTypeList: {
      isSearch: false,
      mainStoneColor: [],
      material: [],
      jewelLargeType: [],
      jewelType: [],
      materialColor: [],
      mainStone: [],
      jewelSmallType: [],
      mainStoneQuality: [],
    },
    // 客服权限
    servicesPermission: null,
    // 商品查询选项
    productSearchOptions: {
      // 关键字
      keyword: '',
      // 活动商品
      isActivity: false,
      // 是否有货
      exists: false,
      // 产品类型
      productType: [''],
      // 产品小类
      jewelrySmallCategoryList: [''],
      // 最低价
      priceMin: '',
      // 最高价
      priceMax: '',
      // 价格范围
      priceRange: '',
      // 材料成色
      materialsGrade: [''],
      // 成色含量
      productContent: [''],
      // 主石名称
      stoneName: [''],
      // 首饰类型
      jewelryType: [''],
      // 条码号
      barCode: '',
      // 证书号
      credentialCode: '',
      // 款式系列
      styleSet: '',
      // 手寸小
      ringSizeMin: '',
      // 手寸大
      ringSizeMax: '',
      // 金重小
      goldWeighMin: '',
      // 金重大
      goldWeighMax: '',
      // 主石重小
      stoneWeighMin: '',
      // 主石重大
      stoneWeighMax: '',
      // 主石粒数
      stoneQuantity: '',
      // 副石
      stoneOther: '',
      // 主石净度
      stoneClarity: [''],
      // 主石颜色
      stoneColor: [''],
      // 排序
      sort: '',
      // 活动集合
      activityList: [''],
      // 顶级类型
      topType: ''
    },
  },
  getters: {
  },
  mutations: {
    setWxReady(state, value) {
      state.wxReady = value;
    },
    setPageStyle(state, value) {
      state.pageStyle = value;
    },
    setShareType(state, value) {
      state.shareType = value;
    },
    setPostMethod(state, value) {
      state.postMethod = value;
    },
    setListDisplayParams(state, value) {
      state.listDisplayParams = value;
    },
    // 重置商品查询选项
    initProductSearchOptions(state, options) {
      state.productSearchOptions.keyword = '';
      state.productSearchOptions.isActivity = false;
      state.productSearchOptions.exists = false;
      state.productSearchOptions.productType.splice(0, state.productSearchOptions.productType.length, '');
      state.productSearchOptions.jewelrySmallCategoryList.splice(0, state.productSearchOptions.jewelrySmallCategoryList.length, '');
      state.productSearchOptions.priceMin = '';
      state.productSearchOptions.priceMax = '';
      state.productSearchOptions.priceRange = '';
      state.productSearchOptions.materialsGrade.splice(0, state.productSearchOptions.materialsGrade.length, '');
      state.productSearchOptions.productContent.splice(0, state.productSearchOptions.productContent.length, '');
      state.productSearchOptions.stoneName.splice(0, state.productSearchOptions.stoneName.length, '');
      state.productSearchOptions.jewelryType.splice(0, state.productSearchOptions.jewelryType.length, '');
      state.productSearchOptions.barCode = '';
      state.productSearchOptions.credentialCode = '';
      state.productSearchOptions.styleSet = '';
      state.productSearchOptions.ringSizeMin = '';
      state.productSearchOptions.ringSizeMax = '';
      state.productSearchOptions.goldWeighMin = '';
      state.productSearchOptions.goldWeighMax = '';
      state.productSearchOptions.stoneWeighMin = '';
      state.productSearchOptions.stoneWeighMax = '';
      state.productSearchOptions.stoneQuantity = '';
      state.productSearchOptions.stoneOther = '';
      state.productSearchOptions.stoneClarity.splice(0, state.productSearchOptions.stoneClarity.length, '');
      state.productSearchOptions.stoneColor.splice(0, state.productSearchOptions.stoneColor.length, '');
      state.productSearchOptions.sort = '';
      state.productSearchOptions.topType = '';
      state.productSearchOptions.activityList = [''];
    },
    // 商品查询项设置排序
    setProductSearchOptionsSort(state, sortType) {
      const code = state.productSearchOptions.sort;

      if (sortType === 'time') {
        if (code === '' || code === '2' || code === '3') {
          state.productSearchOptions.sort = '0';
        } else if (code === '0') {
          state.productSearchOptions.sort = '1';
        } else {
          state.productSearchOptions.sort = '';
        }
      } else if (sortType === 'price') {
        if (code === '' || code === '0' || code === '1') {
          state.productSearchOptions.sort = '2';
        } else if (code === '2') {
          state.productSearchOptions.sort = '3';
        } else {
          state.productSearchOptions.sort = '';
        }
      }
    },
    // 设置选择的活动
    setProductSearchOptionsActivityList(state, id: string) {
      state.productSearchOptions.activityList = [id];
    },
    // 设置顶级类型
    setProductSearchOptionsTopType(state, type: string) {
      state.productSearchOptions.topType = type;
    },
    // 设置高级查询后端数据
    setSearchTypeList(state, options) {
      state.searchTypeList = options;
    },
    // 判断是否已经登录
    setIsLogin(state) {
      const {ticket} = getLocalStorage();

      if (ticket) {
        state.isLogin = true;
      } else {
        state.isLogin = false;
      }
    },
    // 订单数
    setOrderCount(state, options) {
      state.orderCount = options;
    },
    // 购物车数量
    setShoppingCartCount(state, options) {
      state.shoppingCartCount = options;
    },
    setServicesPermission(state, value) {
      state.servicesPermission = value;
    },
  },
  actions: {
    // 查询订单数量
    selectOrderCount({commit}) {
      return new Promise((resolve, reject) => {
        const body = {};

        orderStatusCountReq.requestInit.body = JSON.stringify(body);
        const httpRes = httpReq(orderStatusCountReq);
        httpRes.then(data => {
          commit('setOrderCount', data);
          resolve(data);
        }).catch(reason => {
          reject(reason);
        });
      });
    },
    // 查询购物车数量
    selectShoppingCartCount({commit}) {
      return new Promise((resolve, reject) => {
        const body = {};

        shoppingCartCountReq.requestInit.body = JSON.stringify(body);
        const httpRes = httpReq(shoppingCartCountReq);
        httpRes.then(data => {
          const {count} = data;
          commit('setShoppingCartCount', count);
          resolve(data);
        }).catch(reason => {
          reject(reason);
        });
      });
    },
  },
  modules: {
    userModule,
  },
});

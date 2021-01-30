import Vue from 'vue';
import Vuex from 'vuex';
import {superMKT, superCRM, superAPP, systemSet, cloudShowroom, fission, prestore} from './state/permission';
import nines from './modules/nine';
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    nines,
  },
  state: sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state') as string) : {
    // 权限
    permission: {
      superMKT,
      superCRM,
      superAPP,
      systemSet,
      cloudShowroom,
      fission,
      prestore
    },
    // 拥有权限的路由
    canAccessAppURL: [],
    // 当前模块路由meta信息
    moduleRouteMeta: {
      isModule: false,
      moduleName: '', // 超级CRM | 超级MKT | 超级APP
      path: '/',
    },
    // 当前路径meta信息
    routeMeta: {
      title: '',
      icon: '',
    },
  },
  getters: {
  },
  mutations: {
    // 设置权限
    setPermission(state, permission) {
      state.permission = permission;
    },
    // 设置拥有权限的路由
    setCanAccessAppURL(state, canAccessAppURL) {
      state.canAccessAppURL = canAccessAppURL;
    },
    // 设置当前模块路由信息
    setModuleRouteMeta(state, moduleRouteMeta) {
      state.moduleRouteMeta = moduleRouteMeta;
    },
    // 设置当前路径路由信息
    setRouteMeta(state, routeMeta) {
      state.routeMeta = routeMeta;
    },
  },
  actions: {

  },
});

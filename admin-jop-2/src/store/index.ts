import Vue from 'vue';
import Vuex from 'vuex';
import { mallModule } from './modules/index';
Vue.use(Vuex);

export interface RootState {
  // 布局
  layout: {
    isShowHelp: boolean;
    historyPaths: Array<{
      name: string;
      path: string;
    }>
  }
  // 用户
  user: {
    account: string;
    email: string;
    enabled: string;
    name: string;
    phone: string;
    pwd: string;
    remark: string;
    rid: string;
    sex: string;
    token: string;
    epid: string;
  }
  // 菜单
  menus: unknown[];
  // 子菜单
  subMenus: unknown[];
  // 路径信息
  pathInfo: Record<string, unknown>;
  // 需要缓存的组件名称列表
  componentNames: string[];
}
const store = new Vuex.Store<RootState>({
  state: {
    layout: {
      isShowHelp: false,
      historyPaths: [],
    },
    user: {
      account: '',
      email: '',
      enabled: '',
      name: '',
      phone: '',
      pwd: '',
      remark: '',
      rid: '',
      sex: '',
      token: '',
      epid: ''
    },
    menus: [],
    subMenus: [],
    pathInfo: {},
    componentNames: [],
  },
  mutations: {
    setMenus(state, value) {
      state.menus = value;
    },
    setSubMenus(state, value) {
      state.subMenus = value;
    },
    setPathInfo(state, value) {
      state.pathInfo = value;
    },
    setComponentNames(state, value) {
      state.componentNames = value;
    },
    setUser(state, value) {
      state.user = value;
    },
    setLayoutIsShowHelp(state, value) {
      state.layout.isShowHelp = value;
    },
    setLayoutHistoryPaths(state, value) {
      state.layout.historyPaths = value;
    },
    // 初始化数据
    initState(state) {
      state.layout.isShowHelp = false;
      state.layout.historyPaths = [];
    }
  },
  actions: {
  },
  modules: {
    mallModule,
  },
});

function setState() {
  const stateJSON = sessionStorage.getItem('state');

  if (stateJSON) {
    const state = JSON.parse(stateJSON);
    store.replaceState(state);
  }
}

setState();

export default store;

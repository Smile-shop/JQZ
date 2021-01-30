import * as types from '../mutation-types';
import { Commit, Dispatch } from 'vuex';

export interface User {
  openid: string;
  companyKey: string;
  headerImg: string;
  nick: string;
}

export interface Servicer {
  accountId: string;
  kfHeadimgurl: string;
  kfAccount: string;
  topic: string;
  nick: string;
  isOnline: string;
  kfPhone: string;
  [propName: string]: any;
}

export interface State {
  user: User;
  servicer: Servicer;
  client: any;
  // 用户最后活跃时间
  lastActiveTime: number;
  // 心跳检测间隔
  pingTimeout: number;
  // 心跳检测定时器
  pingTimer: any;
  // 等待服务器ping返回的时间
  waitServerPingTime: number;
  // 等待服务器定时器
  serverPingTimer: any;
  // ping服务器是否返回
  serverPingIsBack: boolean;
  reconnectTime: number;
  reconnectTimer: any;
  // 客户端接收消息容器
  clientOnMsgEvent: any[];
  // websocket连接异常
  connectError: boolean;
  // websocket重连loading
  connectLoading: boolean;
  // 列表显示参数
  listDisplayParams: any;
  // 商品卡详情
  productInfo: any;
}

const wxChatSystemState = sessionStorage.getItem('wxChatSystemState') && JSON.parse(sessionStorage.getItem('wxChatSystemState') as string).home;
console.log(wxChatSystemState);

const state: State = wxChatSystemState || {
  user: {
    openid: '',
    companyKey: '',
    headerImg: '',
    nick: ''
  },
  servicer: {
    accountId: '',
    kfHeadimgurl: '',
    kfAccount: '',
    topic: '',
    nick: '',
    isOnline: '0',
    kfPhone: '',
    clerkId: '',
    shopName: '',
    nameOut: ''
  },
  client: null,
  lastActiveTime: Date.now(),
  pingTimeout: 30 * 1000,
  pingTimer: null,
  waitServerPingTime: 5000,
  serverPingTimer: null,
  serverPingIsBack: true,
  reconnectTime: 1000,
  reconnectTimer: null,
  clientOnMsgEvent: [],
  connectError: true,
  connectLoading: false,
  listDisplayParams: null,
  productInfo: null
};

const getters = {
  getUser: (state: State) => state.user,
  getServicer: (state: State) => state.servicer,
  getClient: (state: State) => state.client,
  getConnectError: (state: State) => state.connectError,
  getConnectLoading: (state: State) => state.connectLoading,
  getProductInfo: (state: State) => state.productInfo
};

const mutations = {
  setListDisplayParams(state: State, value: any) {
    state.listDisplayParams = value;
  },
  setProductInfo(state: State, value: any) {
    state.productInfo = value;
  },
  [types.SET_USER](state: State, user: User) {
    state.user = user;
  },
  [types.SET_SERVICER](state: State, servicer: Servicer) {
    state.servicer = servicer;
  },
  [types.SET_CLIENT](state: State, client: any) {
    state.client = client;
  },
  // 关闭websocket连接，并销毁客户端
  [types.DISTORY_CLIENT](state: State) {
    if (state.client) {
      state.client.close();
    }
    state.client = null;
  },
  // 清除ping定时器
  [types.CLEAR_PING_TIMER](state: State) {
    if (state.pingTimer) {
      clearTimeout(state.pingTimer);
    }
    if (state.serverPingTimer) {
      clearTimeout(state.serverPingTimer);
    }
  },
  // 重置用户活跃时间
  [types.RESET_ACTIVE_TIME](state: State, now: number) {
    state.serverPingIsBack = true;
    state.lastActiveTime = now;
  },
  // 收集客户端接收消息事件
  [types.COLLECT_EVENT](state: State, event: any) {
    if (typeof event !== 'function') {
      console.error('removeBindClientEvent只能移除方法');
      return;
    }
    console.log(state.clientOnMsgEvent.length);
    if (state.clientOnMsgEvent.length > 10) {
      console.error('clientBindEvent绑定的方法过多');
    }
    if (event) {
      state.clientOnMsgEvent.push(event);
    }
  },
  // 移除绑定到client上的方法
  [types.REMOVE_CLIENT_EVENT](state: State, event: any) {
    if (typeof event !== 'function') {
      console.error('removeBindClientEvent只能移除方法');
      return;
    }
    const index = state.clientOnMsgEvent.findIndex((cb: any) => cb && event.valueOf() === cb.valueOf());
    if (index > -1) {
      state.clientOnMsgEvent.splice(index, 1);
    }
  },
  // websocket连接异常
  [types.CONNECT_ERROR](state: State, isConnect: boolean) {
    state.connectError = isConnect;
    // state.reconnectTime = 1000;
  },
  // 重连loading
  [types.RECONNECT_LOADING](state: State, loading: boolean) {
    state.connectLoading = loading;
  },
  // 清除重新建立websocket连接的定时器
  [types.REMOVE_RECONNECT_TIME](state: State, timer: any) {
    state.reconnectTimer = timer;
  },
  // 重置重新建立websocket连接延迟时间
  [types.UPDATE_RECONNECT_TIME](state: State, time: number) {
    state.reconnectTime = time;
  },
};

const actions = {
  setUser(context: { commit: Commit; state: State }, user: User) {
    context.commit(types.SET_USER, user);
  },
  setServicer(context: { commit: Commit; state: State }, servicer: Servicer) {
    context.commit(types.SET_SERVICER, servicer);
  },
  // 创建连接
  createClient(context: { commit: Commit, dispatch: Dispatch, state: State }) {
    try {
      const url = `${VUE_APP_WEBSOKCET_API}/chat-web/chatWs?openid=${state.user.openid}&accountId=132`;
      const client = new WebSocket(url);
      context.dispatch('initClient', client);
    } catch (e) {
      console.log(e, 'websocket连接失败');
      // 提示网络异常
      context.commit(types.CONNECT_ERROR, true);
      context.commit(types.RECONNECT_LOADING, false);
    }
  },
  // 初始化客户端
  initClient(context: { commit: Commit, state: State, dispatch: Dispatch }, client: any) {
    context.dispatch('setClient', client);
    client.onopen = () => {
      console.log(`websocket连接成功，openid:${state.user.openid}`);
      context.commit(types.CONNECT_ERROR, false);
      context.commit(types.RECONNECT_LOADING, false);
      context.commit(types.UPDATE_RECONNECT_TIME, 1000);
      context.dispatch('resetActiveTime');
    };
    client.onmessage = (event: any) => {
      context.dispatch('resetActiveTime');
      try {
        const message = JSON.parse(event.data);
        // 触发绑定到client上的全部方法
        state.clientOnMsgEvent.forEach((cb: any) => {
          cb(message);
        });
      } catch (error) {
        if (event.data === `SHB${state.user.companyKey}`) {
          console.log('接收的pong消息');
        } else {
          console.log(error);
        }
      }
    };
    client.onclose = () => {
      console.log('close');
      context.dispatch('reCreateClient');
    };
    client.onerror = () => {
      console.log('error');
      // 解决商品卡返回聊天界面ios授权问题录音功能失效
      location.reload();
      // 出错重连
      context.dispatch('reCreateClient');
    };
  },
  // 用户手动重新连接
  reConnectClient(context: { commit: Commit, dispatch: Dispatch }) {
    context.commit(types.RECONNECT_LOADING, true);
    context.dispatch('createClient');
  },
  // 重新建立websocket连接
  reCreateClient(context: { commit: Commit, state: State, dispatch: Dispatch }) {
    if (state.client) {
      state.client.close();
    }
    // 重新建立连接要先清除之前的ping的定时器
    context.commit(types.CLEAR_PING_TIMER);
    // 每次重连时间增加一倍，默认1s，最大30s
    if (state.reconnectTime <= 30 * 1000) {
      const timer = setTimeout(() => {
        context.dispatch('createClient');
        context.commit(types.UPDATE_RECONNECT_TIME, state.reconnectTime * 2);
      }, state.reconnectTime);
      context.commit(types.REMOVE_RECONNECT_TIME, timer);
    } else {
      if (state.reconnectTimer) {
        clearTimeout(state.reconnectTimer);
        context.commit(types.REMOVE_RECONNECT_TIME, null);
      }
      // 提示网络异常
      context.commit(types.CONNECT_ERROR, true);
      context.commit(types.RECONNECT_LOADING, false);
    }
  },
  // 设置websockt客户端
  setClient(context: { commit: Commit, dispatch: Dispatch }, client: any) {
    context.commit(types.SET_CLIENT, client);
  },
  // 销毁websocket客户端
  destoryClient(context: { commit: Commit, state: State }) {
    context.commit(types.DISTORY_CLIENT);
    context.commit(types.CLEAR_PING_TIMER);
    if (state.reconnectTimer) {
      context.commit(types.REMOVE_RECONNECT_TIME, null);
    }
  },
  // 暂停心跳检测
  stopOrStartPing(context: { commit: Commit, state: State, dispatch: Dispatch }, type: string) {
    if (type === 'stop') {
      context.commit(types.CLEAR_PING_TIMER);
    } else {
      context.dispatch('reCreateClient');
    }
  },
  // 自定义心跳检测
  selfPing(context: { commit: Commit; state: State, dispatch: Dispatch }) {
    context.commit(types.CLEAR_PING_TIMER);
    state.pingTimer = setTimeout(() => {
      state.client.send(`HB${state.user.companyKey}`);
      console.log('ping');
      state.serverPingTimer = setTimeout(() => {
        // 并重置客户端，重新连接
        console.log('未ping通，重新建立连接');
        context.dispatch('reCreateClient');
      }, state.waitServerPingTime);
    }, state.pingTimeout);
  },
  // 重置用户活跃时间
  resetActiveTime(context: { commit: Commit; state: State, dispatch: Dispatch }) {
    if (state.client) {
      context.commit(types.RESET_ACTIVE_TIME, Date.now());
      context.dispatch('selfPing');
    }
  },
  // 收集客户端接收消息事件
  clientBindEvent(context: { commit: Commit; state: State, dispatch: Dispatch }, event: any) {
    context.commit(types.COLLECT_EVENT, event);
  },
  // 移除绑定到client上的方法
  removeBindClientEvent(context: { commit: Commit; state: State, dispatch: Dispatch }, event: any) {
    context.commit(types.REMOVE_CLIENT_EVENT, event);
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};

import axios from 'axios';
import Vue from 'vue';
import store from '../store.js';
import router from '../route';

// http request 拦截器
axios.interceptors.request.use(
  config => {
    const companyKey = store.state.urlData.companyKey || Vue.prototype.urlData.companyKey;
    config.headers['companyKey'] = companyKey;
    if (companyKey) {
      const ticket = window.localStorage.getItem(`ticket_${companyKey}`);
      config.headers['ticket'] = ticket;
    }
    const openid = store.state.urlData.openid || Vue.prototype.urlData.openid;
    config.headers['openid'] = openid;
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    // if(response.data.code == -10) {
    //   // const companyKey = store.state.urlData.companyKey;
    //   // window.localStorage.removeItem(`ticket_${companyKey}`);
    //   // Vue.prototype.$dialog.confirm({
    //   //   title: '提示',
    //   //   message: '登陆失效，是否重新登陆？'
    //   // }).then(() => {
    //   //   window.localStorage.setItem('urlData', JSON.stringify(store.state.urlData));
    //   //   window.location.href = `${Vue.prototype.httpUrl}/login_register/#/login`;
    //   // }).catch(() => {
    //   //   router.push({
    //   //     path: '/home'
    //   //   })
    //   // })
    //   return response;
    // } else {
    //   return response;
    // }
    switch (response.data.code) {
      // 成功
      case 0:
        console.log(`请求成功-${response}`)
        break;
      // ticket验证失败
      case -10:
        store.commit('requestIndexPoup', true);
        break;
      // companyKey或者openid为空
      case -12:
        console.log(store.state.urlData, '-vuex-urlData');
        console.log(Vue.prototype.urlData, '-Vue-urlData');
        store.commit('requestIndexPoup', true);
        break;
      default:
        break;
    }
    return response;
  },
  error => {
    return Promise.reject(error.response);
  }
);

// 忽略请求头的接口
const ingroeHeaderList = [
  // 首页
  '/jop-web/wxMember/wxCompanyExplain',
  '/jop-web/wxMember/wxMemberIndex',
  '/jop-web/wxinit/jsapi_ticketSign',
  '/jop-web/wxBind/activation',
  // 登陆
  '/jop-web/wxBind/wxLoginIndex',
  '/jop-web/wxCode/sendPhoneMsg',
  '/jop-web/wxBind/wxLogin',
  // 注册
  '/jop-web/wxBind/wxRegistIndexNew',
  '/jop-web/wxBind/wxRegist',
  '/jop-web/wxBind/qrySaler'
];

const httpServer = (opts, data) => {
  let method = null;
  if(typeof(opts.method) == 'undefined') {
    method = 'POST';
  } else {
    method = opts.method;
  }

  let params = data;

  let headers = {};
  const homeMemberData = store.state.homeMemberData;
  if(!ingroeHeaderList.includes(`${opts.url}`)) {
    // 判断会员卡号是否正常
    let Regx = /^[A-Za-z0-9_]*$/;
    if(!Regx.test(homeMemberData.cardNum)) {
      store.commit('pageErrorControl', {
        show: true,
        msg: '会员卡号异常，请联系线下门店',
        img: 'miss-session'
      });
      store.dispatch('goNotFound', {
        userInfo: homeMemberData
      });
      return;
    } else {
      headers = {
        memberCard: homeMemberData.cardNum
      }
    }
  } else {
    headers = {
      memberCard: homeMemberData.cardNum
    }
  }

  //http默认配置
  let httpDefaultOpts = {
    method: method,
    baseURL: Vue.prototype.httpUrl,
    url: opts.url,
    timeout: 15000,
    headers: headers,
    params: params,
    data: params
  }

  if(opts.method == 'get') {
    delete httpDefaultOpts.data;
  } else {
    delete httpDefaultOpts.params;
  };

  let promise = new Promise((resolve, reject) => {
    axios(httpDefaultOpts).then(res => {
      resolve(res);
    }).catch(response => {
      reject(response);
      store.commit('pageErrorControl', {
        show: true,
        msg: '网络异常'
      });
      // 其他网络错误
      store.dispatch('goNotFound', {
        memberCard: memberCard,
        companyKey: companyKey,
        ticket: ticket
      })
    })
  });

  return promise;
};


export default httpServer;
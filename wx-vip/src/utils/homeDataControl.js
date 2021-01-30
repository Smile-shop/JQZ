import store from '@/store';
import { getUrlParam } from "@/utils/functions";
import httpUrl from "@/utils/config";
import { Toast } from 'vant';
import router from '@/route';
import { setMockCookie } from '@/utils/mockData';

// 获取首页展示信息
async function getHomePageInfo(params, cb) {
  const res = await store.dispatch('getHomePageInfo', params);
  if (res.data.code === 0) {
    const resData = res.data.data;
    const loadingCssSheet = document.getElementById('loading-css');
    loadingCssSheet.remove();
    cb({
      isOutTime: resData.endDate * 1 >= new Date().getTime(),
      data: resData
    })
  } else {
    Toast({
      message: res.data.msg,
      duration: 1000
    })
  }
}

// 获取首页注册方式信息
async function getHomePageRegisterInfo(params, cb) {
  const res = await store.dispatch('getHomePageRegisterInfo', params);
  if (res.data.code === 0) {
    cb(res.data.data)
  } else {
    Toast({
      message: res.data.msg,
      duration: 1000
    })
  }
}
// 获取url中参数
function getUrlData() {
  let sessionUrlData = '';
  // 先判断url上是否有参数，如果有则直接取， 否则从session中取
  if (getUrlParam('o') && getUrlParam('c')) {
    sessionUrlData = window.location.href.split('?')[1];
    window.sessionStorage.setItem('urlParams', window.location.href.split('?')[1]);
  } else {
    sessionUrlData = window.sessionStorage.getItem('urlParams');
  }
  const urlData = {
    openid: getUrlParam('o', sessionUrlData),
    companyKey: getUrlParam('c', sessionUrlData),
    headerImg: getUrlParam('i', sessionUrlData),
    page: getUrlParam('childPage', sessionUrlData) || getUrlParam('p', sessionUrlData) || 'home',
    register_openid: getUrlParam('shareId', sessionUrlData),
    isRegister: getUrlParam('r', sessionUrlData) || '1',
    memberCard: getUrlParam('m', sessionUrlData),
    phone: getUrlParam('s', sessionUrlData),
    localUrl: `${httpUrl}/wx_member/index.html#/home`,
    ticket: getUrlParam('p1', sessionUrlData),
    logo: getUrlParam('logo', sessionUrlData),
    receiveid: getUrlParam('receiveid', sessionUrlData),
    eventid: getUrlParam('eventid', sessionUrlData)
  }

  // 启动开发模式
  window.debugger = true

  window.location.replace(window.location.href.split('?')[0]);
  if (urlData.openid && urlData.companyKey) {
    console.log(urlData.openid, urlData.companyKey)
    return urlData;
  } else if (process.env.NODE_ENV === 'development' && window.debugger) { // 开发模式
    const companyKey = '01';
    const openid = 'oP6kNs2mVzaBPX1oZngGucyYPco4';
    // const companyKey = 'test01';
    // const openid = 'oYKLK1ftPgfBZ_oAlfyU7NXeFh1k';
    const register_openid = 'oP6kNs2mVzaBPX1oZngGucyYPco4';
    const memberCard = '18673056556';
    const phone = '18673056556';
    const isRegister = '1';
    const localUrl = window.location.origin.concat('/wx_member/index.html#/home');
    const subscribe = '0';
    const page = '/';
    const headerImg = 'http://thirdwx.qlogo.cn/mmopen/veztsJ5DDPIv91Bxyrt7LMPTGP4z4k54FQ13I1cqkshibjn88HtNDHFKKFNYdTakibzg8RicRlJ8ufhRUs0Yvob2UxhbW12eB5l/132';

    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set('o', openid);
    urlSearchParams.set('c', companyKey);
    urlSearchParams.set('i', headerImg);
    urlSearchParams.set('m', memberCard);
    urlSearchParams.set('s', phone);
    urlSearchParams.set('r', isRegister);
    urlSearchParams.set('page', page);
    urlSearchParams.set('subscribe', subscribe);
    urlSearchParams.set('openid', register_openid);

    const urlData = {
      openid,
      companyKey,
      headerImg,
      page,
      register_openid,
      localUrl,
      isRegister,
      memberCard,
      subscribe
    }


    const ticketKey = `ticket_${companyKey}`
    window.localStorage.setItem('urlData', JSON.stringify(urlData));
    window.localStorage.setItem('memberCard', memberCard);
    window.localStorage.setItem(ticketKey, companyKey)

    async function mock() {
      window.location.href = `${location.origin}/#/?${urlSearchParams.toString()}`
      window.location.reload();
      alert('启用开发模式')
    }

    mock();
  } else {
    return null
  }
}

// 处理注册页面
function registerControl(app, urlData) {
  const ticket = window.localStorage.getItem(`ticket_${urlData.companyKey}`);
  if (ticket) {
    // 先获取本地ticket，如果存在，则证明已经登录，直接获取首页信息
    indexPageControl(app, urlData, () => router.replace({ path: '/home' }));
  } else {
    // 如果未登录，则先获取设置信息
    getHomePageRegisterInfo({
      openid: urlData.openid,
      companyKey: urlData.companyKey
    }, res => {
      // 判断是否允许注册
      if (urlData.isRegister === '0') {
        // 不允许注册，直接进入首页
        indexPageControl(app, urlData, () => router.replace({ path: '/home' }));
      } else {
        // 允许注册 判断注册方式  卡包注册进入首页
        if (res.registType === '0') {
          // 有ticket 直接进入首页
          if (res.ticket && process.env.NODE_ENV != 'development') {
            window.localStorage.setItem(`ticket_${urlData.companyKey}`, res.ticket);
            indexPageControl(app, urlData, () => router.replace({ path: '/home' }));
          } else {
            // 无ticket 去卡包页面
            window.location.replace(res.openCardUrl);
          }
        } else {
          // 普通注册
          window.location.replace(`${httpUrl}/login_register/index.html?c=${urlData.companyKey}`);
        }
      }
    })
  }
}

// 处理激活
function activeControl(app, urlData) {
  const ticket = window.localStorage.getItem(`ticket_${urlData.companyKey}`);
  // 如果登录，直接领取
  if (ticket) {
    store.dispatch('activePackage', {
      companyKey: urlData.companyKey,
      openid: urlData.openid
    })
    indexPageControl(app, urlData, () => router.replace({ path: '/home' }));
  } else {
    // 没有登录，则通过登录激活
    window.location.href = `${httpUrl}/login_register/#/?c=${urlData.companyKey}`;
  }
}

// 放行资讯中心文章详情
function articleDetail(url) {
  const mark = 'consult-details'
  let result = false
  if (url.includes(mark)) {
    result = true
  }
  return result
}

// 正常进入微会员首页
function indexPageControl(app, urlData, callback) {
  getHomePageInfo({
    openid: urlData.openid,
    companyKey: urlData.companyKey
  }, res => {
    app.$mount('#app');
    if (callback) {
      callback();
    } else {
      const ticket = window.localStorage.getItem(`ticket_${urlData.companyKey}`);
      const url = urlData.page
      if (url && articleDetail(url)) {
        router.replace({
          path: `/${urlData.page}`
        });
      } else {
        router.replace({
          path: ticket && urlData.memberCard ? `/${urlData.page}` : '/home'
        });
      }
    }
    res.isOutTime ? store.commit('homePageInfoControl', res.data) : errorPageControl(app, '服务超过有效期！');
  })
}

// 进入首页获取信息失败，直接报错
function errorPageControl(app, msg) {
  app.$mount('#app');
  store.commit('pageErrorControl', {
    show: true,
    msg,
    img: 'miss-session'
  })
}

export function homeControl(resolve) {
  // 从url中获取参数
  const urlData = getUrlData();
  console.log('首页执行的函数及结果', urlData)
  if (urlData) {
    // 先将数据存到store中，并保存至全局变量
    store.commit('getUrlData', urlData);
    resolve((app, Vue) => Vue.prototype.urlData = urlData);
    // 修改中间页面的logo
    if (urlData.logo) {
      const logoImgDom = document.getElementById('logo-img');
      logoImgDom.src = `http://www.jqzjop.com/ftp_images/${urlData.companyKey}/userLogoImg/${urlData.logo}`;
    }
    // 如果url中含有ticket字段，则直接存入本地， 表示从卡包注册完成
    if (urlData.ticket && process.env.NODE_ENV != 'development') {
      window.localStorage.setItem(`ticket_${urlData.companyKey}`, urlData.ticket);
    }
    // 根据进入的页面，做不同的业务处理
    if (urlData.page === 'register' || urlData.page === 'share_register' || urlData.page === 'login') {
      // 注册页面
      resolve(app => registerControl(app, urlData));
    } else if (urlData.page === 'active') {
      // 激活页面
      resolve(app => activeControl(app, urlData));
    } else if (urlData.page === 'gift') {
      // 我的礼品页面
      window.location.href = `${httpUrl}/wx_member/gift/#/gift?c=${urlData.companyKey}`;
    } else {
      // 如果进入的不是注册页面，则先获取设置信息
      getHomePageRegisterInfo({
        openid: urlData.openid,
        companyKey: urlData.companyKey
      }, registDataInfo => {
        // 如果根据openid查到  为会员、已经有卡包、并且返回ticket  则直接存入ticket
        if (registDataInfo.isMember === '1' && registDataInfo.isHaveCard === '1' && registDataInfo.ticket && process.env.NODE_ENV != 'development') {
          window.localStorage.setItem(`ticket_${urlData.companyKey}`, registDataInfo.ticket);
        }
        // 获取首页展示信息， 并根据page跳转相应页面
        resolve(app => indexPageControl(app, urlData));
      })
    }
  } else {
    // 如果rulData不存在，则直接页面报错
    resolve(app => errorPageControl(app, '出现未知问题，请退出重新进入！'));
  }
}

export function loadingColor() {
  // 从本地取主题颜色，修复loading页闪烁问题
  const themeColor = window.localStorage.getItem('themeColor');
  if (themeColor) {
    const logoDivDom = document.getElementById('loading-html-wave-content');
    logoDivDom.style.backgroundColor = themeColor;
    const circleDomList = document.querySelectorAll('.circle');
    for (let index = 0; index < circleDomList.length; index++) {
      circleDomList[index].style.backgroundColor = themeColor;
    }
  }
}

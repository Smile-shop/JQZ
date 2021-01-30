import axios from 'axios';
import baseUrl from '@/config/config.js'
import { getLocalStorage } from '@/utils/local-storage';

// create an axios instance
const service = axios.create({
  baseURL: baseUrl, // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 15000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    const localStorageData = getLocalStorage();
    let { wxUserInfo, ticket, memberCard } = localStorageData;
    memberCard = memberCard ? memberCard : wxUserInfo && wxUserInfo.memberCard ? wxUserInfo.memberCard : '';
    if (wxUserInfo) {
      config.headers.companyKey = wxUserInfo.companyKey;
    }
    if (wxUserInfo) {
      config.headers.openid = wxUserInfo.openid;
    }
    if (ticket) {
      config.headers.ticket = ticket;
    }
    if (memberCard) {
      config.headers.memberCard = memberCard;
    }
    config.headers.channel = 'wx';
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data

    if (res.code !== 0) {
      return Promise.reject(res.msg || 'error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    let err = String(error);
    if (err.indexOf('Network Error') >= 0) {
      return Promise.reject('抱歉，网络异常！')
    } else if (err.indexOf('timeout')) {
      return Promise.reject('非常抱歉，网络请求异常！')
    } else {
      return Promise.reject(error)
    }

  }
)

export default service;
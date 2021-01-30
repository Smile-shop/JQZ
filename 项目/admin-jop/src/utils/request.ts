import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import user from '@/utils/user';
import router from '@/router';

// create an axios instance
const service = axios.create({
  // baseURL: VUE_APP_BASE_API, // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (user.serverUser) {
      config.headers.ticket = user.serverUser.ticket;
      config.headers.companyKey = user.serverUser.account.companyKey;
      config.headers.accountId = user.serverUser.account.accountId;
      // config.headers.appCode = 'onlineMember';
    }
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
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    if ((response as any).request.responseType === 'blob') {
      return res;
    }
    if (res.code != 0) {
      if (res.code == 203) {
        router.push({
          path: '/login'
        })
      }
      Message({
        message: res.msg || 'error',
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(res.msg || 'error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

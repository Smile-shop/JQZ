import axios from 'axios'
import baseUrl from '@/config/config.js'
import { getLocalStorage } from '@/utils/local-storage'
import { EventBus } from '@/utils/event-bus'

const service = axios.create({
  baseURL: baseUrl,
  withCredentials: false,
  timeout: 15000  // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    const localStorageData = getLocalStorage()
    const { companyKey, ticket, memberCard, wxUserInfo } = localStorageData
    config.headers.companyKey = companyKey
    config.headers.openid = wxUserInfo.openid
    config.headers.ticket = ticket
    config.headers.memberCard = memberCard || ''
    config.headers.channel = 'wx'

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    const { ticket } = getLocalStorage()
    if (res.code !== 0) {
      EventBus.$emit('netError', true, res.msg)
      if (!ticket) {
        EventBus.$emit('checkMember', true) // 未登录默认非会员
      }
      return Promise.reject(res.msg || 'error')
    } else {
      return res
    }
  },
  error => {
    EventBus.$emit('netError', true)
    return Promise.reject(error)
  }
)

export default service

import { http } from "../utils/http";
import { origin } from "../utils/env";
import { getJqzUserInfo, queryWxToken, queryJqzToken, queryWxLoginWmind } from './userInfo'
import filterApis from './filterApi'
import log from './log'

class Ajax {
  constructor(method = 'POST') {
    this.method = method
  }

  getFilterApi(url) {
    let result = true
    const val = getJqzUserInfo() // 本地用户信息
    log('金千枝用户信息', val)
    const apis = filterApis
    if (apis.includes(url)) {
      if (!val) {
        result = false
      }
    }

    return result
  }

  getWxToken() {
    const wxToken = queryWxToken()
    // log('ajax wxtoken', wxToken)
    return wxToken
  }

  getJqzToken() {
    return queryJqzToken()
  }

  getWxLoginWmind() {
    return queryWxLoginWmind()
  }

  post(url, body) {
    const filter = this.getFilterApi(url) // 过滤一些权限
    if (filter) {
      // log('原始参数', body)
      const options = Object.assign({},
        { url: origin + url },
        { data: body },
        { method: this.method },
        { header: { 'mini-token': this.getWxToken(), token: this.getJqzToken(), wmid: this.getWxLoginWmind() }})
      // log('观测参数', options)
      return http(options)
    } else {
      return {} // mock 
    }
  }
}

export { Ajax }
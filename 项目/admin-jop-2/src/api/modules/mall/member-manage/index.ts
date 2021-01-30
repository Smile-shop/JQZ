import http from '@/utils/http'

// 会员
class Ajax {
  method: string
  constructor(method: string = 'POST') {
    this.method = method
  }

  post(url: string, body: any) {
    const options = Object.assign({}, { body: body }, { method: this.method })
    return http(url, options)
  }
}

// 统一处理请求方法
const ajax = new Ajax()

// 微会员列表
export async function queryMemberList(body: any) {
  return await ajax.post('/emp-mall/wxMember/queryWithShopPage', body)
}

// 根据微会员id获取详情
export async function queryMemberDetail(body: any) {
  return await ajax.post('/emp-mall/wxMember/queryWithShopById', body)
}

// 门店列表
export async function getShopList(body: any) {
  return await ajax.post('/emp-mall/store/queryStoreList', body)
}

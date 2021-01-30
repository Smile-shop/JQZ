import request from '@/utils/request'
import { jopMarketingWebBaseUrl } from '@/api/pro-config'

// 查询活动列表
export function getActiveList(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/market/queryActiveList`,
    method: 'POST',
    data
  })
}
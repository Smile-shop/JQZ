import request from '@/utils/request'
import { jopMarketingWebBaseUrl } from '@/api/pro-config'


// 活动奖品设置保存
export function productsSave(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/proSaveNoProbability`,
    method: `POST`,
    data
  })
}
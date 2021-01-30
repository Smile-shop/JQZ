import request from '@/utils/request'
import { wholesaleBaseUrl } from '@/api/pro-config'

// 获取页面设置
export function getPageSet(data: any): any {
  return request({
    url: `${wholesaleBaseUrl}/manager/pageset/findpageset`,
    method: 'POST',
    data,
  })
}

// 设置页面设置
export function setPageSet(data: any): any {
  return request({
    url: `${wholesaleBaseUrl}/manager/pageset/savepageset`,
    method: 'POST',
    data,
  })
}

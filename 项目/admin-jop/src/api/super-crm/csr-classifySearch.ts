import request from '@/utils/request'
import { wholesaleBaseUrl } from '@/api/pro-config'

// 查询分类
export function getDisplay(data: any): any {
  return request({
    url: `${wholesaleBaseUrl}/manager/classifiedSer/display`,
    method: 'POST',
    data,
  })
}

export function submit(data: any): any {
  return request({
    url: `${wholesaleBaseUrl}/manager/classifiedSer/update`,
    method: 'POST',
    data,
  })
}

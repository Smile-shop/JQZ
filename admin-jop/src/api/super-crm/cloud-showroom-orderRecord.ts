/*
 * @Descripttion:
 * @version:
 * @Author: XJHong
 * @Date: 2020-06-29 10:04:10
 * @LastEditTime: 2020-07-01 10:38:42
 */
import request from '@/utils/request'
import { wholesaleBaseUrl } from '@/api/pro-config'

// 订单记录
export function orderHistory(data: any) {
    return request({
      url: `${wholesaleBaseUrl}/manager/order/orderHistory`,
      method: 'POST',
      data,
    })
}
// 查询订单详情
export function orderDetails(data: any, customerId: any) {
    return request({
      url: `${wholesaleBaseUrl}/manager/order/orderProductDetails`,
      method: 'POST',
      data,
      headers: {
        customerId
      }
    })
}
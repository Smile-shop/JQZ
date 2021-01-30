import request from '@/utils/request'
import { wholesaleBaseUrl } from '@/api/pro-config'

// 商品推荐位添加
export function addRecommendProduct(data: any): any {
  return request({
    url: `${wholesaleBaseUrl}/manager/recommend/addRecommendProduct`,
    method: 'POST',
    data,
  })
}

// 商品推荐位查询
export function queryRecommendProduct(data: any): any {
  return request({
    url: `${wholesaleBaseUrl}/manager/recommend/queryRecommendProduct`,
    method: 'POST',
    data,
  })
}

// 商品推荐位编辑
export function updateRecommendProduct(data: any): any {
  return request({
    url: `${wholesaleBaseUrl}/manager/recommend/updateRecommendProduct`,
    method: 'POST',
    data,
  })
}

// 商品推荐位删除
export function delRecommendProduct(data: any): any {
  return request({
    url: `${wholesaleBaseUrl}/manager/recommend/delRecommendProduct`,
    method: 'POST',
    data,
  })
}

// 分类推荐位查询
export function queryClassifiedRecommend(data: any): any {
  return request({
    url: `${wholesaleBaseUrl}/manager/recommend/queryClassifiedRecommend`,
    method: 'POST',
    data,
  })
}

// 分类推荐位删除
export function delClassifiedRecommend(data: any): any {
  return request({
    url: `${wholesaleBaseUrl}/manager/recommend/delClassifiedRecommend`,
    method: 'POST',
    data,
  })
}

// 分类推荐位编辑
export function updateClassifiedRecommend(data: any): any {
  return request({
    url: `${wholesaleBaseUrl}/manager/recommend/updateClassifiedRecommend`,
    method: 'POST',
    data,
  })
}

// 轮播图列表
export function queryShowPictures(data: any): any {
  return request({
    url: `${wholesaleBaseUrl}/manager/recommend/queryShowPictures`,
    method: 'POST',
    data,
  })
}

// 轮播图修改
export function updateShowPictures(data: any): any {
  return request({
    url: `${wholesaleBaseUrl}/manager/recommend/updateShowPictures`,
    method: 'POST',
    data,
  })
}

// 轮播图删除
export function deleteShowPictures(data: any): any {
  return request({
    url: `${wholesaleBaseUrl}/manager/recommend/deleteShowPictures`,
    method: 'POST',
    data,
  })
}

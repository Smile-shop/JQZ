import request from '@/utils/request'
import { jopWXBaseUrl } from '@/api/pro-config'

// 企业资料上传图片
export function uploadCompanyInfoIMGOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/os/upload`,
    method: `POST`,
    data,
  })
}

// 企业资料-查询
export function getCompanyInfoOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/os/getCompanyInfo`,
    method: `POST`,
    data,
  })
}

// 企业资料-设置
export function setCompanyInfoOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/os/save`,
    method: `POST`,
    data,
  })
}

// 栏目管理-查询
export function getColumnOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/column/lookAll`,
    method: `POST`,
    data,
  })
}

// 栏目管理-添加栏目
export function setColumnOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/column/save`,
    method: `POST`,
    data,
  })
}

// 栏目管理-一级栏目删除
export function deleteColumnOneOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/column/deleteOne`,
    method: `POST`,
    data,
  })
}

// 栏目管理-查询文章类型栏目
export function getArticleColumnTypeOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/column/lookShow`,
    method: `POST`,
    data,
  })
}

// 栏目管理-获取栏目背景
export function getColumnBGOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/column/getImgUrl`,
    method: `POST`,
    data,
  })
}

// 栏目管理-排序
export function updateColumnOrderOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/column/order`,
    method: `POST`,
    data,
  })
}

// 留言反馈-查询
export function getMessageOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/weblw/qryWebRecord`,
    method: `POST`,
    data,
  })
}

// 留言反馈-删除
export function deleteMessageOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/weblw/deleWebRecord`,
    method: `POST`,
    data,
  })
}

// 留言反馈-栏目背景图上传
export function uploadMessageIMGOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/weblw/uploadImg`,
    method: `POST`,
    data,
  })
}

// 留言反馈-栏目背景图保存
export function saveMessageIMGOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/weblw/postWeblw`,
    method: `POST`,
    data,
  })
}

// 留言反馈-栏目背景图查询
export function getMessageIMGOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/weblw/qryWeblw`,
    method: `POST`,
    data,
  })
}

// 界面风格-查询
export function getStyleOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/websur/qrySur`,
    method: `POST`,
    data,
  })
}

// 界面风格-设置
export function setStyleOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/websur/postSur`,
    method: `POST`,
    data,
  })
}

// 界面风格-首页图片查询
export function getStyleIMGOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/websur/qrySurDetail`,
    method: `POST`,
    data,
  })
}

// 界面风格-添加图片
export function addStyleIMGOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/websur/postSurDetail`,
    method: `POST`,
    data,
  })
}

// 文章管理-查询
export function getArticleListOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/textImg/lookByPage`,
    method: `POST`,
    data,
  })
}

// 文章管理-新增(修改, 删除)
export function addArticleOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/textImg/save`,
    method: `POST`,
    data,
  })
}

// 文章管理-根据id查询文章
export function getArticleDetailOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/textImg/selectOne`,
    method: `POST`,
    data,
  })
}

// 文章管理-批量删除
export function getArticleBatchDetailOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/textImg/mulDel`,
    method: `POST`,
    data,
  })
}

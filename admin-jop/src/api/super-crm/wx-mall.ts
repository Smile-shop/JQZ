import request from '@/utils/request'
import { jopWXBaseUrl } from '@/api/pro-config'

// 查询兑换门店
export function getShopList(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMallSetting/qryWxShopName`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineShop`
    }
  })
}

// 设置兑换门店
export function setShopList(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMallSetting/postWxShopName`,
    method: `POST`,
    data,
    headers: {
      appCode: `onlineShop`
    }
  })
}

// 添加轮播位广告
export function addBannerOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMall/banner/addBanner`,
    method: `POST`,
    data,
  })
}

// 修改轮播图广告
export function updateBannerOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMall/banner/updateBanner`,
    method: `POST`,
    data,
  })
}

// 查询轮播图广告
export function selectBannerOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMall/banner/listBanner`,
    method: `POST`,
    data,
  })
}

// 上传图片
export function uploadIMGOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/file/upload`,
    method: `POST`,
    data,
  })
}

// 查询商品列表
export function selectProductListOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/jopProduct/productList`,
    method: `POST`,
    data,
  })
}

// 高级查询选择项
export function searchTypeOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/jopProduct/commonCategory`,
    method: `POST`,
    data,
  })
}

// 查询商品详情
export function productDetailsOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/jopProduct/productinfo`,
    method: `POST`,
    data,
  })
}

// 修改商品详情
export function updateProductDetailsOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/jopProduct/updateProductinfo`,
    method: `POST`,
    data,
  })
}

// 新增或修改交易规则
export function updateSellRulesOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/declare/save`,
    method: `POST`,
    data,
  })
}

// 查询交易规则
export function selectSellRulesOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/declare/look`,
    method: `POST`,
    data,
  })
}

// 查询查询设置
export function queryConditionsOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxShop/queryConditions`,
    method: `POST`,
    data,
  })
}

// 更新查询设置
export function updateConditionOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxShop/updateCondition`,
    method: `POST`,
    data,
  })
}

// 别名查询
export function queryWscTititleOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxShop/queryWscTititle`,
    method: `POST`,
    data,
  })
}

// 更新别名查询
export function updateWscTititleOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxShop/updateWscTititle`,
    method: `POST`,
    data,
  })
}

// 查询首饰大类
export function queryJewelryQenera(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxShop/queryLargeType`,
    method: `POST`,
    data,
  })
}

// 查询显示参数
export function queryDisplayParamOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxShop/queryCategoryInfo`,
    method: `POST`,
    data,
  })
}

// 更新列表参数
export function updateListDisplayParamOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxShop/saveOrUpdateGoodsItemDisplayParam`,
    method: `POST`,
    data,
  })
}

// 更新显示参数
export function saveDisplayParamOptions(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxShop/update_categoryInfo`,
    method: `POST`,
    data,
  })
}

// 查询界面样式
export function getPageStyle(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxShop/queryPage`,
    method: `POST`,
    data,
  })
}

// 设置界面样式
export function setPageStyle(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxShop/save`,
    method: `POST`,
    data,
  })
}

// 设置分享样式
export function setProductShareStyle(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMallSetting/productShareStyleSetting`,
    method: `POST`,
    data,
  })
}

// 查询分享样式
export function getProductShareStyle(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMallSetting/queryProductShareStyle`,
    method: `POST`,
    data,
  })
}

// 邮寄方式设置
export function setMailingMethodSetting(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMallSetting/mailingMethodSetting`,
    method: `POST`,
    data,
  })
}

// 邮寄方式查询
export function getMailingMethod(data: any) {
  return request({
    url: `${jopWXBaseUrl}/wxMallSetting/queryMailingMethod`,
    method: `POST`,
    data,
  })
}

// 导购列表统计 （jmp数据）
export function getStatistics(data: any) {
  return request({
    url: `${jopWXBaseUrl}/sale/statistics/queryList`,
    method: `POST`,
    data,
  })
}

// 导购统计明细 （jmp数据）
export function getStatisticsDetail(data: any) {
  return request({
    url: `${jopWXBaseUrl}/sale/statistics/queryDetail`,
    method: `POST`,
    data,
  })
}

// 导购统计明细 （jop数据）
export function getDetailShareData(data: any) {
  return request({
    url: `${jopWXBaseUrl}/sale/statistics/detailShareData`,
    method: `POST`,
    data,
  })
}

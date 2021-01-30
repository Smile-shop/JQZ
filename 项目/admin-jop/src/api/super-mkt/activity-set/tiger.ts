import request from '@/utils/request'
import { jopMarketingWebBaseUrl } from '@/api/pro-config'

export function newUpdateShare(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/newUpdateShare`,
    method: `POST`,
    data
  })
}

export function queryShare(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/queryShare`,
    method: `POST`,
    data
  })
}

export function addGame(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/save`,
    method: `POST`,
    data
  })
}

export function queryActiveList(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/queryActiveList`,
    method: `POST`,
    data
  })
}

export function updatePaused(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/updatePaused`,
    method: `POST`,
    data
  })
}

export function gameActiveDel(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/del`,
    method: `POST`,
    data
  })
}

export function queryActive(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/queryActive`,
    method: `POST`,
    data
  })
}

export function basicUpdate(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/update`,
    method: `POST`,
    data
  })
}

export function queryProducts(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/queryProducts`,
    method: `POST`,
    data
  })
}

export function productsSave(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/productsSave`,
    method: `POST`,
    data
  })
}

export function queryActiveAndJmpGift(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/queryActiveAndJmpGift`,
    method: `POST`,
    data
  })
}

export function queryShopList(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/queryShopList`,
    method: `POST`,
    data
  })
}

export function updateShops(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/updateShops`,
    method: `POST`,
    data
  })
}

export function joinRecords(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActiveData/joinRecords`,
    method: `POST`,
    data
  })
}

export function dataShow(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActiveData/dataShow`,
    method: `POST`,
    data
  })
}

export function winningRecords(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActiveData/winningRecords`,
    method: `POST`,
    data
  })
}

export function updateScheme(data: any) {
  return request({
    url: `${jopMarketingWebBaseUrl}/gameActive/updateScheme`,
    method: `POST`,
    data
  })
}
import request from './request';
const baseUrl = window.VUE_APP_BASE_API;

// 排行榜
export function rankingList(data) {
  return request({
    method: 'POST',
    url: `${baseUrl}/jop-marketing-web/wx/game/rankingList`,
    data,
  })
}

// 用户排行榜
export function userRanking(data) {
  return request({
    method: 'POST',
    url: `${baseUrl}/jop-marketing-web/wx/game/appointUserRanking`,
    data,
  })
}

// 游戏详情
export function getGameDetails(data) {
  return request({
    method: 'POST',
    url: `${baseUrl}/jop-marketing-web/wx/game/gameDetails`,
    data,
  })
}
// 游戏列表
export function getGameGiftList(data) {
  return request({
    method: 'POST',
    url: `${baseUrl}/jop-marketing-web/wx/game/giftList`,
    data,
  })
}
// 游戏结果
export function getGameResult(data) {
  return request({
    method: 'POST',
    url: `${baseUrl}/jop-marketing-web/wx/game/saveWebGift`,
    data,
  })
}
// 游戏参数校验
export function gameStartDraw(data) {
  return request({
    method: 'POST',
    url: `${baseUrl}/jop-marketing-web/wx/game/startDraw`,
    data,
  })
}

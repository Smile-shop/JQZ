import user from '@/utils/user';

const base = `${VUE_APP_BASE_API}/wx-interface-web/wx/auth?companyKey=${user.serverUser.account.companyKey}`;
// const webUrlMap = new Map();

// webUrlMap.set('微商城', {page: 'wx_mall', childPage: ''});
// webUrlMap.set('积分商城', {page: 'wx_point_mall', childPage: ''});
// webUrlMap.set('开心小游戏', {page: 'wx_game', childPage: ''});
// webUrlMap.set('优惠券', {page: 'wx_member', childPage: 'coupons/0'});
// webUrlMap.set('积分记录', {page: 'wx_member', childPage: 'score-record'});
// webUrlMap.set('电子质保单', {page: 'wx_member', childPage: 'consume-record'});
// webUrlMap.set('会员声明', {page: 'wx_member', childPage: 'mber-state'});
// webUrlMap.set('附近门店', {page: 'wx_member', childPage: 'near-stores'});
// webUrlMap.set('今日金价', {page: 'wx_member', childPage: 'gold-price'});
// webUrlMap.set('在线预约', {page: 'wx_member', childPage: 'app-online'});
// webUrlMap.set('系统设置', {page: 'wx_member', childPage: 'sys-set'});
// webUrlMap.set('满意度调研', {page: 'wx_member', childPage: 'evaluation'});
// webUrlMap.set('资讯中心', {page: 'wx_member', childPage: 'consult'});
// webUrlMap.set('今日签到', {page: 'wx_member', childPage: 'sign'});
// webUrlMap.set('微会员', {page: '', childPage: ''});
// webUrlMap.set('微客服', {page: 'wx_chat_system', childPage: ''});
// webUrlMap.set('微官网', {page: 'wx_website', childPage: ''});
// // 特例
// webUrlMap.set('我的礼品', {page: 'wx_member', childPage: '', secondaryPage: 'gift'});
const webUrlMap = {
  微商城: {page: 'wx_mall', childPage: ''},
  积分商城: {page: 'wx_point_mall', childPage: ''},
  开心小游戏: {page: 'wx_game_group', childPage: ''},
  优惠券: {page: 'wx_member', childPage: 'coupons/0'},
  积分记录: {page: 'wx_member', childPage: 'score-record'},
  微保单: {page: 'wx_member', childPage: 'consume-record'},
  会员声明: {page: 'wx_member', childPage: 'mber-state'},
  附近门店: {page: 'wx_member', childPage: 'near-stores'},
  今日金价: {page: 'wx_member', childPage: 'gold-price'},
  在线预约: {page: 'wx_member', childPage: 'app-online'},
  系统设置: {page: 'wx_member', childPage: 'sys-set'},
  满意度调研: {page: 'wx_member', childPage: 'evaluation'},
  资讯中心: {page: 'wx_member', childPage: 'consult'},
  今日签到: {page: 'wx_member', childPage: 'sign'},
  微会员: {page: '', childPage: ''},
  微客服: {page: 'wx_chat_system', childPage: ''},
  微官网: {page: 'wx_website', childPage: ''},
  我的礼品: {page: 'wx_member', childPage: 'gift', secondaryPage: ''},
  微好礼: {page: 'wx_point_mall', childPage: ''},
  会员注册: {page: 'register', childPage: '', secondaryPage: ''}
}

export function computedWebUrl(page: string): string {
  const item = (webUrlMap as any)[page];
  if (item.secondaryPage) {
    return `${VUE_APP_BASE_API}/${item.page}/${item.secondaryPage}`;
  }
  if (item.childPage) {
    return `${base}&page=${item.page}&childPage=${item.childPage}`;
  } else if (item.page) {
    return `${base}&page=${item.page}`;
  }
  return `${base}`;
};
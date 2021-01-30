import { Ajax } from '../utils/ajax'
import { checkTokenValidity } from '../utils/userInfo'
import log from '../utils/log'

// 统一添加请求方法
const ajax = new Ajax()

// 绑定会员信息
export async function bindMemberInfo(body) {
  const url = `/emp-mall/wxMemberFront/bindMemberInfo`
  return await ajax.post(url, body)
}

// 跳转至登录注册页面
const gotoLoginPage = (mark = 'login') => {
  wx.navigateTo({
    url: `/pages/login/index?mark=${mark}`,
  })
}

// 微信登录
export async function wxLogin(body) {
  const mark = 0
  const res = await checkTokenValidity()
  log('检测用户 session', res)
  const { code } = res
  if (code === mark && body) {
    const url = `/emp-mall/wxMemberFront/miniLogin`
    return await ajax.post(url, body)
  }
}

// 查询微会员绑定信息
export async function queryMemberInfo(body, showMsg) {
  const url = `/emp-mall/wxMemberFront/queryBindInfo`
  log('关闭问候语', showMsg)
  return await ajax.post(url, body, showMsg)
}

// 小程序设置个人信息
export async function saveUserInfo(body) {
  const url = `/emp-mall/wxMemberFront/setMiniUserInfo`
  return await ajax.post(url, body)
}

// 获取门店数据
export async function queryStore(body) {
  const url = `/emp-mall/storeFront/queryWithImgDistancePage`
  return await ajax.post(url, body)
}
import { Message } from 'element-ui';
import user from '@/utils/user';
import { getOtherPermissions, getAccountInfo } from '@/api/menu-controller';

const accountId = user.serverUser.account.accountId

const isAdmin = user.serverUser.account.isAdmin // 主账户直接通过

const MASK = '1'

const paramsList = {
  // 分销管理
  distriManage: {
    accountId,
    appCode: 'distriManage',
    channel: 'distribution',
  },
  // 运营管理
  operationManage: {
    accountId,
    appCode: 'operationManage',
    channel: 'distribution',
  },
  // 分销设置
  distriSet: {
    accountId,
    appCode: 'distriSet',
    channel: 'distribution',
  },
  // 订单管理
  orderManage: {
    accountId,
    appCode: 'orderManage',
    channel: 'distribution',
  },
  // 资金管理
  moneyManage: {
    accountId,
    appCode: 'moneyManage',
    channel: 'distribution',
  },
}

// 解析权限值
function parseAuth(arr: any) {
  const mark = '1';
  const m: any[] = [];
  const l = arr;
  l.map((item: any) => {
    if (item.value === mark) {
      m.push(item.otherCode)
    }
  })
  return m
}

// 获取权限
async function queryAuth(params: any) {
  const { data } = await getOtherPermissions(params)
  return parseAuth(data)
}

// 鉴权
async function auth(btn: string, params: any) {
  const info = {
    accountId,
  }
  const { data } = await getAccountInfo(info)
  const { account } = data
  const realTime = account.isAdmin
  if (realTime === MASK) {
    return true
  }
  const list = await queryAuth(params)
  console.log(list, btn, '全活', list.includes(btn))
  if (list.includes(btn)) {
    return true
  } else {
    Message.info('您还没有开通该权限');
    return false
  }
}

// 活动列表-添加活动
export function addActivity() {
  const btn = 'addActivity'
  const params = paramsList.distriManage
  return auth(btn, params)
}

// 活动列表-编辑保存
export function saveActivity() {
  const btn = 'editSave'
  const params = paramsList.distriManage
  return auth(btn, params)
}

// 用户列表-导出数据
export function exportUserList() {
  const btn = 'exportData'
  const params = paramsList.orderManage
  return auth(btn, params)
}

// 订单列表-导出数据
export function exportOrderList() {
  const btn = 'exportData'
  const params = paramsList.orderManage
  return auth(btn, params)
}

// 订单列表-核销订单
export function writeOrder() {
  const btn = 'writeOrder'
  const params = paramsList.orderManage
  return auth(btn, params)
}

// 核销员管理-添加核销员
export function addWriter() {
  const btn = 'addWriter'
  const params = paramsList.orderManage
  return auth(btn, params)
}

// 提现列表-申请提现
export function applyWithraw() {
  const btn = 'applyWithdrawal'
  const params = paramsList.moneyManage
  return auth(btn, params)
}

// 提现列表-添加提现账号
export function addWithdrawAccount() {
  const btn = 'addApplyAccount'
  const params = paramsList.moneyManage
  return auth(btn, params)
}

// 提现列表-提现操作
export function withdrawOperation() {
  const btn = 'withdrawalOperation'
  const params = paramsList.moneyManage
  return auth(btn, params)
}

// 商家设置-编辑保存
export function merchantSave() {
  const btn = 'editSave'
  const params = paramsList.distriSet
  return auth(btn, params)
}

// 客服设置-添加客服
export function addCoustomerSev() {
  const btn = 'addService'
  const params = paramsList.distriSet
  return auth(btn, params)
}

// 客服设置-编辑保存
export function editSave() {
  const btn = 'editSaveSetting'
  const params = paramsList.distriSet
  return auth(btn, params)
}
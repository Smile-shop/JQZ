import { config } from '../config/index'

function getQuery() {
  const launchOptions = wx.getEnterOptionsSync();
  // const launchOptions = wx.getLaunchOptionsSync();
  const { query, path, referrerInfo, scene, shareTicket } = launchOptions;
  const storageQuery = wx.getStorageSync('query');

  // 审核数据
  if (!((query && query.companyKey) || (storageQuery && storageQuery.companyKey))) {
    return {
      env: 'test',
      companyKey: 'test01',
      activityId: 10021,
      // activityId: 937,
      openid: 'oYKLK1cbVMEUu_K_QWUWA-HqdVJ4',
      page: ''
    }
  }

  return {
    ...storageQuery,
    ...query,
  }
}

function getOrigin() {
  const { env } = getQuery();

  switch (env) {
    case 'dev':
      return config.env.dev.origin;
    case 'test':
      return config.env.test.origin;
    case 'uat':
      return config.env.uat.origin;
    default:
      return config.env.production.origin;
  }
}

export {
  getQuery,
  getOrigin,
};

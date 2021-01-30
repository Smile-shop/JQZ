var app = getApp();

// 分享进入存储
export async function shareEntry(store) {
  const userInfoAndStore = Object.assign({}, app.globalData.userInfoAndStore, { store })
  app.globalData.userInfoAndStore = userInfoAndStore
  app.globalData.storeId = store.id
  // try { wx.setStorageSync('userInfoAndStore', userInfoAndStore) } catch (e) { }
}
/**
 * 实现类似Vue里面的mixins混入
 * create by Mr.Li
 */
const app = getApp()
module.exports = {
  data: { 
    mainColor: '#4BC99B'
  },
  onLoad (){
    // this.setTabBarStyleAndsetNavigationBarColor()
  },
  onShareAppMessage () { },
  onShow () { 
    //在线切换用到
    this.setTabBarStyleAndsetNavigationBarColor() 
  },
  /**
   * 
   * @param { top } 是否需要改变头部导航栏颜色 type：Booleans 
   * @param { tabsActive }  底部tabs激活值 type：Number
   */
  setTabBarStyleAndsetNavigationBarColor (top, tabsActive){
    const { theme, globalStyle } = app.globalData
    const mainColor = theme[globalStyle].mainColor
    this.setData({ mainColor })
    if (this.getTabBar() && tabsActive != undefined){
      this.getTabBar().setData({
        active: tabsActive,
        globalStyle: app.globalData.globalStyle,
        activeColor: app.globalData.theme[app.globalData.globalStyle].mainColor
      })
    }
    if(top){
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: mainColor,
      })
    }
  }
}
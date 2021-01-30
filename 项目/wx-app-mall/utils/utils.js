const app = getApp()
// 获取navBar高度
export function getNavbarHeight(){
  const statusBarHeight = app.globalData.systeminfo.statusBarHeight // 状态栏高度
  const headerPosi = app.globalData.headerBtnPosi
  const btnPosi = { bottom: headerPosi.bottom - headerPosi.height - statusBarHeight }
  return headerPosi.bottom + btnPosi.bottom
}
// 时间栅格化
export function filterTime(value, type){
  let data = new Date(value)
  let year = data.getFullYear()
  let month = data.getMonth() + 1 < 10 ? `0${data.getMonth() + 1}` : data.getMonth() + 1
  let day = data.getDate() < 10 ? `0${data.getDate()}` : data.getDate()
  let h = data.getHours() < 10 ? `0${data.getHours()}` : data.getHours()
  let m = data.getMinutes() < 10 ? `0${data.getMinutes()}` : data.getMinutes()
  let s = data.getSeconds() < 10 ? `0${data.getSeconds()}` : data.getSeconds()
  if (type == 1) {
    return `${year}-${month}-${day}`
  } else {
    return `${year}-${month}-${day} ${h}:${m}:${s}`
  }
}
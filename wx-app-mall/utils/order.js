// 保存商品到本地
export function saveGoods(data){
  try {
    const orderDetail = Object.assign({}, { goodsList: data, address: '', remark: '', couponId: '' })
    wx.setStorageSync('orderDetail', orderDetail)
    return true
  } catch (e) {
    return false
   }
}

// 毫秒转时分秒
export function formatTime(msTime) {
  let time = msTime / 1000
  let hour = Math.floor(time / 60 / 60)
  hour = hour.toString().padStart(2, '0')
  let minute = Math.floor(time / 60) % 60
  minute = minute.toString().padStart(2, '0')
  // let second = Math.floor(time) % 60
  // second = second.toString().padStart(2, '0')
  return `${hour}:${minute}`
}
export function countDownTime(val, type) {
  let d, h, m, s
  if (type == 2) {
    if (val >= 0) {
      d = Math.floor(val / 86400)
      val -= d * 86400;
      h = Math.floor(val / 3600)
      val -= h * 3600;
      m = Math.floor(val / 60)
      val -= m * 60;
      s = Math.floor(val)
      
      // 时分秒为单数时、前面加零站位
      if(h < 10) h = "0" + h;
      if(m < 10) m = "0" + m;
      if(s < 10) s = "0" + s;
    } else {
      d = '00';
      h = '00';
      m = '00';
      s = '00';
    }
    return d + '天' + h + '小时' + m + '分' + s + '秒'
  } else {
    if (val >= 0) {
      h = (Math.floor(val / 3600)) < 10 ? '0' + (Math.floor(val / 3600)) : (Math.floor(val / 3600));
      m = (Math.floor(val / 60) % 60) < 10 ? '0' + (Math.floor(val / 60) % 60) : (Math.floor(val / 60) % 60);
      s = (val % 60) < 10 ? '0' + (val % 60) : (val % 60);
    } else {
      h = '00';
      m = '00';
      s = '00';
    }
    return h + '小时' + m + '分' + s + '秒'
  }
}
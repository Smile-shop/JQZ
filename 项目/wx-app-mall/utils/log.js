const launchOptions = wx.getLaunchOptionsSync();
const { env } = launchOptions.query
const mark = 'log'
const untie = 'untie'
const pageFilter = []


const record = function () {
  const base = env
  if (base == mark || base === 'untie' || base == 'fuck') {
    if (typeof console != "undefined" && console.log) {
      const log = console.log.bind(console)
      // const log = (...args) => { }
      module.exports = log
    } else {
      const log = (...args) => {
      }
      module.exports = log
    }
  } else {
    // const log = (...args) => {
    // }
    const log = console.log.bind(console) // 测试调试问题用
    module.exports = log
  }
}

record()
// 计算加载时间
// export function getPerformanceTiming() {
//   var performance = window.performance;

//   if (!performance) {
//     // 当前浏览器不支持
//     console.log('你的浏览器不支持 performance 接口');
//     return;
//   }

//   var t = performance.timing;
//   var times = {};

//   //【重要】页面加载完成的时间
//   //【原因】这几乎代表了用户等待页面可用的时间
//   times.loadPage = t.loadEventEnd - t.navigationStart;

//   //【重要】解析 DOM 树结构的时间
//   //【原因】反省下你的 DOM 树嵌套是不是太多了！
//   times.domReady = t.domComplete - t.responseEnd;

//   //【重要】重定向的时间
//   //【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
//   times.redirect = t.redirectEnd - t.redirectStart;

//   //【重要】DNS 查询时间
//   //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
//   // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)            
//   times.lookupDomain = t.domainLookupEnd - t.domainLookupStart;

//   //【重要】读取页面第一个字节的时间
//   //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
//   // TTFB 即 Time To First Byte 的意思
//   // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
//   times.ttfb = t.responseStart - t.navigationStart;

//   //【重要】内容加载完成的时间
//   //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
//   times.request = t.responseEnd - t.requestStart;

//   //【重要】执行 onload 回调函数的时间
//   //【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
//   times.loadEvent = t.loadEventEnd - t.loadEventStart;

//   // DNS 缓存时间
//   times.appcache = t.domainLookupStart - t.fetchStart;

//   // 卸载页面的时间
//   times.unloadEvent = t.unloadEventEnd - t.unloadEventStart;

//   // TCP 建立连接完成握手的时间
//   times.connect = t.connectEnd - t.connectStart;
//   return {
//     t,
//     ...times
//   };
// }

//初始化相关
function TestTiming(timing){
  var timerArr = [];
  var dnsTimer = {key:"DNS查询耗时" , value:timing.domainLookupEnd - timing.domainLookupStart + "ms"};
  var tcpTimer = {key:"TCP链接耗时" , value:timing.connectEnd - timing.connectStart + "ms"};
  var requestTimer = {key:"request请求耗时" , value:timing.responseEnd - timing.responseStart + "ms"};
  var domTimer = {key:"解析dom树耗时" , value:timing.domComplete - timing.domInteractive + "ms"};
  var pageEmptyTimer = {key:"白屏时间" , value:timing.responseStart - timing.navigationStart + "ms"};
  var domReadyTimer = {key:"domready时间" , value:timing.domContentLoadedEventEnd - timing.navigationStart + "ms"};
  var onloadTimer = {key:"onload时间" , value:timing.loadEventEnd - timing.navigationStart + "ms"};

  timerArr = timerArr.concat(dnsTimer, tcpTimer, requestTimer, domTimer, pageEmptyTimer, domReadyTimer, onloadTimer);
  return timerArr;
}
//请求的各种资源（js,图片，样式等）
function TestResource(resourcesObj){
  var resourceArr = [];
  var len = resourcesObj.length;
  for(var i = len - 1;i >0;i--){
    var temp = {};
    var cur = resourcesObj[i];
    temp.key = cur.name;
    temp.resValue = cur.responseEnd - cur.requestStart + "ms";
    temp.conValue = cur.connectEnd - cur.connectStart + "ms";
    resourceArr.push(temp);
  }
  return resourceArr;
}
//页面的加载方式
function pageLoadMethod(type){
  var arr = [];
  var loadMethod = {};
  loadMethod.name = "进入页面的方式";
  var str = "";
  switch(type){
    case 0:
      str = '点击链接、地址栏输入、表单提交、脚本操作等方式加载';
      break;
    case 1:
      str = '通过“重新加载”按钮或者location.reload()方法加载';
      break;
    case 2:
      str = '网页通过“前进”或“后退”按钮加载';
      break;
    default:
      str = '任何其他来源的加载';
      break;
  }
  loadMethod.value = str;
  arr.push(loadMethod);
  return arr;
}

export function getPerformanceTiming() {
  //输出性能数据
  const perObj = window.performance
  if (!perObj) {
    // 当前浏览器不支持
    console.log('你的浏览器不支持 performance 接口');
    return;
  }
  return {
    '页面初始化': TestTiming(perObj.timing),
    '页面请求': TestResource(perObj.getEntries()),
    '页面加载方式': pageLoadMethod(perObj.navigation.type)
  }
}
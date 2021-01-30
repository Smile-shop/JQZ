

// 对象深度复制
export function deepClone(obj) {
  // Handle null or undefined or function
  if (null == obj || "object" != typeof obj)
    return obj;
  // Handle the 3 simple types, Number and String and Boolean
  if (obj instanceof Number || obj instanceof String || obj instanceof Boolean)
    return obj.valueOf();
  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
  // Handle Array or Object
  if (obj instanceof Object || obj instanceof Array) {
    var copy = (obj instanceof Array) ? [] : {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr))
        copy[attr] = obj[attr] ? Vue.prototype.deepClone(obj[attr]) : obj[attr];
    }
    return copy;
  }
  throw new Error("Unable to clone obj! Its type isn't supported.");
};

// 存储编码
export function compileStr(code) {
  var c = String.fromCharCode(code.charCodeAt(0) + code.length);
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
  };
  return c;
};

// 存储解码
export function unCompileStr(code) {
  c = unescape(code);
  var c = String.fromCharCode(code.charCodeAt(0) - code.length);
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
  };
  return c;
};

// 获取参数
export function getUrlParam(params, urlData) {
  const localUrl = urlData ? urlData : window.location.href.split('?')[1];
  const url = new URLSearchParams(localUrl);
  if (params) {
    const data = url.get(params);
    return data && data !== 'null' ? data : ''
  }
  return '';
}

// 获取URL参数
export function getUrlKey(name) {
  return window.decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
};
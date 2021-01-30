// 本地存储字符编码
export function compileStrFunction(code: string): string {
  let c = String.fromCharCode(code.charCodeAt(0) + code.length);
  for (let i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
  };
  return c;
}

// 本地存储字符解码
export function unCompileStrFunction(code: string): string {
  let c = unescape(code);
  c = String.fromCharCode(code.charCodeAt(0) - code.length);
  for (let i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
  };
  return c;
}

/*1.用正则表达式实现html转码*/
export function htmlEncodeByRegExp(str: any) {
  let s = '';
  if (str.length === 0) {
    return '';
  }
  s = str.replace(/&/g, '&amp;');
  s = s.replace(/</g, '&lt;');
  s = s.replace(/>/g, '&gt;');
  s = s.replace(/ /g, '&nbsp;');
  s = s.replace(/\'/g, '&#39;');
  s = s.replace(/\"/g, '&quot;');
  return s;
}

/*2.用正则表达式实现html解码*/
export function htmlDecodeByRegExp(str: any) {
  let s = '';
  if (str.length === 0) {
    return '';
  }
  s = str.replace(/&amp;/g, '&');
  s = s.replace(/&lt;/g, '<');
  s = s.replace(/&gt;/g, '>');
  s = s.replace(/&nbsp;/g, ' ');
  s = s.replace(/&#39;/g, `'`);
  s = s.replace(/&quot;/g, '"');
  return s;
}
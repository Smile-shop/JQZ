const launchOptions = wx.getLaunchOptionsSync();
const { query, path, referrerInfo, scene, shareTicket } = launchOptions;
const { env } = query;

function getOrigin() {
  switch (env) {
    case 'fuck':
      return 'http://120.79.93.109:9012';
    case 'log':
      return 'https://fat.jqzjop.com';
    case 'untie':
      return 'http://120.79.93.109:9012';
    case 'test':
      return 'http://47.115.77.99:9012';
    case 'dev':
      return 'http://120.79.93.109:9012';
    case 'test':
      return 'https://test2.jbfsoft.net';
    case 'uat':
      return 'https://uat.jbfsoft.net';
    case 'local':
      return 'http://192.168.1.161:9015';
    default:
      return 'https://fat.jqzjop.com';
  }
}

export const origin = getOrigin();

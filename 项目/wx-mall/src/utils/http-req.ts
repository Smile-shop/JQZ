import {HttpReq} from '@/typings/utils';
import {getLocalStorage} from '@/utils/local-storage';

export function httpReq(options: HttpReq.ReqOptions): Promise<any> {
  const localStorageData = getLocalStorage();
  const {url, requestInit} = options;
  const {wxUserInfo, ticket, memberCard} = localStorageData;
  const {headers, body} = requestInit;

  if (wxUserInfo) {
    const {companyKey, openid} = wxUserInfo;
    (headers as Headers).set('companyKey', companyKey);
    (headers as Headers).set('openid', openid);
  }

  if (ticket) {
    (headers as Headers).set('ticket', ticket);
  }

  if (memberCard) {
    (headers as Headers).set('memberCard', memberCard);
  }

  const httpRes = fetch(url, requestInit);

  return new Promise((resolve, reject) => {
    httpRes.then(async res => {
      if (res.ok) {
        const { headers: resHeaders } = res;
        const contentType = resHeaders.get('Content-Type');
        if (contentType && contentType.includes('image')) {
          const blob = await res.blob();
          const file = new File([blob], '推广二维码', {
            type: contentType.split(';')[0].trim()
          });
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
          fileReader.onerror = (e) => {
            reject('文件解析错误');
          };
        } else {
          const bodyJson = res.json();
          bodyJson.then(valueJson => {
            const {code, msg, data} = valueJson;
            if (code === 0) {
              resolve(data);
            } else {
              reject(msg);
            }
          }).catch(reason => {
            reject(reason);
          });
        }
      } else {
        reject(res.statusText);
      }
    }).catch(reason => {
      reject(reason);
    });
  });

}

import {getLocalStorage} from '@/utils/local-storage';
import {Toast} from 'vant';
import store from '@/stores/index';
import {
  VUE_APP_BASE_URL,
  VUE_APP_IMG_BASE_URL
} from '@/config/global-var';

const baseUrl = VUE_APP_BASE_URL;

interface HttpRequest extends RequestInit {
  url: string;
}

async function http(httpRequest: HttpRequest) {
  try {
    const requestInit: RequestInit = {
      mode: 'cors',
      credentials: 'include',
      headers: new Headers({}),
      ...httpRequest,
    };

    const headers = requestInit.headers;

    if (headers instanceof Headers) {
      const localStorageData = getLocalStorage();
      const {wxUserInfo, ticket} = localStorageData;

      if (wxUserInfo) {
        const {companyKey, memberCard, openid} = wxUserInfo;

        headers.set('companyKey', companyKey);
        headers.set('memberCard', memberCard);
        headers.set('openid', openid);

        if (httpRequest.url.includes('jop-wx-web')) {
          headers.delete('openid');
        }

        if (ticket) {
          headers.set('ticket', ticket);
        }
      }

      if (!headers.has('Content-Type')) {
        // 设置json数据头部信息
        if (typeof httpRequest.body === 'string') {
          headers.set('Content-Type', 'application/json');
        }
      }
    }

    const url = `${baseUrl}${httpRequest.url}`;
    const response = await fetch(url, requestInit);
    const responseJson = await response.json();

    if (response.ok) {
      const {code, msg, data} = responseJson;

      if (code == 0) {
        return data;
      } else {
        Toast(msg);
        throw new Error(msg);
      }
    } else {
      throw new Error(responseJson);
    }
  } catch (error) {
    throw new Error(error);
  }
}

export {http};

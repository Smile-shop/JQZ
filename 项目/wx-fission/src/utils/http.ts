import message from '@/utils/app-message';
import store from '@/store';
const origin = window.VUE_APP_BASE_API;

interface Options {
    body?: any;
    cache?: RequestCache;
    credentials?: RequestCredentials;
    headers?: HeadersInit;
    integrity?: string;
    keepalive?: boolean;
    method?: string;
    mode?: RequestMode;
    redirect?: RequestRedirect;
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
    signal?: AbortSignal | null;
    window?: unknown;
    deleteHeaders?: string[]; // 删除的headers
    notPretreatmentData?: boolean; // 不处理data
}
export default async function http(url: string, options: Options) {
  let requestURL = '';
  const requestInit: RequestInit = {
    mode: 'cors',
    credentials: 'include',
    ...options,
  };
  const companyKey = store.state.query.companyKey;
  const distributionId = store.state.query.distributionId;
  const channelId = store.state.query.channelId;
  const openId = store.state.user.openId;
  const userId = store.state.user.userId;

  // 初始化头部
  function initHeaders() {
    const requestInitHeaders = new Headers(options.headers || undefined);

    if (companyKey) {
      requestInitHeaders.set('companyKey', companyKey);
    }

    if (distributionId) {
      requestInitHeaders.set('distributionId', distributionId);
    }

    if (openId) {
      requestInitHeaders.set('openid', openId);
    }

    if (userId) {
      requestInitHeaders.set('userId', userId);
    }

    if (channelId) {
      requestInitHeaders.set('channelId', channelId);
    }

    if (options.deleteHeaders instanceof Array) {
      options.deleteHeaders.forEach((value) => {
        if (value) {
          if (requestInitHeaders.has(value)) {
            requestInitHeaders.delete(value);
          }
        }
      })
    }

    requestInit.headers = requestInitHeaders;
  }

  initHeaders();

  // 初始化地址
  function initURL() {
    if (!url.startsWith('http')) {
      requestURL = `${origin}${url}`;
    } else {
      requestURL = `${url}`
    }
  }

  initURL();

  // 初始化body
  function initBody() {
    const { method } = requestInit;
    const headers = requestInit.headers as Headers;

    if (method === 'GET') {
      requestInit.body = undefined;
      const url = new URL(requestURL);

      for (const [key, value] of Object.entries(options.body)) {
        url.searchParams.append(key, value as string)
      }

      requestURL = url.href;
    } else if ((requestInit.body instanceof FormData) === false) {
      if (requestInit.headers instanceof Headers) {
        headers.set('Content-Type', 'application/json;charset=UTF-8');
      }
      requestInit.body = JSON.stringify(requestInit.body);
    }
  }

  initBody();

  const res = await fetch(requestURL, requestInit);
  const isJson = res.headers.get('Content-Type')?.includes('application/json');

  if (res.ok) {
    if (isJson) {
      const formatJson = await res.json();
      const { code, data, msg } = formatJson;

      // 兼容其它请求
      if (code == null) {
        return formatJson;
      }

      // 请求正确
      if (code === 0) {
        if (options.notPretreatmentData) {
          return formatJson;
        } else {
          return data;
        }
      }

      // 请求错误
      message(msg);
      return Promise.reject(msg);
    }

    return res;
  }

  if (isJson) {
    const formatJson = await res.json();
    return Promise.reject(formatJson);
  }

  return Promise.reject(res);
}

import { message } from 'ant-design-vue';
import { imgAction, fileAction } from '@/api/common/image';
import store from '@/store';

const { state } = store;
const origin = window.VUE_APP_BASE_URL;

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
}
export default async function http(url: string, options: Options) {
  let requestURL = '';
  const requestInit: RequestInit = {
    mode: 'cors',
    credentials: 'include',
    ...options,
  };

  // 初始化头部
  function initHeaders() {
    const requestInitHeaders = new Headers(options?.headers);
    const notNeedToken = [imgAction, fileAction].includes(url)
    const token = localStorage.getItem('token');
    const { epid } = state.user;

    if (!notNeedToken && token) {
      requestInitHeaders.append('token', token);
    }

    if (epid) {
      requestInitHeaders.append('epid', epid);
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
      const urlSearchParams = new URLSearchParams(options.body);
      requestInit.body = undefined;
      requestURL = `${requestURL}?${urlSearchParams.toString()}`;
    } else if ((requestInit.body instanceof FormData) === false) {
      if (requestInit.headers instanceof Headers) {
        headers.set('Content-Type', 'application/json;charset=UTF-8');
      }

      const body = {
        appId: '',
        cliVersion: '',
        param: requestInit.body,
        sign: '',
        signType: '',
        source: '',
        timestamp: 0,
        version: '',
      };
      requestInit.body = JSON.stringify(body);
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
        return data;
      }

      // 请求错误
      message.warning(msg);
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

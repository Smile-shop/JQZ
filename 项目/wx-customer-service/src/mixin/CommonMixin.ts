import axios from 'axios';
import { Vue, Component } from 'vue-property-decorator';
import router from '@/router';

declare module 'vue/types/vue' {
  interface Vue {
    httpBaseUrl: string;
    nodeBaseUrl: string;
    httpServer(opts: any, data: any): Promise<any>;
    goBack(step: number | string): void;
  }
}

declare global {
  interface Window {
    VUE_APP_BASE_API: string;
  }
}


function getUrl(): string {
  return VUE_APP_BASE_API || window.VUE_APP_BASE_API;
  // if (VUE_APP_BASE_API === 'development') {
  //   return 'http://www.jbfsoft.net';
  // } else if (VUE_APP_BASE_API === 'test') {
  //   return 'http://www.jbfsoft.net';
  // } else if (VUE_APP_BASE_API === 'production') {
  //   return 'http://www.jqzjop.com';
  // } else {
  //   return 'http://www.jbfsoft.net';
  // }
}


function getNodeUrl(): string {
  // return VUE_APP_NODE_BASE_API;
  return VUE_APP_BASE_API;
  // if (VUE_APP_BASE_API === 'development') {
  //   return 'http://www.jbfsoft.net';
  // } else if (VUE_APP_BASE_API === 'test') {
  //   return 'http://www.jbfsoft.net';
  // } else if (VUE_APP_BASE_API === 'production') {
  //   return 'http://www.jqzcloud.com';
  // } else {
  //   return 'http://www.jbfsoft.net';
  // }
}

@Component
export default class CommonMixin extends Vue {
  // 云客服前端项目部署
  // public httpBaseUrl = 'http://www.jqzcloud.com';
  // public httpBaseUrl = 'http://www.jbfsoft.net';
  public httpBaseUrl = getUrl();
  // 云客服node服务ip
  // public nodeBaseUrl = 'http://www.jqzcloud.com';
  // public nodeBaseUrl = 'http://47.107.153.176:9099';
  // public nodeBaseUrl = 'http://127.0.0.1:18099';
  // public nodeBaseUrl = 'http://www.jbfsoft.net';
  // public nodeBaseUrl = getNodeUrl();

  public httpServer(opts: any, data: any): Promise<any> {
    const method: string = typeof(opts.method) === 'undefined' ? 'POST' : opts.method;
    const params: object = data;

    const httpDefaultOpts = {
      method,
      baseURL: opts.baseUrl ? opts.baseUrl : this.httpBaseUrl,
      url: opts.url,
      timeout: 10000,
      headers: opts.headers ? opts.headers : '',
      params,
      data: params
    };

    if (opts.method === 'GET') {
      delete httpDefaultOpts.data;
    } else {
      delete httpDefaultOpts.params;
    }

    return new Promise((resolve: any, reject: any) => {
      axios(httpDefaultOpts).then((res: object) => {
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  public goBack(step: number | string): void {
    if (typeof(step) === 'number') {
      router.go(step);
    } else {
      router.push({
        path: `/${step}`
      });
    }
  }
}

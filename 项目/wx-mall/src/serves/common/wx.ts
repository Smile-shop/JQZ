import {http} from '@/utils/http';

interface InitWechatApiReqData {
  companyKey: string;
  url: string;
  type: 'jsapi';
  ispay?: string;
}

interface InitWechatApiResData {
  appid: string;
  timestamp: number;
  nonceStr: string;
  signature: string;
}

// 初始化微信
export function initWechatApi(data: InitWechatApiReqData): Promise<InitWechatApiResData> {
  return http({
    url: '/jop-web/wxinit/jsapi_ticketSign',
    method: 'POST',
    body: JSON.stringify(data),
  });
}

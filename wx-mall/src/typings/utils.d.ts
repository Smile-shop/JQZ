export declare namespace LocalStorage {
  interface WxUserInfo {
    openid: string;
    companyKey: string;
    memberCard: string;
    phone: string;
    headerImg: string;
    page: null | string;
    register_openid: null | string;
    cardNum: null | string;
    logoImg: null | string;
    localUrl: null | string;
    subscribe: string,
    childPage: string | null | undefined
  }

  interface LoginInfo {
    mobileNumber: string;
    password: string;
  }

  interface StorageData {
    wxUserInfo: WxUserInfo | null;
    ticket: string | null;
    memberCard: string | null;
    loginInfo: LoginInfo | null;
  }
}

export declare namespace HttpReq {
  interface ReqOptions {
    url: string;
    requestInit: RequestInit;
  }
}

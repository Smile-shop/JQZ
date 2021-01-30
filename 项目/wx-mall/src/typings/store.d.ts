export interface ShoppingCartList {
  [key: number]: any;
}

export interface SearchTypeList {
  [key: string]: any[] | boolean;
}

export interface ProductSearchOptions {
  [key: string]: any;
}

export interface ShoppingCartCount {
  newCount: number;
  payCount: number;
  doneCount: number;
}


export interface State {
  wxReady: boolean;
  shoppingCartList: ShoppingCartList;
  productSearchOptions: ProductSearchOptions;
  searchTypeList: SearchTypeList;
  // 是否登录
  isLogin: boolean;
  // 页面样式
  pageStyle: {
    banner: any[];
    logo: string;
    themeColor: string;
    title: string;
    isShowComment: number
  } | null;
  // 购物车数
  orderCount: ShoppingCartCount | null;
  // 购物车数量是否点击
  isShoppingCartListClick: boolean,
  // 订单数
  shoppingCartCount: number;
  servicesPermission: null | any[];
  // 分享样式
  shareType: any;
  // 列表显示参数
  listDisplayParams: any,
  postMethod: any,
}

import store from '@/store';

// 拼接首图地址
const baseImgUrl: string = `${VUE_APP_BASE_API}/jop-wx-web/op/showimage`;
export const getImgUrl = (imgname: string): string => {
  const url = new URL(baseImgUrl);
  url.searchParams.append('companyKey', (store as any).state.home.user.companyKey);
  url.searchParams.append('imgname', imgname);
  const urlHref = url.href;
  return urlHref;
};

// 判断是否是json
export const isJSON = (str: string): boolean => {
  try {
    const obj = typeof str === 'string' && JSON.parse(str);
    if (typeof obj === 'object' && obj) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};

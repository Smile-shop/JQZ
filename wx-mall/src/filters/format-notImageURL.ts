import { notImageURL } from '@/utils/notImageURL';

// 头部添加单位
export function notImage(data: string): string {
  if (data) {
    return data;
  } else {
    return notImageURL;
  }
}

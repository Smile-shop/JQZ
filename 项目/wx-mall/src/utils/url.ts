import {getLocalStorage} from '@/utils/local-storage';
import { notImageURL } from '@/utils/notImageURL';

import {
  VUE_APP_BASE_URL,
  VUE_APP_IMG_BASE_URL
} from '@/config/global-var';

export function imageURL(name: string) {
  const {wxUserInfo} = getLocalStorage();
  const baseUrl: string = VUE_APP_BASE_URL;
  const baseImgUrl: string = VUE_APP_IMG_BASE_URL;
  const url = new URL(baseImgUrl);

  if (name) {
    url.searchParams.append('companyKey', wxUserInfo!.companyKey);
    url.searchParams.append('imgname', name);

    return url.href;
  } else {
    return `url(${notImageURL})`;
  }
}

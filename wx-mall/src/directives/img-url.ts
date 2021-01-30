import {getLocalStorage} from '@/utils/local-storage';
import Vue from 'vue';
import {
  VUE_APP_BASE_URL,
  VUE_APP_IMG_BASE_URL
} from '@/config/global-var';
import { notImageURL } from '@/utils/notImageURL';

Vue.directive('imgURL', (element, vNodeDirective) => {
  const {wxUserInfo} = getLocalStorage();
  const baseUrl: string = VUE_APP_BASE_URL;
  const baseImgUrl: string = VUE_APP_IMG_BASE_URL;
  const url = new URL(baseImgUrl);
  const imgname = vNodeDirective.value;

  url.searchParams.append('companyKey', wxUserInfo!.companyKey);
  url.searchParams.append('imgname', imgname);

  const urlHref = url.href;
  const nodeName = element.nodeName;

  if (nodeName === 'IMG') {
    if (imgname) {
      element.setAttribute('src', urlHref);
    } else {
      element.setAttribute('src', baseUrl.concat('/images/404.png'));
    }
  } else {
    if (imgname) {
      element.style.backgroundImage = `url(${urlHref})`;
    } else {
      element.style.backgroundImage = `url(${notImageURL})`;
    }
    element.style.backgroundSize = 'contain';
    element.style.backgroundRepeat = 'no-repeat';
    element.style.backgroundPosition = 'center center';
  }
});

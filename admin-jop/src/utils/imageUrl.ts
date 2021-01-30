import { getSessionStorage } from '@/utils/storage';
interface ImagesUrlOptions {
  name: string;
  path?: string;
  alias?: string;
}

export function imagesUrl(options: ImagesUrlOptions): string {
  options = {
    path: '/jop-wx-web/op/showimage',
    alias: 'Gift',
    ...options,
  }

  let result = ''
  const IntegralImg = 'http://www.jqzjop.com/ftp_images/01/game/game_integral_default.png'
  const { user } = getSessionStorage();
  const { account } = user;
  const { companyKey } = account;
  const baseUrl = VUE_APP_BASE_API;
  const type = 'Integral' // 积分
  const {
    alias,
    name,
    path
  } = options

  if (name) {
    result = `${baseUrl}${path}?companyKey=${companyKey}&imgname=${name}&alias=${alias}`
  } else if (alias === type) {
    result = IntegralImg
  }

  return result
}

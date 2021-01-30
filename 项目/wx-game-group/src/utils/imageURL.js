import { getLocalStorage } from './local-storage'
import baseUrl from '@/config/config.js'

/**
 *
 * @param {{name: string, path?: string, alias?: string}} options
 */
export function imagesUrl(options) {
  options = {
    path: '/jop-wx-web/op/showimage',
    alias: 'Gift',
    ...options
  }

  const { companyKey } = getLocalStorage()
  const {
    alias,
    name,
    path
  } = options

  return `${baseUrl}${path}?companyKey=${companyKey}&imgname=${name}&alias=${alias}`
}

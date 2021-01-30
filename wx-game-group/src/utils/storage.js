import { storagekey, giftKey, QRcode } from '@/config/constants.js'

class localStorage {
  constructor(keyWords) {
    this.keyWords = keyWords
  }

  save(params) {
    if ((typeof (params) === 'string') && params.includes('}')) {
      window.localStorage.setItem(this.keyWords, params)
    } else {
      window.localStorage.setItem(this.keyWords, JSON.stringify(params))
    }
  }

  get() {
    const result = window.localStorage.getItem(this.keyWords)
    if (result && (typeof (result) === 'string')) {
      return JSON.parse(result)
    } else {
      return result
    }
  }
}

const setStorage = new localStorage(storagekey)
const getInfoStorage = new localStorage(storagekey)
const setQRcode = new localStorage(QRcode)
const getQRcode = new localStorage(QRcode)
const setGiftStorage = new localStorage(giftKey)
const getGiftStorage = new localStorage(giftKey)

export {
  setStorage,
  getInfoStorage,
  setQRcode,
  getQRcode,
  setGiftStorage,
  getGiftStorage,
}
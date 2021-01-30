import request from '@/utils/request'

export function getCategorylist(data: any) {
  return request({
    url: `${VUE_APP_BASE_API}/app/tutorial/video/categorylist`,
    method: 'POST',
    data,
  })
}

export function query(data: any) {
  return request({
    url: `${VUE_APP_BASE_API}/app/tutorial/video/query `,
    method: 'POST',
    data,
  })
}

export function clickRecord(data: any) {
  return request({
    url: `${VUE_APP_BASE_API}/app/tutorial/video/clickRecord `,
    method: 'POST',
    data,
  })
}



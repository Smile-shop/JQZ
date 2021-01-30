import http from '@/utils/http';

// 图片上传url
export const imgAction = `${window.VUE_APP_BASE_IMAGE_URL}/upload/uploadImageFile`

// 文件上传url
export const fileAction = `${window.VUE_APP_BASE_IMAGE_URL}/upload/uploadFile`

// 上传图片
export async function upLoadImage(body: any) {
  return http(imgAction, {
    body,
    method: 'POST',
  });
}

// 上传文件
export async function upLoadFile(body: any) {
  return http(fileAction, {
    body,
    method: 'POST',
  });
}

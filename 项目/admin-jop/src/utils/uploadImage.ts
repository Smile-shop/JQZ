import {upload} from '@/api/common';
import { Message } from 'element-ui';

// 背景上传
export async function uploadImage(event: Event) {
  const fileInputEl = event!.target as HTMLInputElement;
  const files = fileInputEl.files;
  const formData = new FormData();
  const message = Message.info({
    duration: 0,
    message: '上传中...'
  });

  if (files) {
    formData.append('file', files[0]);
    formData.append('alias', 'photos');

    const {data} = await upload(formData);
    message.close();
    Message.success('上传成功');
    return data.url;
  } else {
    message.close();
    Message.warning('没有文件');
    return Promise.reject('没有文件');
  }
}

import { Modal } from 'ant-design-vue';

interface ModalOptions {
  title?: string;
  content?: string;
}
export function confirmMessage(options: ModalOptions) {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      ...options,
      onOk() {
        resolve();
      },
      onCancel() {
        reject(new Error('取消'));
      }
    })
  });
}

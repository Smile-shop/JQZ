export function copyText(text: string) {
  return new Promise((resolve, reject) => {
    if (window.navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        resolve('复制成功');
      }).catch(() => {
        reject('复制失败');
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove()
      resolve('复制成功');
    }
  })
}

export function readText() {
  return new Promise(async (resolve, reject) => {
    if (window.navigator.clipboard) {
      const clipboard = window.navigator.clipboard;

      if (clipboard.readText) {
        const text = await clipboard.readText();
        resolve(text);
      } else {
        reject('浏览器不支持粘贴功能, 请输入');
      }
    } else {
      reject('浏览器不支持粘贴功能, 请输入');
    }
  })
}

export default function rem() {
  const docWidth = 750; // 设计稿宽度
  const initFontSize = 16; // 初始字体大小
  const minWidth = 0; // 最小宽度
  const minWidthFontSize = initFontSize * (minWidth / docWidth); // 最小宽度字体大小
  const maxWidth = 2000; // 最大宽度
  const maxWidthFontSize = initFontSize * (maxWidth / docWidth); // 最大宽度字体大小
  const html = document.documentElement; // html元素

  // 重新计算fontSize大小
  const recalc = () => {
    const clientWidth = (html as HTMLElement).getBoundingClientRect().width;
    if (clientWidth <= minWidth) {
      (html as HTMLElement).style.fontSize = `${minWidthFontSize}px`;
    } else if (clientWidth >= maxWidth) {
      (html as HTMLElement).style.fontSize = `${maxWidthFontSize}px`;
    } else {
      (html as HTMLElement).style.fontSize = `${initFontSize * (clientWidth / docWidth)}px`;
    }
  };

  recalc();

  // 改变窗口大小时候改变fontSize大小
  window.addEventListener('resize', recalc);
}

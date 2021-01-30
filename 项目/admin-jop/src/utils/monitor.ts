export function runMonitor() {
  if (process.env.NODE_ENV === 'production' && VUE_APP_BASE_API === 'http://www.jqzjop.com') {
    const headDom = document.querySelector('head');
    const scriptDom = document.createElement('script');
    scriptDom.src = './assets/js/monitor.js';
    if (headDom) {
      headDom.insertBefore(scriptDom, headDom.firstElementChild);
    }
  }
}
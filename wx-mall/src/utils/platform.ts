export const isMobile = {
  Android() {
    return navigator.userAgent.match(/Android/i) ? true : false;
  },
  BlackBerry() {
    return navigator.userAgent.match(/BlackBerry/i) ? true : false;
  },
  iOS() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
  },
  Windows() {
    return navigator.userAgent.match(/IEMobile/i) ? true : false;
  },
  any() {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
  }
};

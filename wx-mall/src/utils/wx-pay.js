function wxPay(options) {
  return new Promise((resolve, reject) => {
    function onBridgeReady() {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        options.payinfo,
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            resolve('支付成功')
          } else {
            reject(res.err_desc)
          }
        }
      );
    }

    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
      }
    } else {
      onBridgeReady();
    }
  })
}

export default wxPay;
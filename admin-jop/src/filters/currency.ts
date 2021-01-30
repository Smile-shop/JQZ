import Vue from 'vue';

Vue.filter('currencyFilter', (
  num: number | string,
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 2
): string | number => {
  let result: number | string = 0;

  if (typeof num === 'number') {
    if (Number.isFinite(num)) {
      result = num.toLocaleString('zh-Hans-CN', {
        style: 'currency', // 显示类型
        currency: 'CNY', // 货币类型
        currencyDisplay: 'symbol', // 货币显示类型
        useGrouping: true, // 是否使用分隔符
        minimumFractionDigits, // 最小小数位
        maximumFractionDigits, // 最大小数位
      });
    }
  }

  return result;
})

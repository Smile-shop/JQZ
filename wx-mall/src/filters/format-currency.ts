// 千分符并保留两份小数
export function formatCurrencyFraction(
  num: number | string,
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 2,
): string | number {
  if ('toLocaleString' in Number.prototype && typeof num == 'number') {
    const localeNumber = num.toLocaleString('zh-CN', {
      style: 'currency', // 显示类型
      currency: 'CNY', // 货币类型
      currencyDisplay: 'symbol', // 货币显示类型
      useGrouping: true, // 是否使用分隔符
      minimumFractionDigits, // 最小小数位
      maximumFractionDigits, // 最大小数位
    });

    if (localeNumber) {
      num = localeNumber;
    } else {
      num = `￥${num}`;
    }

  } else {
    num = `￥${num}`;
  }

  return num;
}

// 积分符号
export function pointSign(point: number): string | number {
  const plusSign: string = '+';

  if (point > 0) {
    return plusSign.concat(String(point));
  } else {
    return point;
  }
}

// 头部添加单位
export function padStartUnit(data: number | string, unit: string): string | number {
  if (data != null) {
    if (unit) {
      return unit.concat(String(data));
    }

    return data;
  }

  return '';
}

// 尾部添加单位
export function padEndUnit(data: number | string, unit: string): string | number {
  if (data != null) {
    if (unit) {
      return String(data).concat(unit);
    }

    return data;
  }

  return '';
}

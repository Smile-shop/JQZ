import store from '@/store/index';

// 产品需要显示的属性
export function productDisplayPropertys(product: any): any[] {
  const { home } = store.state as any;
  const { listDisplayParams } = home;

  if (listDisplayParams) {
    const largeType: any[] | undefined = listDisplayParams[product.jewelryLargeCategory];

    if (largeType) {
      const propertys = largeType.map((value, index) => {
        const { name, id, unit } = value;
        return {
          name,
          value: product[id],
          unit
        };
      });
      return propertys;
    }
  }
  return [];
}


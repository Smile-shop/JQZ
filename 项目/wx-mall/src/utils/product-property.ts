import store from '@/stores/index';

// 产品需要显示的属性
export function productDisplayPropertys(product: any) {
  const { listDisplayParams } = store.state;

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

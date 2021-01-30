// 订单状态
export function orderStatus(status: string): string {
  switch (status) {
    case 'NEW':
      return '待支付';
    case 'CFD':
      return '已发货';
    case 'PAY':
      return '待支付';
    case 'PAD':
      return '已支付';
    case 'EMS':
      return '已发货';
    case 'RCT':
      return '已完成';
    case 'RTN':
      return '退款中';
    case 'RTH':
      return '已退款';
    default:
      return '未知';
  }
}

// 配送方式
export function expressType(status: string): string {
  switch (status) {
    case 'SLF':
      return '自取';
    case 'EMS':
      return '快递';
    default:
      return '未知';
  }
}

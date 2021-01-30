import exportCsv from '@/utils/exportCsv'

// 格式化状态
function formatStatus(status: string) {
  const mark = 'OCHH'
  const recevied = '已领取'
  const unaccalimed = '未领取'
  if (status === mark) {
    return recevied
  } else {
    return unaccalimed
  }
}
// 格式化默认值
function formatDefault(val: any) {
  if (val) {
    return val
  } else {
    return ''
  }
}

// 转换数据
function transformData(data: any) {
  const mark = 'accepetStatus'
  const result = data.map((item: any) => {
    item.accepetStatus = formatStatus(item.accepetStatus)
    let val: any = null
    for (val in item) {
      if (val !== mark) {
        item[`${val}`] = formatDefault(item[`${val}`] )
      }
    }
    return item
  })
  return result
}

// 制作表格
function createTable(data: any) {
  exportCsv({
      quoted: true,
      separator: ',',
      filename: '裂变分销' + '—' + '资金明细',
      columns: [
        {
          title: '支付单号',
          key: 'order'
        },
        {
          title: '用户昵称',
          key: 'nickName'
        },
        {
          title: '支付金额',
          key: 'paymentAmount'
        },
        {
          title: '一级返现',
          key: 'firstPay'
        },
        {
          title: '二级返现',
          key: 'sencondPay'
        },
        {
          title: '入账手续费',
          key: 'handleFee'
        },
        {
          title: '实收金额',
          key: 'actualAmount'
        },
        {
          title: '支付时间',
          key: 'date'
        },
      ],
      data
  });
}

// 导出表格
export function downloadFissionTable(data: any) {
  const giftData = data
  const format = transformData(giftData)
  createTable(format)
}

// 下载或导出表格
export function downLoad(src: string) {
  // const a: any = document.createElement('a');
  // a.id = 'expertFile'
  // a.href = src;
  // document.body.append(a)
  // a.click ? a.click() : (window as any).open(src)
  // (document as any).getElementById('expertFile').remove();


  // const MIME_TYPE = 'image/png';
  // const imgURL = this.fabricCanvas.toDataURL(MIME_TYPE);
　　// 创建一个a链接，模拟点击下载
  const dlLink = document.createElement('a');
  // const filename = 'playbill.png';
  // dlLink.download = filename;
  dlLink.href = src;
  dlLink.dataset.downloadurl = [dlLink.href].join(':');
  document.body.appendChild(dlLink);
  dlLink.click();
  document.body.removeChild(dlLink);
}

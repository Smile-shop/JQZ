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
function createTable(data: any, name: string, detail: string) {
  exportCsv({
      quoted: true,
      separator: ',',
      filename: name + '—' + detail + '中奖记录',
      columns: [
        {
          title: 'openid',
          key: 'openId'
        },
        {
          title: '领奖人姓名',
          key: 'name'
        },
        {
          title: '会员卡',
          key: 'memberCard'
        },
        {
          title: '手机号',
          key: 'phoneNumber'
        },
        {
          title: '奖品名称',
          key: 'giftName'
        },
        {
          title: '中奖时间',
          key: 'winningTime'
        },
        {
          title: '兑奖门店',
          key: 'exchangeShop'
        },
        {
          title: '兑奖码',
          key: 'exchangeCode'
        },
        {
          title: '领奖时间',
          key: 'accepetTime'
        },
        {
          title: '领取状态',
          key: 'accepetStatus'
        }
      ],
      data
  });
}

// 导出表格
export default function downloadWinTable(data: any) {
  const name = data.name
  const giftData = data.data
  const detail = data.detail
  const format = transformData(giftData)
  createTable(format, name, detail)
}

const ENMap = {
  news: '2',
  text: '1',
  image: '3',
  voice: '5',
  video: '4',
  2: 'news',
  1: 'text',
  3: 'image',
  5: 'voice',
  4: 'video'
}

export function getENString(key: any): any {
  return (ENMap as any)[key];
}

const CNMap = {
  news: '选择图文消息',
  text: '添加回复文字',
  image: '选择图片',
  voice: '选择音频',
  video: '选择视频',
  2: '图文',
  1: '文本',
  3: '图片',
  5: '音频',
  4: '视频'
}

export function getCNString(key: any): any {
  return (CNMap as any)[key];
}

const templateData = {
  等级提升通知: {
    name: '等级提升通知',
    startMsg: '恭喜您，您的会员等级提升了！',
    bodyMsg: [
      {
        title: '当前会员等级',
        value: '会员等级 白金会员'
      },
      {
        title: '当前积分',
        value: 'xxx'
      }
    ],
    endMsg: '您将享受更多会员特权'
  },
  充值成功通知: {
    name: '充值成功通知',
    startMsg: '恭喜您，已经充值成功。',
    bodyMsg: [
      {
        title: '会员卡号',
        value: '88888888'
      },
      {
        title: '充值金额',
        value: '100'
      },
      {
        title: '卡内余额',
        value: '200'
      }
    ],
    endMsg: '如若有任何疑问，可随时与我们联系。'
  },
  登录成功通知: {
    name: '登录成功通知',
    startMsg: '恭喜您，您已经成功登录。',
    bodyMsg: [
      {
        title: '登录账号',
        value: 'ST320101001'
      },
      {
        title: '登录状态',
        value: '登录成功'
      },
      {
        title: '登录时间',
        value: '2017-09-09 15:14:58'
      }
    ],
    endMsg: '我们将为您持续提供最优质的服务。'
  },
  服务评价通知: {
    name: '服务评价通知',
    startMsg: '亲爱的会员，感谢您对我们的服务作出评价！',
    bodyMsg: [
      {
        title: '评价项目',
        value: '首饰保养'
      },
      {
        title: '服务柜台',
        value: 'xx珠宝'
      },
      {
        title: '服务时间',
        value: '2018/04/15 12:30-13:30'
      }
    ],
    endMsg: '您的满意是我们永恒的追求。'
  },
  服务状态提醒: {
    name: '服务状态提醒',
    startMsg: '感谢关注XX珠宝，我们将竭诚为您服务！',
    bodyMsg: [],
    endMsg: '我已在此等候多时，欢迎您的关注，我们将为你提供最新的咨询和优惠活动信息'
  },
  会员服务通知: {
    name: '会员服务通知',
    startMsg: '尊敬的顾客，您好！请查询您的服务：',
    bodyMsg: [
      {
        title: '会员名称',
        value: '曹操'
      },
      {
        title: '会员类型',
        value: '免费会员'
      },
      {
        title: '申请的服务',
        value: '首饰清洗'
      }
    ],
    endMsg: '感谢您的使用，如有疑问请咨询店内。'
  },
  会员积分增加通知: {
    name: '会员积分增加通知',
    startMsg: '积分享好礼，兑换不停歇。您的积分已到账！',
    bodyMsg: [
      {
        title: '会员卡号',
        value: '100000000093'
      },
      {
        title: '新增积分',
        value: '50'
      },
      {
        title: '现有积分',
        value: '4050'
      },
      {
        title: '备注',
        value: '2015年5月11日 17:40 绑定微信赠送积分'
      }
    ],
    endMsg: '想获取更多积分可每日签到获取，点击签到吧！'
  },
  电子会员卡激活通知: {
    name: '电子会员卡激活通知',
    startMsg: '恭喜您，电子会员卡已经成功激活！',
    bodyMsg: [
      {
        title: '会员卡号',
        value: '60018348385'
      },
      {
        title: '会员等级',
        value: '普通会员'
      },
      {
        title: '积分余额',
        value: '0'
      },
      {
        title: '使用渠道',
        value: '所有门店'
      }
    ],
    endMsg: '感谢的使用，如有疑问请咨询店内。'
  },
  会员消费提醒: {
    name: '会员消费提醒',
    startMsg: '尊敬的会员，您好！您已消费成功，详情如下：',
    bodyMsg: [
      {
        title: '消费时间',
        value: '2015-2-3 17:35:24'
      },
      {
        title: '消费金额',
        value: '467元'
      },
      {
        title: '新增积分',
        value: '467分'
      },
      {
        title: '兑换积分',
        value: '0分'
      },
      {
        title: '积分余额',
        value: '785分'
      }
    ],
    endMsg: 'XX珠宝感谢您的惠顾，欢迎您再次光临。'
  },
  会员信息修改通知: {
    name: '会员信息修改通知',
    startMsg: '亲爱的会员，您的信息已修改成功。',
    bodyMsg: [
      {
        title: '姓名',
        value: '曹操'
      },
      {
        title: '手机号',
        value: '13000123457'
      },
      {
        title: '修改项目',
        value: '生日'
      },
      {
        title: '修改内容',
        value: '从1990年1月1日修改为1990年2月1日'
      },
      {
        title: '修改状态',
        value: '成功'
      }
    ],
    endMsg: '感谢您的使用，如有疑问请咨询店内。'
  },
  会员注册成功通知: {
    name: '会员注册成功通知',
    startMsg: '恭喜您已成为XX珠宝的会员',
    bodyMsg: [
      {
        title: '手机',
        value: '13888888888'
      },
      {
        title: '姓名',
        value: '张三'
      },
      {
        title: '会员等级',
        value: '高级会员'
      }
    ],
    endMsg: '点击详情进入会员中心，即刻体验会员专属权益。'
  },
  积分变更提醒: {
    name: '积分变更提醒',
    startMsg: '尊敬的顾客，您的积分发生了变动，请查询：',
    bodyMsg: [
      {
        title: '卡号',
        value: '000000001'
      },
      {
        title: '变更类型',
        value: '消费获赠500积分'
      },
      {
        title: '当前积分',
        value: '500'
      }
    ],
    endMsg: '感谢您的使用，如有疑问请咨询店内。'
  },
  积分兑换成功通知: {
    name: '积分兑换成功通知',
    startMsg: '恭喜您，兑换了心怡的礼品',
    bodyMsg: [
      {
        title: '产品名',
        value: '雨伞'
      },
      {
        title: '兑换积分',
        value: '3580分'
      },
      {
        title: '兑换时间',
        value: '12月1日13时40分'
      }
    ],
    endMsg: '兑换的礼品需至门店进行领取，赶紧去店内领取吧！'
  },
  积分即将过期通知: {
    name: '积分即将过期通知',
    startMsg: '紧急！您有积分即将到期，别让到手的积分白白浪费啦！',
    bodyMsg: [
      {
        title: '积分数量',
        value: '39积分'
      },
      {
        title: '积分来源',
        value: '购买珠宝'
      },
      {
        title: '领取截至日期',
        value: '2015-5-20'
      }
    ],
    endMsg: '积分使用详情请咨询门店。'
  },
  积分入账通知: {
    name: '积分入账通知',
    startMsg: '尊敬的顾客，您的积分已入账，请查收！',
    bodyMsg: [
      {
        title: '积分数量',
        value: '39积分'
      },
      {
        title: '积分来源',
        value: '购买珠宝'
      },
      {
        title: '领取截至日期',
        value: '2015-5-20'
      }
    ],
    endMsg: '积分商城享豪礼，海量商品等您领！'
  },
  卡券成功使用通知: {
    name: '卡券成功使用通知',
    startMsg: '尊敬的顾客，您的卡券已经使用！',
    bodyMsg: [
      {
        title: '订单号',
        value: '998005516'
      },
      {
        title: '订单金额',
        value: '总价68元，实际支付38元'
      },
      {
        title: '卡券号',
        value: '88800888'
      },
      {
        title: '卡券信息',
        value: '代金券，面值30元'
      },
      {
        title: '使用时间',
        value: '2016/08/31 12:30'
      }
    ],
    endMsg: '点击我的“优惠券”查看更多开启详情。'
  },
  客服跟进提醒: {
    name: '客服跟进提醒',
    startMsg: '你好，接收到客户通知。',
    bodyMsg: [
      {
        title: '客户称谓',
        value: '曹操'
      },
      {
        title: '咨询时间',
        value: '2016年8月31日 12:30'
      }
    ],
    endMsg: '点击查看详情。'
  },
  签到成功提醒: {
    name: '签到成功提醒',
    startMsg: '恭喜您，今天打卡成功，积分已经到账。',
    bodyMsg: [
      {
        title: '积分奖励',
        value: '10积分(=0.1元)'
      },
      {
        title: '会员积分',
        value: '40'
      }
    ],
    endMsg: '打卡得积分，积分大价值，海量礼品等您换。'
  },
  申请退换货通知: {
    name: '申请退换货通知',
    startMsg: '尊敬得顾客，您的申请我们已经收到，正在为您处理。',
    bodyMsg: [
      {
        title: '订单号',
        value: '1010011211'
      },
      {
        title: '商品信息',
        value: 'xx珠宝'
      },
      {
        title: '商品数量',
        value: '2'
      },
      {
        title: '商品金额',
        value: '0.5'
      },
      {
        title: '受理时间',
        value: '2014年7月21日 18:35'
      }
    ],
    endMsg: '如若有任何疑问，可随时与我们联系。'
  },
  首饰保养提醒: {
    name: '首饰保养提醒',
    startMsg: '非常感谢您在本店选购心怡的首饰，特此提醒您的首饰即将需要进行常规维护保养。',
    bodyMsg: [
      {
        title: '会员姓名',
        value: '曹操'
      },
      {
        title: '上次保养时间',
        value: '2014-02-03'
      },
      {
        title: '到期时间',
        value: '2015-01-01'
      }
    ],
    endMsg: '请携带您的心怡首饰到XX珠宝，我们将可为它做维护保养哦。'
  },
  连单券提醒: {
    name: '连单券提醒',
    startMsg: '连单券消息开始语。',
    bodyMsg: [
      {
        title: '订单号',
        value: 'XS201028006'
      },
      {
        title: '完成状态',
        value: '已完成'
      },
      {
        title: '完成时间',
        value: '2020-01-01'
      },
      {
        title: '备注',
        value: '点击详情领取奖励。'
      }
    ],
    endMsg: '连单券消息结束语。'
  }
}

export function getTemplateMap(key: string): any {
  const res = (templateData as any)[key];
  return res ? res : {
    name: key,
    startMsg: '',
    bodyMsg: [],
    endMsg: ''
  };
}

const ClueBasisData = {
  1: {
    type: '1',
    name: '线索来源'
  },
  2: {
    type: '2',
    name: '线索状态'
  },
  3: {
    type: '3',
    name: '跟进方式'
  },
  4: {
    type: '4',
    name: '快捷跟进',
    title: '快捷跟进内容'
  },
  5: {
    type: '5',
    name: '客户级别'
  },
  6: {
    type: '6',
    name: '客户状态'
  },
  // 7: {
  //   type: '7',
  //   name: '联系人'
  // },
  8: {
    type: '8',
    name: '负责人'
  }
}

export interface BaseData {
  type: string;
  name: string;
  title?: string;
  list: any[]
}

export function getClueBasisDataString(key?: string) {
  if (key) {
    return (ClueBasisData as any)[key];
  } else {
    return ClueBasisData;
  }
}
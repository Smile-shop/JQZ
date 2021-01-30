<template>
  <div class="order-overview">
    <div class="order-o-top">
      <p>订单概况</p>
      <p class="order-o-top-right">买家信息</p>
    </div>
    <div class="order-o-bottom">
      <div class="order-o-left" v-if="dataList.orderSummary">
        <p class="order-title">订单编号：{{dataList.orderSummary.number ? dataList.orderSummary.number : '—'}}
          <!-- <span class="order-look">查看微保单</span> -->
          </p>
        <p>支付流水号：{{dataList.orderSummary.tradeNo ? dataList.orderSummary.tradeNo : '—'}}</p>
        <p>付款方式：{{paymentKind(dataList.orderSummary.paymentKind ? dataList.orderSummary.paymentKind : '—')}}</p>
        <p>所属门店：{{dataList.orderSummary.storeName ? dataList.orderSummary.storeName : '—'}}</p>
        <p>订单导购：—</p>
      </div>
      <div class="order-o-right" v-if="dataList.orderBuyer">
        <p class="order-title">买家：<span>{{dataList.orderBuyer.memberSummary && dataList.orderBuyer.memberSummary.customerName ? dataList.orderBuyer.memberSummary.customerName : '—'}}</span><span>{{dataList.orderBuyer.memberSummary && dataList.orderBuyer.memberSummary.levelName ? (dataList.orderBuyer.memberSummary.levelName) : ''}}</span></p>
        <p>会员电话：{{dataList.orderBuyer.memberSummary && dataList.orderBuyer.memberSummary.phone ? dataList.orderBuyer.memberSummary.phone : '—'}}</p>
        <p>配送方式：{{dataList.orderBuyer.recvManner === 'DIY' ? '自提' : dataList.orderBuyer.recvManner === 'EXP' ? '快递' : '—'}}</p>
        <p>收货人：{{dataList.orderBuyer.receiver ? dataList.orderBuyer.receiver : '—'}}</p>
        <p>收货电话：{{dataList.orderBuyer.receiverOhone ? dataList.orderBuyer.receiverOhone : '—'}}</p>
        <p>收货地址：{{dataList.orderBuyer.address ? dataList.orderBuyer.address : '—'}}<span :data="dataList.orderBuyer.address ? dataList.orderBuyer.address : ''" class="order-copy" @click="copyLink">复制</span><input id="copy_content" type="text" value=""  style="opacity: 0;"/></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from '@vue/composition-api'
export default defineComponent({
  props: {
    dataList: {
      type: Object,
      default: {}
    }
  },
  setup(props, context) {
    // 支付方式
    const paymentKind = (item: any) => {
      switch (item) {
        case 'NOTPAID':
          return '待支付'
        case 'FTF':
          return '线下支付'
        case 'WXPAY':
          return '微信支付'
      }
    }
    // 复制
    function copyLink(e: any) {
      const clickContent = e.target.getAttribute('data'); // 获取要复制的值
      const inputElement = document.getElementById('copy_content'); // 获取要赋值的input的元素
      (inputElement as any).value = clickContent; // 给input框赋值
      (inputElement as any).select();// 选中input框的内容
      document.execCommand('Copy');// 执行浏览器复制命令
      context.root.$message.success('复制成功');
    }
    return {
      paymentKind,
      copyLink
    }
  }
})
</script>

<style lang="scss" scoped>
.order-overview {
  width: 100%;
  .order-o-top {
    display: flex;
    background: #EBEEF5;
    padding: 18px 12px;
    p {
      margin: 0;
      flex: 1;
      color: #263446;
      font-weight: 500;
      border-left: 2px solid #0045FF;
      padding-left: 10px;
    }
    .order-o-top-right {
      margin-left:105px;
    }
  }
  .order-o-bottom {
    display: flex;
    margin-top: 18px;
    .order-o-left {
      flex: 1;
      border-right: 2px solid #F2F2F4;
      padding-left: 22px;
      p {
        margin-bottom: 6px;
      }
      .order-title {
        color: #263446;
        .order-look {
          color: #0045FF;
          margin-left: 30px;
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
    .order-o-right {
      flex: 1;
      padding-left: 118px;
      p {
        margin-bottom: 6px;
        .order-copy {
          color: #0045FF;
          margin-left: 30px;
          text-decoration: underline;
          cursor: pointer;
        }
      }
      .order-title {
        color: #263446;
      }
    }
  }
}
</style>

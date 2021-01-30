<template>
  <div class="order-status">
    <div class="order-title">
      订单状态：
      <span class="order-status-text"
       :class="{'order-status-style' : initData.statusCode === '6' || initData.statusCode === '7' || initData.statusCode === '8' || initData.statusCode === '9'}">
       {{initData.statusValue}}
      </span>
    </div>
    <div class="order-content-box">
      <div class="order-c-left">
        <a-timeline>
          <a-timeline-item v-for="(item, index) in dataList.orderProgressList" :key="index">
            <!-- <a-icon slot="dot" type="clock-circle-o" style="font-size: 16px;" /> -->
            <p class="order-c-title">{{item.description}}<span v-if="item.remark" @click="popFun('closeDeal', 'resolution', item.name, item.remark)">查看处理意见</span></p>
            <p class="order-c-time">{{item.createTime}}</p>
          </a-timeline-item>
        </a-timeline>
      </div>
      <div class="order-c-right">
        <!-- 待付款 -->
        <template v-if="initData.statusCode === 'NOTPAID'">
          <div class="order-r-btn">
            <a-button type="primary">手动付款</a-button>
            <a-button class="close-trade order-r-cancel" @click="popFun('closeDeal', 'close')">取消交易</a-button>
            <a-button class="order-r-cancel">修改价格</a-button>
            <a-button icon="reload" type="link" class="order-r-cancel" @click="onReflush">刷新</a-button>
          </div>
          <p class="order-r-p" v-if="(dataList.reserve>0)">
            买家还有
            <a-statistic-countdown class="order-countDown" :value="Date.now() + dataList.reserve" format="D 天 H 时 m 分 s 秒" @finish="onFinish(initData.statusCode)"/>
            支付订单，否则系统将自动关闭订单。
          </p>
          <!-- <p class="order-r-p">客户已付款（线下转账或系统回调延时），可以操作确认付款，如果商品被恶意拍下，您可以后台取消订单哟~</p> -->
        </template>
        <!-- 待发货 -->
        <template v-if="initData.statusCode === 'NOTSHIPPED'">
          <div class="order-r-btn">
            <a-button v-if="initData.status === 'PAID'" type="primary" @click="popFun('comfirmOrder', '', initData.orderItem)">确认订单</a-button>
            <a-button v-if="initData.status === 'CFMED'" type="primary" @click="popFun('comfirmChoice', '', initData.orderItem)">确认备货</a-button>
            <a-button v-if="initData.status === 'NOTAUDITED'" type="primary" @click="popFun('closeDeal', 'reviewOrder')">审核订单</a-button>
            <!-- 确认发货 -->
            <a-button v-if="initData.status === 'AUDITED'" type="primary" @click="popFun('comfirmShipment', '', initData.orderItem)">确认发货</a-button>
            <!-- 已备货 -->
            <a-button v-if="initData.status === 'NOTAUDITED'" class="order-r-cancel" @click="popFun('closeDeal', 'cancelGoods', initData.orderItem)">取消备货</a-button>
            <!-- 未备货 -->
            <a-button v-if="initData.status === 'CFMED'" class="order-r-cancel" @click="popFun('closeDeal', 'cancelOrder', initData.orderItem)">取消订单确认</a-button>
            <a-button v-if="initData.status === 'AUDITED'" class="order-r-cancel" @click="popFun('closeDeal', 'cancelApproval', initData.orderItem)">取消审核订单</a-button>
          </div>
          <p class="order-r-p" v-if="initData.status !== 'PAID'">确认发货需填写物流信息。</p>
        </template>
        <!-- 已发货 -->
        <template v-if="initData.statusCode === 'SHIPPED'">
          <div class="order-r-btn">
            <a-button type="primary" @click="popFun('closeDeal', 'receivingGoods', initData.orderItem)">确认收货</a-button>
            <a-button class="order-r-cancel" @click="popFun('closeDeal', 'modify', initData.orderItem)">修改物流</a-button>
            <a-button type="link" class="order-r-cancel">查看物流信息</a-button>
          </div>
          <p class="order-r-p" v-if="(dataList.reserve>0)">
            买家还有
            <a-statistic-countdown class="order-countDown" :value="Date.now() + dataList.reserve" format="D 天 H 时 m 分 s 秒" @finish="onFinish(initData.statusCode)"/>
            支付订单，否则系统将自动确认收货。
          </p>
        </template>
        <!-- 待提货 -->
        <template v-if="initData.statusCode === 'NOTRECV'">
          <div class="order-r-btn">
            <a-button type="primary">核销提货</a-button>
            <a-button class="close-trade order-r-cancel" @click="popFun('closeDeal', 'cancelGoods', initData.orderItem)">取消备货</a-button>
          </div>
          <p class="order-r-p">需客户提供核销码。</p>
        </template>
        <!-- 已关闭 -->
        <template v-if="initData.statusCode === 'CLOSED'">
          <p>关闭原因：{{dataList.reserve}}</p>
          <p>退款备注：缺货</p>
        </template>
        <!-- 已取消 -->
        <template v-if="initData.statusCode === 'CANCELED'">
          <p>关闭原因：{{dataList.reserve}}</p>
        </template>
      </div>
    </div>
    <!-- 弹窗 -->
    <!-- <close-deal :parentData="initData.parentData" :modalVisible="initData.modalVisible"  @cancel="cancenFun"></close-deal> -->
    <close-deal v-if="initData.modalType === 'closeDeal' && initData.modalVisible" :parentList="initData.dealList" :modalVisible="initData.modalVisible" :parentData="initData.parentData" @cancel="cancenFun" @ok-event="okEvent"></close-deal>
    <!-- 改价 -->
    <order-price-change v-if="initData.modalType === 'orderPriceChange' && initData.modalVisible" :modalVisible="initData.modalVisible" @cancel="goCancel"></order-price-change>
    <!-- 确认订单 -->
    <comfirm-order v-if="initData.modalType === 'comfirmOrder' && initData.modalVisible" :modalList="initData.orderItem" :modalVisible="initData.modalVisible" @cancel="cancenFun" @ok-event="okEvent" @direct="directEvent"></comfirm-order>
    <!-- 确认备货 -->
    <comfirm-choice v-if="initData.modalType === 'comfirmChoice' && initData.modalVisible" :modalList="initData.orderItem" :parentData="initData.parentData" :modalVisible="initData.modalVisible" @cancel="cancenFun" @ok-event="okEvent"></comfirm-choice>
    <!-- 确认发货 -->
    <comfirm-shipment v-if="initData.modalType === 'comfirmShipment' && initData.modalVisible" :modalList="initData.orderItem" :modalVisible="initData.modalVisible" @cancel="cancenFun" @ok-event="okEvent"></comfirm-shipment>
    <!-- 审核订单 -->
    <review-order v-if="initData.modalType === 'reviewOrder' && initData.modalVisible" :modalVisible="initData.modalVisible" @cancel="cancenFun"></review-order>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, onActivated, watch } from '@vue/composition-api'
import closeDeal from '../custom-table/modal-content/close-deal.vue'
import orderPriceChange from '../custom-table/modal-content/order-price-change.vue'
import comfirmOrder from '../custom-table/modal-content/comfirm-order.vue'
import comfirmChoice from '../custom-table/modal-content/comfirm-choice.vue'
import comfirmShipment from '../custom-table/modal-content/comfirm-shipment.vue'
import reviewOrder from '../custom-table/modal-content/review-order.vue'
import {
  cancelOrder,
  cancelAudit,
  cancelStockup,
  cancelConfirm,
  audit,
  finish,
  shipped,
  confirm,
  stockup,
  directShipped
} from '@/api/modules/mall/order-manage/all-order/index';
export default defineComponent({
  props: {
    dataList: {
      type: Object
    },
    goodsId: {
      type: String,
    }
  },
  components: {
    closeDeal,
    orderPriceChange,
    comfirmOrder,
    comfirmChoice,
    comfirmShipment,
    reviewOrder
  },
  setup(props, context) {
    const initData = reactive({
      parentData: {
        title: '', // 子组件弹窗标题
        modalStatus: '' // 子组件弹窗标识
      },
      modalVisible: false,
      orderItem: null, // 单条订单数据从首页过来的
      dealList: { // 处理意见数据
        name: '',
        remark: ''
      },
      modalType: '',
      // 倒计时间
      deadline: Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30,
      statusCode: '2', // 订单状态码
      statusValue: '', // 订单状态值
      status: '', // 订单操作状态
      statusList: {
        status2: '待付款',
        status3: '待发货',
        status4: '已发货',
        status5: '待提货',
        status6: '已完成',
        status7: '已关闭',
        status8: '已取消',
        status9: '已完成(售后中)',
      }
    })
    onMounted(() => {
      getParamUrl();
      // 获取订单首页单条订单数据
      const orderData = (window.localStorage.getItem('orderData') as any);
      if (orderData) {
        (initData.orderItem as any) = JSON.parse(orderData) as any;
      }
    })
    watch(() => props.dataList, (val) => {
      getParamUrl();
    })
    const getParamUrl = () => {
      // (initData as any).statusCode = context.root.$route.query.statusCode || '';
      // 获取userStatus
      const userCode: any = (props.dataList as any) && (props.dataList as any).orderSummary && (props.dataList as any).orderSummary.userStatus;
      (initData as any).statusCode = userCode || '';
      // 获取status
      const status: any = (props.dataList as any) && (props.dataList as any).orderSummary && (props.dataList as any).orderSummary.status;
      (initData as any).status = status || '';
      switch (initData.statusCode) {
        case 'NOTPAID':
          initData.statusValue = initData.statusList.status2;
          break;
        case 'NOTSHIPPED':
          initData.statusValue = initData.statusList.status3;
          break;
        case 'SHIPPED':
          initData.statusValue = initData.statusList.status4;
          break;
        case 'NOTRECV':
          initData.statusValue = initData.statusList.status5;
          break;
        case 'FINISHED':
          initData.statusValue = initData.statusList.status6;
          break;
        case 'CLOSED':
          initData.statusValue = initData.statusList.status7;
          break;
        case 'CANCELED':
          initData.statusValue = initData.statusList.status8;
          break;
        case '9':
          initData.statusValue = initData.statusList.status9;
          break;
      }
    }
    const cancenFun = () => {
      initData.modalVisible = false;
    }
    // 倒计时完成
    const onFinish = (statusCode: string) => {
      if (statusCode === 'SHIPPED') {
        okEvent('receivingGoods');
      } else if (statusCode === 'NOTPAID') {
        okEvent('close');
      }
    }
    // 弹窗事件
    const goModal = (modalStatus: any) => {
      initData.modalVisible = true
      // 关闭交易
      if (modalStatus === 'close') {
        initData.parentData.title = '关闭交易';
        initData.parentData.modalStatus = modalStatus;
      }
      // 确定发货
      if (modalStatus === 'sendGoods') {
        initData.parentData.title = '确定发货';
        initData.parentData.modalStatus = modalStatus;
      }
      // 确认收货
      if (modalStatus === 'receivingGoods') {
        initData.parentData.title = '确定收货';
        initData.parentData.modalStatus = modalStatus;
      }
      // 取消备货
      if (modalStatus === 'cancelGoods') {
        initData.parentData.title = '取消备货';
        initData.parentData.modalStatus = modalStatus;
      }
      // 取消订单确认
      if (modalStatus === 'cancelOrder') {
        initData.parentData.title = '取消订单确认';
        initData.parentData.modalStatus = modalStatus;
      }
      // 确认订单
      if (modalStatus === 'cancelApproval') {
        initData.parentData.title = '取消审核订单';
        initData.parentData.modalStatus = modalStatus;
      }
    }
    // 弹窗事件
    const popFun = (type?: string, modalStatus?: string, orderId?: string, item?: any) => {
      // 获取当前的订单id
      (initData as any).orderId = orderId;
      initData.modalVisible = true
      if (type === 'orderPriceChange') {
        initData.modalType = type
      }
      if (type === 'closeDeal') {
        initData.modalType = type;
        // 关闭交易
        if (modalStatus === 'close') {
          initData.parentData.title = '关闭交易';
          initData.parentData.modalStatus = modalStatus;
        }
        // 确定发货
        if (modalStatus === 'sendGoods') {
          initData.parentData.title = '确定发货';
          initData.parentData.modalStatus = modalStatus;
        }
        // 确认收货
        if (modalStatus === 'receivingGoods') {
          initData.parentData.title = '确定收货';
          initData.parentData.modalStatus = modalStatus;
        }
        // 修改物流
        if (modalStatus === 'modify') {
          initData.parentData.title = '修改物流';
          initData.parentData.modalStatus = modalStatus;
        }
        // 处理意见
        if (modalStatus === 'resolution') {
          initData.parentData.title = '处理意见';
          initData.parentData.modalStatus = modalStatus;
          (initData.dealList as any).name = orderId;
          (initData.dealList as any).remark = item;
        }
        // 撤销审核
        if (modalStatus === 'cancellation') {
          initData.parentData.title = '取消审核';
          initData.parentData.modalStatus = modalStatus;
        }
        // 审核订单
        if (modalStatus === 'reviewOrder') {
          initData.parentData.title = '审核订单';
          initData.parentData.modalStatus = modalStatus;
        }
        // 取消备货
        if (modalStatus === 'cancelGoods') {
          initData.parentData.title = '取消备货';
          initData.parentData.modalStatus = modalStatus;
        }
        // 取消订单确认
        if (modalStatus === 'cancelOrder') {
          initData.parentData.title = '取消订单确认';
          initData.parentData.modalStatus = modalStatus;
        }
        // 取消订单审核
        if (modalStatus === 'cancelApproval') {
          initData.parentData.title = '取消订单审核';
          initData.parentData.modalStatus = modalStatus;
        }
      }
      // 订单确认
      if (type === 'comfirmOrder') {
        initData.modalType = type
      }
      // 确认备货
      if (type === 'comfirmChoice') {
        initData.modalType = type;
        const status: any = modalStatus;
        initData.parentData.modalStatus = status;
      }
      // 确认发货
      if (type === 'comfirmShipment') {
        initData.modalType = type
      }
      // 订单审核
      if (type === 'reviewOrder') {
        initData.modalType = type
      }
    }
    // 弹窗确定
    const okEvent = (modalStatus?: string, remark?: string, recvManner?: string, type?: string) => {
      const body = {
        orderId: props.goodsId,
        remark
      }
      // 交易关闭
      if (modalStatus === 'close') {
        cancelOrderFun(body)
      }
      // 取消审核
      if (modalStatus === 'cancelApproval') {
        cancelAuditFun(body)
      }
      // 取消备货
      if (modalStatus === 'cancelGoods') {
        cancelStockupFun(body)
      }
      // 取消订单确认
      if (modalStatus === 'cancelOrder') {
        cancelConfirmFun(body)
      }
      // 审核订单
      if (modalStatus === 'reviewOrder') {
        auditFun(body)
      }
      // 确认收货
      if (modalStatus === 'receivingGoods') {
        finishFun(body)
      }
      // 确认发货
      if (modalStatus === 'sendGoods') {
        shippedFun(body)
      }
      // 确认订单
      if (modalStatus === 'PAID') {
        // 直接发货
        if ((type as any).type === 'direct') {
          const barcodeSumit: any = recvManner;
          const list: any = type;
          const params = {
            orderId: props.goodsId,
            remark,
            address: list.address,
            city: list.city,
            district: list.district,
            phone: list.phone,
            province: list.province,
            receiver: list.receiver,
            recvManner: list.recvManner,
            express: list.express,
            expNo: list.expNo,
            stockupList: barcodeSumit,
          }
          directShippedFun(params);
        } else {
          const params = {
            orderId: props.goodsId,
            ...(recvManner as any)
          }
          confirmFun(params);
        }
      }
      // 确认发货
      if (modalStatus === 'AUDITED') {
        const params = {
          orderId: props.goodsId,
          express: remark,
          expressNo: recvManner
        }
        shippedFun(params);
      }
      // console.log(initData.modalType);
      if (initData.modalType === 'comfirmOrder' && modalStatus === 'CFMED') {
        const params = {
          orderId: props.goodsId,
          ...(recvManner as any)
        }
        confirmFun(params);
      } else if (modalStatus === 'NOTAUDITED' || modalStatus === 'CFMED') { // 确认备货
        const barcodeSumit: any = recvManner;
        const params = {
          orderId: props.goodsId,
          remark,
          stockupList: barcodeSumit
        }
        stockupFun(params);
      }
      // 修改物流
      if (modalStatus === 'modify') {
        initData.modalVisible = false;
      }
    }
    // 确认订单弹窗-直接发货
    const directEvent = () => {
      popFun('comfirmChoice', 'direct');
    }
    // 关闭交易
    const cancelOrderFun = async (params: any) => {
      const responData = await cancelOrder(params);
      initData.modalVisible = false;
      context.root.$message.success('交易关闭成功');
      // 刷新列表
      context.emit('emit-event');
    }
    // 取消审核
    const cancelAuditFun = async (params: any) => {
      const responData = await cancelAudit(params);
      initData.modalVisible = false;
      context.root.$message.success('取消审核成功');
      // 刷新列表
      context.emit('emit-event');
    }
    // 取消备货
    const cancelStockupFun = async (params: any) => {
      const responData = await cancelStockup(params);
      initData.modalVisible = false;
      context.root.$message.success('取消备货成功');
      // 刷新列表
      context.emit('emit-event');
    }
    // 取消订单确认
    const cancelConfirmFun = async (params: any) => {
      const responData = await cancelConfirm(params);
      initData.modalVisible = false;
      context.root.$message.success('订单取消成功');
      // 刷新列表
      context.emit('emit-event');
    }
    // 审核订单
    const auditFun = async (params: any) => {
      const responData = await audit(params);
      initData.modalVisible = false;
      context.root.$message.success('订单审核成功');
      // 刷新列表
      context.emit('emit-event');
    }
    // 确认收货
    const finishFun = async (params: any) => {
      const responData = await finish(params);
      initData.modalVisible = false;
      context.root.$message.success('收货成功');
      // 刷新列表
      context.emit('emit-event');
    }
    // 确认发货
    const shippedFun = async (params: any) => {
      const responData = await shipped(params);
      context.root.$message.success('发货成功');
      initData.modalVisible = false;
      // 刷新列表
      context.emit('emit-event');
    }
    // 确认订单
    const confirmFun = async (params: any) => {
      const responData = await confirm(params);
      initData.modalVisible = false;
      context.root.$message.success('订单确认成功');
      // 刷新列表
      context.emit('emit-event');
    }
    // 确认备货
    const stockupFun = async (params: any) => {
      const responData = await stockup(params);
      initData.modalVisible = false;
      context.root.$message.success('订单备货成功');
      // 刷新列表
      context.emit('emit-event');
    }
    // 直接发货
    const directShippedFun = async (params: any) => {
      const responData = await directShipped(params);
      initData.modalVisible = false;
      context.root.$message.success('直接发货成功');
      // 刷新列表
      context.emit('emit-event');
    }
    const onReflush = () => {
      context.root.$router.go(0);
    }
    return {
      initData,
      cancenFun,
      popFun,
      okEvent,
      directEvent,
      onFinish,
      onReflush
    }
  }
})
</script>

<style lang="scss" scoped>
.order-status {
 .order-title {
   color: #263446;
   font-size: 14px;
   font-weight: 500;
   margin-bottom: 30px;
   .order-status-text {
     color: #E1163F;
   }
   .order-status-style {
     color: #263446;
   }
  }
  .order-content-box {
    display: flex;
    margin-bottom: 30px;
    .order-c-left {
      width: 280px;
      display: flex;
      justify-content: center;
      margin-left: 30px;
      p {
        margin: 0;
        padding: 0;
      }
      .order-c-title {
        color: #263446;
        font-size: 14px;
        span {
          color: #0045FF;
          text-decoration: underline;
          margin-left: 12px;
          cursor: pointer;
        }
      }
      .order-c-time {
        font-size: 12px;
        color: #80869D;
      }
      ::v-deep .ant-timeline {
        border-right: 3px solid rgba(235,238,245,1);
        padding-right: 60px;
      }
    }
    .order-c-right {
      flex: 1;
      margin-left: 212px;
      .order-r-btn {
        .order-r-cancel {
          margin-left: 16px;
        }
        .close-trade {
          color: #fff;
          background: #FFAD11;
          border-color: #FFAD11;
        }
      }
      .order-r-p {
        color: #80869D;
        margin-top: 30px;
      }
    }
  }
  .order-countDown {
    display: inline-block;
    ::v-deep .ant-statistic-content-value {
      font-size: 14px;
      color: #80869D;
    }
  }
}
</style>

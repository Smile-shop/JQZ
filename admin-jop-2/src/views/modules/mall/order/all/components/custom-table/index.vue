<template>
  <div class="table-content-box">
    <div class="table-wrapper">
      <table class="table">
        <thead class="table-thead">
          <th class="table-thead-mes">商品信息</th>
          <th class="table-thead-">会员</th>
          <th>支付方式</th>
          <th>配送方式</th>
          <th>订单价格</th>
          <th>状态</th>
          <th>操作</th>
        </thead>
        <template v-if="dataList.records && dataList.records.length > 0">
          <tbody class="table-tbody" v-for="(item, index) in dataList.records" :key="index">
            <tr>
              <td class="table-tbody-tdF" colspan="7">
                <div class="table-tbody-tdF-div">
                  <div class="table-tbody-tdF-div-left">
                    <div>订单编号：{{item.number}}</div>
                    <div>下单时间：{{item.createTime}}</div>
                  </div>
                  <div class="table-tbody-tdF-div-left table-tbody-tdF-div-right">
                    <div>订单归属导购：-</div>
                    <div>{{item.storeName}}</div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="table-tbody-goods" v-for="(itm, idx) in item.orderDetailRspVoList" :key="idx">
                  <img class="table-tbody-goods-img" :src="itm.imgUrl" alt="">
                  <div class="table-tbody-goods-msb">
                    <div class="m">
                      <div class="table-tbody-goods-msb-title" :title="itm.title">{{itm.title}} </div>
                      <div class="table-tbody-goods-msb-code" title="条码号：4648793216">条码号：{{itm.barcode ? itm.barcode : '-'}}</div>
                      <div class="table-tbody-goods-msb-size" title="">内部款号:{{itm.styleNo ? itm.styleNo : '-'}}</div>
                      <div class="table-tbody-goods-msb-size" title="">{{itm.category}}</div>
                      <div class="table-tbody-goods-msb-size" title="">规格：<span style="margin-left: 5px" v-for="(data, indexs) in itm.parmJsonList" :key="indexs">{{data}}</span></div>
                    </div>
                    <div class="m">
                      <div class="table-tbody-goods-msb-code">￥{{itm.price}}</div>
                      <div class="table-tbody-goods-msb-size">数量：{{itm.quantity}}</div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="table-tbody-menber">
                <a>{{item.nickName}}{{(item.levelName)}}</a>
                <div>卡号：{{item.cardNo}}</div>
              </td>
              <td class="table-tbody-pay">
                <div>{{item.paymentKindStr}}</div>
              </td>
              <td class="table-tbody-sent">
                <div>{{item.recvMannerStr}}</div>
              </td>
              <td class="table-tbody-price">
                <div class="table-tbody-price-color">运费：{{item.amtDelivery}}</div>
                <div class="table-tbody-price-color">优惠总价：{{item.amtDiscount}}</div>
                <div class="table-tbody-price-color">商品小计：{{item.amtPayment}}</div>
                <div class="table-tbody-price-color">商品总价：{{item.amount}}</div>
              </td>
              <td class="table-tbody-status">
                <div :class="{'table-tbody-status-text' : item.status === 'FINISHED' || item.status === 'CLOSED' || item.status === 'CANCELED' || item.userStatus === 'FINISHED'}">{{item.userStatusStr}}</div>
              </td>
              <td class="table-tbody-btn">
                <a @click="goDetail(item.userStatus, item.id, item.status, item)">查看详情</a><br>
                <a-button v-if="item.userStatus === 'NOTPAID' || item.userStatus === ''" class="btn" size='small' type="primary" @click="goModal('orderPriceChange')">订单改价</a-button>
                <a-button v-if="item.userStatus === 'NOTSHIPPED' && item.status === 'PAID'" class="btn" size='small' type="primary" @click="goModal('comfirmOrder', '', item.id, item)">确认订单</a-button>
                <a-button v-if="item.userStatus === 'NOTSHIPPED' && item.status === 'CFMED'" class="btn" size='small' type="primary" @click="goModal('comfirmChoice', '', item.id, item)">确认备货</a-button>
                <a-button v-if="item.userStatus === 'NOTSHIPPED' && item.status === 'AUDITED'" class="btn" size='small' type="primary" @click="goModal('comfirmShipment', '', item.id, item)">确认发货</a-button>
                <a-button v-if="item.userStatus === 'NOTSHIPPED'&& item.status === 'NOTAUDITED'" class="btn" size='small' type="primary" @click="goModal('closeDeal', 'reviewOrder', item.id)">审核订单</a-button>
                <a-button v-if="item.userStatus === 'SHIPPED'" class="btn" size='small' type="primary" @click="goModal('closeDeal', 'receivingGoods', item.id)">确认收货</a-button>
                <a-button v-if="item.userStatus === 'NOTRECV'" class="btn" size='small' type="primary" @click="goModal('orderPriceChange')">核销收货</a-button>
                <a-button v-if="item.userStatus === 'NOTPAID'" class="btn" size='small' @click="goModal('closeDeal', 'close', item.id)">取消交易</a-button>
                <a-button v-if="item.userStatus === 'NOTSHIPPED' && item.status === 'CFMED'" class="btn" size='small' @click="goModal('closeDeal', 'cancelOrder', item.id)">取消订单确认</a-button>
                <a-button v-if="item.userStatus === 'NOTSHIPPED' && item.status === 'NOTAUDITED' || item.userStatus === 'NOTRECV' && item.status === 'NOTAUDITED'" class="btn" size='small' @click="goModal('closeDeal', 'cancelGoods', item.id)">取消备货</a-button>
                <a-button v-if="item.userStatus === 'NOTSHIPPED' && item.status === 'AUDITED'" class="btn" size='small' @click="goModal('closeDeal', 'cancelApproval', item.id)">取消审核订单</a-button>
              </td>
            </tr>
            <tr>
              <td class="table-tbody-tdF" colspan="7" v-if="item.remark">
                <p class="table-tbody-tdF-remark">买家备注：{{item.remark}}</p>
              </td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody class="table-tbody">
            <tr class="table-no-data">
              <td colspan="7" class="table-no-text">暂无数据</td>
            </tr>
          </tbody>
        </template>
      </table>
    </div>
      <div class="class-div-right">
        <a-pagination
          :total="dataList.totalRecord"
          :show-total="total => `共 ${total}条`"
          show-size-changer show-quick-jumper
          :default-current="1"
          :pageSizeOptions="['10', '20', '30', '40']"
          @change="pageChange"
          @showSizeChange="pageSizeChange"
        />
      </div>
      <!-- 弹窗 -->
      <!-- 人工改价 -->
      <order-price-change v-if="initData.modalType === 'orderPriceChange' && initData.modalVisible" :modalVisible="initData.modalVisible" @cancel="goCancel"></order-price-change>
      <!-- 关闭交易 -->
      <close-deal v-if="initData.modalType === 'closeDeal' && initData.modalVisible" :modalVisible="initData.modalVisible" :parentData="initData.parentData" @cancel="goCancel" @ok-event="okEvent"></close-deal>
      <!-- 确认订单 -->
      <comfirm-order v-if="initData.modalType === 'comfirmOrder' && initData.modalVisible" :modalList="initData.modalList" :modalVisible="initData.modalVisible" @cancel="goCancel" @ok-event="okEvent" @direct="directEvent"></comfirm-order>
      <!-- 确认备货 -->
      <comfirm-choice v-if="initData.modalType === 'comfirmChoice' && initData.modalVisible" :modalList="initData.modalList" :parentData="initData.parentData" :modalVisible="initData.modalVisible" @cancel="goCancel" @ok-event="okEvent"></comfirm-choice>
      <!-- 确认发货 -->
      <comfirm-shipment v-if="initData.modalType === 'comfirmShipment' && initData.modalVisible" :modalList="initData.modalList" :modalVisible="initData.modalVisible" @cancel="goCancel" @ok-event="okEvent"></comfirm-shipment>
      <!-- 审核订单 -->
      <review-order v-if="initData.modalType === 'reviewOrder' && initData.modalVisible" :modalVisible="initData.modalVisible" @cancel="goCancel"></review-order>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api'
import tableContent from './table-content.vue'
import orderPriceChange from './modal-content/order-price-change.vue'
import closeDeal from './modal-content/close-deal.vue'
import comfirmOrder from './modal-content/comfirm-order.vue'
import comfirmChoice from './modal-content/comfirm-choice.vue'
import comfirmShipment from './modal-content/comfirm-shipment.vue'
import reviewOrder from './modal-content/review-order.vue'
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
  // statusCode: NOTPAID：待付款，NOTSHIPPED：待发货，NOTRECV：待提货，
  // SHIPPED：已发货，FINISHED：已完成，CLOSED：已关闭，CANCELED：已取消
  props: {
    statusCode: {
      type: String,
      value: ''
    },
    dataList: {
      type: Object,
    }
  },
  components: {
    orderPriceChange,
    closeDeal,
    comfirmOrder,
    comfirmChoice,
    comfirmShipment,
    reviewOrder
  },
  setup(props, context) {
    const initData = reactive({
      modalVisible: false,
      modalType: '', // 弹窗标识
      modalList: {}, // 弹窗数据
      parentData: {
        title: '', // 子组件弹窗标题
        modalStatus: '' // 子组件弹窗标识
      },
      page: {
        curPage: 1,
        pageSize: 10,
      },
      orderId: '', // 当前的订单id
      selectSendCode: [], // 选择发货条码
    })
    // 订单详情
    const goDetail = (statusCode: string, id: string, status: string, item: any) => {
      // 存储数据
      window.localStorage.setItem('orderData', JSON.stringify(item));
      context.root.$router.push({
        path: 'all/order-detail',
        query: {
          statusCode: statusCode,
          id,
          status
        }
      })
    }
    // 弹窗
    const goModal = (type: string, modalStatus?: string, orderId?: string, item?: any) => {
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
        // 处理意见
        if (modalStatus === 'resolution') {
          initData.parentData.title = '处理意见';
          initData.parentData.modalStatus = modalStatus;
        }
        // 撤销审核
        if (modalStatus === 'cancelApproval') {
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
        initData.modalList = item;
      }
      // 确认备货
      if (type === 'comfirmChoice') {
        initData.modalType = type;
        const status: any = modalStatus;
        initData.parentData.modalStatus = status;
        initData.modalList = item;
      }
      // 确认发货
      if (type === 'comfirmShipment') {
        initData.modalType = type
        initData.modalList = item;
      }
      // 订单审核
      if (type === 'reviewOrder') {
        initData.modalType = type
      }
    }
    // 取消
    const goCancel = () => {
      initData.modalVisible = false;
      initData.orderId = '';
    }
    // 分页页数方法
    const pageChange = (curPage: number, pageSize: number) => {
      (initData as any).page.curPage = { curPage, pageSize }
      context.emit('emit-event', initData.page.curPage);
    }
    // 分页pageSize方法
    const pageSizeChange = (curPage: number, pageSize: number) => {
      (initData as any).page.curPage = { curPage, pageSize }
      context.emit('emit-event', initData.page.curPage);
    }
    // 弹窗组件接收数据方法
    const okEvent = (modalStatus: string, remark: string, recvManner: string, type: string) => {
      const body = {
        orderId: initData.orderId,
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
      // 确认订单-直接发货
      if (modalStatus === 'PAID') {
        // 直接发货
        if ((type as any).type === 'direct') {
          const barcodeSumit: any = recvManner;
          const list: any = type;
          const params = {
            orderId: initData.orderId,
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
            orderId: initData.orderId,
            ...(recvManner as any)
          }
          confirmFun(params);
        }
      }
      // 确认发货
      if (modalStatus === 'AUDITED') {
        const params = {
          orderId: initData.orderId,
          express: remark,
          expressNo: recvManner
        }
        shippedFun(params);
      }
      // 确认备货
      if (modalStatus === 'CFMED') {
        const barcodeSumit: any = recvManner;
        const params = {
          orderId: initData.orderId,
          remark,
          stockupList: barcodeSumit
        }
        stockupFun(params);
      }
    }
    // 确认订单弹窗-直接发货
    const directEvent = (item: any) => {
      goModal('comfirmChoice', 'direct', item.id, item);
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
    return {
      initData,
      goDetail,
      goModal,
      goCancel,
      pageChange,
      pageSizeChange,
      okEvent,
      directEvent
    }
  }
})
</script>

<style lang="scss" scoped>
.table-content-box {
  .table-no-data {
    height: 160px;
    border-bottom: 1px solid #e8e8e8;
    .table-no-text {
      text-align: center;
      color: rgba(0, 0, 0, 0.25);
    }
  }
  .table-wrapper {
    height: 580px;
    overflow-y: auto;
  }
  .table-wrap {
    .ant-table-tbody {
      tr.ant-table-row-level-0 :nth-child(1) {
        display: block;
      }
    }
  }
}
.class-div-right {
  display:flex;
  justify-content: flex-end;
  margin-top: 19px;
}
.table{
  width: 100%;
  word-wrap:bread-word;word-break:break-all;
  &-thead{
    background: #fafafa;
    line-height: 56px;
    th:nth-child(1){
      padding-left: 10px;
      width: 30%;
    }
    th:nth-child(2){
      width: 15%;
    }
    th:nth-child(5){
      width: 15%;
    }
    th:nth-child(7){
      width: 90px;
      padding: 0 10px;
    }
    th{
      overflow-wrap: break-word;
    }
  }
  &-tbody{
    td{
      padding: 10px 0;
    }
    &-tdF{
      line-height: 51px;
      font-size: 14px;
      color: #263446;
      border-bottom: 1px solid #eee;
      border-top: 1px solid #eee;
      box-sizing: border-box;
      padding: 0!important;
      &-div{
        display: flex;
        &-left{
          width: 50%;
          padding: 0 10px;
          display: flex;
          div:nth-child(1){
            width: 220px;
          }
        }
        &-right{
          justify-content: flex-end;
          color: #80869D;
          div:nth-child(1){
            width: 160px;
          }
        }
      }
      &-remark {
        color: #80869D;
        padding-left: 10px;
      }
    }
    &-goods{
      display: flex;
      align-items: center;
      padding: 5px 10px;
      &-img{
        width: 66px;
      }
      &-msb{
        padding-left: 10px;
        flex: 1;
        display: flex;
        align-items: center;
        .m:nth-child(2){
          padding-left: 10px;
          width: 110px;
        }
        .m:nth-child(1){
          flex: 1;
        }
        &-title{
          color: #263446;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        &-code, &-size{
          color: #80869D;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
    }
    &-price{
      &-color{
        color: #80869D;
      }
    }
    &-status{
      color: #E1163F;
      &-text {
        color: #80869D;
      }
    }
    &-btn{
      width: 70px;
      padding: 0 10px;
      text-align: center;
      .btn{
        margin-top: 5px;
      }
    }
  }
}
</style>

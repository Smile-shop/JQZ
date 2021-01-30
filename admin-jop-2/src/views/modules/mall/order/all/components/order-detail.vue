<template>
  <div class="order-detail">
    <!-- 订单状态 -->
    <div class="order-status">
      <order-status :dataList="initData.dataList" :goodsId="initData.goodsId" @emit-event="emitEvent"></order-status>
    </div>
    <!-- 订单概况 -->
    <div class="order-overview">
      <order-overview :dataList="initData.dataList"></order-overview>
    </div>
    <!-- 商品信息 -->
    <div class="goods-info">
      <goods-info :dataList="initData.dataList"></goods-info>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, onActivated } from '@vue/composition-api'
import orderStatus from './order-detail/order-status.vue'
import orderOverview from './order-detail/order-overview.vue'
import goodsInfo from './order-detail/goods-info.vue'
import {
  getDisplayByOrderId
} from '@/api/modules/mall/order-manage/all-order/index';
export default defineComponent({
  components: {
    orderStatus,
    orderOverview,
    goodsInfo
  },
  setup(props, context) {
    const initData = reactive({
      goodsId: '',
      dataList: {
        memberSummary: {

        }
      }
    })
    onMounted(() => {
      getDisplayByOrderIdFun();
    })
    onActivated(() => {
      getDisplayByOrderIdFun();
    })
    // 订单详情请求接口
    const getDisplayByOrderIdFun = async () => {
      const id = (context.root.$route.query.id as any) || ''
      initData.goodsId = id;
      initData.dataList = await getDisplayByOrderId(id);
    }
    // 子组件事件
    const emitEvent = () => {
      getDisplayByOrderIdFun();
    }
    return {
      initData,
      emitEvent
    }
  }
})
</script>

<style lang="scss" scoped>
.order-detail {
  height: 100%;
  background: #ffffff;
  padding: 34px 20px;
  box-sizing: border-box;
}
</style>

<template>
  <div class="order-price-change">
    <a-modal
      title="订单改价"
      :visible="modalVisible"
      width="90%"
      centered
      @cancel="cancel"
    >
      <a-table :columns="initData.columns" :data-source="initData.data" :pagination="false">
        <span slot="goodsInfo" slot-scope="record">
            <div class="order-name-box">
              <img class="table-tbody-goods-img" :src="record.goodsInfo.icon" alt="">
              <div class="order-right-box">
                <p class="title">{{record.goodsInfo.title}}</p>
                <p class="code">条码号：59988393</p>
              </div>
            </div>
        </span>
        <span slot="changePrice" slot-scope="record">
          <a-input class="order-input" :value="record.changePrice" placeholder="请输入金额"/>
        </span>
      </a-table>
      <!-- 表尾巴 -->
      <div class="order-footer">
        <div class="order-f-box">
          <p>商品小计: 4800</p>
          <p>线上优化总价: 4800</p>
          <p>人工改价（总）: 4800</p>
          <p>订单运费: 4800</p>
          <p>订单运费总额: <span class="order-f-price">￥4900.00</span></p>
        </div>
      </div>
      <template slot="footer">
        <div class="order-f-button">
          <a-button @click="cancel">取消</a-button>
          <a-button @click="okMethod" type="primary">确认改价</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api';
export default defineComponent({
  props: {
    modalVisible: {
      type: Boolean,
    }
  },
  setup(props, context) {
    const initData = reactive({
      columns: [
        {
          key: 'goodsInfo',
          title: '商品',
          scopedSlots: { customRender: 'goodsInfo' },
        },
        {
          key: 'number',
          title: '数量',
          dataIndex: 'number',
        },
        {
          key: 'price',
          title: '单价',
          dataIndex: 'price',
        },
        {
          key: 'allPrice',
          title: '原总价',
          dataIndex: 'allPrice',
        },
        {
          key: 'discountPrice',
          title: '已优惠金额',
          dataIndex: 'discountPrice',
        },
        {
          key: 'changePrice',
          title: '人工改价',
          scopedSlots: { customRender: 'changePrice' },
        },
        {
          key: 'allChangePrice',
          title: '改价后总价',
          dataIndex: 'allChangePrice',
        },
        {
          key: 'discountRate',
          title: '实际折扣率',
          dataIndex: 'discountRate',
        }],
      data: [
        {
          key: '1',
          goodsInfo: { icon: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3916743799,2744069233&fm=26&gp=0.jpg', title: 'au950 黄金戒指' },
          goodsCode: [{ title: '条码号', value: '59988393' }, { title: '外部款号', value: '3343434' }, { title: '内部款号', value: '3784423' }],
          number: 1000,
          price: 5000,
          allPrice: 5000,
          changePrice: 30,
          allChangePrice: 4800,
          discountRate: '90%'
        }
      ],
    })
    // 取消
    const cancel = () => {
      context.emit('cancel');
    }
    // 确认
    const okMethod = () => {
      context.emit('cancel');
    }
    return {
      initData,
      cancel,
      okMethod
    }
  }
})
</script>

<style lang="scss" scoped>
.order-name-box {
  display: flex;
  .table-tbody-goods-img{
    width: 60px;
    height: 60px;
  }
  .order-right-box {
    flex: 1;
    margin-left: 8px;
    .title {
      color:#263446;
    }
  }
}
.goods-info{
    margin-top: 20px;
}

.table-start{
  margin-top: 10px;
  display: -webkit-flex; /* Safari */
  display: flex;
  justify-content: space-between;
}
.order-input {
  width: 156px;
}
.order-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  .order-f-box {
    .order-f-price {
      color: #E1163F;
    }
  }
}
.order-f-button {
  display: flex;
  justify-content: center;
}
</style>

<template>
  <div class="goods-info">
    <a-table :columns="tableData.columns" :data-source="tableData.data" :pagination="false">
      <span slot="goodsInfo" slot-scope="record">
          <img class="table-tbody-goods-img" :src="record.goodsInfo.icon" alt="">
          <span class="table-tbody-text">{{record.goodsInfo.title}}</span>
      </span>
      <span slot="goodsStyle" slot-scope="record">
          <div v-for="(item, index) in record.goodsStyle" :key="index">
            <span>{{item.title}}: </span><span>{{item.value}}</span>
            <br/>
          </div>
      </span>
      <span slot="goodsCode" slot-scope="record">
          <div v-for="(item, index) in record.goodsCode" :key="index">
            <span>{{item.title}}: </span><span>{{item.value}}</span>
            <br/>
          </div>
      </span>
      <span slot="parameter" slot-scope="record">
          <div v-for="(item, index) in record.parameter" :key="index">
            <!-- <span>{{item.title}}: </span><span>{{item.value}}</span> -->
            <span>{{item}}</span>
            <br/>
          </div>
      </span>
      <span slot="discount" slot-scope="record">
          <div v-for="(item, index) in record.discount" :key="index">
            <span>{{item.title}}: </span><span>{{item.value}}</span>
            <br/>
          </div>
      </span>
    </a-table>
    <div class="table-start">
      <div>订单备注：{{dataList.remark}}</div>
      <div style="margin-bottom: 20px;">
        <div v-for="(item, index) in tableData.goodsCountInfo" :key="index">
          <span>{{item.title}}: </span><span>{{item.value}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, watch } from '@vue/composition-api'
export default defineComponent({
  props: {
    dataList: {
      type: Object,
      default: {
        orderDetailList: []
      }
    }
  },
  setup(props, context) {
    const tableData = reactive({
      list: [],
      goodsSubtotal: '', // 小计
      columns: [
        {
          key: 'goodsInfo',
          title: '商品信息',
          scopedSlots: { customRender: 'goodsInfo' },
        },
        {
          key: 'goodsStyle',
          title: '款式',
          scopedSlots: { customRender: 'goodsStyle' },
        },
        {
          key: 'goodsCode',
          title: '编码',
          scopedSlots: { customRender: 'goodsCode' },
        },
        {
          key: 'parameter',
          title: '参数',
          scopedSlots: { customRender: 'parameter' },
        },
        {
          key: 'price',
          title: '单价',
          dataIndex: 'price',
        },
        {
          key: 'number',
          title: '数量',
          dataIndex: 'number',
        },
        {
          key: 'allPrice',
          title: '原总价',
          dataIndex: 'allPrice',
        },
        {
          key: 'discount',
          title: '折扣信息',
          scopedSlots: { customRender: 'discount' },
        },
        {
          key: 'discountPrice',
          title: '折扣价格',
          dataIndex: 'discountPrice',
        },
        {
          key: 'static',
          title: '状态',
          dataIndex: 'static',
        },
        {
          key: 'operation',
          title: '操作',
          dataIndex: 'operation',
        }
      ],
      data: [],
      goodsCountInfo: [] as any
    })
    onMounted(() => {
    })
    watch(() => props.dataList.orderDetailList, (value) => {
      tableData.list = value;
      getList();
    });
    watch(() => props.dataList.goodsSubtotal, (value) => {
      tableData.goodsSubtotal = value;
      tableData.goodsCountInfo = [
        { title: '商品小计', value: '￥' + tableData.goodsSubtotal || '0.00' }, { title: '运费', value: '￥0.00' }, { title: '优惠总价', value: '￥0.00' }, { title: '人工改价', value: '￥0.00' }, { title: '订单总价', value: '￥0.00' }
      ]
    });
    function getList() {
      const userCode: any = (props.dataList as any) && (props.dataList as any).orderSummary && (props.dataList as any).orderSummary.userStatusStr;
      (tableData.data as any) = tableData.list ? tableData.list.map((item: any, index: any) => {
        const paramJson = item.parmJsonKVList ? item.parmJsonKVList.map((itm: any, idx: any) => {
          return {
            title: itm
          }
        }) : [];
        return {
          key: index,
          goodsInfo: {
            icon: item.imgUrl,
            title: item.title
          },
          goodsStyle: [{
            title: '珠宝类别',
            value: item.goodsKindName,
          }, {
            title: '分类',
            value: item.category ? item.category : '-'
          }],
          goodsCode: [{ title: '条码号', value: item.barcode ? item.barcode : '-' }, { title: '外部款号', value: item.styleOutNo ? item.styleOutNo : '-' }, { title: '内部款号', value: item.styleNo ? item.styleNo : '-' }],
          // parameter: [{ title: '成色', value: '-' }, { title: '下单重量', value: '-' }, { title: '实际重量', value: '-' }],
          parameter: item.parmJsonKVList,
          price: item.price,
          number: item.quantity,
          allPrice: item.amount,
          discount: [{ title: '折扣率抵扣', value: '0.00' }, { title: '优惠券', value: '0.00' }],
          discountPrice: `￥${item.amtDiscount}`,
          static: userCode,
        }
      }) : []
    }
    return {
      tableData
    }
  }
})
</script>

<style lang="scss" scoped>
.goods-info{
  margin-top: 20px;
}
.table-tbody-goods-img{
  width: 66px;
}
.table-tbody-text {
  margin-left: 8px;
}
.table-start{
  margin-top: 10px;
  display: -webkit-flex; /* Safari */
  display: flex;
  justify-content: space-between;
}
</style>

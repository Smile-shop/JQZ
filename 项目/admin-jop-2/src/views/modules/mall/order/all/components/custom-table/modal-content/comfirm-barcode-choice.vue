<template>
  <div>
 <a-modal
      title="选择发货条码"
      :visible="modalVisible"
      width="40%"
      centered
      @cancel="cancel"
      :pagination="false"
      :footer="null"
    >
      <div class="order-f-button">
          <div>需要数量：{{goodsNumber}} 已选数量：{{initData.selectedRows.length ? initData.selectedRows.length : 0}}</div>
          <div class="selectmode"><a-input v-model="initData.goodsCode" placeholder="请输入条码号"/><a-button @click="goSearch" type="primary" style="margin-left:10px">搜索</a-button></div>
      </div>
      <a-table :columns="initData.columns" :data-source="initData.data" :pagination="false" :row-selection="comChange">
      </a-table>
        <div class="order-f-button">
            <!-- <div class="order-tips">货品条码：887382398724，出现异常，请重新选择条码</div> -->
            <div class="order-btn">
                <a-button @click="cancel">取消</a-button>
                <a-button @click="okMethod" type="primary" style="margin-left:10px">确认</a-button>
            </div>
        </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, reactive, watch } from '@vue/composition-api';
import {
  querySkuGoodsStock,
} from '@/api/modules/mall/order-manage/all-order/index';
export default defineComponent({
  props: {
    modalVisible: {
      type: Boolean,
    },
    skuId: {
      type: String
    },
    goodsId: {
      type: String
    },
    goodsNumber: {
      type: Number
    }
  },
  setup(props, context) {
    const initData = reactive({
      selectedRows: [],
      isDisable: false,
      columns: [
        {
          key: 'key',
          title: '序号',
          dataIndex: 'key',
        },
        {
          key: 'goodsInfo',
          title: '货品名称',
          dataIndex: 'goodsInfo',

        },
        {
          key: 'goodsCode',
          title: '货品条码',
          dataIndex: 'goodsCode',
        },
        {
          key: 'number',
          title: '货品库存',
          dataIndex: 'number',
        },
        {
          key: 'selnumber',
          title: '已选数',
          dataIndex: 'selnumber',
        }
      ],
      goodsCode: undefined,
      data: [
        {
          key: '1',
          goodsInfo: '',
          goodsCode: '',
          number: 0,
          selnumber: 0,
          id: '',
          isSelect: false
        }
      ],
    });
    onMounted(() => {
    })
    watch(() => props.modalVisible, (val) => {
      if (props.modalVisible) {
        querySkuGoodsStockFun();
      }
    })
    // 查询sku关联的货品信息列表
    const querySkuGoodsStockFun = async (barcode?: string) => {
      const params = {
        barcode: barcode,
        goodsId: '',
        goodsName: '',
        id: '',
        skuId: props.skuId,
        stock: null
      }
      const responData = await querySkuGoodsStock(params);
      initData.data = responData.map((item: any, index: number) => {
        return {
          key: index + 1,
          goodsInfo: item.goodsName,
          goodsCode: item.barcode,
          number: item.stock,
          selnumber: initData.selectedRows.length ? initData.selectedRows.length : 0,
          id: props.skuId,
          isSelect: false,
          goodsId: item.goodsId
        }
      })
    }
    // 搜索
    const goSearch = () => {
      querySkuGoodsStockFun(initData.goodsCode);
    }
    // 取消
    const cancel = () => {
      context.emit('cancel');
    }
    // 确认
    const okMethod = () => {
      if (initData.selectedRows.length === 0) {
        context.root.$message.warning('请选择发货条码')
      } else if (initData.selectedRows.length > (props.goodsNumber as any)) {
        context.root.$message.warning('已选数量不能大于需要数量')
      } else if (initData.selectedRows.length < (props.goodsNumber as any)) {
        context.root.$message.warning('已选数量不能小于需要数量')
      } else {
        context.emit('emit-event', initData.selectedRows, props.goodsId);
        context.emit('cancel');
      }
    }
    const comChange = computed(() => {
      return rowSelection
    })
    const rowSelection = {
      onChange: (selectedRowKeys :any, selectedRows:any) => {
        console.log(selectedRowKeys)
        initData.selectedRows = selectedRows;
        initData.data.map((item: any, index: any) => {
          if (initData.selectedRows.length > 0) {
            if (item.key === selectedRowKeys[index]) {
              // 如果需要数量大于库存数量的时候，取库存数量
              if ((props.goodsNumber as any) >= initData.data[index].number) {
                initData.data[index].selnumber = initData.data[index].number;
              } else {
                initData.data[index].selnumber = (props.goodsNumber as any);
              }
              initData.data[index].isSelect = true;
            }
          } else {
            initData.data[index].selnumber = 0;
            initData.data[index].isSelect = false;
          }
        })
      },
      onSelect: (record: any, selected: any, selectedRows: any, nativeEvent: any) => {
        console.log(record)
        initData.data.map((item: any, index: any) => {
          if (selected) {
            if (item.key === record.key) {
              // 如果需要数量大于库存数量的时候，取库存数量
              if ((props.goodsNumber as any) >= initData.data[index].number) {
                initData.data[index].selnumber = initData.data[index].number;
              } else {
                initData.data[index].selnumber = (props.goodsNumber as any);
              }
              initData.data[index].isSelect = true;
            }
          } else {
            record.selnumber = 0;
            initData.data[index].isSelect = false;
          }
        })
        const arr = initData.data.filter(item => !item.isSelect);
        arr.map((item: any, index: any) => {
          if (initData.selectedRows.length === (props.goodsNumber as any)) {
            item.isSelect = true;
          } else {
            item.isSelect = false;
          }
        })
      },
      getCheckboxProps: (record: any) => ({
        props: {
          disabled: record.isSelect, // Column configuration not to be checked
        },
      }),
    }
    return {
      initData,
      cancel,
      okMethod,
      rowSelection,
      goSearch,
      comChange
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
  justify-content: space-between;
}
.order-tips{
    margin: 20px;
    font-size:14px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(225,22,63,1);
}
.order-btn{
  margin: 20px;
}
.selectmode{
display: flex;
}
</style>

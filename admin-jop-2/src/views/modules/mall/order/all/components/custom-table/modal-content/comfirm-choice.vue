<template>
  <div class="comfirm-choice">
    <a-modal
      :pagination="false"
      :visible="modalVisible"
      width="65%"
      centered
      @cancel="goCancel"
    >
      <a-table :columns="tableData.columns" :data-source="tableData.data" :pagination="false">
        <span slot="goodsInfo" slot-scope="record">
          <img class="table-tbody-goods-img" :src="record.goodsInfo.icon" alt="">
          <span style="margin-left: 10px;">{{record.goodsInfo.title}}</span>
        </span>
        <span slot="goodsStyle" slot-scope="record">
          <div v-for="(item, index) in record.goodsStyle" :key="index">
            <span>{{item}}</span>
            <br/>
          </div>
        </span>
        <span slot="goodsCode" slot-scope="record">
          <template v-if="record.goodsCode.length > 0">
            <div v-for="(item, index) in record.goodsCode" :key="index">
              <span>{{item.goodsCode}}</span>
              <br/>
            </div>
          </template>
          <span v-else>-</span>
        </span>
        <span slot="static" slot-scope="record">
          <span :style="{color: record.static === '未选择' ? '#E1163F' : ''}">{{record.static}}</span>
        </span>
        <span slot="operation" slot-scope="record">
             <a @click="goBarcodeOk(record.skuId, record.id, record.number)">{{record.operation}}</a>
        </span>
      </a-table>
      <div class="form-div">
        <a-form-model
          ref="queryFormModel"
          v-bind="tableData.layout"
          >
          <div class="form-flex-wrapper">
            <div class="form-flex-left">
              <a-form-model-item label="处理意见:">
                <div class="c-textarea-box">
                  <textarea class="c-textarea" v-model="tableData.form.remark" maxlength="400" placeholder="请添加处理意见" rows="2" @keyup="keyEvent"></textarea>
                  <span class="c-textarea-number"><span>{{tableData.textareaNumber}}</span>/400</span>
                </div>
              </a-form-model-item>
            </div>
            <div class="form-flex-right" v-if="parentData.modalStatus === 'direct'">
              <a-form-model-item label="物流信息：">
                <a-select placeholder="选择快递" style="width:110px" v-model="tableData.form.express">
                  <a-select-option :value="item.value" v-for="(item, index) in tableData.allExpressList" :key="index">
                    {{item.label}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="物流单号：">
                <a-input placeholder="请输入单号" v-model="tableData.form.expNo"/>
              </a-form-model-item>
            </div>
          </div>
        </a-form-model>
      </div>
      <!-- 表尾巴 -->
      <template slot="footer">
        <a-button  @click="goCancel">取消</a-button>
        <a-button type="primary"  @click="goOk('direct')" v-if="parentData.modalStatus === 'direct'">确认发货</a-button>
        <a-button type="primary"  @click="goOk" v-else>确认备货</a-button>
      </template>
    </a-modal>
    <!-- 弹窗 -->
    <close-deal :parentData="tableData.parentData" :modalVisible="tableData.modalVisible"  @cancel="cancenFun" @ok-event="okEventFun"></close-deal>
    <comfirm-barcode-choice :modalVisible="tableData.modalBarcodeVisible" :goodsNumber="tableData.goodsNumber" :skuId="tableData.skuId" :goodsId="tableData.goodsId"  @cancel="cancenFun" @emit-event="emitEvent"></comfirm-barcode-choice>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, reactive } from '@vue/composition-api';
import closeDeal from './close-deal.vue'
import comfirmBarcodeChoice from './comfirm-barcode-choice.vue'
import {
  getStockupByOrderId,
} from '@/api/modules/mall/order-manage/all-order/index';

export default defineComponent({
  components: {
    closeDeal,
    comfirmBarcodeChoice
  },
  props: {
    modalVisible: {
      type: Boolean,
    },
    parentData: {
      type: Object
    },
    modalList: {
      type: Object
    }
  },
  setup(props, context) {
    const tableData = reactive({
      textareaNumber: 0,
      parentData: {
        title: '确定发货', // 子组件弹窗标题
        modalStatus: 'sendGoods', // 子组件弹窗标识
        type: 'direct' // 直接发货标识
      },
      modalVisible: false,
      modalBarcodeVisible: false,
      barcodeList: [],
      barcodeSumit: [] as any, // 条码提交的数据
      skuId: '',
      goodsId: '',
      goodsNumber: 0, // 已选数量
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      },
      form: {
        remark: '',
        express: null,
        expNo: '',
      },
      columns: [
        {
          key: 'goodsInfo',
          title: '商品',
          scopedSlots: { customRender: 'goodsInfo' },
        },
        {
          key: 'goodsStyle',
          title: '规格',
          scopedSlots: { customRender: 'goodsStyle' },
        },
        {
          key: 'number',
          title: '数量',
          dataIndex: 'number',
        },
        {
          key: 'goodsCode',
          title: '货品条码',
          scopedSlots: { customRender: 'goodsCode' },
        },
        {
          key: 'static',
          title: '状态',
          scopedSlots: { customRender: 'static' },
        },
        {
          key: 'operation',
          title: '操作',
          scopedSlots: { customRender: 'operation' },
        }],
      // data: [
      //   {
      //     key: '1',
      //     goodsInfo: { icon: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3916743799,2744069233&fm=26&gp=0.jpg', title: 'au950 黄金戒指' },
      //     goodsStyle: [{ title: '珠宝类别', value: '首饰' }, { title: '大类', value: '黄金类' }, { title: '小类', value: '戒指' }],
      //     goodsCode: [{ title: '条码号', value: '59988393' }, { title: '外部款号', value: '3343434' }, { title: '内部款号', value: '3784423' }],
      //     number: 1000,
      //     static: '待付款',
      //     operation: '选择发货条码'
      //   }
      // ],
      data: [] as any,
      allExpressList: [
        {
          label: '顺丰快递',
          value: '1'
        },
        {
          label: '圆通快递',
          value: '2'
        },
        {
          label: '天天快递',
          value: '3'
        },
        {
          label: '中通快递',
          value: '4'
        }
      ]
    })
    onMounted(() => {
      getStockupByOrderIdFun();
    })
    // 备货条码选择
    const emitEvent = (item: any, ids: string) => {
      tableData.barcodeList = item;
      const data = item;
      const id = ids;
      if (data.length === 0) {
        return
      }
      (tableData.data as any).map((item: any, index: number) => {
        if (item.id === id) {
          tableData.data[index].static = '已选择';
          tableData.data[index].goodsCode = data;
        }
      })
      // 获取确定发货的参数数据
      tableData.barcodeSumit = tableData.data.filter((item: any) => item.static === '已选择').map((item: any) => {
        const arr = item.goodsCode.map((itm: any) => {
          return {
            goodsId: itm.goodsId,
            goodsNum: itm.selnumber
          }
        });
        return {
          goodsInfo: arr,
          orderDetailId: item.id
        }
      })
    }
    // 根据订单ID获取订单备货列表
    const getStockupByOrderIdFun = async () => {
      const id = (props.modalList as any).id || '';
      const responData = await getStockupByOrderId(id);
      tableData.data = responData.map((item: any, index: number) => {
        return {
          key: index + 1,
          goodsInfo: {
            icon: item.imgUrl,
            title: item.title
          },
          goodsStyle: item.parmJson,
          goodsCode: [],
          number: item.quantity,
          static: '未选择',
          operation: '选择发货条码',
          skuId: item.skuId,
          id: item.id
        }
      })
    }
    const goCancel = () => {
      context.emit('cancel');
    };
    const cancenFun = () => {
      tableData.modalVisible = false;
      tableData.modalBarcodeVisible = false;
    }
    // 确认发货
    const goOk = (type?: string) => {
      const arr = tableData.data.filter((item: any) => item.static === '未选择');
      if (arr.length > 0) {
        context.root.$message.warning('存在未选择条码的商品，无法发货');
        return
      }
      tableData.modalVisible = true;
      if (type === 'direct') {
        tableData.parentData.title = '确定发货';
        tableData.parentData.modalStatus = 'sendGoods'
        tableData.parentData.type = 'direct'
      } else {
        tableData.parentData.title = '确定备货';
        tableData.parentData.modalStatus = 'okGoods'
      }
    }
    const goBarcodeOk = (skuId: string, goodsId: string, goodsNumber: number) => {
      tableData.modalBarcodeVisible = true;
      tableData.skuId = skuId;
      tableData.goodsId = goodsId;
      tableData.goodsNumber = goodsNumber;
    }
    // textarea事件
    const keyEvent = (e: any) => {
      tableData.textareaNumber = (e.target.value).length;
    }
    // 二次弹窗确定
    const okEventFun = (item: any, remark: string, type: string) => {
      // 增加直接发货类型标识
      (props.modalList as any).type = type;
      (props.modalList as any).express = tableData.form.express;
      (props.modalList as any).expNo = tableData.form.expNo;
      context.emit('ok-event', (props.modalList as any).status, tableData.form.remark, tableData.barcodeSumit, props.modalList);
      console.log((props.modalList as any).status)
    }
    return {
      tableData,
      goCancel,
      keyEvent,
      cancenFun,
      goOk,
      goBarcodeOk,
      okEventFun,
      emitEvent
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
.table-start{
    margin-top: 10px;
    display: -webkit-flex; /* Safari */
    display: flex;
    justify-content: space-between;
}
.btn-foop{
  margin-top: 20px;
}
.form-div{
  margin-top: 20px;
}
.form-flex-wrapper {
  display: flex;
  .form-flex-left {
    flex: 1;
  }
  .form-flex-right {
    flex: 1;
  }
}
.c-textarea-box {
  position: relative;
  .c-textarea {
    padding-left: 12px;
    width: 100%;
    border-radius:2px;
    border:1px solid rgba(214,221,236,1);
    -moz-user-select:none; /*火狐*/
    -webkit-user-select:none; /*webkit浏览器*/
    -ms-user-select:none; /*IE10*/
    -khtml-user-select:none; /*早期浏览器*/
    user-select:none;
  }
  .c-textarea-number {
    position: absolute;
    bottom: 8px;
    right: 8px;
    color: #C0C6D1;
  }
}
</style>

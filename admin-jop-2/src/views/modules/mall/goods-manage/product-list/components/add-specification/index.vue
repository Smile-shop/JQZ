<template>
<div>
    <a-modal
      centered
      title="添加货品首饰"
      :visible="visible"
      width="95%"
      :footer="null"
      @cancel="onCloseHallder"
    >
    <div class="add-specifi">
        <search-header :v-if="initData.spuObj" :spuObj="initData.spuObj" @onSearhClick="onSearhClick"></search-header>
        <!-- 表格 -->
        <div class="add-table">
          <div class="add-left">
            <a-table
            rowKey="key"
            :row-selection="{ selectedRowKeys: initData.selectedRowKeys, onChange: onSelectChange }"
            :columns="initData.columns"
            :data-source="initData.tableData"
            :pagination="false"
            :scroll="{ y: 480 }"
            >
              <span slot="goodsName"  slot-scope="text, record">
                <div class="name-box">
                  <img class="name-img" :src="record.imgUrl" alt="">
                  <div class="name-right">
                    <p class="name-p1">{{record.name}}</p>
                  </div>
                </div>
              </span>
               <span slot="price" slot-scope="text, record">
                <div class="goodInfo-box">
                  <p>¥{{record.price}}</p>
                </div>
              </span>
               <span slot="goodInfo" slot-scope="text, record">
                <div class="goodInfo-box">
                  <p>内部款号：{{record.styleNo}}</p>
                  <p>条码号：{{record.barcode}}</p>
                </div>
              </span>
              <span slot="param"  slot-scope="text, record">
                <div style="display: flex;">
                  <span class="goodInfo-box">
                    <p>手   寸：{{record.size}}{{record.sizeUnit}}</p>
                    <p>主石重：{{record.mstnWt}}</p>
                    <p>总件重：{{record.totalWt}}</p>
                  </span>
                  <template v-if="record.mainStonePropList.length>0">
                     <span class="goodInfo-box" style="margin-left:20px">
                        <p>主石净度：{{record.mainStonePropList[0].color}}</p>
                        <p>主石颜色：{{record.mainStonePropList[0].clarity}}</p>
                      </span>
                  </template>
                </div>
              </span>
              <span slot="isAdd" slot-scope="text, record">
                  <p>{{(initData.selectData.findIndex((item) => item.key === record.key) !=-1)? "已添加":"—"}}</p>
              </span>
              <span slot="action" slot-scope="text, record">
                <a-button type="link" @click="()=>{addGoodItem(record.key)}">加入商品</a-button>
              </span>
            </a-table>
            <div class="class-footer">
              <div class="class-div-left">
                <a-checkbox @change="onChange" :checked="initData.isChecked">
                  全选
                </a-checkbox>
                <a-button @click="addGood">添加到已选商品</a-button>
              </div>
              <div class="class-div-right">
                <a-pagination
                  :total="initData.totalRecord"
                  :show-total="total => `共 ${total}条`"
                  show-size-changer show-quick-jumper
                  :default-current="1"
                  :defaultPageSize="initData.pageSize"
                  @change="onPageChange"
                  @showSizeChange="onChangeSize"
                  :pageSizeOptions="['5', '10', '15', '20']"
                />
              </div>
            </div>
          </div>
          <div class="add-right">
            <select-product :maxGoodsPrice="initData.maxGoodsPrice" :minGoodsPrice="initData.minGoodsPrice" :selectData="initData.selectData" @onClearAllSelect="onClearAllSelectHander" @onDelectHandler="onDelectHandler" @onSaveAllSelect="onSaveAllSelect"></select-product>
          </div>
        </div>
      </div>
    </a-modal>
</div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from '@vue/composition-api'
import PageTable from '@/layout/page-table.vue';
import searchHeader from './search-header.vue';
import selectProduct from './select-product.vue';
import {
  addSkuGoods,
  queryGoodsInitDataIndex,
  queryGoodsPage
} from '@/api/modules/mall/goods-manage/product-list/index';
export default defineComponent({
  props: {
    spuId: {
      type: String,
      value: ''
    },
    skuId: {
      type: String,
      value: ''
    },
    skuImgUrlList: {
      type: Array,
      value: []
    },
    visible: {
      type: Boolean,
      value: false
    }
  },
  components: {
    PageTable,
    searchHeader,
    selectProduct
  },
  setup(props, context) {
    const initData = reactive({
      isChecked: false, // 全选反选
      newData: [],
      curPage: 1,
      pageSize: 5,
      totalRecord: 0,
      maxGoodsPrice: 0,
      minGoodsPrice: 0,
      selectedRowKeys: [],
      selectData: []as any[],
      spuObj: {} as any,
      goodData: {} as any,
      columns: [
        {
          title: '序号',
          dataIndex: 'seq',
          key: 'seq',
        },
        {
          title: '商品名称',
          dataIndex: 'goodsName',
          key: 'goodsName',
          scopedSlots: { customRender: 'goodsName' },
        },
        {
          title: '分类',
          key: 'cateName',
          dataIndex: 'cateName',
        },
        {
          title: '商品信息',
          key: 'goodInfo',
          scopedSlots: { customRender: 'goodInfo' },
        },
        {
          title: '参数',
          key: 'param',
          scopedSlots: { customRender: 'param' },
        },
        {
          title: '价格',
          key: 'price',
          scopedSlots: { customRender: 'price' },
        },
        {
          title: '添加状态',
          key: 'isAdd',
          scopedSlots: { customRender: 'isAdd' },
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      tableData: [] as any,
    });
    onMounted(() => {
      if (props.skuId !== '') {
        queryGoodsInitData(props.skuId);
      }
    });
    const queryGoodsInitData = async (id:any) => {
      const spuObj = await queryGoodsInitDataIndex(id);
      if (spuObj) {
        initData.spuObj = spuObj;
        initData.maxGoodsPrice = spuObj.maxGoodsPrice;
        initData.minGoodsPrice = spuObj.minGoodsPrice;
        const goodData = await queryGoodsPage({ spuId: props.spuId, curPage: initData.curPage, pageSize: initData.pageSize, goodsKind: initData.spuObj.goodsKind });
        initData.goodData = goodData;
        initData.totalRecord = goodData.totalRecord;
        initData.tableData = goodData.records.map((item:any, index:number) => {
          return Object.assign({ key: item.id, seq: (index + 1) + (initData.curPage - 1) * initData.pageSize }, item);
        });
      }
    };
    // 表格复选框
    const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
      initData.newData = selectedRows;
      initData.selectedRowKeys = selectedRowKeys;
      if (initData.selectedRowKeys.length === initData.tableData.length) {
        initData.isChecked = true;
      } else {
        initData.isChecked = false;
      }
    }
    // 自定义全选
    const onChange = (e: any) => {
      if (e.target.checked) {
        initData.isChecked = true;
        const idlist:any = initData.tableData.map((item:any) => { return item.key });
        (initData as any).selectedRowKeys = idlist;
      } else {
        initData.isChecked = false;
        initData.selectedRowKeys = [];
      }
    }
    const addGoodItem = (key:string) => {
      const target = initData.tableData.filter((item:any) => key === item.key)[0];
      if (target) {
        const index = initData.selectData.findIndex((item:any) => item.key === target.key);
        if (index === -1) {
          const data:any = JSON.parse(JSON.stringify(target));
          initData.selectData.unshift(data);
        }
        getGoodPrice();
      }
    }
    const getGoodPrice = () => {
      let min:number = 0;
      let max:number = 0;
      initData.selectData.map((item, index) => {
        if (index === 0) {
          min = item.price;
        }
        min = Math.min(min, item.price);
        max = Math.max(max, item.price);
      });
      initData.maxGoodsPrice = max;
      initData.minGoodsPrice = min;
    }
    // 已选商品按钮
    const addGood = () => {
      initData.selectedRowKeys.forEach((key:string) => {
        const target = initData.tableData.filter((item:any) => key === item.key)[0];
        if (target) {
          const index = initData.selectData.findIndex((item:any) => item.key === target.key);
          if (index === -1) {
            const data:any = JSON.parse(JSON.stringify(target));
            initData.selectData.unshift(data);
          }
        }
      });
      getGoodPrice();
    }
    const onDelectHandler = (key:string) => {
      const index = initData.selectData.findIndex((item:any) => item.key === key);
      if (index !== -1) {
        initData.selectData.splice(index, 1);
        getGoodPrice();
      }
    }
    const onClearAllSelectHander = () => {
      initData.selectData = [];
      initData.maxGoodsPrice = 0;
      initData.minGoodsPrice = 0;
    }
    const onCloseHallder = () => {
      context.emit('onCancelHander');
    }
    const onPageChange = async (curPage:number, pageSize:number) => {
      initData.curPage = curPage;
      initData.pageSize = pageSize;
      const goodData = await queryGoodsPage({ spuId: props.spuId, curPage: initData.curPage, pageSize: initData.pageSize, goodsKind: initData.spuObj.goodsKind });
      initData.goodData = goodData;
      initData.tableData = goodData.records.map((item:any, index:number) => {
        return Object.assign({ key: item.id, seq: (index + 1) + (initData.curPage - 1) * initData.pageSize }, item);
      });
    }
    const onChangeSize = async (curPage: number, pageSize: number) => {
      initData.curPage = curPage;
      initData.pageSize = pageSize;
      const goodData = await queryGoodsPage({ spuId: props.spuId, curPage: initData.curPage, pageSize: initData.pageSize, goodsKind: initData.spuObj.goodsKind });
      initData.goodData = goodData;
      initData.tableData = goodData.records.map((item:any, index:number) => {
        return Object.assign({ key: item.id, seq: (index + 1) + (initData.curPage - 1) * initData.pageSize }, item);
      });
    }
    const onSaveAllSelect = async (origPrice:number) => {
      const goodsIdList = initData.selectData.map((item:any) => { return item.id });
      await addSkuGoods({ skuId: props.skuId, origPrice: origPrice, goodsKind: initData.spuObj.goodsKind, skuImgUrlList: props.skuImgUrlList, goodsIdList: goodsIdList });
      context.root.$message.warning('添加商品SKU成功！');
      context.emit('onSaveAllSelect');
    }
    const onSearhClick = async (formobj:any) => {
      const sendobj = Object.assign({ spuId: props.spuId, curPage: initData.curPage, pageSize: initData.pageSize, goodsKind: initData.spuObj.goodsKind }, formobj);
      const goodData = await queryGoodsPage(sendobj);
      initData.goodData = goodData;
      initData.totalRecord = goodData.totalRecord;
      initData.tableData = goodData.records.map((item:any, index:number) => {
        return Object.assign({ key: item.id, seq: (index + 1) + (initData.curPage - 1) * initData.pageSize }, item);
      });
    }
    return {
      initData,
      onSelectChange,
      onChange,
      addGood,
      onCloseHallder,
      onPageChange,
      onClearAllSelectHander,
      onDelectHandler,
      onChangeSize,
      addGoodItem,
      onSaveAllSelect,
      onSearhClick
    }
  }
})
</script>

<style lang="scss" scoped>
.add-specifi {
  height: 80vh;
  .page-main {
    height: 70vh;
    .page-content {
      padding-bottom: 0;
    }
  }
  .add-table {
    display: flex;
    height: 80%;
    padding-bottom: 20px;
    .add-left {
      flex: 1;
      width: 318px;
    }
    .add-right {
      width: 318px;
    }
  }
  .class-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
  }
  .custom-title-box {
    color: #80869D;
    margin-top: 14px;
  }
  .name-box {
    display: flex;
    .name-img {
      width: 60px;
      height: 60px;
    }
    .name-right {
      display: flex;
      flex-direction: column;
      flex: 1;
      margin-left: 8px;
      align-items: center;
      justify-content: center;
      p {
        margin: 0;
      }
      .name-p1 {
        color: #263446;
      }
      .name-p2 {
        color: #80869D;
      }
    }
  }
  ::v-deep .ant-table {
    min-height: 480px !important;
  }
  ::v-deep .ant-form-item{
    margin-bottom: 15px;
  }
  .goodInfo-box {
    p {
      margin: 0;
    }
  }
}
::v-deep .ant-modal-body {
    max-height: 90vh;
    overflow-y: auto;
}
</style>

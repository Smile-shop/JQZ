<template>
  <div class="specification-detail">
    <productTab @goProductInfo="goProductInfo" @goProductDetail="goProductDetail"></productTab>
    <title-header titleHeader="商品分类信息"></title-header>
    <a-form-model
      :label-col="initData.labelCol"
      :wrapper-col="initData.wrapperCol"
      labelAlign="left"
    >
      <a-form-model-item label="商品类型：">
        <span>一级分类名称：{{initData.skuobj.cateIdLevel1Name}}</span>
        <span class="sort-name">二级分类名称：{{initData.skuobj.cateIdLevel2Name}}</span>
        <span class="sort-name">首饰类型：首饰{{initData.skuobj.goodsKindStr}}</span>
      </a-form-model-item>
      <a-form-model-item label="规格：">
        <span class="sort-name"  v-for=" (item, index) in initData.skuobj.skuPropList" :key="index">
           {{item.name}}：{{item.propValue}}
        </span>
      </a-form-model-item>
      <p class="specifi-title">已关联商品：</p>
      <a-form-model-item>
        <a-button type="primary" style="margin: 16px 0 10px" @click="addProduct">添加商品</a-button>
      </a-form-model-item>
    </a-form-model>
    <a-table
        :row-selection="{ selectedRowKeys: initData.selectedRowKeys,onChange:onSelectChange}"
        :columns="initData.columns"
        :data-source="initData.tableData"
        :pagination="false"
      >
        <span slot="name" slot-scope="text, record">
            <div class="name-box">
              <img class="name-img" :src="record.imgUrl" alt="">
              <div class="name-right">
                <p class="name-p1">{{record.name}}</p>
              </div>
            </div>
        </span>
        <span slot="goodsInfo" slot-scope="text, record">
            <div class="goodInfo-box">
              <p>内部款号：{{record.styleNo}}</p>
              <p>条码号：{{record.barcode}}</p>
            </div>
        </span>
        <span slot="params"  slot-scope="text, record">
          <div>
              <span>
                <p>手   寸：{{record.size}}{{record.sizeUnit}}</p>
                <p>主石重：{{record.mstnWt}}</p>
                <p>总件重：{{record.totalWt}}</p>
              </span>
              <template v-if="record.mainStonePropList.length>0">
                  <span class="goodInfo-box">
                    <p>主石净度：{{record.mainStonePropList[0].color}}</p>
                    <p>主石颜色：{{record.mainStonePropList[0].clarity}}</p>
                  </span>
              </template>
            </div>
        </span>
        <span slot="price"  slot-scope="text, record">
          <p>¥{{record.price}}</p>
        </span>
        <span slot="stock"  slot-scope="text, record">
          <p>{{record.stock}}</p>
        </span>
        <span slot="action" slot-scope="text, record">
          <p>
            <a-button type="link" @click="popMethod(record.id)">移除</a-button>
          </p>
        </span>
      </a-table>
      <div class="class-footer">
        <div class="class-div-left">
          <a-checkbox @change="onChange" :checked="initData.isChecked">
            全选
          </a-checkbox>
          <a-button @click="onDelectClick">批量移除商品</a-button>
        </div>
        <div class="class-div-right">
         <a-pagination
            :total="initData.totalRecord"
            :show-total="total => `共 ${total}条`"
            show-size-changer show-quick-jumper
            :default-current="1"
            :defaultPageSize="initData.pageSize"
            @change="pageChange"
            @showSizeChange="changeSize"
            :pageSizeOptions="['5', '10', '20', '30']"
          />
        </div>
      </div>
       <a-form-model-item>
        <div class="speci-button">
          <a-button type="primary" @click="gotoSkuSpecification">返回</a-button>
        </div>
      </a-form-model-item>
    <add-specification v-if="initData.addVisible"  :visible="initData.addVisible" :skuImgUrlList="initData.imgUrlList"  :skuId="skuId" :spuId="spuId" @onCancelHander="onCancelSpecification" @onSaveAllSelect="onSaveAllSelect"></add-specification>
      <!-- 提示确认框 -->
    <a-modal centered v-model="initData.visible" :title="initData.comfirms.title" @ok="handleOk" @cancel="handleCancel">
      <p>{{initData.comfirms.content}}</p>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted } from '@vue/composition-api'
import PageTable from '@/layout/page-table.vue';
import titleHeader from '../search-form/title-header.vue';
import productTab from '../../product-tab.vue';
import addSpecification from '../add-specification/index.vue';
import {
  getSkuGoodsBySkuId,
  querySkuGoodsPage,
  delSkuGoodsByIds
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
    statusCode: {
      type: String,
      value: ''
    }
  },
  components: {
    PageTable,
    titleHeader,
    productTab,
    addSpecification
  },
  setup(props, context) {
    onMounted(() => {
      if (props.skuId !== '') {
        getSkuGoods();
      }
    })
    const initData = reactive({
      skuobj: { cateIdLevel1Name: '', cateIdLevel2Name: '', goodsKind: '', goodsKindStr: '', skuPropList: [] },
      cateType: '1', // 1 单品 2多品
      labelCol: { span: 2 },
      wrapperCol: { span: 16 },
      selectedRowKeys: []as any[],
      imgUrlList: [],
      isChecked: false, // 全选反选
      addVisible: false,
      isSelectAll: false,
      // 确认框
      visible: false,
      // 确认框标题,
      comfirms: {
        title: '',
        content: ''
      },
      totalRecord: 0,
      curPage: 1,
      pageSize: 5,
      selectId: '',
      columns: [
        {
          title: '序号',
          dataIndex: 'key',
          key: 'key',
        },
        {
          title: '商品名称',
          key: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '分类',
          key: 'cateName',
          dataIndex: 'cateName',
        },
        {
          title: '商品信息',
          key: 'goodsInfo',
          scopedSlots: { customRender: 'goodsInfo' }
        },
        {
          title: '参数',
          key: 'params',
          scopedSlots: { customRender: 'params' }
        },
        {
          title: '价格',
          key: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '门店',
          key: 'distName',
          dataIndex: 'distName',
        },
        {
          title: '库存',
          key: 'stock',
          scopedSlots: { customRender: 'stock' }
        },
        {
          title: '商品状态',
          key: 'statusStr',
          dataIndex: 'statusStr',
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      tableData: []as any[]
    })
    // 全选
    const onChange = (e: any) => {
      if (e.target.checked) {
        initData.isChecked = true;
        const ids:any[] = initData.tableData.map((item:any) => { return item.key })
        initData.selectedRowKeys = ids;
      } else {
        initData.isChecked = false;
        initData.selectedRowKeys = [];
      }
    }
    // 批量操作方法
    const popMethod = (id: any) => {
      initData.visible = true;
      initData.comfirms.title = '移除商品';
      initData.comfirms.content = '是否移除已选商品？'
      initData.selectId = id;
    }
    // 添加商品
    const addProduct = () => {
      initData.addVisible = true
    }
    // 确认方法
    const handleOk = (e: any) => {
      initData.visible = false;
      if (initData.isSelectAll) {
        if (initData.selectedRowKeys.length > 0) {
          const selectedRowIds:any[] = [];
          initData.selectedRowKeys.forEach((key) => {
            const tableItem = initData.tableData.find((item:any) => item.key === key);
            if (tableItem) {
              selectedRowIds.push(tableItem.id);
            }
          });
          delSkuGoods(selectedRowIds);
        }
      } else {
        if (initData.selectId !== '') {
          delSkuGoods([initData.selectId]);
        }
      }
    }
    // 取消方法
    const handleCancel = () => {
      initData.visible = false;
      initData.selectId = '';
      initData.isSelectAll = false;
    }
    const goProductInfo = () => {
      const path = 'product-info';
      context.root.$router.push({
        path,
        query: {
          productId: props.spuId,
          statusCode: props.statusCode
        }
      })
    }
    const goProductDetail = () => {
      const path = 'product-detail';
      context.root.$router.push({
        path,
        query: {
          type: '1',
          id: props.spuId,
          statusCode: props.statusCode
        }
      })
    }
    const getSkuGoods = async () => {
      const skuobj = await getSkuGoodsBySkuId(props.skuId);
      initData.skuobj = skuobj;
      getSkuGoodsPage();
    }
    const getSkuGoodsPage = async () => {
      const skudata = await querySkuGoodsPage({ skuId: props.skuId, goodsKind: initData.skuobj.goodsKind, curPage: initData.curPage, pageSize: initData.pageSize });
      initData.curPage = skudata.curPage;
      initData.totalRecord = skudata.totalRecord;
      const records = skudata.records;
      initData.tableData = [];
      records.forEach((element:any, index:number) => {
        const tabledata = Object.assign({ key: (index + 1) + (initData.curPage - 1) * initData.pageSize, align: 'center' }, element);
        initData.tableData.push(tabledata);
      });
    }
    const onSaveAllSelect = () => {
      initData.addVisible = false;
      getSkuGoodsPage();
    }
    const onCancelSpecification = () => {
      initData.addVisible = false;
    }
    const changeSize = (curPage: number, pageSize: number) => {
      initData.curPage = curPage;
      initData.pageSize = pageSize;
      getSkuGoodsPage();
    }
    // 分页页数方法
    const pageChange = (curPage: number, pageSize: number) => {
      initData.curPage = curPage;
      initData.pageSize = pageSize;
      getSkuGoodsPage();
    }
    const onDelectClick = () => {
      initData.visible = true;
      initData.comfirms.title = '移除商品';
      initData.comfirms.content = '是否移除已选商品？'
      initData.isSelectAll = true;
    }

    const delSkuGoods = async (ids:string[]) => {
      await delSkuGoodsByIds(ids);
      context.root.$message.warn('删除规格列表成功');
      getSkuGoodsPage();
    }
    // 表格复选框
    const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
      initData.selectedRowKeys = selectedRowKeys;
      if (initData.selectedRowKeys.length === initData.tableData.length) {
        initData.isChecked = true;
      } else {
        initData.isChecked = false;
      }
    }
    const gotoSkuSpecification = () => {
      context.emit('gotoSkuSpecification');
    }
    return {
      initData,
      onChange,
      handleOk,
      handleCancel,
      popMethod,
      addProduct,
      goProductInfo,
      goProductDetail,
      getSkuGoods,
      onCancelSpecification,
      onSaveAllSelect,
      changeSize,
      pageChange,
      onDelectClick,
      onSelectChange,
      gotoSkuSpecification
    }
  }
})
</script>

<style lang="scss" scoped>
.specification-detail {
  p {
    margin: 0;
  }
  .name-flex-box {
    display: flex;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
    }
    .name-right {
      flex: 1;
      margin-left: 8px;
      p {
        margin: 0;
      }
      .name-r-title {
        color: #263446;
      }
    }
  }
  .sort-name {
    margin-left: 20px;
  }
  .specifi-title {
    color: #263446;
    font-weight: 500;
  }
  .class-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
  }
  .custom-title-box {
    color: #80869D;
    margin-top: 14px;
  }
}
  .speci-button {
    margin-top: 20px;
    margin-left: 64px;
    .prev-btn {
      margin-right: 10px;
    }
  }
</style>

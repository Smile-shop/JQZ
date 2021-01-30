<template>
  <a-modal
    title="添加商品"
    :visible="value"
    :maskClosable="false"
    :width="1000"
    @cancel="onCancel"
    @ok="onConfirm(data.selectedRowKeys)"
  >
    <page-table size="small">
      <template #form>
        <a-form-model
          ref="queryFormModel"
          layout="inline"
          :model="data.datasForm"
          @submit="getDatas"
          @submit.native.prevent
        >
          <a-form-model-item prop="goodsKind">
            <a-select placeholder="选择商品类型" allowClear v-model="data.datasForm.goodsKind">
              <a-select-option value="JW">
                首饰
              </a-select-option>
              <a-select-option value="JWR">
                饰品
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item prop="cateIdLevel1">
            <a-select placeholder="选择一级分类" allowClear v-model="data.datasForm.cateIdLevel1">
              <a-select-option
                v-for="item of data.productType1"
                :value="item.id"
                :key="item.id"
              >
                {{item.name}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item prop="cateIdLevel2">
            <a-select placeholder="选择一级分类" allowClear v-model="data.datasForm.cateIdLevel2">
              <a-select-option
                v-for="item of data.productType2"
                :value="item.id"
                :key="item.id"
              >
                {{item.name}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item prop="status">
            <a-select placeholder="状态" allowClear v-model="data.datasForm.status">
              <a-select-option value="N">
                待上架
              </a-select-option>
              <a-select-option value="Y">
                已上架
              </a-select-option>
              <a-select-option value="R">
                回收站
              </a-select-option>
              <a-select-option value="S">
                已售罄
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item prop="title">
            <a-input placeholder="输入商品编号/商品名" v-model="data.datasForm.title" />
          </a-form-model-item>
          <a-form-model-item>
            <a-button-group>
              <a-button
                @click="getDatas(true)"
              >
                查询
              </a-button>
              <a-button
                @click="resetQuery"
              >
                重置
              </a-button>
            </a-button-group>
          </a-form-model-item>
        </a-form-model>
      </template>
      <a-table
        :columns="data.columns"
        :data-source="data.datas"
        :pagination="data.pagination"
        :row-selection="rowSelection"
        row-key="id"
        @change="tableChange"
      >
        <template
          #imgUrl="text"
        >
          <img
            :src="text"
            alt="图片"
            :style="{
              width: '80px',
              height: '80px',
              objectFit: 'contain',
              objectPosition: 'center center',
            }"
          >
        </template>
      </a-table>
    </page-table>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive, watch, computed } from '@vue/composition-api';
import PageTable from '@/layout/page-table.vue';
import {
  querySpuPageByRecommandation,
} from '@/api/modules/mall/shop-setting/index';
import { queryRetailCategoryList } from '@/api/modules/mall/goods-manage/classification/index';

export default defineComponent({
  components: {
    PageTable,
  },
  props: {
    value: Boolean,
    recommandKind: String,
    type: String,
  },
  setup(props, context) {
    // 表单数据
    const data = reactive({
      selectedRowKeys: [],
      datasForm: {
        cateIdLevel1: undefined,
        cateIdLevel2: undefined,
        goodsKind: undefined,
        maxPrice: undefined,
        minPrice: undefined,
        recommandKind: props.recommandKind,
        status: undefined,
        title: ''
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showTotal(total: number) {
          return `共${total}条`
        },
        showSizeChanger: true
      },
      productType1: [],
      productType2: [],
      datas: [],
      columns: [
        {
          title: '名称',
          dataIndex: 'title',
          width: 150
        },
        {
          title: '图片',
          dataIndex: 'imgUrl',
          scopedSlots: { customRender: 'imgUrl' },
        },
        {
          title: '货品类型',
          dataIndex: 'goodsKindStr',
        },
        {
          title: '分类',
          customRender(record: any) {
            return `${record.cateIdLevel1Name} / ${record.cateIdLevel2Name}`
          }
        },
        {
          title: '价格',
          customRender(record: any) {
            if (record.minPrice == null || record.maxPrice == null) {
              return '';
            }

            return `${record.minPrice} - ${record.maxPrice}`
          }
        },
        {
          title: '编号',
          dataIndex: 'id',
          width: 150
        },
        {
          title: '状态',
          dataIndex: 'statusStr',
        },
        {
          title: '是否关联',
          dataIndex: 'relatedGoods',
          customRender(text: boolean) {
            return {
              children: text ? '是' : '否',
              props: {
                colSpan: 5,
              },
            }
          }
        },
      ],
    });
    const queryFormModel = ref();

    const rowSelection = computed(() => {
      if (props.type === 'single') {
        return null;
      }

      return {
        selectedRowKeys: data.selectedRowKeys,
        onChange: onSelectChange,
        getCheckboxProps: (record: any) => ({
          props: {
            disabled: record.relatedGoods, // Column configuration not to be checked
            name: record.title,
          },
        }),
      }
    });

    // 表格选中
    function onSelectChange(selectedRowKeys: never[]) {
      data.selectedRowKeys = selectedRowKeys;
    }

    // 获取分类
    async function getProductType(level: number) {
      const body = {
        level
      };

      const res = await queryRetailCategoryList(body);
      (data as any)[`productType${level}`] = res;
    }

    // 重置查询表单
    function resetQuery() {
      data.selectedRowKeys = [];
      queryFormModel.value.resetFields();
    }

    // 获取数据
    async function getDatas(isFirstPage = false) {
      if (isFirstPage) {
        data.pagination.current = 1;
      }

      const body = {
        ...data.datasForm,
        curPage: data.pagination.current,
        pageSize: data.pagination.pageSize,
      };

      const res = await querySpuPageByRecommandation(body);
      data.pagination.total = res.totalRecord;
      data.datas = res.records;
    }

    function onCancel() {
      context.emit('input', false);
      context.emit('cancel');
    }

    function onConfirm(value: any) {
      context.emit('input', false);
      context.emit('confirm', value);
    }

    function tableChange(pagination: any, filters: any, sorter: any) {
      const { current, pageSize } = pagination;

      data.pagination.current = current;
      data.pagination.pageSize = pageSize;
      getDatas();
    }

    watch(() => props.value, async (value) => {
      console.log(value);

      if (value) {
        resetQuery()
        Promise.all([getProductType(1), getProductType(2)]);
        getDatas(true);
      }
    });

    return {
      data,
      resetQuery,
      getDatas,
      onCancel,
      onConfirm,
      queryFormModel,
      onSelectChange,
      tableChange,
      rowSelection,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>

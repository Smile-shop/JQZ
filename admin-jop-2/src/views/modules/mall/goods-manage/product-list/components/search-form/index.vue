<template>
  <div class="search-form">
    <a-form-model
      ref="queryFormModel"
      layout="inline"
    >
      <a-form-model-item v-if="tabKey === 'N'">
        <a-button type="primary" @click="addProduct">添加商品</a-button>
      </a-form-model-item>
      <a-form-model-item>
        <a-select placeholder="选择货品类型" style="width: 130px" v-model="dataInit.formValue.goodsKind" @keyup.enter.native="onSelect">
          <a-select-option :value="item.value" v-for="(item, index) in dataInit.allShopList" :key="index">
            {{item.label}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item>
        <a-select placeholder="选择一级分类" style="width: 130px" v-model="dataInit.formValue.cateIdLevel1" @keyup.enter.native="onSelect">
          <a-select-option :value="item.value" v-for="(item, index) in dataInit.oneType" :key="index">
            {{item.label}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item>
        <a-select placeholder="选择二级分类" style="width: 130px" v-model="dataInit.formValue.cateIdLevel2" @keyup.enter.native="onSelect">
          <a-select-option :value="item.value" v-for="(item, index) in dataInit.twoType" :key="index">
            {{item.label}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item>
        <a-select v-model="dataInit.formValue.recommandKind" placeholder="全部推荐位" style="width: 130px" @keyup.enter.native="onSelect">
          <a-select-option :value="item.value" v-for="(item, index) in dataInit.recommendType" :key="index">
            {{item.label}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="价格区间">
        <a-input v-model="dataInit.formValue.minPrice" :label-col="dataInit.labelCol" class="input-width" @keyup="checkValue" @keyup.enter.native="onSelect"/>
      </a-form-model-item>
      <a-form-model-item>
        <span>-</span>
      </a-form-model-item>
      <a-form-model-item>
        <a-input v-model="dataInit.formValue.maxPrice" :label-col="dataInit.labelCol" class="input-width" @keyup="checkValue" @keyup.enter.native="onSelect"/>
      </a-form-model-item>
      <a-form-model-item>
        <a-input v-model="dataInit.formValue.title" placeholder="请输入商品名称" @keyup.enter.native="onSelect"/>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="onSelect" @keyup.enter.native="onSelect">
          搜索
        </a-button>
      </a-form-model-item>
      <a-form-model-item>
        <a-button @click="onReset"  @keyup.enter.native="onSelect">
          重置
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive } from '@vue/composition-api';
import {
  queryRetailCategoryList
} from '@/api/modules/mall/goods-manage/classification/index';
export default defineComponent({
  props: {
    tabKey: {
      type: String,
      default: 'N'
    }
  },
  setup(props, context) {
    const dataInit = reactive({
      // 货品类型
      allShopList: [
        {
          label: '首饰',
          value: 'JW'
        },
        {
          label: '饰品',
          value: 'JWR'
        },
      ],
      // 一级分类
      oneType: [] as any[],
      // 二级分类
      twoType: [] as any[],
      recommendType: [
        {
          label: '全部推荐位',
          value: 'ALL'
        },
        {
          label: '推荐位一',
          value: 'RCD1'
        }, {
          label: '推荐位二',
          value: 'RCD2'
        }
      ],
      labelCol: {
        span: 1
      },
      formValue: {
        goodsKind: undefined,
        recommandKind: 'ALL',
        cateIdLevel1: undefined,
        cateIdLevel2: undefined,
        maxPrice: '',
        minPrice: '',
        title: ''
      }
    })
    const addProduct = () => {
      context.root.$router.push({
        path: 'product-list/product-info',
        query: {
          statusCode: props.tabKey,
        }
      })
    }
    // 价格区间只能加入数字和小数点
    const checkValue = (e: any) => {
      e.target.value = e.target.value.replace(/[^0-9.]/g, '')
    }
    const queryCategoryList = async (level:number) => {
      const body = { appId: '68594CF2-E947-82FA-84D0-01D4556F9F54', level: level };
      let datalist:any[] = await queryRetailCategoryList(body);
      datalist = datalist.map((item) => {
        return { label: item.name, value: item.id };
      });
      if (level === 1) {
        dataInit.oneType = datalist;
      } else {
        dataInit.twoType = datalist;
      }
    }
    const onSelect = () => {
      context.emit('onSelectItem', dataInit.formValue);
    }
    const onReset = () => {
      dataInit.formValue.goodsKind = undefined;
      dataInit.formValue.cateIdLevel1 = undefined;
      dataInit.formValue.cateIdLevel2 = undefined;
      dataInit.formValue.recommandKind = 'ALL';
      dataInit.formValue.maxPrice = '';
      dataInit.formValue.minPrice = '';
      dataInit.formValue.title = '';
    }
    onMounted(() => {
      queryCategoryList(1);
      queryCategoryList(2);
    });
    return {
      dataInit,
      addProduct,
      onSelect,
      onReset,
      checkValue
    }
  }
})
</script>

<style lang="scss" scoped>
.search-form {
  .input-width {
    width: 110px;
  }
}
</style>

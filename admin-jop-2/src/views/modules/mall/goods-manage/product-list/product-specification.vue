<template>
  <page-wrapper>
    <!-- 表格组件 -->
    <page-table>
      <!-- 查询表单 -->
      <template #form>
        <specification-page v-if="initData.isType === '1'" :spuId="initData.spuId" :statusCode="initData.statusCode" @gotoSkuDetail="gotoSkuDetail"></specification-page>
        <specification-detail v-if="initData.isType === '2'" :spuId="initData.spuId" :skuId="initData.skuId" :statusCode="initData.statusCode" @gotoSkuSpecification="gotoSkuSpecification"></specification-detail>
      </template>
    </page-table>
  </page-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from '@vue/composition-api';
import PageTable from '@/layout/page-table.vue';
import specificationPage from './components/specification-page/index.vue';
import specificationDetail from './components/specification-detail/index.vue';
export default defineComponent({
  components: {
    PageTable,
    specificationPage,
    specificationDetail
  },
  setup(props, context) {
    const initData = reactive({
      isType: '', // 1关联商品 2规格详情
      spuId: '',
      skuId: '',
      statusCode: 'N', // 获取tabs状态码 N为待上架 Y为已上架
    })
    onMounted(() => {
      initData.statusCode = context.root.$route.query.statusCode || 'N' as any;
      initData.isType = context.root.$route.query.type || '1' as any;
      initData.spuId = context.root.$route.query.id || '' as any;
    });
    const gotoSkuDetail = (id:any) => {
      initData.isType = '2';
      initData.skuId = id;
    }
    const gotoSkuSpecification = () => {
      initData.isType = '1';
      initData.skuId = '';
    }
    return {
      initData,
      gotoSkuDetail,
      gotoSkuSpecification
    }
  }
})
</script>

<style lang="scss" scoped>
</style>

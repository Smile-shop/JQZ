<template>
  <page-wrapper>
    <div class="goods-info-wrap">
      <div class="goods-info-tab">
        <classification-set v-if="initData.customStyle === '1'"  @custom-style="getStyle"></classification-set>
        <custom-class  v-if="initData.customStyle === '2'" :edtype="initData.edtype" :id="initData.id" @custom-style="getStyle2"></custom-class>
      </div>
    </div>
  </page-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from '@vue/composition-api';
import classificationSet from './components/classification-set.vue';
import customClass from './components/custom-class.vue';
export default defineComponent({
  components: {
    classificationSet,
    customClass
  },
  setup(props, context) {
    const initData = reactive({
      // 1为商品分类首页，2为添加自定义分类页面
      customStyle: '1',
      id: '',
      edtype: 0,
    })
    // 跳转到自定义分类页面
    const getStyle = (id:string = '', type:number = 0) => {
      initData.customStyle = '2';
      initData.id = id;
      initData.edtype = type;
    }
    // 跳转到分类列表页面
    const getStyle2 = () => {
      initData.customStyle = '1';
    }
    watch(
      () => initData.customStyle,
      () => {
      })
    return {
      initData,
      getStyle,
      getStyle2
    }
  }
})
</script>

<style lang="scss" scoped>
.goods-info-wrap {
  width: 100%;
  background: #ffffff;
  box-shadow:0px 2px 30px 0px rgba(120,148,245,0.1);
  border-radius:8px;
  padding: 14px;
}
</style>

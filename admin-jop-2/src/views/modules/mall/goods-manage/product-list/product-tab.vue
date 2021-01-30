<template>
    <div class="goods-box">
          <div @click="goFun('goProductInfo')">商品分类信息</div>
          <div class="product-mess">关联商品</div>
          <div @click="goFun('goProductDetail')">商品详情</div>
   </div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted } from '@vue/composition-api';
export default defineComponent({
  setup(props, context) {
    // 商品分类信息-商品详情按钮
    const goFun = (path: string) => {
      context.emit(path);
    }
    return {
      goFun
    }
  }
})
</script>

<style lang="scss" scoped>
.goods-box {
    display: flex;
    height: 48px;
    border:1px solid rgba(235,238,245,1);
    margin-bottom: 24px;
    div {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #263446;
      font-weight: 500;
      cursor: pointer;
    }
    .product-mess {
      background: #0045FF;
      color: #fff;
    }
  }
</style>

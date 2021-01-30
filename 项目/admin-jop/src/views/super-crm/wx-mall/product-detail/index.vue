<template>
  <div class="product-detail">
    <keep-alive
      :include="['productList']"
    >
      <component
        @editDetail="editDetail"
        @back="back"
        :is="showComponentName"
        :code="code"
      >
      </component>
    </keep-alive>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import ProductEdit from './ProductEdit.vue';
import ProductList from './ProductList.vue';

@Component({
  components: {
    ProductEdit,
    ProductList
  }
})
export default class WxMallProductDetail extends Vue {
  showComponentName = 'ProductList';

  code = '';

  editDetail(res: any) {
    this.showComponentName = 'ProductEdit';

    this.code = res.code;
  }

  back(res: any) {
    this.showComponentName = 'ProductList';
  }
}
</script>

<style lang="scss" scoped>
.product-detail {
}
</style>



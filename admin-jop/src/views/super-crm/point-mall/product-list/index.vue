<template>
  <div class="product-edit">
    <form-bar>
      <el-form  :inline="true">
        <el-form-item label="商品名称：">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="分类：">
          <el-input></el-input>
        </el-form-item>
      </el-form>
    <div slot="right">123</div>
    </form-bar>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import FormBar from '@/components/FormBar.vue';

@Component({
  components: {
    FormBar
  }
})
export default class PointMallProductEdit extends Vue {

}
</script>

<style lang="scss" scoped>
.product-edit {
}
</style>



<template>
  <article>
    <el-tabs v-model="activeName" :before-leave="TabClick">
      <el-tab-pane label="关注统计" name="total">
      </el-tab-pane>
      <el-tab-pane label="关注明细" name="detail">
      </el-tab-pane>
    </el-tabs>
    <router-view/>
  </article>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
})
export default class ShopFocus extends Vue {
  private activeName: string = 'total';
  private TabClick(activeName: string, oldActiveName: string) {
    this.$router.push({
      path: `/super-crm/wx-member/data-statistics/shop-focus/${activeName}`
    })
  }
  private mounted() {
    const pathArr = this.$route.path.split('/');
    this.activeName = pathArr[pathArr.length - 1];
  }
}
</script>


<template>
  <div class="recommend">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :router="true"
    >
      <el-menu-item
        index="/cloud-showroom/cloud-showroom/recommend/carousel"
      >
        轮播图
      </el-menu-item>
      <el-menu-item
        index="/cloud-showroom/cloud-showroom/recommend/type"
      >
        分类推荐
      </el-menu-item>
      <el-menu-item
        index="/cloud-showroom/cloud-showroom/recommend/list-1"
      >
        商品推荐一
      </el-menu-item>
      <el-menu-item
        index="/cloud-showroom/cloud-showroom/recommend/list-2"
      >
        商品推荐二
      </el-menu-item>
    </el-menu>
    <router-view/>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';

@Component({
})
export default class Recommend extends Vue {
  activeIndex = '/cloud-showroom/cloud-showroom/recommend/carousel';


  mounted() {
    this.init();
  }

  init() {
    const { path } = this.$route;
    this.activeIndex = path;
  }
}
</script>

<style lang="scss" scoped>

</style>

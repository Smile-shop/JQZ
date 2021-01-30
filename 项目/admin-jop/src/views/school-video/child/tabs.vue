<template>
  <div class="tabs">
    <div class="tabs-list">
      <div
        :class="`tabs-list-item ${activeIndex === index ? 'active' : ''}`"
        v-for="(item, index) in tabList"
        :key="index"
        @click="select(item, index)"
      >{{ item }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class Tabs extends Vue {
  @Prop({
    default: () => {
      return [];
    },
  })
  tabList!: any[];
  activeIndex: number = 0;
  public get type(): string {
    if (this.$route.params.type) {
      sessionStorage.setItem('type', this.$route.params.type);
    }
    return this.$route.params.type;
  }
  @Watch('type')
  chageType(val: string) {
    if (val) {
      this.activeIndex =
        this.tabList.findIndex((item: any) => item === val) || this.activeIndex;
    }
  }
  getCategorylist() {
    const type = sessionStorage.getItem('type');
    this.activeIndex =
      this.tabList.findIndex((item: any) => item === type) || this.activeIndex;
  }
  select(item: any, index: number) {
    this.activeIndex = index;
    this.$router.replace(`/school-video/index/list/${item}`);
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  height: 60px;
  line-height: 60px;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  &-list {
    min-width: 600px;
    display: flex;
    font-size: 14px;
    &-item {
      width: 14.28%;
      text-align: center;
      cursor: pointer;
      &:hover {
        background: #409eff;
        color: #fff;
      }
    }
    .active {
      background: #409eff;
      color: #fff;
    }
  }
}
</style>



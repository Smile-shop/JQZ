<template>
  <header class="header">
    <div>
      <div class="header-title">
        <img src="@/assets/images/school-video/logo.png" alt />
      </div>
      <tabs ref="tabs" class="header-tabs" :tabList="tabList" />
    </div>
    <div>
      <el-button type="primary" size="small" round plain @click="back">返回JOP首页</el-button>
    </div>
  </header>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import tabs from './tabs.vue';

@Component({
  components: { tabs },
})
export default class Header extends Vue {
  @Prop({
    default: () => {
      return [];
    },
  })
  tabList!: any[];
  tabsDataChange() {
    (this.$refs.tabs as any).getCategorylist();
  }
  back() {
    this.$router.push('/home/module');
    sessionStorage.removeItem('type');
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  background: #333;
  color: #fff;
  font-size: 24px;
  line-height: 60px;
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  background: #ffffff;
  box-shadow: 0px 6px 6px 0px rgba(0, 0, 0, 0.05),
    0px 0px 6px 0px rgba(0, 0, 0, 0.02);
  min-width: 1000px;
  div {
    &:nth-child(1) {
      align-items: center;
      display: flex;
    }
    &:nth-child(2) {
      line-height: 50px;
    }
  }
  &-title {
    font-family: FZJZCH;
    color: #2462a7;
    width: 250px;
    display: inline-block;
    img {
      height: 42px;
    }
  }
  &-tabs {
    line-height: 60px !important;
  }
}
</style>

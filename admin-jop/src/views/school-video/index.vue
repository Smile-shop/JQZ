<template>
  <div class="video">
    <page-header ref="header" :tabList="tabList" />
    <keep-alive include="VideoList">
      <router-view ref="view"></router-view>
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import pageHeader from './child/header.vue';
import tabs from './child/tabs.vue';
import videoList from './child/videoList.vue';
import player from './child/player.vue';
import { getCategorylist } from '@/api/school-video';

@Component({
  components: { pageHeader, tabs, videoList, player },
})
export default class LayoutMain extends Vue {
  showPlayer: boolean = false;
  item: any = {};
  tabList: any[] = [];
  get route() {
    return this.$route;
  }
  created() {
    this.getCategorylist();
  }
  async getCategorylist() {
    try {
      const res: any = await getCategorylist({});
      const { code, data } = res;
      if (!code && data) {
        this.tabList = data;
        this.$nextTick(() => {
          if ((this.$refs.view as any).height) {
            (this.$refs.view as any).height();
          }
          (this.$refs.header as any).tabsDataChange();
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  closePlayer() {
    this.showPlayer = false;
  }
  getSelectedData(item: any) {
    if (item) {
      this.showPlayer = true;
      this.item = {
        title:
          '销售销售人员维护，珠宝分销实用技巧，珠宝珠宝珠宝珠宝珠宝珠宝销售销售人员维护，珠宝分销实用技巧，珠宝珠宝',
        url: '//vjs.zencdn.net/v/oceans.mp4',
      };
    }
  }
}
</script>

<style lang="scss" scoped>
.video {
  // background: #ecf5ff;
}
</style>



<template>
  <header class="header" v-show="navInfo.hasNav">
    <div class="left" @click="goBack(-1)">
      <i class="iconfont arrow-L-white some-font-color"></i>
    </div>
    <div class="center">{{navInfo.titleName}}</div>
    <div class="right"></div>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CommonMixin from '../mixin/CommonMixin';
@Component({
  components: {
  },
  mixins: [CommonMixin]
})
export default class Home extends Vue {
  // computed
  get navInfo() {
    return this.$route.meta;
  }

  private mounted() {
    // console.log(this.$route.meta);
  }
}
</script>

<style lang="less" scoped>
.header {
  background-color: #ffffff;
  height: 44px;
  display: flex;
  align-items: center;
  .left {
    width: 40px;
    text-align: center;
    line-height: 40px;
  }
  .center {
    flex-grow: 1;
    text-align: center;
    font-family: PingFang-SC-Regular;
    font-size: 18px;
    color: #333333;
  }
  .right {
    width: 40px;
    text-align: center;
  }
}
</style>


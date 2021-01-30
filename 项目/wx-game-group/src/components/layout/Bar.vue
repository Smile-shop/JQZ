<template>
  <div id="bar">
    <nav>
      <span class="icon iconfont icon-back" @click="$router.go(-1)" />
      <span class="title">{{ title }}</span>
      <span class="icon p-right iconfont icon-share" @click="show=true" />
    </nav>
    <Share :show.sync="show" />
  </div>
</template>

<script>
import Share from '../dialog/Share'
export default {
  components: {
    Share
  },
  props: {
    title: {
      type: String,
      default: '老虎机'
    },
    currentPage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false
    }
  }
}
</script>

<style lang='scss' scoped>
@import 'assets/rem.scss';
#bar {
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: px2rem(88);
    font-size: px2rem(36);
    background: #fff;
    color: #333;

    .icon {
      font-size: px2rem(36);
      color: #fe5362;
    }
    .p-left {
      padding-left: px2rem(24);
    }
    .p-right {
      padding-right: px2rem(24);
    }
  }
}
</style>
